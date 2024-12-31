import { html } from "hono/html"
import { User } from "../repos/userrepository.ts"

interface LayoutProps {
  title?: string
  user: User
  styles?: string[]
  children?: any
}

const Layout = (props: LayoutProps) => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <meta charset="UTF-8" />
      <title>${props.title || "Expeditus"}</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="stylesheet" href="/static/styles/core.css" />

      ${
    props.styles && props.styles.map((s) =>
      html`<link rel="stylesheet" href="/static/styles/${s}" />`
    )
  }

      <script src="https://unpkg.com/htmx.org@2.0.4"></script>

      <body>
        <div id="logo"><h1>Expeditus</h1></div>

        <div id="page-root">
          <header id="page-header">
            <h1>Hello, <span class="highlight">${props.user.username}</span></h1>
            <a id="logout-btn" href=${`/auth/logout`}>Log out</a>
          </header>

          <section id="view-root">${props.children}</section>
        </div>
      </body>
    </html>
  `
}

export { Layout }
