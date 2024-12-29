import { Hono } from "hono"
import { Variables } from "./variables.ts"
import { UrlRepository } from "../repos/urlrepository.ts"
import {
  readonlyPool,
  statementCache,
  writeonlyPool,
} from "../db/connections.ts"

const shortener = new Hono<{ Variables: Variables }>()

shortener.get("/:slug", (c) => {
  const slug = c.req.param("slug")

  const urlRepo = new UrlRepository(readonlyPool, writeonlyPool, statementCache)

  const url = urlRepo.getBySlug(slug)

  if (url) {
    return c.redirect(url.address)
  }

  return c.notFound()
})

export { shortener }
