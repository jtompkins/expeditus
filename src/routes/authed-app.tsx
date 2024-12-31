import { Hono } from "hono"
import { MetricRepository } from "../repos/metricrepository.ts"
import { UrlRepository } from "../repos/urlrepository.ts"
import { UserRepository } from "../repos/userrepository.ts"
import { UrlTable } from "../views/components/url-table.tsx"
import { HomeView } from "../views/home.tsx"
import { Layout } from "../views/layout.ts"
import { UrlView } from "../views/url.tsx"
import { AppVariables } from "./env.ts"

const authedApp = new Hono<{ Variables: AppVariables }>()

authedApp.use(async (c, next) => {
  const session = c.get("session")
  const userId = session.get("userId")

  if (!userId) {
    return c.redirect("/")
  }

  const userRepo = c.get("ioc").get(UserRepository)

  const user = userRepo.getById(userId)

  if (!user) {
    return c.redirect("/")
  }

  c.set("user", user)

  await next()
})

authedApp.get("/", (c) => {
  const urlRepo = c.get("ioc").get(UrlRepository)
  const user = c.get("user")

  const urls = urlRepo.getByUser(user.id)

  return c.html(
    <Layout title={"Expeditus | Home"} user={user}>
      <HomeView urls={urls} />
    </Layout>,
  )
})

authedApp.get("/urls/:slug", (c) => {
  const urlRepo = c.get("ioc").get(UrlRepository)
  const metricRepo = c.get("ioc").get(MetricRepository)

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
  const urlRepo = c.get("ioc").get(UrlRepository)
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
  const urlRepo = c.get("ioc").get(UrlRepository)
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
