import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { BsArrowRepeat, BsArrowRight } from "react-icons/bs";
import { platforms, colors } from "@/lib/platforms";
import ShareButton from "@/components/share button/ShareButton";
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
  const links = await fetchLinks(props.params.clerkId);
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
    <div className="">
      <div className="z-10 fixed top-0 w-full flex bg-white p-4 space-x-4">
        <Link
          href={"/home"}
          className="buttonSecondaryDefault w-1/2 px-4 bg-white text-center"
        >
          Back to Editor
        </Link>
        <ShareButton/>
      </div>

      <div className="flex flex-col space-y-2 mx-auto w-full text-center">
        <Image
          src={profile.avatar}
          alt="avatar"
          width={150}
          height={150}
          className="object-fill rounded-full border-4 border-strongPurple mx-auto"
        />
        <h1 className="headerM">
          {profile.firstName} {profile.familyName}
        </h1>
        {profile.email && <p className="bodyM text-midGray">{profile.email}</p>}
      </div>

    <div className="flex flex-col space-y-4 mt-8 mb-4">
      {links.map((link) => {
        return (
          <Link href={link.url} target="_blank" className={`mx-auto flex items-baseline justify-between w-[240px] px-6 py-4 rounded-lg`} key={link.id} style={{backgroundColor: colors[link.platform as keyof typeof platforms]}}>
            <div className="flex items-center">
              <Image src={platforms[link.platform as keyof typeof platforms]} width={24} height={24} alt={link.platform} className="w-6 h-6 text-red"/>
              <p className="headerS text-white ml-2">{link.platform}</p>
            </div>
            <BsArrowRight className="w-5 h-5 text-white" />
          </Link>
        );
      })}
    </div>





    </div>
  );
};

export default PreviewPage;
