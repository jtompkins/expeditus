import { DbConnectionPool } from "../db/dbconnectionpool.ts"
import { Database, Statement } from "@db/sqlite"
import { StatementCache } from "../db/statementcache.ts"

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
  created: Date
  updated: Date
}

function dbUserToUser(user: DbUser): User {
  return {
    id: user.id,
    username: user.github_username,
    email: user.github_email,
    created: new Date(user.created),
    updated: new Date(user.updated),
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
    const conn = this._writeonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "insert into users (github_username, github_email, created, updated) values (?, ?, unixepoch(), unixepoch());",
    )
    const rowIdStmt = this._cache.prepareAndCache(
      conn,
      "select last_insert_rowid() as user_id",
    )

    stmt.run(username, email)
    const res = rowIdStmt.get<{ user_id: number }>()!

    return this.getById(res.user_id)!
  }
}

export { UserRepository }
export type { User }
