import Nav from '@/components/nav/Nav'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { currentUser } from "@clerk/nextjs";
import { FC } from 'react';

interface Props {
  children: React.ReactNode
}

export interface UserData {
  clerkId: string,
  email: string,
}

const RootLayout:FC<Props> = async(props) =>{
  const user = await currentUser();
  const userData:UserData = {
    clerkId: user!.id,
    email: user!.emailAddresses[0].emailAddress,
  }


  return (
    <ClerkProvider>
    <html lang="en" className='bg-lightGray'>
      <body className='container max-w-[1440px] min-h-screen mx-auto'>
      <Nav userData={userData}/>
        {props.children}
        </body>
    </html>
    </ClerkProvider>
  )
}

export default RootLayout
