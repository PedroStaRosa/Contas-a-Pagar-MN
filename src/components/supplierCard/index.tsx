import { addDays } from "date-fns";
import { Trash2 } from "lucide-react";
import { useContext, useMemo } from "react";

import { UserContext } from "@/contexts/userContext";
import type { Supplier } from "@/types/supplier";
import {
  calcAddDays,
  formatCurrency,
  formatDateBR,
  getValueForDate,
  getWeekdayName,
  parseDateBR,
} from "@/utils/utils";

import { AlertDialogDelete } from "../alertDialog";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

interface SupplierCardProps {
  supplier: Supplier;
  onDelete: (id: string) => void;
}

interface supplierWithFinance {
  paymentDate: string;
  weekday: string;
  totalValueToPay: number;
}

/* REFATORAR LOGICA DE REMOVER O FORNECEDOR, E ATUALIZAR A LISTA DE FORNECEDORES... SUPPLIERCARD DEVE RECEBER A FUNC;ÁO DE DELETAR O FORNECEDOR COMO PROPS,
ASSIM É POSSIVEL TRAVAR A TELA ENQUANTO A REMOÇÃO DO FORNECEDOR ESTÁ SENDO EXECUTADA */

const SupplierCard = ({ supplier, onDelete }: SupplierCardProps) => {
  const { finances } = useContext(UserContext);

  const supplierInfos = useMemo(() => {
    const supplierInfo: supplierWithFinance[] = supplier.payment_term.map(
      (paymentDay) => {
        const paymentDate = formatDateBR(calcAddDays(paymentDay));
        const weekday = getWeekdayName(parseDateBR(paymentDate));
        let totalValueToPay = getValueForDate(finances, paymentDate) || 0;

        if (weekday === "segunda-feira") {
          const baseDate = parseDateBR(paymentDate);
          totalValueToPay +=
            getValueForDate(finances, formatDateBR(addDays(baseDate, -2))) || 0;
          totalValueToPay +=
            getValueForDate(finances, formatDateBR(addDays(baseDate, -1))) || 0;
        }

        return { paymentDate, weekday, totalValueToPay };
      },
    );

    return supplierInfo;
  }, [supplier, finances]);

  // If supplier is not provided, return null to avoid rendering errors
  if (!supplier) return null;
  // If supplierInfos is not provided, return null to avoid rendering errors
  if (!supplierInfos) return null;
  // If supplierInfos is empty, return null to avoid rendering errors
  if (supplierInfos.length === 0) return null;

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {supplier.company_name}
        </CardTitle>
        <CardDescription>CNPJ: {supplier.cnpj}</CardDescription>
      </CardHeader>

      <CardContent className="text-muted-foreground space-y-2 text-sm">
        <div className="flex gap-1 md:flex-row md:items-center md:gap-4">
          Prazo:{" "}
          {supplier.payment_term.map((paymentTerm) => (
            <Badge key={paymentTerm} variant="outline">
              {paymentTerm}
            </Badge>
          ))}
          <div className={`flex w-full items-center justify-end`}>
            <AlertDialogDelete
              supplierRef={supplier}
              onDelete={() => onDelete(supplier.id)}
            >
              <Trash2 className="h-6 w-6 text-red-500" />
            </AlertDialogDelete>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="flex flex-col space-y-1">
          <span className="text-muted-foreground">
            Pagamentos previstos para:
          </span>
          {supplierInfos.map((info, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 text-sm md:flex-row"
            >
              <span className="text-muted-foreground text-xs text-nowrap">
                {info.weekday === "segunda-feira" ? (
                  <>
                    (Segunda-feira + <span className="text-red-500">FDS</span>)
                  </>
                ) : (
                  info.weekday
                )}
              </span>
              <span className="text-muted-foreground">
                <strong>{info.paymentDate}</strong>:
              </span>
              <strong className="text-red-600">
                {formatCurrency(info.totalValueToPay)}
              </strong>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierCard;
