import { FC } from "hono/jsx"

const Login: FC = () => {
  const githubId = Deno.env.get("GITHUB_ID")

  return (
    <html>
      <head>
      </head>
      <body>
        <h1>Expeditus</h1>
        <div>
          <a
            href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${githubId}`}
          >
            Login with Github
          </a>
        </div>
      </body>
    </html>
  )
}

export { Login }
