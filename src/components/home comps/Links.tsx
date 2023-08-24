"use client";
import { colors, platformsForm } from "@/lib/platforms";
import Image from "next/image";
import { FC, useState, useTransition } from "react";
import { IoReorderTwoOutline } from "react-icons/io5";
import { BsLink45Deg } from "react-icons/bs";
import { Link, Profile } from "@prisma/client";
import ButtonLoader from "../loader button/ButtonLoader";
import Preview from "./PreviewProfile";

interface Props {
  clerkId: string;
  updateLinks: (links: userLink[], clerkId: string) => Promise<void>;
  links?: Link[];
  profile: Profile
}

export interface LinkUi {
  platform: string;
  url: string;
}

export interface userLink {
  platform: string;
  url: string;
}

const Links: FC<Props> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inTransition, startTransition] = useTransition();
  const [numberOfLinks, setNumberOfLinks] = useState(() => {
    if (props.links && props.links.length) {
      return props.links.length;
    }
    return 1;
  });

  const [links, setLinks] = useState<LinkUi[]>(() => {
    if (props.links && props.links.length) {
      return props.links.map((link) => ({
        platform: link.platform,
        url: link.url,
      }));
    } else {
      return [
        {
          platform: Object.keys(platformsForm)[0],
          url: "",
        },
      ];
    }
  });
  const handlePlatformChange = (index: number, platform: string) => {
    const updatedLinks = [...links];

    let newUrl = updatedLinks[index].url;
    newUrl = "";

    updatedLinks[index] = {
        ...updatedLinks[index],
        platform,
        url: newUrl,
    };

    setLinks(updatedLinks);
};


  const updateUserLink = (newUrl: string, platform: string) => {
    const updatedLinks = [...links];
    const linkIndex = updatedLinks.findIndex(
      (link) => link.platform === platform
    );

    if (linkIndex !== -1) {
      updatedLinks[linkIndex].url = newUrl;
    }
    setLinks(updatedLinks);
  };

  const getAvailablePlatforms = (currentIndex: number) => {
    let currentPlatforms = { ...platformsForm };
    links.forEach((link, linkIndex) => {
      if (
        currentIndex !== linkIndex &&
        currentPlatforms[link.platform as keyof typeof platformsForm]
      ) {
        delete currentPlatforms[link.platform as keyof typeof platformsForm];
      }
    });
    return currentPlatforms;
  };

  const hasAvailablePlatforms = () => {
    const allAvailablePlatforms = getAvailablePlatforms(-1);
    return Object.keys(allAvailablePlatforms).length > 0;
  };

  const handleLinkDeletion = (indexToDelete: number) => {
    const updatedLinks = links.filter((_, index) => index !== indexToDelete);
    setLinks(updatedLinks);
    setNumberOfLinks((prev) => prev - 1);
  };



  return (
    <div className="xl:flex">
      {/* <Preview links={links} profile={props.profile} clientProfileData={clientProfileData}/> */}

    <div className="xl:w-3/5 bg-white rounded-md m-4 p-4 min-h-screen flex flex-col justify-between">
      <div>
        <h1 className="headerM text-[24px] mb-2">Customize your links</h1>
        <p className="bodyM text-midGray mb-6">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
        <button
          className={`buttonSecondaryDefault bg-white text-strongPurple border-strongPurple w-full ${
            !hasAvailablePlatforms() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (!hasAvailablePlatforms()) return;

            const allAvailablePlatforms = getAvailablePlatforms(-1);
            const firstAvailablePlatformKey = Object.keys(
              allAvailablePlatforms
            )[0] as keyof typeof platformsForm;

            const newLinkURL = "";

            setNumberOfLinks((prev) => prev + 1);
            setLinks([
              ...links,
              {
                platform: firstAvailablePlatformKey,
                url: newLinkURL,
              },
            ]);
          }}
          disabled={!hasAvailablePlatforms()}
        >
          + Add new link
        </button>

        {numberOfLinks === 0 || numberOfLinks === 1 && (
          <div className="bg-lightestGray px-2 py-16 rounded-xl flex flex-col mx-auto w-full text-center mt-4 md:py-36">
            <Image
              src={"/other/start.svg"}
              alt="get started"
              width={124}
              height={80}
              className="mx-auto md:w-[250px] md:h-[160px]"
            />
            <h1 className="headerM my-6 md:my-8">Let’s get you started</h1>
            <p className="bodyM text-midGray md:w-[488px] md:mx-auto">
              Use the “Add new link” button to get started. Once you have more
              than one link, you can reorder and edit them. We’re here to help
              you share your profiles with everyone!
            </p>
          </div>
        )}

        {!hasAvailablePlatforms() && (
          <p className="headerS mt-2 text-red text-right">
            All available platforms have been added!
          </p>
        )}
        <div className="mb-16 border-b-2  border-lightGray">
          {Array.from({ length: numberOfLinks }).map((_, index) => {
            const currentAvailablePlatforms = getAvailablePlatforms(index);
            return (
              <div
                key={index + 1}
                className="bg-lightestGray w-full p-4 mt-4 rounded-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <IoReorderTwoOutline className="text-midGray w-8 h-8" />
                    <p className="headerS text-midGray ml-1">
                      Link #{index + 1}
                    </p>
                  </div>
                  <button
                    className="bodyM text-midGray hover:text-red hover:headerS"
                    onClick={() => handleLinkDeletion(index)}
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label className="bodyM">Platform</label>
                  <div className="flex items-center">
                    <div className="flex items-center border-2 border-lightGray w-full rounded-md bg-white p-2 mt-1">

                    {platformsForm[links[index].platform as keyof typeof platformsForm]}

                      <select
                        className="w-full"
                        value={links[index].platform}
                        onChange={(e) =>
                          handlePlatformChange(index, e.target.value)
                        }
                      >
                        {Object.keys(currentAvailablePlatforms).map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center border-2 border-lightGray w-full rounded-md bg-white p-2 mt-1">
                    <BsLink45Deg className="w-8 h-8 mr-2 text-midGray" />
                    <input
                      placeholder="e.g. https://www.any.com/287d9hubc2oq9"
                      value={links[index].url}
                      onChange={(e) =>
                        updateUserLink(e.target.value, links[index].platform)
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={async () => {
          setIsLoading(true);
          startTransition(
            async () => await props.updateLinks(links, props.clerkId)
          );
        }}
        className="buttonPrimaryDefault py-3 fixed bottom-4 left-4 right-4 mx-auto md:px-0 md:w-[100px] md:left-auto md:right-4"
      >
        {isLoading ? <ButtonLoader /> : "Save"}
      </button>
    </div>
    </div>
  );
};

export default Links;
