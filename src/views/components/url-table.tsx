import { FC } from "hono/jsx"
import { Url } from "../../repos/urlrepository.ts"

interface UrlTableProps {
  urls: Url[]
}

const UrlTable: FC<UrlTableProps> = (props: UrlTableProps) => {
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "UTC",
  })

  return (
    <table id="url-table">
      <thead>
        <tr>
          <th>Short Code</th>
          <th>Address</th>
          <th class="views">Views</th>
          <th class="created">Created</th>
          <th class="action"></th>
        </tr>
      </thead>
      <tbody>
        {props.urls.map((u) => {
          return (
            <tr>
              <th>
                {u.slug}
              </th>
              <td>
                <a href={u.address}>{u.address}</a>
              </td>
              <td class="views">{u.views}</td>
              <td class="created">
                {dateFormatter.format(u.created.toZonedDateTimeISO("UTC"))}
              </td>
              <td class="action">
                <button
                  hx-delete={`/app/urls/${u.slug}`}
                  hx-target="#url-table"
                  hx-swap="outerHTML"
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
