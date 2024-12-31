import { CookieStore, sessionMiddleware } from "@jcs224/hono-sessions"
import { Hono } from "hono"
import { auth } from "./routes/auth.ts"
import { authedApp } from "./routes/authed-app.tsx"
import { core } from "./routes/core.ts"
import { iocContainer } from "./util/ioc.ts"
import { AppVariables } from "./routes/env.ts"
import { serveStatic } from "hono/deno"

const store = new CookieStore()

const app = new Hono<{ Variables: AppVariables }>()

app.use("/static/*", serveStatic({ root: "./src/" }))

app.use(
  "*",
  sessionMiddleware({
    store,
    encryptionKey: Deno.env.get("AUTH_SECRET"), // Required for CookieStore, recommended for others
    expireAfterSeconds: 900, // Expire session after 15 minutes of inactivity
    cookieOptions: {
      sameSite: "Lax", // Recommended for basic CSRF protection in modern browsers
      path: "/", // Required for this library to work properly
      httpOnly: true, // Recommended to avoid XSS attacks
    },
  }),
)

app.use(async (c, next) => {
  c.set("ioc", iocContainer)
  await next()
})

app.route("/auth", auth)
app.route("/app", authedApp)
app.route("/", core)

Deno.serve({ port: 8080 }, app.fetch)
