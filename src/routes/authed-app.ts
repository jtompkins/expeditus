import { Hono } from "hono"
import { Variables } from "./variables.ts"
import { html } from "hono/html"
import { UserRepository } from "../repos/userrepository.ts"
import {
  readonlyPool,
  statementCache,
  writeonlyPool,
} from "../db/connections.ts"
import { Session } from "@jcs224/hono-sessions"

const authedApp = new Hono<{ Variables: Variables }>()

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

export { authedApp }
