import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

// Formata uma data para "dd/MM/yyyy"
export function formatDateBR(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: ptBR });
}

// Converte string "dd/MM/yyyy" para objeto Date
export function parseDateBR(dateString: string): Date {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
}

// Retorna o nome do dia da semana em português (segunda-feira, etc.)
export function getWeekdayName(date: Date): string {
  return date.toLocaleDateString("pt-BR", { weekday: "long" });
}

// Retorna valor de pagamento para uma data específica
export function getValueForDate(
  finances: Finances[],
  dateString: string,
): number {
  const entry = finances.find((f) => f.date === dateString);
  return entry?.valueAccountsPayable || 0;
}

export function calcAddDays(days: number): Date {
  const paymentDate = formatDateBR(addDays(new Date(), days));
  return parseDateBR(paymentDate);
}
