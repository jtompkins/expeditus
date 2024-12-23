interface CacheableConnection<TStatement> {
  prepare(sql: string): TStatement
}

export class StatementCache<TConnection extends CacheableConnection<TStatement>, TStatement> {
  private _statementCache: Map<TConnection, Map<string, TStatement>>

  constructor() {
    this._statementCache = new Map()
  }

  prepareAndCache(conn: TConnection, sql: string): TStatement {
    if (!this._statementCache.has(conn)) {
      this._statementCache.set(conn, new Map())
    }

    const cache = this._statementCache.get(conn)!

    if (cache.has(sql)) {
      return cache.get(sql)!
    }

    const statement = conn.prepare(sql)

    cache!.set(sql, statement)

    return statement
  }
}
