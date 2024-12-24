import { Database, Statement } from "@db/sqlite"
import { DbConnectionPool } from "../db/dbconnectionpool.ts"
import { StatementCache } from "../db/statementcache.ts"

interface Metric {
  id: number
  url_id: number
  ip_address: string
  created: Date
  updated: Date
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

  getByUrlId(urlId: number): Metric[] {
    const conn = this._readonlyPool.borrow()
    const stmt = this._cache.prepareAndCache(
      conn,
      "select * from metrics where url_id = ?",
    )

    const metrics = stmt.all<Metric>(urlId)

    this._readonlyPool.release(conn)

    return metrics
  }
}

export type { Metric }
export { MetricRepository }
