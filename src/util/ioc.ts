import { Database, Statement } from "@db/sqlite"
import { IoCContainer } from "../lib/ioc-container.ts"
import { DbConnectionPool } from "../lib/dbconnectionpool.ts"
import { StatementCache } from "../lib/statementcache.ts"
import { UserRepository } from "../repos/userrepository.ts"
import { MetricRepository } from "../repos/metricrepository.ts"
import { UrlRepository } from "../repos/urlrepository.ts"

const DATABASE_URL = Deno.env.get("DATABASE_URL")!

const iocContainer = new IoCContainer()

iocContainer.singletonWithProvider(
  DbConnectionPool<Database>,
  "readonly",
  () => {
    return new DbConnectionPool<Database>(4, () => {
      const db = new Database(DATABASE_URL, { readonly: true })

      return db
    }, (conn) => conn.close())
  },
)

iocContainer.singletonWithProvider(
  DbConnectionPool<Database>,
  "writeonly",
  () => {
    return new DbConnectionPool<Database>(1, () => {
      const db = new Database(DATABASE_URL)

      return db
    }, (conn) => conn.close())
  },
)

iocContainer.singleton(StatementCache<Database, Statement>, () => {
  return new StatementCache<Database, Statement>()
})

iocContainer.instance(UserRepository, (c: IoCContainer) => {
  return new UserRepository(
    c.get(DbConnectionPool<Database>, "readonly"),
    c.get(DbConnectionPool<Database>, "writeonly"),
    c.get(StatementCache<Database, Statement>),
  )
})

iocContainer.instance(MetricRepository, (c: IoCContainer) => {
  return new MetricRepository(
    c.get(DbConnectionPool<Database>, "readonly"),
    c.get(DbConnectionPool<Database>, "writeonly"),
    c.get(StatementCache<Database, Statement>),
  )
})

iocContainer.instance(UrlRepository, (c: IoCContainer) => {
  return new UrlRepository(
    c.get(DbConnectionPool<Database>, "readonly"),
    c.get(DbConnectionPool<Database>, "writeonly"),
    c.get(StatementCache<Database, Statement>),
    c.get(MetricRepository),
  )
})

export { iocContainer }
