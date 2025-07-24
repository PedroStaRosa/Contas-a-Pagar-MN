import { addDays } from "date-fns";
import { useContext, useMemo } from "react";

import { UserContext } from "@/contexts/userContext";
import type { Finances } from "@/types/finances";
import {
  formatCurrency,
  formatDateBR,
  getTotalReceived,
  getValueForDate,
  getWeekdayName,
  parseDateBR,
} from "@/utils/utils";

import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { TableCell, TableRow } from "../ui/table";

interface FinanceRowProps {
  finance: Finances;
}

const FinanceTableRow = ({ finance }: FinanceRowProps) => {
  const { finances } = useContext(UserContext);

  const weekday = getWeekdayName(parseDateBR(finance.date));

  let totalValueToPay = getValueForDate(finances, finance.date) || 0;

  const valuePayableCalc = useMemo(() => {
    if (weekday === "segunda-feira") {
      const baseDate = parseDateBR(finance.date);

      totalValueToPay +=
        getValueForDate(finances, formatDateBR(addDays(baseDate, -2))) || 0;

      totalValueToPay +=
        getValueForDate(finances, formatDateBR(addDays(baseDate, -1))) || 0;

      finance.valueAccountsPayable = totalValueToPay;
    }
    return finance.valueAccountsPayable
      ? formatCurrency(finance.valueAccountsPayable)
      : 0;
  }, [finances, finance.date]);

  return (
    <TableRow className={``}>
      <TableCell className={`font-medium`}>
        {weekday} - {finance.date}
      </TableCell>
      <TableCell>
        <HoverCard>
          <HoverCardTrigger>
            <Button variant="ghost" className="text-green-500">
              {formatCurrency(getTotalReceived(finance))}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="">
            <div className="flex flex-col gap-2">
              <span>Credito: {formatCurrency(finance.credito)}</span>
              <span>Debito: {formatCurrency(finance.debito)}</span>
              <span>Pix: {formatCurrency(finance.pix)}</span>
              <span>Alelo: {formatCurrency(finance.alelo)}</span>
              <span>Vr: {formatCurrency(finance.vr)}</span>
              <span>Sodexo: {formatCurrency(finance.sodexo)}</span>
              <span>Dinheiro: {formatCurrency(finance.dinheiro)}</span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell className={`text-red-500`}>{valuePayableCalc}</TableCell>
      <TableCell
        className={`text-lg font-bold ${finance.balanceOfDay! <= 0 ? "text-red-500" : "text-green-500"} `}
      >
        {finance.balanceOfDay ? formatCurrency(finance.balanceOfDay!) : ""}
      </TableCell>
    </TableRow>
  );
};

export default FinanceTableRow;
