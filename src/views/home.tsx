import { FC } from "hono/jsx"
import { Url } from "../repos/urlrepository.ts"
import { UrlTable } from "./components/url-table.tsx"
import { UrlEntry } from "./components/url-entry.tsx"
import { Errors } from "./components/errors.tsx"

interface HomeProps {
  urls: Url[]
  error?: string
}

const HomeView: FC<HomeProps> = (props: HomeProps) => {
  return (
    <>
      <UrlEntry />
      {props.error && <Errors text={props.error!} />}
      <UrlTable urls={props.urls} />
    </>
  )
}

export { HomeView }
