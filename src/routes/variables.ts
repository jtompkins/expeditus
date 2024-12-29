import { GitHubUser } from "@hono/oauth-providers/github"
import { Session } from "@jcs224/hono-sessions"
import { User } from "../repos/userrepository.ts"

type SessionVariables = {
  "token": string
  "user-email": string
}

type Variables = {
  "token": string
  "user-github": GitHubUser
  "user": User
  "session": Session<SessionVariables>
  "session_key_rotation": boolean
}

export type { SessionVariables, Variables }
