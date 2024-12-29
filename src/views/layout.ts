import { html } from "hono/html"
import { User } from "../repos/userrepository.ts"

interface LayoutProps {
  title?: string
  user: User
  children?: any
}

const Layout = (props: LayoutProps) =>
  html`
<!DOCTYPE html>
  <html lang="en">
  <meta charset="UTF-8">
  <title>${props.title || "Expeditus"}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="">
  <script src="https://unpkg.com/htmx.org@2.0.4"></script>
  
  <body>
    <header>
      <h1>Hello, ${props.user.username}</h1>
      <a href=${`/auth/logout`}>Log out</a>
    </header>
    <section id="view-root">
      ${props.children}
    </section>
  </body>
</html>
`

export { Layout }
