import { CookieStore, sessionMiddleware } from "@jcs224/hono-sessions"
import { Hono } from "hono"

import { auth } from "./routes/auth.ts"
import { Variables } from "./routes/variables.ts"
import { authedApp } from "./routes/authed-app.tsx"
import { core } from "./routes/core.tsx"

const app = new Hono<{ Variables: Variables }>()

const store = new CookieStore()

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

app.route("/auth", auth)
app.route("/app", authedApp)
app.route("/", core)

Deno.serve(app.fetch)
