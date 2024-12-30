import { GitHubUser } from "@hono/oauth-providers/github"
import { Session } from "@jcs224/hono-sessions"
import { User } from "../repos/userrepository.ts"

type SessionEnv = {
  "token": string
  "userId": number
}

type Env = {
  "token": string
  "user-github": GitHubUser
  "user": User
  "session": Session<SessionEnv>
  "session_key_rotation": boolean
}

export type { Env, SessionEnv }
