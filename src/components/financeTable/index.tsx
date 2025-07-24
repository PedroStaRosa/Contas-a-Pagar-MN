import type { Finances } from "@/types/finances";
import { formatCurrency, getIsWeekend, getTotalReceived } from "@/utils/utils";

import FinanceTableRow from "../financeTableRow";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface FinanceTableProps {
  finances: Finances[];
}

const FinanceTable = ({ finances }: FinanceTableProps) => {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <Table className="min-w-[600px]">
          <TableCaption>Saldos ao final do dia pela previsão.</TableCaption>
          <TableHeader className="">
            <TableRow>
              <TableHead className="">Data</TableHead>
              <TableHead className="">Receber</TableHead>
              <TableHead>Pagar</TableHead>
              <TableHead className="">Saldo dia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finances
              // Atravez da funcao getIsWeekend, filtramos os fins de semana para nao serem exibidos.
              .filter((finance) => {
                const isWeekend = getIsWeekend(finance);
                return !isWeekend;
              })
              .map((finance) => (
                <FinanceTableRow key={finance.date} finance={finance} />
              ))}
          </TableBody>
        </Table>
      </div>
      {/* Lista responsiva para mobile */}
      <div className="block md:hidden">
        {finances.map((finance) => (
          <div key={finance.id} className="mb-4 rounded-lg border p-4 shadow">
            <div className="font-semibold">{finance.date}</div>
            <div className="text-green-500">
              Receber: {formatCurrency(getTotalReceived(finance))}
            </div>
            <div className="text-red-500">
              Pagar:{" "}
              {finance.valueAccountsPayable
                ? formatCurrency(finance.valueAccountsPayable)
                : 0}
            </div>
            <div
              className={`text-lg font-bold ${
                finance.balanceOfDay! <= 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              Saldo:{" "}
              {finance.balanceOfDay
                ? formatCurrency(finance.balanceOfDay!)
                : ""}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FinanceTable;
