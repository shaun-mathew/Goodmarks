import Input from "../components/input";
import Button from "../components/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CSSTransition } from "react-transition-group";

import { IconContext } from "react-icons";
import { IoBookmarks } from "react-icons/io5";

//TODO:
function LoginPage() {
  const [signup, setSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const sendData = async () => {
      const formJSON = Object.fromEntries(new FormData(e.target));

      if (signup) {
        const res = await fetch("http://localhost:1234/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formJSON),
        });
      } else {
        const res = await fetch("http://localhost:1234/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formJSON),
        });

        for (const k of res.headers.keys()) {
          console.log(k);
        }

        const resJSON = await res.json();
        console.log(resJSON);
        navigate("/profile");
      }
    };

    sendData();
  };
  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className="flex flex-col items-stretch justify-center gap-3 w-full"
    >
      <div className="flex justify-center gap-2 items-center">
        <IconContext.Provider value={{ className: "text-4xl text-gray-1000" }}>
          <IoBookmarks />
        </IconContext.Provider>
        <h2 className="text-3xl text-gray-600 font-bold">Goodmarks</h2>
      </div>

      <h2 className="text-xl text-gray-600 font-bold text-center px-4">
        Login or create an account to access your bookmarks
      </h2>
      <Input name="username" placeholder="Username" />
      <Input type="password" name="password" placeholder="Password" />
      <CSSTransition
        in={signup}
        classNames="password"
        timeout={100}
        mountOnEnter
        unmountOnExit
      >
        <Input
          type="password"
          name="confirm-password"
          placeholder="Confirm Password"
        />
      </CSSTransition>

      <span className="px-4 text-sm text-gray-400">
        Connecting to
        <a className="ml-1 text-sky-400 hover:cursor-pointer">
          localhost:1234/
        </a>
      </span>

      <Button
        className="bg-indigo-400 py-1 text-gray-100 rounded-md hover:text-gray-100 hover:bg-indigo-500"
        label={signup ? "Register" : "Login"}
        type="submit"
      />
      {signup ? (
        <span className="text-sm text-gray-400">
          Have an account?
          <a
            className="ml-1 text-sky-400 hover:cursor-pointer"
            onClick={() => setSignUp(false)}
          >
            Login to your account
          </a>
        </span>
      ) : (
        <span className="text-sm text-gray-400">
          Don't have an account?
          <a
            className="ml-1 text-sky-400 hover:cursor-pointer"
            onClick={() => setSignUp(true)}
          >
            Create an account
          </a>
        </span>
      )}
    </form>
  );
}

export default LoginPage;
