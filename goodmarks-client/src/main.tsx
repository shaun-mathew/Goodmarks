import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Navigate, RouterProvider, createMemoryRouter } from "react-router-dom";
import BookmarkPage from "./pages/BookmarkPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

const router = createMemoryRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/bookmark" replace /> },
      {
        path: "/bookmark",
        element: <BookmarkPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
