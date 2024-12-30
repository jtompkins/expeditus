import { DbConnectionPool } from "../util/dbconnectionpool.ts"
import { StatementCache } from "../util/statementcache.ts"
import { Database, Statement } from "@db/sqlite"

const DATABASE_URL = Deno.env.get("DATABASE_URL")!

const readonlyPool = new DbConnectionPool<Database>(4, () => {
  const db = new Database(DATABASE_URL, { readonly: true })

  return db
}, (conn) => conn.close())

const writeonlyPool = new DbConnectionPool<Database>(1, () => {
  const db = new Database(DATABASE_URL)

  return db
}, (conn) => conn.close)

const statementCache = new StatementCache<Database, Statement>()

export { readonlyPool, statementCache, writeonlyPool }
