import { Database, Statement } from "@db/sqlite"
import { DbConnectionPool } from "../db/dbconnectionpool.ts"
import { StatementCache } from "../db/statementcache.ts"

interface DbMetric {
  id: number
  url_id: number
  ip_address: string
  created: number
  updated: number
}

interface Metric {
  id: number
  urlId: number
  ipAddress: string
  created: Date
  updated: Date
}

const dbToEntity = (metric: DbMetric): Metric => {
  return {
    id: metric.id,
    urlId: metric.url_id,
    ipAddress: metric.ip_address,
    created: new Date(metric.created),
    updated: new Date(metric.updated),
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
}

export type { Metric }
export { MetricRepository }
