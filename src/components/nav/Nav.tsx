"use client";

import { UserData } from "@/app/layout";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import { FC, useState } from "react";
import { BsLink45Deg } from "react-icons/bs";
import { MdOutlineAccountCircle } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import {TbLayersLinked} from "react-icons/tb";
interface Props {
  userData: UserData | null;
}

const Nav: FC<Props> = (props) => {
  const [homeIsActive, setHomeIsActive] = useState(true);
  const activeClass = "bg-lightPurple px-6 py-2 rounded-lg text-strongPurple";
  const inactiveClass = "px-6 py-2 rounded-lg text-strongGray border border-strongGray";

  return (
    <div className="bg-white flex flex-row justify-between p-4 items-center">





      <div className="flex items-center">
      <Link
        href={`/home`}
        className="bg-strongPurple p-1 rounded-2xl text-white hover:bg-midPurple"
      >
        <TbLayersLinked className="w-8 h-8" />
      </Link>
      <h1 className="headerM hidden md:block  md:ml-4 font-extrabold">devlinks</h1>

      </div>











      <div className="flex space-x-4">
        <Link
          href={"#"}
          onClick={() => setHomeIsActive(!homeIsActive)}
          className={homeIsActive ? activeClass : inactiveClass}
        >
          <BsLink45Deg className="w-8 h-8" />
        </Link>
        <Link
          href={"#"}
          onClick={() => setHomeIsActive(!homeIsActive)}
          className={homeIsActive ? inactiveClass : activeClass}
        >
          <MdOutlineAccountCircle className="w-8 h-8" />
        </Link>
      </div>









      <Link
        href={`/preview`}
        className="p-2 rounded-lg text-strongPurple border border-strongPurple hover:bg-strongPurple hover:text-lightGray"
      >
        <BsEye className="w-8 h-8" />
      </Link>














    </div>
  );
};

export default Nav;
