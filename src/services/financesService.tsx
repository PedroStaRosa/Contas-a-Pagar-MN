import { set } from "date-fns";
import { format } from "date-fns";
import type { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";

import { db } from "@/services/firebaseconnection";
import type { Finances } from "@/types/finances";

export const fetchFinances = async (userAuthID : string) => {
  try {
    const today = moment(set(new Date(), { hours: 0, minutes: 0 })).format(
      "YYYY-MM-DD",
    );
    const productRef = collection(db, "financeiros");
    const q = query(
      productRef,
      orderBy("date", "asc"),
      where("userId", "==" , userAuthID), 
      where("date", ">=", today),
    );
    const snapshot = await getDocs(q);
    const dateReponse: Finances[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        alelo: data.alelo || 0,
        credito: data.credito || 0,
        pix: data.pix || 0,
        dinheiro: data.dinheiro || 0,
        debito: data.debito || 0,
        ticket: data.ticket || 0,
        vr: data.vr || 0,
        sodexo: data.sodexo || 0,
        valueAccountsPayable: data.valorAPagar,
        date: moment(data.date).format("DD/MM/YYYY"),
      };
    });

    return dateReponse;
  } catch (error) {
    throw new Error(`Credenciais inválidas. ${error}`);
  }
};

export const createOrUpdateFinance = async (
  selectedDate: Date,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  userAuth: User,
) => {
  const dateStr = format(selectedDate, "yyyy-MM-dd");
 
  try {

    const docRef = doc(db, "financeiros", `${userAuth.uid}_${dateStr}`);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      // Primeiro tenta atualizar o documento existente
      /* console.log("Documento encontrado:", docSnap.data()); */
      await updateDoc(docRef, {
        ...data,
        date: dateStr,
        userId: userAuth.uid,
        updatedAt: new Date(),
      });
      return { status: true, message: "Informações atualizadas com sucesso!" };
    } else {
      // Se o documento não existe, cria um novo
      await setDoc(docRef, {
        ...data,
        date: dateStr,
        userId: userAuth.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { status: true, message: "Informações criadas com sucesso!" };
    } 
  } catch (createError) {
        /* console.error("Erro ao criar documento:", createError); */
        throw new Error("❌ Erro ao Criar/Atualizar documento financeiro.");
    }
};
