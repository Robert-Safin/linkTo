"use client";
import { platforms } from "@/lib/platforms";
import Image from "next/image";
import { FC, useState, useTransition } from "react";
import { IoReorderTwoOutline } from "react-icons/io5";
import { BsLink45Deg } from "react-icons/bs";
import { Link } from "@prisma/client";
import ButtonLoader from "../loader button/ButtonLoader";

interface Props {
  clerkId: string;
  updateLinks: (links: userLink[], clerkId: string) => Promise<void>;
  links?: Link[];
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
          platform: Object.keys(platforms)[0],
          url: "",
        },
      ];
    }
  });
  const [userLinks, setUserLinks] = useState<userLink[]>(() => {
    if (props.links && props.links.length) {
      return props.links.map((link) => ({
        ...link,
        clerkId: props.clerkId,
      }));
    }
    return [];
  });

  const handlePlatformChange = (index: number, platform: string) => {
    const updatedLinks = [...links];

    let newUrl = updatedLinks[index].url;
    const isDefaultUrl = Object.values(platforms).includes(
      updatedLinks[index].url
    );

    if (isDefaultUrl) {
      newUrl = platforms[platform as keyof typeof platforms];
    }

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
    let currentPlatforms = { ...platforms };
    links.forEach((link, linkIndex) => {
      if (
        currentIndex !== linkIndex &&
        currentPlatforms[link.platform as keyof typeof platforms]
      ) {
        delete currentPlatforms[link.platform as keyof typeof platforms];
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
    <div className="bg-white rounded-md m-4 p-4 min-h-screen flex flex-col justify-between">
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
            )[0] as keyof typeof platforms;

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
                      <Image
                        src={
                          platforms[
                            links[index].platform as keyof typeof platforms
                          ]
                        }
                        width={16}
                        height={16}
                        alt="icon"
                        className="w-8 h-8 mr-2"
                      />
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
                      required
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
        className="buttonPrimaryDefault py-3 fixed bottom-4 left-4 right-4 mx-auto md:w-[100px] md:left-auto md:right-4"
      >
        {isLoading ? <ButtonLoader /> : "Save"  }
      </button>
    </div>
  );
};

export default Links;
