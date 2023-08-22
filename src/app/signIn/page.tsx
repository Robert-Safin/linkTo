import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn afterSignInUrl={'/home'}/>
    </div>
  )
}

export default SignInPage;
