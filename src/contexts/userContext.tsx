import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";

import { fetchFinances } from "@/services/financesService";
import { auth } from "@/services/firebaseconnection";
import type { Finances } from "@/types/finances";

type UserContextType = {
  userAuth: User | null;
  loadingAuth: boolean;
  signed: boolean;
  finances: Finances[];
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  getFinances: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  /* const [loadingAuth, setLoadingAuth] = useState(false); */
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [finances, setFinances] = useState<Finances[]>([]);

  // Efeito para verificar se o usuário já está autenticado (persistência)
  useEffect(() => {
    setLoadingAuth(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.uid) {
        setUserAuth(currentUser);
      } else {
        setUserAuth(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Efeito para buscar as finanças do usuário
  useEffect(() => {
    if (userAuth?.uid) {
      getFinances();
    }
  }, [userAuth?.uid]);

  const getFinances = async () => {
    try {
      const reponse = await fetchFinances();
      setFinances(reponse);
    } catch {
      throw new Error("Erro ao buscar finanças");
    }
  };
  // Função para login com email e senha
  const login = async (
    email: string,
    password: string,
  ): Promise<User | null> => {
    try {
      const UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (UserCredential.user) {
        setUserAuth(UserCredential.user);

        return UserCredential.user; // ✅ Retorna o usuário autenticado corretamente
      }
      return null;
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            throw new Error("Email inválido.");
          case "auth/invalid-credential":
            throw new Error("Credenciais inválidas.");
          case "auth/user-disabled":
            throw new Error("Essa conta está desativada.");
          case "auth/user-not-found":
            throw new Error("Usuário não encontrado.");
          case "auth/wrong-password":
            throw new Error("Senha incorreta.");
          case "auth/too-many-requests":
            throw new Error("Muitas tentativas. Tente novamente mais tarde.");
          default:
            throw new Error("Erro inesperado ao fazer login.");
        }
      } else {
        throw new Error("Erro inesperado ao fazer login.");
      }
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUserAuth(null);
      localStorage.removeItem("@lastProtectedRoute"); // ✅ limpa rota protegida
    } catch {
      throw new Error("Erro ao sair.");
    }
  };

  return (
    <UserContext.Provider
      value={{
        signed: !!userAuth,
        userAuth,
        loadingAuth,
        finances,
        login,
        logout,
        getFinances,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
