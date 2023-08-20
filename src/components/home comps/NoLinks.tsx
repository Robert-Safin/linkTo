"use client";
import { platforms } from "@/lib/platforms";
import Image from "next/image";
import { FC, useState } from "react";
import { IoReorderTwoOutline } from "react-icons/io5";
import { BsLink45Deg } from "react-icons/bs";

interface Props {
  clerkId: string;
}

interface LinkUi {
  platform: string;
  url: string;
}

interface userLink {
  platform: string;
  url: string;
  clerkId: string;
}

const NoLinks: FC<Props> = (props) => {
  const [numberOfLinks, setNumberOfLinks] = useState(1);
  const [links, setLinks] = useState<LinkUi[]>([
    {
      platform: Object.keys(platforms)[0],
      url: platforms[Object.keys(platforms)[0] as keyof typeof platforms],
    },
  ]);
  const [userLinks, setUserLinks] = useState<userLink[]>([]);

  const handlePlatformChange = (index: number, platform: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = {
      ...updatedLinks[index],
      platform,
      url: platforms[platform as keyof typeof platforms],
    };
    setLinks(updatedLinks);
  };

  const updateUserLink = (userLink: string, platform: string) => {
    const updatedUserLinks = [...userLinks];
    updatedUserLinks.push({
      clerkId: props.clerkId,
      platform: platform,
      url: userLink,
    });
    setUserLinks(updatedUserLinks);
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
            const firstAvailablePlatformURL =
              allAvailablePlatforms[firstAvailablePlatformKey];

            setNumberOfLinks((prev) => prev + 1);
            setLinks([
              ...links,
              {
                platform: firstAvailablePlatformKey,
                url: firstAvailablePlatformURL,
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
                        src={links[index].url}
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

      <button className="buttonPrimaryDefault py-3 fixed bottom-4 left-4 right-4 mx-auto">
        Save
      </button>
    </div>
  );
};

export default NoLinks;
