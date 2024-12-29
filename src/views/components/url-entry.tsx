import { FC } from "hono/jsx"

const UrlEntry: FC = () => {
  return (
    <div id="url-entry">
      <form hx-put="/app/urls" hx-target="#view-root">
        <input type="text" name="slug" placeholder="slug" />
        <input type="text" name="address" placeholder="address" />
        <input type="submit">Add</input>
      </form>
    </div>
  )
}

export { UrlEntry }
