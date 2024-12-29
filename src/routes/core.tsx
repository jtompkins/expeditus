import { Hono } from "hono"
import { Env } from "./env.ts"
import { UrlRepository } from "../repos/urlrepository.ts"
import {
  readonlyPool,
  statementCache,
  writeonlyPool,
} from "../db/connections.ts"
import { Login } from "../views/login.tsx"

const core = new Hono<{ Variables: Env }>()

core.get("/", (c) => {
  return c.html(<Login />)
})

core.get("/:slug", (c) => {
  const slug = c.req.param("slug")

  const urlRepo = new UrlRepository(readonlyPool, writeonlyPool, statementCache)

  const url = urlRepo.getBySlug(slug)

  if (url) {
    return c.redirect(url.address)
  }

  return c.notFound()
})

export { core }
