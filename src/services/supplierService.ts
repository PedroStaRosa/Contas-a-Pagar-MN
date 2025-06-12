import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import type { Supplier } from "@/types/supplier";

import { db } from "./firebaseconnection";

export const createSupplier = async (data: Supplier) => {
  const idGenerated = uuidv4();
  const docRef = doc(db, "suppliers", idGenerated); // Use CNPJ as ID
  try {
    // Check if the supplier already exists
    const q = query(
      collection(db, "suppliers"),
      where("cnpj", "==", data.cnpj),
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error("❌ Fornecedor já cadastrado.");
    }

    await setDoc(docRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { status: true, message: "Informações salvas com sucesso!" };
  } catch (err: unknown) {
    if (err instanceof Error) throw err;

    throw new Error("❌ Erro desconhecido ao criar fornecedor.");
  }
};

export const fetchSuppliers = async () => {
  try {
    const supplierRef = collection(db, "suppliers");
    const q = query(
      supplierRef,
      orderBy("payment_term", "asc"),
      orderBy("company_name", "asc"),
    );
    const snapshot = await getDocs(q);

    const dateReponse: Supplier[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        company_name: data.company_name,
        cnpj: data.cnpj,
        payment_term: data.payment_term,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    });

    return dateReponse;
  } catch (error) {
    throw new Error(`Credenciais inválidas. ${error}`);
  }
};

export const updateSupplier = async (data: Supplier) => {
  const docRef = doc(db, "suppliers", data.id);
  try {
    await setDoc(docRef, {
      ...data,
      updated_at: new Date(),
    });

    return { status: true, message: "Informações atualizadas com sucesso!" };
  } catch (err: unknown) {
    if (err instanceof Error) throw err;

    throw new Error("❌ Erro desconhecido ao atualizar fornecedor.");
  }
};

export const deleteSupplier = async (id: string) => {
  try {
    await deleteDoc(doc(db, "suppliers", id));

    return { status: true, message: "Informações deletadas com sucesso!" };
  } catch (err: unknown) {
    if (err instanceof Error) throw err;

    throw new Error("❌ Erro desconhecido ao deletar fornecedor.");
  }
};
