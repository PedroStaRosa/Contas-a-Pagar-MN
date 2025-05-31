import { doc, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";

import { db } from "@/services/firebaseconnection";

import { fetchFinances } from "./financesService";

type DataValor = {
  dataFormatada: string; // ex: "25/04/2025"
  valor: number;
};

export const atualizarOuCriarValorAPagar = async (
  dados: DataValor[],
  userId: string,
) => {
  const getFinances = await fetchFinances();

  const upgradeable = [];

  for (const item of dados) {
    if (
      item.dataFormatada === "TOTAL LOJA:" ||
      item.dataFormatada === "TOTAL GERAL:"
    ) {
      continue;
    }

    const dataInput = item.dataFormatada.trim();

    const checksFinances = getFinances.find((finance) => {
      const dataBanco = finance.date.trim();
      return dataBanco === dataInput;
    });

    if (
      !checksFinances ||
      Number(checksFinances.valueAccountsPayable) !== Number(item.valor)
    ) {
      upgradeable.push(item); // precisa criar ou atualizar
    }
  }

  for (const item of upgradeable) {
    const dataISO = moment(item.dataFormatada, "DD-MM-YYYY").format(
      "YYYY-MM-DD",
    );
    const docId = `${userId}_${dataISO}`;
    const docRef = doc(db, "financeiros", docId);
    try {
      // Primeiro tenta atualizar
      await updateDoc(docRef, {
        valorAPagar: item.valor,
      });
      await updateDoc(doc(db, "users", userId), {
        lastUpdatedPayments: new Date(),
      });
      console.log(`✅ Atualizado ${dataISO} com valor ${item.valor}`);
    } catch {
      // Se não existe, cria o documento com merge
      try {
        await setDoc(
          docRef,
          {
            valorAPagar: item.valor,
            date: dataISO,
            userId: userId,
          },
          { merge: true },
        );
        await updateDoc(doc(db, "users", userId), {
          lastUpdatedPayments: new Date(),
        });
      } catch (err) {
        console.error(`❌ Erro ao criar documento ${docId}:`, err);
      }
    }
  }
};
