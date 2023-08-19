
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

const Page = async () => {
  const user = await currentUser();

  return (
    <>
    <Link href={`/signIn`}>signin</Link>
    <Link href={`/signUp`}>signup</Link>

    </>
  );
};

export default Page;
