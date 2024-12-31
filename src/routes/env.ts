import { GitHubUser } from "@hono/oauth-providers/github"
import { Session } from "@jcs224/hono-sessions"
import { User } from "../repos/userrepository.ts"
import { IoCContainer } from "../lib/ioc-container.ts"

type SessionVariables = {
  "token": string
  "userId": number
}

type AppVariables = {
  "token": string
  "user-github": GitHubUser
  "user": User
  "ioc": IoCContainer
  "session": Session<SessionVariables>
  "session_key_rotation": boolean
}

export type { AppVariables, SessionVariables }
