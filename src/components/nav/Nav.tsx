"use client";

import { UserData } from "@/app/layout";
import Link from "next/link";
import { FC, useState } from "react";
import { BsLink45Deg } from "react-icons/bs";
import { MdOutlineAccountCircle } from "react-icons/md";
import { TbEye } from "react-icons/tb";
import { TbLayersLinked } from "react-icons/tb";
import { usePathname } from 'next/navigation'

interface Props {
  userData: UserData | null;
}

const Nav: FC<Props> = (props) => {
  const pathname = usePathname()

  const [homeIsActive, setHomeIsActive] = useState(pathname === "/home" ? true : false);
  const [profileIsActive, setProfileIsActive] = useState(pathname === "/profile" ? true : false);



  const activeClass =
    "bg-lightPurple px-6 py-3 rounded-lg text-strongPurple flex items-center";
  const inactiveClass =
    "px-6 py-3 rounded-lg text-strongGray  flex items-center";

  return (
    <div className="bg-white flex flex-row justify-between p-4 items-center sticky top-0">
      <div className="flex items-center">
        <Link
          href={`/home`}
          className="bg-strongPurple p-1 rounded-2xl text-white hover:bg-midPurple"
        >
          <TbLayersLinked className="w-8 h-8" />
        </Link>
        <h1 className="headerM hidden md:block  md:ml-4 font-extrabold">
          linkTo
        </h1>
      </div>

      <div className="flex space-x-4">
        <Link
          href={"/home"}
          onClick={() => {
            setHomeIsActive(true);
            setProfileIsActive(false);
          }}
          className={homeIsActive ? activeClass : inactiveClass}
        >
          <BsLink45Deg className="w-6 h-6" />
          <p className="headerS pl-2 hidden md:block">Links</p>
        </Link>
        <Link
          href={"/profile"}
          onClick={() => {
            setHomeIsActive(false);
            setProfileIsActive(true);
          }}
          className={homeIsActive ? inactiveClass : activeClass}
        >
          <MdOutlineAccountCircle className="w-6 h-6" />
          <p className="headerS pl-2 hidden md:block">Profile Details</p>
        </Link>
      </div>

      <Link
        href={props.userData ? `/${props.userData?.clerkId}` : "/"}
        className="p-2 md:p-3 rounded-lg text-strongPurple border border-strongPurple hover:bg-strongPurple hover:text-lightGray"
      >
        <TbEye className="w-8 h-8 md:hidden" />
        <p className="headerS hidden md:block">Preview</p>
      </Link>
    </div>
  );
};

export default Nav;
