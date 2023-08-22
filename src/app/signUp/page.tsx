import { SignUp } from "@clerk/nextjs";

const signUpPage = async () => {
  return (
    <div className="flex justify-center items-center h-screen">
    <SignUp/>
  </div>
  )
};

export default signUpPage;
