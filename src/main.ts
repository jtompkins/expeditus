import { Hono } from "hono"
import { html } from "hono/html"
import { githubAuth } from "@hono/oauth-providers/github"
import { UrlRepository } from "./repos/urlrepository.ts"
import { CookieStore, Session, sessionMiddleware } from "@jcs224/hono-sessions"
import { GitHubUser } from "@hono/oauth-providers/github"
import { readonlyPool, statementCache, writeonlyPool } from "./db/db.ts"
import { UserRepository } from "./repos/userrepository.ts"

const urlRepo = new UrlRepository(readonlyPool, writeonlyPool, statementCache)
const userRepo = new UserRepository(readonlyPool, writeonlyPool, statementCache)

type SessionVariables = {
  "token": string
  "user": string
}

type Variables = {
  "token": string
  "user-github": GitHubUser
  "session": Session<SessionVariables>
  "session_key_rotation": boolean
}

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

app.use(
  "/auth/callback/github",
  githubAuth({
    client_id: Deno.env.get("GITHUB_ID"),
    client_secret: Deno.env.get("GITHUB_SECRET"),
  }),
)

app.get("/auth/callback/github", (c) => {
  const token = c.get("token")
  const user = c.get("user-github")
  const session = c.get("session")

  let existingUser = userRepo.getByEmail(user.email!)

  if (!existingUser) {
    existingUser = userRepo.createUser(user.login, user.email!)
  }

  session.set("token", token)
  session.set("user", existingUser.email)

  return c.redirect("/app")
})

app.get("/auth/logout", (c) => {
  const session = c.get("session") as Session
  session.deleteSession()
  return c.redirect("/")
})

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
        <p>
          If that link doesn't work, remember to provide your own <a href="/apps/building-oauth-apps/authorizing-oauth-apps/">Client ID</a>!
        </p>
      </body>
    </html>`,
  )
})

app.get("/app", (c) => {
  const session = c.get("session") as Session
  const email = session.get("user") as string

  const user = userRepo.getByEmail(email)

  if (!user) {
    return c.redirect("/")
  }

  return c.html(
    html`
      <html>
        <body>
          You are logged in as ${user.username}. Click <a href="/auth/logout">here</a> to logout.
        </body>
      </html>
    `,
  )
})

app.get("/:slug", (c) => {
  const slug = c.req.param("slug")

  const url = urlRepo.getBySlug(slug)

  if (url) {
    return c.redirect(url.address)
  }

  return c.notFound()
})

Deno.serve(app.fetch)
