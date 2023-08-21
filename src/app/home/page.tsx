import Links, { userLink } from "@/components/home comps/Links";
import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const fetchUserLinks = async (clerkId: string) => {
  const prisma = new PrismaClient();
  const links = await prisma.link.findMany({
    where: {
      clerkId: clerkId,
    },
  });
  await prisma.$disconnect();
  return links;
};

const updateLinks = async (links: userLink[], clerkId: string) => {
  "use server";

  const prisma = new PrismaClient();
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

  await prisma.$disconnect();
  revalidateTag("/profile");
  revalidatePath("profile");
  redirect("/profile");
};

const HomePage = async () => {
  const user = await currentUser();
  const links = await fetchUserLinks(user!.id);

  return (
    <>
      <Links links={links} clerkId={user!.id} updateLinks={updateLinks} />
    </>
  );
};

export default HomePage;
