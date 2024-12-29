import { Database, Statement } from "@db/sqlite"
import { DbConnectionPool } from "../db/dbconnectionpool.ts"
import { StatementCache } from "../db/statementcache.ts"
import { MetricRepository } from "./metricrepository.ts"

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
  created: Temporal.Instant
  updated: Temporal.Instant
}

function dbToEntity(url: DbUrl): Url {
  return {
    id: url.id,
    userId: url.user_id,
    slug: url.slug,
    address: url.url,
    views: url.views || 0,
    created: Temporal.Instant.fromEpochMilliseconds(url.created * 1000),
    updated: Temporal.Instant.fromEpochMilliseconds(url.updated * 1000),
  }
}

class UrlRepository {
  private readonly _readonlyPool: DbConnectionPool<Database>
  private readonly _writeonlyPool: DbConnectionPool<Database>
  private readonly _cache: StatementCache<Database, Statement>

  private readonly _metricRepo: MetricRepository

  constructor(
    readonlyPool: DbConnectionPool<Database>,
    writeonlyPool: DbConnectionPool<Database>,
    cache: StatementCache<Database, Statement>,
    metricRepo: MetricRepository,
  ) {
    this._readonlyPool = readonlyPool
    this._writeonlyPool = writeonlyPool
    this._cache = cache
    this._metricRepo = metricRepo
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

  deleteById(id: number): boolean {
    const success = this._metricRepo.deleteByUrlId(id)

    if (!success) {
      return false
    }

    const roConn = this._readonlyPool.borrow()
    const woConn = this._writeonlyPool.borrow()

    const stmt = this._cache.prepareAndCache(
      woConn,
      "delete from urls where id = ?",
    )

    const changesStatement = this._cache.prepareAndCache(
      roConn,
      "select changes() as changes",
    )

    stmt.run(id)
    const res = changesStatement.get<{ changes: number }>()!

    this._readonlyPool.release(roConn)
    this._writeonlyPool.release(woConn)

    return res.changes > 0
  }
}

export type { Url }
export { UrlRepository }
