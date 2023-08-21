import { FC } from "react"
import { Link } from "@prisma/client"

interface Props {
  links: Link[]
}

const Links:FC<Props> = (props) => {

  return (
    <>

    {props.links.map((link)=> {
      return <p key={link.id}>{link.url}</p>
    })}
    </>
  )
}


export default Links
