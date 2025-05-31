import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

/* Inserir um componet Header para ser rederizado junto a todas as paginas */
const Layout = () => {
  return (
    <main className="flex h-screen flex-col justify-between">
      <div className="flex-1 bg-slate-50">
        <Toaster
          richColors
          position="top-left"
          expand={false}
          duration={1500}
        />
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
