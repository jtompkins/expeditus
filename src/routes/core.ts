import { Hono } from "hono"
import { getConnInfo } from "hono/deno"
import { MetricRepository } from "../repos/metricrepository.ts"
import { UrlRepository } from "../repos/urlrepository.ts"
import { Login } from "../views/login.ts"
import { AppVariables } from "./env.ts"

const core = new Hono<{ Variables: AppVariables }>()

core.get("/", (c) => {
  const session = c.get("session")
  const userId = session.get("userId")

  if (userId) {
    return c.redirect("/app")
  }

  return c.html(Login())
})

core.get("/:slug", (c) => {
  const urlRepo: UrlRepository = c.get("ioc").get(UrlRepository)
  const metricRepo: MetricRepository = c.get("ioc").get(MetricRepository)

  const slug = c.req.param("slug")

  const url = urlRepo.getBySlug(slug)

  if (url) {
    urlRepo.incrementViewsById(url.id)

    const info = getConnInfo(c)

    metricRepo.createMetric(url.id, info.remote.address, c.req.raw.referrer)

    return c.redirect(url.address)
  }

  return c.notFound()
})

export { core }
