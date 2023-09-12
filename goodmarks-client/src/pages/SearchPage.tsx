import {
  IoSearch,
  IoOptionsOutline,
  IoClose,
  IoCalendar,
} from "react-icons/io5";

import { PiSortAscendingBold } from "react-icons/pi";
import Input from "../components/input";
import Tag from "../components/tag";
import Button from "../components/button";
import SearchCard from "../components/search-card";
import { useEffect, useState, useContext } from "react";
import debounce from "lodash.debounce";
import {
  ValidationError,
  UnAuthenticatedError,
  ServerError,
} from "../utils/errors";
import { NotificationContext } from "../contexts/notification-context";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { addNotification } = useContext(NotificationContext);

  const debouncedSearch = debounce(async (value: string) => {
    if (value.trim().length >= 2) {
      const q = `http://localhost:1234/api/search/?query=${encodeURIComponent(
        value
      )}`;

      const res = await fetch(q, {
        credentials: "include",
        mode: "cors",
      });
      try {
        const resJSON = await res.json();
        console.log(res);
        if (!res.ok) {
          if (res.status === 400) {
            throw new ValidationError(resJSON.error, resJSON.message);
          } else if (res.status === 403) {
            throw new UnAuthenticatedError(resJSON.error);
          } else if (res.status === 500) {
            throw new ServerError(resJSON.error);
          } else {
            throw new Error(resJSON.error);
          }
        } else {
          setResults(resJSON);
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          addNotification({
            notificationType: "ERROR",
            notificationMessage: "Improper search query",
            additionalMessages: error.validationErrors,
            timeout: 5000,
          });
        } else if (error instanceof UnAuthenticatedError) {
          addNotification({
            notificationType: "ERROR",
            notificationMessage: "You are not logged in",
            timeout: 5000,
          });
        } else if (error instanceof ServerError) {
          addNotification({
            notificationType: "ERROR",
            notificationMessage: "Server Error",
            additionalMessages: [error.message],
            timeout: 5000,
          });
        } else {
          console.log(error.message);
          addNotification({
            notificationType: "ERROR",
            notificationMessage: "Unknown Error",
            additionalMessages: [error.message],
            timeout: 5000,
          });
        }

        return setResults([]);
      }
    }
  }, 400);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (query.length == 0) {
      setResults([]);
    }
  }, [query]);
  return (
    <div className="flex flex-col items-stretch justify-between gap-4 w-full">
      <div className="flex flex-col gap-2">
        <Input
          leftIcon={<IoSearch />}
          rightIcon={
            <Button icon={<IoOptionsOutline />} iconClassName="text-lg" />
          }
          placeholder="Search"
          value={query}
          onChange={handleInputChange}
        />
        <div className="flex px-4">
          <div className="flex flex-grow"></div>
          <div className="flex gap-2 justify-end">
            <Button icon={<IoCalendar />} iconClassName="text-xs" />
            <Button
              icon={<PiSortAscendingBold />}
              iconClassName="text-[0.85rem]"
            />
          </div>
        </div>
        <div className="flex flex-col px-4 h-[22rem] hover:overflow-y-scroll">
          {results &&
            results.map((item) => (
              <SearchCard
                key={item.id}
                title={item.title}
                context={item.description}
                imgSrc={item.icon}
                date={item.date}
                website={item.url}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
