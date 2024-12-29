import { CookieStore, sessionMiddleware } from "@jcs224/hono-sessions"
import { Hono } from "hono"
import { html } from "hono/html"

import { auth } from "./routes/auth.ts"
import { Variables } from "./routes/variables.ts"
import { authedApp } from "./routes/authed-app.ts"
import { shortener } from "./routes/shortener.ts"

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
app.route("/", shortener)

app.get("/", (c) => {
  return c.html(
    html`
    <html>
      <head>
      </head>
      <body>
        <p>
          Well, hello there!
        </p>
        <p>
          We're going to now talk to the GitHub API. Ready?
          <a href="https://github.com/login/oauth/authorize?scope=user:email&client_id=${
      Deno.env.get("GITHUB_ID")
    }">Click here</a> to begin!
        </p>
      </body>
    </html>`,
  )
})

Deno.serve(app.fetch)
