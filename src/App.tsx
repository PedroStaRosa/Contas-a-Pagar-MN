import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/layout";
import DashboardPage from "./pages/dashboard";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/notFound";
import PrivateRoute from "./routes/privateRoute";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
