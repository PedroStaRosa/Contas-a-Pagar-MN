import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/layout";
import DashboardPage from "./pages/dashboard";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/notFound";
import Suppliers from "./pages/suppliers";
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
        path: "/fornecedores",
        // This route is also protected by PrivateRoute
        // so it will only be accessible to authenticated users.
        element: (
          <PrivateRoute>
            <Suppliers />
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
