import Links, { userLink } from "@/components/home comps/Links";
import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";

const fetchUserProfile = async (clerkId: string) => {
  const profile = await prisma.profile.findFirst({
    where: {
      clerkId: clerkId,
    },
  });
  return profile;
}

const fetchUserLinks = async (clerkId: string) => {
  const links = await prisma.link.findMany({
    where: {
      clerkId: clerkId,
    },
  });
  return links;
};

const updateLinks = async (links: userLink[], clerkId: string) => {
  "use server";

  const linksToDelete = await prisma.link.deleteMany({
    where: {
      clerkId: clerkId,
    },
  });

  for (const link of links) {
    await prisma.link.create({
      data: {
        platform: link.platform,
        url: link.url,
        clerkId: clerkId,
      },
    });
  }

  revalidateTag("/profile");
  revalidatePath("profile");
  redirect("/profile");
};

const HomePage = async () => {
  const user = await currentUser();
  const links = await fetchUserLinks(user!.id);
  const profile = await fetchUserProfile(user!.id);

  return (
    <>
      <Links links={links} clerkId={user!.id} updateLinks={updateLinks} profile={profile!}/>
    </>
  );
};

export default HomePage;
