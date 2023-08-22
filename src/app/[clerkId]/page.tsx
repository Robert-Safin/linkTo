import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { BsArrowRight } from "react-icons/bs";
import { platforms, colors } from "@/lib/platforms";
import ShareButton from "@/components/share button/ShareButton";
import { currentUser, clerkClient } from "@clerk/nextjs";
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
};

const PreviewPage: FC<Props> = async (props) => {

  const user = await currentUser();
  const links = await fetchLinks(props.params.clerkId);
  let searchedUser
  try {
    searchedUser = await clerkClient.users.getUser(props.params.clerkId)
  } catch(error) {
    searchedUser = null
  }

  if (searchedUser===null) {
    return (
      <div className="bg-white rounded-md m-4 p-4 flex flex-col">
        <div className="flex flex-col items-center mx-auto bg-lightestGray p-4 m-4 rounded-md w-full">
          <p className="headerS text-red mb-4">User not found</p>
        </div>
      </div>
    );
  }


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
          <p className="headerS text-red mb-4">
            Set up your profile details first
          </p>
          <Link href={"/profile"} className="buttonPrimaryDefault">
            Profile details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="hiden md:block md:fixed md:z-10 md:bg-strongPurple md:w-full md:h-[380px] md:top-0 md:rounded-b-3xl" />
      {user && (
        <div className="z-20 fixed top-0 w-full flex bg-white p-4 space-x-4 md:left-4 md:right-4 md:top-4 md:w-auto md:rounded-lg md:justify-between">
          <Link
            href={"/home"}
            className="buttonSecondaryDefault w-1/2 px-4 bg-white text-center md:w-auto"
          >
            Back to Editor
          </Link>
          <ShareButton />
        </div>
      )}

      <div className="md:w-2/5 md:mx-auto md:z-50 md:flex md:flex-col mt-20 md:mt-40 md:shadow-xl">
        <div className="flex flex-col space-y-2 mx-auto w-full text-center md:z-30 md:bg-white md:pt-16 md:rounded-t-lg">
          <Image
            src={profile.avatarUrl}
            alt="avatar"
            width={150}
            height={150}
            className="object-fill rounded-full border-4 border-strongPurple mx-auto md:z-30"
          />
          <h1 className="headerM md:z-30">
            {profile.firstName} {profile.familyName}
          </h1>
          {profile.email && (
            <p className="bodyM text-midGray md:z-30">{profile.email}</p>
          )}
        </div>

        <div className="flex flex-col space-y-4 py-16 mb-4 md:z-30 md:bg-white md:rounded-b-lg">
          {links.map((link) => {
            return (
              <Link
                href={link.url}
                target="_blank"
                className={`mx-auto flex items-baseline justify-between w-[240px] px-6 py-4 rounded-lg md:z-30`}
                key={link.id}
                style={{
                  backgroundColor:
                    colors[link.platform as keyof typeof platforms],
                }}
              >
                <div className="flex items-center md:z-30">
                  <Image
                    src={platforms[link.platform as keyof typeof platforms]}
                    width={24}
                    height={24}
                    alt={link.platform}
                    className="w-6 h-6 text-red md:z-30"
                  />
                  <p className="headerS text-white ml-2 md:z-30">
                    {link.platform}
                  </p>
                </div>
                <BsArrowRight className="w-5 h-5 text-white md:z-30" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
