import { Hono } from "hono"
import { Env } from "./env.ts"
import { UserRepository } from "../repos/userrepository.ts"
import {
  readonlyPool,
  statementCache,
  writeonlyPool,
} from "../db/connections.ts"
import { Session } from "@jcs224/hono-sessions"
import { UrlRepository } from "../repos/urlrepository.ts"
import { HomeView } from "../views/home.tsx"
import { Layout } from "../views/layout.ts"
import { UrlView } from "../views/url.tsx"
import { MetricRepository } from "../repos/metricrepository.ts"
import { UrlTable } from "../views/components/url-table.tsx"

const metricRepo = new MetricRepository(
  readonlyPool,
  writeonlyPool,
  statementCache,
)

const urlRepo = new UrlRepository(
  readonlyPool,
  writeonlyPool,
  statementCache,
  metricRepo,
)

const authedApp = new Hono<{ Variables: Env }>()

authedApp.use(async (c, next) => {
  const session = c.get("session") as Session
  const userId = session.get("userId") as number

  const userRepo = new UserRepository(
    readonlyPool,
    writeonlyPool,
    statementCache,
  )

  const user = userRepo.getById(userId)

  if (!user) {
    return c.redirect("/")
  }

  c.set("user", user)

  await next()
})

authedApp.get("/", (c) => {
  const user = c.get("user")

  const urls = urlRepo.getByUser(user.id)

  return c.html(
    <Layout title={"Expeditus | Home"} user={user}>
      <HomeView urls={urls} />
    </Layout>,
  )
})

authedApp.get("/urls/:slug", (c) => {
  const slug = c.req.param("slug")
  const user = c.get("user")

  const url = urlRepo.getBySlug(slug)

  if (!url) {
    return c.redirect("/app")
  }

  const metrics = metricRepo.getByUrlId(url.id)

  return c.html(
    <Layout title={`Expeditus | ${slug}`} user={user}>
      <UrlView url={url} metrics={metrics} />
    </Layout>,
  )
})

authedApp.put("/urls", async (c) => {
  const user = c.get("user")

  const form = await c.req.formData()

  const slug = form.get("slug")?.toString()
  const address = form.get("address")?.toString()

  let error = ""

  if (slug && address) {
    const existingSlug = urlRepo.getBySlug(slug)

    if (existingSlug) {
      error = `${slug} is not available`
    } else {
      urlRepo.createUrl(user.id, slug, address)
    }
  } else {
    error = "Slug and address are required"
  }

  const urls = urlRepo.getByUser(user.id)

  return c.html(
    <HomeView urls={urls} error={error} />,
  )
})

authedApp.delete("/urls/:slug", (c) => {
  const user = c.get("user")
  const slug = c.req.param("slug")

  const url = urlRepo.getBySlug(slug)

  if (url) {
    urlRepo.deleteById(url.id)
  }

  const urls = urlRepo.getByUser(user.id)

  return c.html(
    <UrlTable urls={urls} />,
  )
})

export { authedApp }
