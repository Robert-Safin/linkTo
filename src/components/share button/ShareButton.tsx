'use client'
import { FC, useState } from "react";

interface Props {

}

const ShareButton:FC<Props> = (props) => {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }
    , 2000)
  }

  return (
    <button onClick={handleClick} className="buttonPrimaryDefault w-1/2 px-4 md:w-auto">{copied ? 'Coppied to clipboard' : "Share Link"}</button>

  )
}


export default ShareButton;
