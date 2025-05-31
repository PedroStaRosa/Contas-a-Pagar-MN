import { useContext } from "react";

import { UserContext } from "@/contexts/userContext";

import globo from "../../assets/globo.png";
import { Button } from "../ui/button";

const Header = () => {
  const { logout } = useContext(UserContext);
  return (
    <header className="flex w-full items-center justify-between bg-gradient-to-r from-orange-600 to-green-600 p-4">
      <div className="flex items-center gap-4 text-white">
        <img src={globo} alt="Logo" className="h-12" />
        <div>
          <h1 className="text-4xl font-bold">Financeiro</h1>
          <h4>Demonstração Financeira</h4>
        </div>
      </div>
      <Button variant="outline" onClick={logout} className="mr-6">
        Sair
      </Button>
    </header>
  );
};

export default Header;
