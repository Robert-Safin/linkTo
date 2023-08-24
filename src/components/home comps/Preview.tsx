"use client";

import { FC } from "react";
import { LinkUi } from "./Links";
import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";
import { colors, platforms } from "@/lib/platforms";
import Link from "next/link";
import { Profile } from "@prisma/client";
interface Props {
  links: LinkUi[];
  profile: Profile;
}

const Preview: FC<Props> = (props) => {
  const shadowsToShow = 5 - props.links.length;

  const userHasLinks = props.links.length > 0;
  const userHasAvatar = props.profile.avatarUrl !== null;
  const userHasFirstName = props.profile.firstName !== null;
  const userHasFamilyName = props.profile.familyName !== null;
  const userHasEmail = props.profile.email !== null;

  return (
    <div className="hidden xl:flex w-2/5 bg-white p-4 my-4 ml-4 rounded-xl  justify-center">
      <div className="fixed mt-20 border-2 rounded-[65px] border-lightGray px-8 py-14 flex flex-col h-[630px] w-[320px] items-center">
        {userHasAvatar ? (
          <Image src={props.profile.avatarUrl} width={1000} height={1000} alt="avatar" className="rounded-full border-2 border-strongPurple h-24 w-24 mb-8"/>
        ) : (
          <div className="bg-lightGray rounded-full h-24 w-24 mb-8" />
        )}
        {userHasFamilyName && userHasFirstName ? (
          <p className="headerS mb-2">
            {props.profile.firstName} {props.profile.familyName}
          </p>
        ) : (
          <div className="bg-lightGray h-4 w-44 rounded-lg mb-2" />
        )}
        {userHasEmail ? (
          <p className="bodyM text-midGray mb-8">{props.profile.email}</p>
        ) : (
          <div className="bg-lightGray h-2 w-24 rounded-lg mb-8" />
        )}

        <div className="flex flex-col overflow-y-auto space-y-2 h-[305px]">
          {userHasLinks &&
            props.links.map((link) => {
              return (
                <Link
                  href={link.url ? link.url : "#"}
                  target="_blank"
                  key={link.platform}
                  className={`mx-auto flex items-baseline justify-between w-[240px] px-6 py-4 rounded-lg md:z-30`}
                  style={{
                    backgroundColor:
                      colors[link.platform as keyof typeof platforms],
                  }}
                >
                  <div className="flex items-center md:z-30">
                  {platforms[link.platform as keyof typeof platforms]}
                    <p className="headerS text-white ml-2 md:z-30">
                      {link.platform}
                    </p>
                  </div>
                  <BsArrowRight className="w-5 h-5 text-white md:z-30" />
                </Link>
              );
            })}
          {Array.from({ length: shadowsToShow }).map((_, i) => (
            <div
              key={i}
              className="bg-lightGray h-12 w-[240px] rounded-lg md:z-30"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
