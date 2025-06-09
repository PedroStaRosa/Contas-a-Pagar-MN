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

export function formatCNPJ(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}
