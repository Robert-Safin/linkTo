import { FC } from "react"

interface Props {
  params: {
    clerkId: string
  }
}

const PreviewPage:FC<Props> = (props) => {
  return (
    <>
    <p>{props.params.clerkId}</p>
    </>
  )
}

export default PreviewPage
