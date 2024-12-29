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

const authedApp = new Hono<{ Variables: Env }>()

authedApp.use(async (c, next) => {
  const session = c.get("session") as Session
  const email = session.get("user-email") as string

  const userRepo = new UserRepository(
    readonlyPool,
    writeonlyPool,
    statementCache,
  )

  const user = userRepo.getByEmail(email)

  if (!user) {
    return c.redirect("/")
  }

  c.set("user", user)

  await next()
})

authedApp.get("/", (c) => {
  const user = c.get("user")

  const urlRepo = new UrlRepository(readonlyPool, writeonlyPool, statementCache)

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

  const urlRepo = new UrlRepository(readonlyPool, writeonlyPool, statementCache)
  const metricRepo = new MetricRepository(
    readonlyPool,
    writeonlyPool,
    statementCache,
  )

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

export { authedApp }
