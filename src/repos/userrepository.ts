import { DbConnectionPool } from "../util/dbconnectionpool.ts"
import { Database, Statement } from "@db/sqlite"
import { StatementCache } from "../util/statementcache.ts"

interface DbUser {
  id: number
  github_username: string
  github_email: string
  created: number
  updated: number
}

interface User {
  id: number
  username: string
  email: string
  created: Temporal.Instant
  updated: Temporal.Instant
}

function dbUserToUser(user: DbUser): User {
  return {
    id: user.id,
    username: user.github_username,
    email: user.github_email,
    created: Temporal.Instant.fromEpochMilliseconds(user.created * 1000),
    updated: Temporal.Instant.fromEpochMilliseconds(user.updated * 1000),
  }
}

class UserRepository {
  private readonly _readonlyPool: DbConnectionPool<Database>
  private readonly _writeonlyPool: DbConnectionPool<Database>
  private readonly _cache: StatementCache<Database, Statement>

  constructor(
    readonlyPool: DbConnectionPool<Database>,
    writeonlyPool: DbConnectionPool<Database>,
    cache: StatementCache<Database, Statement>,
  ) {
    this._readonlyPool = readonlyPool
    this._writeonlyPool = writeonlyPool
    this._cache = cache
  }

  getById(id: number): User | null {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select * from users where id = ?",
    )

    const user = stmt.get<DbUser>(id)

    this._readonlyPool.release(conn)

    if (user) {
      return dbUserToUser(user)
    }

    return null
  }

  getByEmail(email: string): User | null {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select * from users where github_email = ?",
    )

    const user = stmt.get<DbUser>(email)

    this._readonlyPool.release(conn)

    if (user) {
      return dbUserToUser(user)
    }

    return null
  }

  createUser(username: string, email: string): User {
    const roConn = this._readonlyPool.borrow()
    const woConn = this._writeonlyPool.borrow()

    const stmt = this._cache.prepareAndCache(
      woConn,
      "insert into users (github_username, github_email, created, updated) values (?, ?, unixepoch(), unixepoch());",
    )
    const rowIdStmt = this._cache.prepareAndCache(
      roConn,
      "select last_insert_rowid() as user_id",
    )

    stmt.run(username, email)
    const res = rowIdStmt.get<{ user_id: number }>()!

    this._readonlyPool.release(roConn)
    this._writeonlyPool.release(woConn)

    return this.getById(res.user_id)!
  }
}

export { UserRepository }
export type { User }
