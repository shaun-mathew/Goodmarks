import { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import Button from "./button";
import { IoCopyOutline } from "react-icons/io5";
import { HiPencil } from "react-icons/hi";
import { getCurrentTab } from "../utils/chrome-functions";

interface SearchCardProps {
  title: string;
  context: string;
  website: string;
  date: string;
  imgSrc: string;
}

function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}
function SearchCard({
  title,
  context,
  website,
  date,
  imgSrc,
}: SearchCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const url = new URL(website);

  const handleCardClick = async (url: URL) => {
    const activeTab = await getCurrentTab();
    chrome.tabs.update(activeTab?.id, {
      url: url.href,
    });
  };

  const handleLinkClick = async (url: URL) => {
    chrome.tabs.create({
      url: url.href,
    });
  };
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleCardClick(url)}
      className="flex gap-2 p-1 border-b border-gray-200 hover:bg-neutral-100 hover:cursor-pointer"
    >
      <div className="flex flex-col justify-center items-center">
        {imgSrc && <img className="object-scale-down h-6 w-6" src={imgSrc} />}
      </div>

      <div className="flex flex-col w-full self-center">
        <p className="text-ellipsis overflow-hidden ... text-gray-600 text-xs">
          {title}
        </p>
        <p className="line-clamp-3 h-13 text-gray-400 text-xs leading-4">
          {context}
        </p>
        <div className="flex">
          <div
            className="flex flex-grow text-xs text-gray-600 items-center gap-0.5"
            onClick={() => handleLinkClick(url)}
          >
            <span>{url.hostname}</span>
            {isHovered && <FiExternalLink />}
          </div>
          <div className="flex text-xs text-gray-600 items-center gap-1">
            {!isHovered && <span>{formatDate(date)}</span>}
            {isHovered && (
              <Button icon={<IoCopyOutline />} iconClassName="text-sm" />
            )}
            {isHovered && (
              <Button icon={<HiPencil />} iconClassName="text-sm" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchCard;
