import { FC } from "hono/jsx"

interface ErrorsProps {
  text: string
}

const Errors: FC<ErrorsProps> = (props: ErrorsProps) => {
  return (
    <div id="errors">
      <div class="label">you messed up</div>
      <div class="error">{props.text}</div>
    </div>
  )
}

export { Errors }
