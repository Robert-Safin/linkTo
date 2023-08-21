import Links from "@/components/home comps/Links";
import NoLinks, { userLink } from "@/components/home comps/NoLinks";
import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

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

const updateLinks = async (links: userLink[]) => {
  "use server";
  const prisma = new PrismaClient();
  const linksToDelete = await prisma.link.deleteMany({
    where: {
      clerkId: links[0].clerkId,
    },
  });

  const newLinks = await prisma.link.createMany({
    data: links,
  });

  await prisma.$disconnect();
};

const HomePage = async () => {
  const user = await currentUser();
  const links = await fetchUserLinks(user!.id);

  if (links.length === 0) {
    return (
      <>
        <NoLinks clerkId={user!.id} updateLinks={updateLinks} />
      </>
    );
  } else {
    return (
      <>
       <Links links={links} />
      </>
    );
  }
};

export default HomePage;
