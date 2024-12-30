export class DbConnectionPool<TDatabase> {
  readonly max: number
  readonly openFn: () => TDatabase
  readonly closeFn: ((conn: TDatabase) => void) | undefined

  private _opened: number = 0
  private _borrowed: number = 0
  private _connections: Array<TDatabase> = []

  private _closed: boolean = false

  get count(): number {
    return this.max - this._borrowed
  }

  get opened(): number {
    return this._opened
  }

  get closed(): boolean {
    return this._closed
  }

  constructor(
    maxConnections: number,
    openFn: () => TDatabase,
    closeFn?: (conn: TDatabase) => void,
  ) {
    this.max = maxConnections
    this.openFn = openFn
    this.closeFn = closeFn
  }

  borrow(): TDatabase {
    if (this._closed) {
      throw new Error("Connection pool closed")
    }

    let conn: TDatabase | undefined

    if (this._opened < this.max) {
      conn = this.openFn()

      this._opened++
    } else if (this._connections.length > 0) {
      conn = this._connections.pop()
    }

    if (conn) {
      this._borrowed++
      return conn
    }

    throw new Error("No connections available")
  }

  release(db: TDatabase) {
    if (this._closed) {
      throw new Error("Connection pool closed")
    }

    this._borrowed--
    this._connections.push(db)
  }

  close() {
    if (this.closeFn) {
      this._connections.forEach((conn) => this.closeFn!(conn))
    }

    this._closed = true
  }
}
