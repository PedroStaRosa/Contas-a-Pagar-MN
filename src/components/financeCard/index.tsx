import type { Finances } from "@/types/finances";
import { formatCurrency, getTotalReceived } from "@/utils/utils";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface FinanceCardProps {
  dayFincance: Finances;
}

const FinanceCard = ({ dayFincance }: FinanceCardProps) => {
  const total = getTotalReceived(dayFincance);
  return (
    <>
      {/* <Dialog key={dayFincance.id}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {dayFincance.date} a receber {total ? formatCurrency(total) : 0} -
          Total a pagar
          {dayFincance.valueAccountsPayable
            ? ` ${formatCurrency(dayFincance.valueAccountsPayable)}`
            : " 0"}{" "}
          - Saldo fim do dia:{" "}
          {dayFincance.balanceOfDay
            ? formatCurrency(dayFincance.balanceOfDay)
            : "Ainda não calculado"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Valores a receber em {dayFincance.date}</DialogTitle>
          <DialogDescription>
            Esses são os valores a receber...
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 space-y-2">
          <span className="leading-none font-medium">
            Credito: {dayFincance.credito}
          </span>
          <span className="leading-none font-medium">
            Debito: {dayFincance.debito}
          </span>
          <span className="leading-none font-medium">
            Alelo: {dayFincance.alelo}
          </span>
          <span className="leading-none font-medium">
            Dinheiro: {dayFincance.dinheiro}
          </span>
          <span className="leading-none font-medium">
            Pix: {dayFincance.pix}
          </span>

          <span className="leading-none font-medium">
            Sodexo: {dayFincance.sodexo}
          </span>
          <span className="leading-none font-medium">
            Ticket: {dayFincance.ticket}
          </span>
          <span className="leading-none font-medium">Vr: {dayFincance.vr}</span>
          <span className="leading-none font-medium">Total: {total}</span>
        </div>
      </DialogContent>
    </Dialog> */}
    </>
  );
};

export default FinanceCard;
