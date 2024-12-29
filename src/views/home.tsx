import { FC } from "hono/jsx"
import { Url } from "../repos/urlrepository.ts"
import { UrlTable } from "./components/url-table.tsx"

interface HomeProps {
  urls: Url[]
}

const HomeView: FC<HomeProps> = (props: HomeProps) => {
  return <UrlTable urls={props.urls} />
}

export { HomeView }
