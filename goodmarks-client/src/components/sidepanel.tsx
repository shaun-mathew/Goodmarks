import {
  IoBookmark,
  IoList,
  IoMoon,
  IoPersonCircle,
  IoSearch,
  IoSettings,
} from "react-icons/io5";
import LinkButton from "./link-button";
import Button from "./button";
function SidePanel() {
  return (
    <div className="flex flex-col justify-center p-1 border-r-1 border-gray-300 shadow-[rgba(0,0,0,0.25)_1px_0px_3px_0px] bg-white">
      <div className="flex flex-col flex-grow justify-start">
        <LinkButton
          link="/login"
          icon={<IoPersonCircle />}
          iconClassName="text-3xl"
        />
      </div>
      <div className="flex flex-col flex-grow gap-1">
        <LinkButton link="/search" icon={<IoSearch />} />
        <LinkButton link="/bookmark" icon={<IoBookmark />} />
        <LinkButton link="/list" icon={<IoList />} />
      </div>
      <div className="flex flex-col flex-grow justify-end gap-1 items-center">
        <Button icon={<IoMoon />} />
        <LinkButton link="/settings" icon={<IoSettings />} />
      </div>
    </div>
  );
}

export default SidePanel;
