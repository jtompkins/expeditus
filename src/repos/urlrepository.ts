import { Database, Statement } from "@db/sqlite"
import { DbConnectionPool } from "../lib/dbconnectionpool.ts"
import { StatementCache } from "../lib/statementcache.ts"
import { MetricRepository } from "./metricrepository.ts"

interface DbUrl {
  id: number
  user_id: number
  url: string
  slug: string
  views: number
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
}

function dbToEntity(url: DbUrl): Url {
  return {
    id: url.id,
    userId: url.user_id,
    slug: url.slug,
    address: url.url,
    views: url.views,
    created: Temporal.Instant.fromEpochMilliseconds(url.created * 1000),
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

  getById(id: number): Url | null {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select * from urls where id = ?",
    )
    const url = stmt.get<DbUrl>(id)

    this._readonlyPool.release(conn)

    if (url) {
      return dbToEntity(url)
    }

    return null
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
      "select * from urls where user_id = ? order by slug",
    )

    const urls = stmt.all<DbUrl>(userId)

    this._readonlyPool.release(conn)

    return urls.map((url) => dbToEntity(url))
  }

  createUrl(userId: number, slug: string, address: string): Url {
    const roConn = this._readonlyPool.borrow()
    const woConn = this._writeonlyPool.borrow()

    const stmt = this._cache.prepareAndCache(
      woConn,
      "insert into urls (user_id, url, slug, views, created, updated) values (?, ?, ?, 0, unixepoch(), unixepoch());",
    )
    const rowIdStmt = this._cache.prepareAndCache(
      roConn,
      "select last_insert_rowid() as url_id",
    )

    stmt.run(userId, address, slug)
    const res = rowIdStmt.get<{ url_id: number }>()!

    this._readonlyPool.release(roConn)
    this._writeonlyPool.release(woConn)

    return this.getById(res.url_id)!
  }

  incrementViewsById(id: number, value: number = 1): boolean {
    const roConn = this._readonlyPool.borrow()
    const woConn = this._writeonlyPool.borrow()

    const stmt = this._cache.prepareAndCache(
      woConn,
      "update urls set views = views + ? where id = ?",
    )

    const changesStatement = this._cache.prepareAndCache(
      woConn,
      "select changes() as changes",
    )

    stmt.run(id, value)
    const res = changesStatement.get<{ changes: number }>()!

    this._readonlyPool.release(roConn)
    this._writeonlyPool.release(woConn)

    return res.changes > 0
  }

  deleteById(id: number): boolean {
    this._metricRepo.deleteByUrlId(id)

    const roConn = this._readonlyPool.borrow()
    const woConn = this._writeonlyPool.borrow()

    const stmt = this._cache.prepareAndCache(
      woConn,
      "delete from urls where id = ?",
    )

    const changesStatement = this._cache.prepareAndCache(
      woConn,
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
