import { Database, Statement } from "@db/sqlite"
import { DbConnectionPool } from "../db/dbconnectionpool.ts"
import { StatementCache } from "../db/statementcache.ts"

interface DbUrl {
  id: number
  user_id: number
  url: string
  slug: string
  views?: number
  created: number
  updated: number
}

interface Url {
  id: number
  userId: number
  slug: string
  address: string
  views: number
  created: Date
  updated: Date
}

function dbToEntity(url: DbUrl): Url {
  return {
    id: url.id,
    userId: url.user_id,
    slug: url.slug,
    address: url.url,
    views: url.views || 0,
    created: new Date(url.created),
    updated: new Date(url.updated),
  }
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
      return dbToEntity(url)
    }

    return null
  }

  getByUser(userId: number): Url[] {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select u.*, count(m.id) as views from urls as u join metrics as m on u.id = m.url_id where u.user_id = ? group by m.url_id",
    )

    const urls = stmt.all<DbUrl>(userId)

    this._readonlyPool.release(conn)

    return urls.map((url) => dbToEntity(url))
  }
}

export type { Url }
export { UrlRepository }
