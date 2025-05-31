import "./index.css";

import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "./App.tsx";
import { UserProvider } from "./contexts/userContext.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>,
);
