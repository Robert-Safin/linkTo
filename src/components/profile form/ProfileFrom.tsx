"use client";

import { Profile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FC, useState, useTransition } from "react";
import { LiaImageSolid } from "react-icons/lia";
import ButtonLoader from "../loader button/ButtonLoader";
interface Props {
  profile: Profile | null;
  clerkId: string;
  updateOrCreateProfile: (
    profileData: ProfileData,
    clerkId: string
  ) => Promise<void>;
}

export interface ProfileData {
  avatar: string;
  firstName: string;
  familyName: string;
  email?: string;
}

const ProfileForm: FC<Props> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition()
  const [avatar, setAvatar] = useState(props.profile?.avatar || null);
  const [firstName, setFirstName] = useState(props.profile?.firstName || null);
  const [familyName, setFamilyName] = useState(
    props.profile?.familyName || null
  );
  const [email, setEmail] = useState(props.profile?.email || null);


  const [avatarError, setAvatarError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [familyNameError, setFamilyNameError] = useState(false);







  const handleAvatarChangeBase64 = (e:ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target!.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const profileData: ProfileData = {
      avatar: avatar!,
      firstName: firstName!,
      familyName: familyName!,
      email: email!,
    }

    if (!avatar) {
      setAvatarError(true);
      return;
    } else {
      setAvatarError(false);
    }

    if (!firstName) {
      setFirstNameError(true);
      return;
    } else {
      setFirstNameError(false);
    }

    if (!familyName) {
      setFamilyNameError(true);
      return;
    } else {
      setFamilyNameError(false);
    }
    setIsLoading(true);
    startTransition(async() => await props.updateOrCreateProfile(profileData, props.clerkId))
  }


    return (
      <div className="bg-white rounded-md p-4 m-4 h-screen">
        <h1 className="headerM mt-6 mb-4">Profile Details</h1>
        <p className="bodyM text-midGray mb-6">
          Add your details to create a personal touch to your profile.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="bg-lightestGray rounded-md p-4 flex flex-col w-full mx-auto">
            <label className="bodyM text-midGray mb-2">Profile picture</label>
            <input
              type="file"
              id="avatar"
              className="hidden"
              onChange={handleAvatarChangeBase64}
              accept="image/png, image/jpeg"
              max={1024}
              multiple={false}
            />

            <label
              htmlFor="avatar"
              className="mb-2 flex flex-col justify-center text-center rounded-xl bg-lightPurple py-4 w-[200px] h-[200px] relative"
            >
              {avatarError && <p className="bodyS text-red">Must upload an avatar</p> }
              {avatar ? (
                <div className="flex flex-col items-center space-y-4">
                  <Image
                    src={avatar}
                    alt="Avatar Preview"
                    className="object-fill w-[200px] h-[200px] rounded-xl opacity-60 shadow-sm shadow-black"
                    width={200}
                    height={200}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <LiaImageSolid className="w-10 h-10 text-white" />
                    <p className="bodyM text-white mt-2">Change image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <LiaImageSolid className="w-10 h-10 text-strongPurple text-mx-auto" />
                  <p className="bodyM text-strongPurple text-mx-auto">
                    + Upload Image
                  </p>
                </div>
              )}
            </label>

            <p className="bodyS text-midGray my-4">
              Image must be below 1024x1024px. Use PNG or JPG format.
            </p>
          </div>

          <div className="bg-lightestGray rounded-md p-4 flex flex-col w-full mx-auto mt-6">
            <label className="bodyM text-midGray">First name*</label>
            {firstNameError && <p className="bodyS text-red">Must enter first name</p> }
            <input
              className="bg-white p-2 rounded-md border border-lightGray"
              type="text"
              placeholder="John"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName || ""}
            />
            <label className="bodyM text-midGray">Family name*</label>
            {familyNameError && <p className="bodyS text-red">Must enter family name</p> }
            <input
              className="bg-white p-2 rounded-md border border-lightGray"
              type="text"
              placeholder="Smith"
              onChange={(e) => setFamilyName(e.target.value)}
              value={familyName || ""}
            />
            <label className="bodyM text-midGray">Email</label>
            <input
              className="bg-white p-2 rounded-md border border-lightGray"
              type="text"
              placeholder="johnsmith@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email || ""}
            />
          </div>

          <button type="submit" className="buttonPrimaryDefault py-3 fixed bottom-4 left-4 right-4 mx-auto">
            {isLoading ? <ButtonLoader/> : "Save"}
          </button>
        </form>
      </div>
    );



};

export default ProfileForm;
