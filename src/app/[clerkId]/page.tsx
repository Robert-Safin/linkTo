import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";

interface Props {
  params: {
    clerkId: string;
  };
}

const fetchUserProfile = async (clerkId: string) => {
  const prisma = new PrismaClient();
  const profile = await prisma.profile.findFirst({
    where: {
      clerkId: clerkId,
    },
  });
  await prisma.$disconnect();
  return profile;
};

const fetchLinks = async (clerkId: string) => {
  const prisma = new PrismaClient();
  const links = await prisma.link.findMany({
    where: {
      clerkId: clerkId,
    },
  });
  await prisma.$disconnect();
  return links;
}

const PreviewPage: FC<Props> = async (props) => {
  const links = await fetchLinks(props.params.clerkId)
  if (links.length === 0) {
    return (
      <div className="bg-white rounded-md m-4 p-4 flex flex-col">
        <div className="flex flex-col items-center mx-auto bg-lightestGray p-4 m-4 rounded-md w-full">
            <p className="headerS text-red mb-4">Set up your links first</p>
            <Link href={"/home"} className="buttonPrimaryDefault">
              Create Links
            </Link>
        </div>
      </div>
    );
  }
  const profile = await fetchUserProfile(props.params.clerkId);
  if (!profile) {
    return (
      <div className="bg-white rounded-md m-4 p-4 flex flex-col">
        <div className="flex flex-col items-center mx-auto bg-lightestGray p-4 m-4 rounded-md w-full">
            <p className="headerS text-red mb-4">Set up your profile details first</p>
            <Link href={"/profile"} className="buttonPrimaryDefault">
              Profile details
            </Link>
        </div>
      </div>
    );
  }


  return (
    <>
      <p>{props.params.clerkId}</p>
    </>
  );
};

export default PreviewPage;
