import { FC } from "hono/jsx"
import { Url } from "../repos/urlrepository.ts"

interface HomeProps {
  urls: Url[]
}

const HomeView: FC<HomeProps> = (props: HomeProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Slug</th>
          <th>Address</th>
          <th>Views</th>
          <th>Created</th>
          <th>Updated</th>
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
              <td>{u.created}</td>
              <td>{u.updated}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export { HomeView }
