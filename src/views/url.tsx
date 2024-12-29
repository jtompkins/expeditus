import { FC } from "hono/jsx"
import { Url } from "../repos/urlrepository.ts"
import { Metric } from "../repos/metricrepository.ts"

interface UrlViewParams {
  url: Url
  metrics: Metric[]
}

const UrlView: FC<UrlViewParams> = (props: UrlViewParams) => {
  return (
    <>
      <a href="/app">All URLs</a>
      <p>
        {props.url.slug} - {props.url.address}
      </p>

      <h2>Views</h2>

      <table>
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Viewed</th>
          </tr>
        </thead>
        <tbody>
          {props.metrics.map((m) => {
            return (
              <tr>
                <td>{m.ipAddress}</td>
                <td>
                  {m.created}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export { UrlView }
