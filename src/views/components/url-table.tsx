import { FC } from "hono/jsx"
import { Url } from "../../repos/urlrepository.ts"

interface UrlTableProps {
  urls: Url[]
}

const UrlTable: FC<UrlTableProps> = (props: UrlTableProps) => {
  return (
    <table id="url-table">
      <thead>
        <tr>
          <th>Slug</th>
          <th>Address</th>
          <th>Views</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.urls.map((u) => {
          return (
            <tr>
              <td>
                <a href={`/app/urls/${u.slug}`}>{u.slug}</a>
              </td>
              <td>
                <a href={u.address}>{u.address}</a>
              </td>
              <td>{u.views}</td>
              <td>
                {u.created.toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
              <td>
                <button
                  hx-delete={`/app/urls/${u.slug}`}
                  hx-target="#url-table"
                  hx-swap="outerHTML"
                  href="#"
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export { UrlTable }
