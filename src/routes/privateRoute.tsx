import { type ReactNode, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import Header from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/contexts/userContext";

interface PrivateProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateProps) => {
  const { signed, loadingAuth } = useContext(UserContext);

  useEffect(() => {
    if (!loadingAuth) {
      // Espera o loading terminar
      if (!signed) {
        toast.error("Você precisa estar logado para acessar esta página.");
        /*         const isLogout = localStorage.getItem("@logout"); // Verifica se foi logout manual
        if (isLogout !== "true") {
          toast.error("Você precisa estar logado para acessar esta página.");
        }
        localStorage.removeItem("@logout"); */
      }
    }
  }, [signed, loadingAuth]);

  if (loadingAuth) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <Skeleton className="mb-4 h-6 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  if (!signed) {
    localStorage.setItem("@lastProtectedRoute", location.pathname);
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default PrivateRoute;
