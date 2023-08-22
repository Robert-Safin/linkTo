import ProfileForm, { ProfileData } from "@/components/profile form/ProfileFrom"
import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const fecthLinks = async (clerkId:string) => {
  const prisma = new PrismaClient();
  const links = await prisma.link.findMany({
    where: {
      clerkId: clerkId,
    },
  });
  await prisma.$disconnect();
  return links;
}

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

  const cloudinaryResponse = await cloudinary.v2.uploader.upload(profileData.avatar, {
    folder: "toLink",
  });

  if (existingProfile) {
    const deleteOldAvatarResponse = await cloudinary.v2.uploader.destroy(
      existingProfile.avatarPublicId
    );

    const updatedProfile = await prisma.profile.update({
      where: {
        id: existingProfile.id,
      },
      data: {
        avatarUrl: cloudinaryResponse.secure_url,
        avatarPublicId: cloudinaryResponse.public_id,
        firstName: profileData.firstName,
        familyName: profileData.familyName,
        email: profileData.email,
      },
    });
    await prisma.$disconnect();
  } else {
    const newProfile = await prisma.profile.create({
      data: {
        clerkId: clerkId,
        avatarUrl: cloudinaryResponse.secure_url,
        avatarPublicId: cloudinaryResponse.public_id,
        firstName: profileData.firstName,
        familyName: profileData.familyName,
        email: profileData.email,
      },
    });
    await prisma.$disconnect();
  }

  revalidatePath(`/${clerkId}`);
  redirect(`/${clerkId}`);
}

const ProfilePage = async() => {
  const user = await currentUser()
  const profile = await fetchProfile(user!.id)
  const links = await fecthLinks(user!.id)

  return (
    <>
    <ProfileForm profile={profile} clerkId={user!.id} updateOrCreateProfile={updateOrCreateProfile} links={links}/>
    </>
  )

}


export default ProfilePage
