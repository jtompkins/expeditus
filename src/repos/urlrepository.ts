import { Database, Statement } from "@db/sqlite"
import { DbConnectionPool } from "../db/dbconnectionpool.ts"
import { StatementCache } from "../db/statementcache.ts"

interface DbUrl {
  id: number
  user_id: number
  url: string
  slug: string
  created: number
  updated: number
}

interface Url {
  id: number
  userId: number
  slug: string
  address: string
  created: Date
  updated: Date
}

class UrlRepository {
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

  getBySlug(slug: string): Url | null {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select * from urls where slug = ?",
    )
    const url = stmt.get<DbUrl>(slug)

    this._readonlyPool.release(conn)

    if (url) {
      return {
        id: url.id,
        userId: url.user_id,
        slug: url.slug,
        address: url.url,
        created: new Date(url.created),
        updated: new Date(url.updated),
      } satisfies Url
    }

    return null
  }

  getByUser(userId: number): Url[] {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select * from urls where user_id = ?",
    )

    const urls = stmt.all<DbUrl>(userId)

    this._readonlyPool.release(conn)

    return urls.map((u) => {
      return {
        id: u.id,
        userId: u.user_id,
        slug: u.slug,
        address: u.url,
        created: new Date(u.created),
        updated: new Date(u.updated),
      } satisfies Url
    })
  }
}

export type { Url }
export { UrlRepository }
