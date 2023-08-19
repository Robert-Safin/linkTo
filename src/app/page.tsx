import { SignIn } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

const Page = async () => {
  const user = await currentUser();
  console.log(user);

  return (
    <>

    </>
  );
};

export default Page;
