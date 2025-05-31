import { doc, getDoc } from "firebase/firestore";

import { db } from "./firebaseconnection";

export const getUser = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    console.log(userSnapshot.data());
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      throw new Error("Usuário não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};
