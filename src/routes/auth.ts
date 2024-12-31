import { githubAuth } from "@hono/oauth-providers/github"
import { Session } from "@jcs224/hono-sessions"
import { Hono } from "hono"
import { UserRepository } from "../repos/userrepository.ts"
import { AppVariables } from "./env.ts"

const auth = new Hono<{ Variables: AppVariables }>()

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

  const userRepo: UserRepository = c.get("ioc").get(UserRepository)

  let existingUser = userRepo.getByEmail(user.email!)

  if (!existingUser) {
    existingUser = userRepo.createUser(user.login, user.email!)
  }

  session.set("token", token)
  session.set("userId", existingUser.id)

  return c.redirect("/app")
})

auth.get("/logout", (c) => {
  const session = c.get("session") as Session
  session.deleteSession()
  return c.redirect("/")
})

export { auth }
