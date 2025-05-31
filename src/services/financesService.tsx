import { set } from "date-fns";
import { format } from "date-fns";
import type { User } from "firebase/auth";
import {
  collection,
  doc,
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

export const fetchFinances = async () => {
  try {
    const today = moment(set(new Date(), { hours: 0, minutes: 0 })).format(
      "YYYY-MM-DD",
    );
    const productRef = collection(db, "financeiros");
    const q = query(
      productRef,
      orderBy("date", "asc"),
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
  const docRef = doc(db, "financeiros", `${userAuth.uid}_${dateStr}`);
  try {
    await updateDoc(docRef, {
      ...data,
      date: dateStr,
      userId: userAuth.uid,
    });

    return { status: true, message: "Informações salvas com sucesso!" };
  } catch {
    try {
      await setDoc(
        docRef,
        {
          ...data,
          date: dateStr,
          userId: userAuth.uid,
        },
        { merge: true },
      );

      return { status: true, message: "Informações salvas com sucesso!" };
    } catch {
      throw new Error("❌ Erro ao criar documento.");
    }
  }
};
