import { Database, Statement } from "@db/sqlite"
import { DbConnectionPool } from "../db/dbconnectionpool.ts"
import { StatementCache } from "../db/statementcache.ts"

interface DbMetric {
  id: number
  url_id: number
  ip_address: string
  referrer?: string
  created: number
  updated: number
}

interface Metric {
  id: number
  urlId: number
  ipAddress: string
  referrer?: string
  created: Temporal.Instant
  updated: Temporal.Instant
}

const dbToEntity = (metric: DbMetric): Metric => {
  return {
    id: metric.id,
    urlId: metric.url_id,
    ipAddress: metric.ip_address,
    referrer: metric.referrer,
    created: Temporal.Instant.fromEpochMilliseconds(metric.created * 1000),
    updated: Temporal.Instant.fromEpochMilliseconds(metric.updated * 1000),
  }
}

class MetricRepository {
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

  getById(id: number): Metric | null {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select * from metrics where id = ?",
    )

    const metric = stmt.get<DbMetric>(id)

    this._readonlyPool.release(conn)

    if (metric) {
      return dbToEntity(metric)
    }

    return null
  }

  getViewsByUrlId(urlId: number): number {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select count(*) from metrics where url_id = ?",
    )

    const views = stmt.value<[number]>(urlId)

    this._readonlyPool.release(conn)

    return views ? views[0] : 0
  }

  getByUrlId(urlId: number): Metric[] {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select * from metrics where url_id = ?",
    )

    const metrics = stmt.all<DbMetric>(urlId)

    this._readonlyPool.release(conn)

    return metrics.map((m) => dbToEntity(m))
  }

  createMetric(urlId: number, ipAddress?: string, referrer?: string): Metric {
    const roConn = this._readonlyPool.borrow()
    const woConn = this._writeonlyPool.borrow()

    const stmt = this._cache.prepareAndCache(
      woConn,
      "insert into metrics (url_id, ip_address, referrer, created, updated) values (?, ?, ?, unixepoch(), unixepoch());",
    )
    const rowIdStmt = this._cache.prepareAndCache(
      roConn,
      "select last_insert_rowid() as metric_id",
    )

    stmt.run(urlId, ipAddress ?? null, referrer ?? null)
    const res = rowIdStmt.get<{ metric_id: number }>()!

    this._readonlyPool.release(roConn)
    this._writeonlyPool.release(woConn)

    return this.getById(res.metric_id)!
  }

  deleteByUrlId(urlId: number): boolean {
    const roConn = this._readonlyPool.borrow()
    const woConn = this._writeonlyPool.borrow()

    const stmt = this._cache.prepareAndCache(
      woConn,
      "delete from metrics where url_id = ?",
    )

    const changesStatement = this._cache.prepareAndCache(
      roConn,
      "select changes() as changes",
    )

    stmt.run(urlId)
    const res = changesStatement.get<{ changes: number }>()!

    this._readonlyPool.release(roConn)
    this._writeonlyPool.release(woConn)

    return res.changes > 0
  }
}

export type { Metric }
export { MetricRepository }
