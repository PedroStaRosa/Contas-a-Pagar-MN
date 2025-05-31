import { doc, getDoc } from "firebase/firestore";

import { db } from "./firebaseconnection";

export const getUser = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      throw new Error("Usuário não encontrado");
    }
  } catch {
    throw new Error("Erro ao buscar usuário");
  }
};
