import { FC } from "hono/jsx"

interface ErrorsProps {
  text: string
}

const Errors: FC<ErrorsProps> = (props: ErrorsProps) => {
  return (
    <div>
      ERROR {props.text}
    </div>
  )
}

export { Errors }
