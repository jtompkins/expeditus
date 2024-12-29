import { Hono } from "hono"
import { githubAuth } from "@hono/oauth-providers/github"
import { Variables } from "./variables.ts"
import { Session } from "@jcs224/hono-sessions"
import { UserRepository } from "../repos/userrepository.ts"
import {
  readonlyPool,
  statementCache,
  writeonlyPool,
} from "../db/connections.ts"

const auth = new Hono<{ Variables: Variables }>()

auth.use(
  "/callback/github",
  githubAuth({
    client_id: Deno.env.get("GITHUB_ID"),
    client_secret: Deno.env.get("GITHUB_SECRET"),
  }),
)

auth.get("/callback/github", (c) => {
  const token = c.get("token")
  const user = c.get("user-github")
  const session = c.get("session")

  const userRepo = new UserRepository(
    readonlyPool,
    writeonlyPool,
    statementCache,
  )

  let existingUser = userRepo.getByEmail(user.email!)

  if (!existingUser) {
    existingUser = userRepo.createUser(user.login, user.email!)
  }

  session.set("token", token)
  session.set("user-email", existingUser.email)

  return c.redirect("/app")
})

auth.get("/logout", (c) => {
  const session = c.get("session") as Session
  session.deleteSession()
  return c.redirect("/")
})

export { auth }
