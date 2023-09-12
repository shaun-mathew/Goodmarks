import { IoHeart, IoHeartOutline, IoTrash } from "react-icons/io5";

import { BsPinAngleFill } from "react-icons/bs";
import Input from "../components/input";
import MetaCard from "../components/meta-card";
import Button from "../components/button";
import { useContext, useEffect, useState } from "react";

import { getHTML, getPageMetadata } from "../utils/chrome-functions";
import {
  ServerError,
  UnAuthenticatedError,
  ValidationError,
} from "../utils/errors";
import { NotificationContext } from "../contexts/notification-context";
import "crypto";

//TODO:
//Client side validation + messages
function BookmarkPage() {
  const [bookmarkData, setBookmarkData] = useState({
    id: null,
    url: null,
    icon: null,
    title: null,
    description: null,
    userDescription: null,
    tags: null,
    date: null,
  });

  const [modified, setModified] = useState({
    userDescription: false,
    tags: false,
    markup: false,
  });

  const [html, setHTML] = useState("");
  const [exists, setExists] = useState(false);
  const { addNotification, clearNotifications } =
    useContext(NotificationContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookmarkData((prevBookmarkData) => ({
      ...prevBookmarkData,
      [name]: value,
    }));

    setModified((prevModified) => ({
      ...prevModified,
      [name]: true,
    }));
  };

  const handleDelete = (e) => {
    e.preventDefault();

    const deleteBookmark = async () => {
      const res = await fetch(
        `http://localhost:1234/api/bookmark/${bookmarkData.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        addNotification({
          notificationType: "SUCCESS",
          notificationMessage: "Bookmark Deleted",
          timeout: 5000,
        });

        setExists(false);
      }
    };

    deleteBookmark();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addNotification({
      notificationMessage: exists ? "Updating Bookmark" : "Saving Bookmark",
      notificationType: "PENDING",
    });

    const form = e.target;
    const formData = new FormData(form);

    const sendData = async () => {
      let markup = html;
      const tags = bookmarkData.tags
        ?.split()
        .map((item) => item.strip().replace(/^#/, ""));
      if (markup === "" || exists) {
        markup = await getHTML();
      }

      const formJSON = {
        ...bookmarkData,
        ...Object.fromEntries(formData.entries()),
        tags: tags,
        markup: markup,
        date: new Date().toJSON(),
      };

      try {
        let res = null;
        const filteredJSON = Object.keys(modified).reduce((result, key) => {
          if (modified[key]) {
            result[key] = formJSON[key];
          }
          return result;
        }, {});

        if (exists) {
          res = await fetch("http://localhost:1234/api/bookmark", {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: bookmarkData.id, ...filteredJSON }),
          });
        } else {
          res = await fetch("http://localhost:1234/api/bookmark", {
            method: form.method,
            credentials: "include",

            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formJSON),
          });
        }

        if (!res.ok) {
          const resJSON = await res.json();
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
          const resJSON = await res.json();
          addNotification({
            notificationType: "SUCCESS",
            notificationMessage: exists ? "Bookmark Updated" : "Bookmark Saved",
            timeout: 5000,
          });

          setBookmarkData({ ...bookmarkData, ...resJSON });
        }

        setExists(true);
      } catch (error) {
        if (error instanceof ValidationError) {
          addNotification({
            notificationType: "ERROR",
            notificationMessage: exists
              ? "Error Updating Bookmark"
              : "Error Saving Bookmark",
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

        setModified({
          userDescription: false,
          markup: false,
          tags: false,
        });
      }
    };

    sendData();
  };

  useEffect(() => {
    const fetchTabData = async () => {
      const metadata = await getPageMetadata();
      setBookmarkData((prevBookmarkData) => ({
        ...prevBookmarkData,
        ...metadata,
      }));

      const q = `http://localhost:1234/api/bookmark/?url=${encodeURIComponent(
        metadata.url
      )}`;
      const dataRes = await fetch(q, {
        credentials: "include",
      });

      const { markupHash, ...dataBookmark } = await dataRes?.json();
      if (dataBookmark.id) {
        setBookmarkData(dataBookmark);
        setExists(true);
      } else {
        addNotification({
          notificationType: "WARNING",
          notificationMessage: "Bookmark Unsaved",
        });
        setExists(false);
      }

      const html = await getHTML();
      setHTML(html);
    };

    fetchTabData();

    return clearNotifications;
  }, []);
  useEffect(() => {
    if (html !== "" && bookmarkData.url && bookmarkData.description == null) {
      const getDescription = async () => {
        const toSend = {
          url: bookmarkData.url,
          html,
        };

        const res = await fetch("http://localhost:1234/api/bookmark/metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toSend),
        });

        const data = await res.json();

        setBookmarkData((prevBookmarkData) => ({
          ...prevBookmarkData,
          ...data,
        }));
      };

      getDescription();
    }
  }, [html]);

  //
  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className="flex flex-col items-stretch justify-between gap-4 w-full"
    >
      <MetaCard
        title={bookmarkData.title}
        description={bookmarkData.description}
        imgSrc={bookmarkData.icon}
      />
      <Input
        value={bookmarkData.url}
        name="url"
        placeholder="Url (e.g. https://www.google.com)"
        onChange={handleInputChange}
      />
      <Input
        name="userDescription"
        value={bookmarkData.userDescription}
        isTextArea={true}
        placeholder="Description of website"
        onChange={handleInputChange}
      />
      <Input
        name="tags"
        value={bookmarkData.tags}
        placeholder="Tags (e.g. #software, #read_later)"
        onChange={handleInputChange}
      />
      <div className="flex">
        <div className="flex flex-grow gap-2">
          {exists ? (
            <Button
              type="submit"
              icon={<IoHeart />}
              className="text-rose-500 hover:text-rose-700"
            />
          ) : (
            <Button
              type="submit"
              icon={<IoHeartOutline />}
              className="hover:text-rose-500"
            />
          )}
          <Button
            icon={<BsPinAngleFill />}
            className={exists && "text-green-600 hover:text-green-800"}
            disabled={!exists}
          />
        </div>

        <div className="flex justify-end">
          <Button
            icon={<IoTrash />}
            className={exists && "text-rose-500 hover:text-rose-700"}
            disabled={!exists}
            onClick={handleDelete}
          />
        </div>
      </div>
    </form>
  );
}

export default BookmarkPage;
