import { Menu } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "@/contexts/userContext";

import globo from "../../assets/Globo.png";
import { Button } from "../ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";

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
      <div className="hidden items-center md:block">
        <Button variant="outline" className="mr-6">
          <Link to="/dashboard">Financeiro</Link>
        </Button>
        <Button variant="outline" className="mr-6">
          <Link to="/fornecedores">Fornecedores</Link>
        </Button>
        <Button variant="outline" onClick={logout} className="mr-6">
          Sair
        </Button>{" "}
      </div>
      <div className="flex items-center gap-4 md:hidden">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <Menu />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link to="/dashboard">Financeiro</Link>
              </MenubarItem>
              <MenubarItem>
                <Link to="/fornecedores">Fornecedores</Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={logout} className="bg-red-500 text-white">
                Sair
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </header>
  );
};

export default Header;
