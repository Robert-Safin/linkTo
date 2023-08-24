import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

const Page = async () => {

  const user = await  currentUser()

  return (

    <div className="flex justify-center items-center h-screen bg-lightestGray">
      <div className="rounded-lg p-4 m-4">
        <h1 className="headerM">linkTo is a free link sharing app.</h1>
        <p className="bodyM my-4">
          Generate your personal page with links to your social platforms.
        </p>
        <div className="flex flex-col w-full justify-evenly space-y-4">

          <Link
            href={`https://clear-rabbit-33.accounts.dev/sign-in`}
            className="buttonPrimaryDefault text-center"
          >
            Sign In
          </Link>
          <Link
            href={`https://clear-rabbit-33.accounts.dev/sign-up`}
            className="buttonPrimaryDefault text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
          {JSON.stringify(user)}
    </div>
  );
};

export default Page;
