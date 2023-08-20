import NoLinks from "@/components/home comps/NoLinks";
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

const HomePage = async () => {
  const user = await currentUser();
  const links = await fetchUserLinks(user!.id);

  if (links.length === 0) {
    return (
      <>
        <NoLinks clerkId={user!.id}/>
      </>
    );
  } else {
    return (
      <>
        {links.map((link) => (
          <p key={link.id}>{link.url}</p>
        ))}
      </>
    );
  }
};

export default HomePage;
