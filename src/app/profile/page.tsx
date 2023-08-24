import ProfileForm, { ProfileData } from "@/components/profile form/ProfileFrom"
import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "cloudinary";
import prisma from "@/lib/client";
import Link from "next/link";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const fecthLinks = async (clerkId:string) => {
  const links = await prisma.link.findMany({
    where: {
      clerkId: clerkId,
    },
  });
  return links;
}

const fetchProfile = async (clerkId:string) => {
  const profile = await prisma.profile.findFirst({
    where: {
      clerkId: clerkId,
    },
  });
  return profile;
}

const updateOrCreateProfile = async(profileData:ProfileData, clerkId:string) => {
  'use server'
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
  }

  revalidatePath(`/${clerkId}`);
  redirect(`/${clerkId}`);
}

const ProfilePage = async() => {
  const user = await currentUser()
  const profile = await fetchProfile(user!.id)
  const links = await fecthLinks(user!.id)


  if (links.length === 0) {
    return (
      <div className="bg-white rounded-md m-4 p-4 flex flex-col">
        <div className="flex flex-col items-center mx-auto bg-lightestGray p-4 m-4 rounded-md w-full">
          <p className="headerS text-red mb-4">Make some links first</p>
          <Link href={"/home"} className="buttonPrimaryDefault">
            Create Links
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <ProfileForm profile={profile} clerkId={user!.id} updateOrCreateProfile={updateOrCreateProfile} links={links}/>
    </>
  )

}


export default ProfilePage
