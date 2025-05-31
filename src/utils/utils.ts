import type { Finances } from "@/types/finances";

export const formatCurrency = (value: number) => {
  const numericValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
  return numericValue;
};

export const getTotalReceived = (finance: Finances): number => {
  return (
    (finance.credito ?? 0) +
    (finance.debito ?? 0) +
    (finance.pix ?? 0) +
    (finance.dinheiro ?? 0) +
    (finance.alelo ?? 0) +
    (finance.ticket ?? 0) +
    (finance.vr ?? 0) +
    (finance.sodexo ?? 0)
  );
};
