import { DbConnectionPool } from "../db/dbconnectionpool.ts"
import { Database, Statement } from "@db/sqlite"
import { StatementCache } from "../db/statementcache.ts"

interface User {
  id: number
  user_name: string
  created: Date
  updated: Date
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

    const user = stmt.get<User>(id)

    this._readonlyPool.release(conn)

    return user ?? null
  }
}

export { UserRepository }
export type { User }
