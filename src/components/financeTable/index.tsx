import type { Finances } from "@/types/finances";
import { formatCurrency, getTotalReceived } from "@/utils/utils";

import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
            {finances.map((finance) => {
              const [day, month, year] = finance.date.split("/").map(Number);
              const date = new Date(year, month - 1, day); // mês é 0-indexado
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <TableRow key={finance.id} className="">
                  <TableCell
                    className={`font-medium ${isWeekend ? "text-red-600 line-through" : ""}`}
                  >
                    {isWeekend ? `${finance.date} (FDS)` : finance.date}
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
                          <span>
                            Credito: {formatCurrency(finance.credito)}
                          </span>
                          <span>Debito: {formatCurrency(finance.debito)}</span>
                          <span>Pix: {formatCurrency(finance.pix)}</span>
                          <span>Alelo: {formatCurrency(finance.alelo)}</span>
                          <span>Vr: {formatCurrency(finance.vr)}</span>
                          <span>Sodexo: {formatCurrency(finance.sodexo)}</span>
                          <span>
                            Dinheiro: {formatCurrency(finance.dinheiro)}
                          </span>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell className="text-red-500">
                    {finance.valueAccountsPayable
                      ? formatCurrency(finance.valueAccountsPayable)
                      : 0}
                  </TableCell>
                  <TableCell
                    className={`text-lg font-bold ${finance.balanceOfDay! <= 0 ? "text-red-500" : "text-green-500"} `}
                  >
                    {finance.balanceOfDay
                      ? formatCurrency(finance.balanceOfDay!)
                      : ""}
                  </TableCell>
                </TableRow>
              );
            })}
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
