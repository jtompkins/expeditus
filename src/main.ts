import { Hono } from "hono"
import { DbConnectionPool } from "./db/dbconnectionpool.ts"
import { StatementCache } from "./db/statementcache.ts"
import { Database, Statement } from "@db/sqlite"
import { UrlRepository } from "./repos/urlrepository.ts"

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

const urlRepo = new UrlRepository(readonlyPool, writeonlyPool, statementCache)

const app = new Hono()

app.get("/:slug", (c) => {
  const slug = c.req.param("slug")

  const url = urlRepo.getBySlug(slug)

  if (url) {
    return c.redirect(url.address)
  }

  return c.notFound()
})

Deno.serve(app.fetch)
