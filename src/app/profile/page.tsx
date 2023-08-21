import ProfileForm, { ProfileData } from "@/components/profile form/ProfileFrom"
import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


const fetchProfile = async (clerkId:string) => {
  const prisma = new PrismaClient();
  const profile = await prisma.profile.findFirst({
    where: {
      clerkId: clerkId,
    },
  });
  await prisma.$disconnect();
  return profile;
}

const updateOrCreateProfile = async(profileData:ProfileData, clerkId:string) => {
  'use server'
  const prisma = new PrismaClient();
  const existingProfile = await prisma.profile.findFirst({
    where: {
      clerkId:clerkId,
    },
  });

  if (existingProfile) {
    const updatedProfile = await prisma.profile.update({
      where: {
        id: existingProfile.id,
      },
      data: {
        ...profileData,
      },
    });
    await prisma.$disconnect();
  }

  const newProfile = await prisma.profile.create({
    data: {
      ...profileData,
      clerkId: clerkId,
    },
  });
  await prisma.$disconnect();

  revalidatePath(`/${clerkId}`);
  redirect(`/${clerkId}`);
}

const ProfilePage = async() => {
  const user = await currentUser()
  const profile = await fetchProfile(user!.id)

  return (
    <>
    <ProfileForm profile={profile} clerkId={user!.id} updateOrCreateProfile={updateOrCreateProfile}/>
    </>
  )

}


export default ProfilePage
