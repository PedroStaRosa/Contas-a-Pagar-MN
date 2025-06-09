import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { SquarePen, Trash2 } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserContext } from "@/contexts/userContext";
import { type SupplierFormData, SupplierFormSchema } from "@/schema/schemas";
import { deleteSupplier, updateSupplier } from "@/services/supplierService";
import type { Supplier } from "@/types/supplier";
import {
  formatCurrency,
  formatDateBR,
  getValueForDate,
  getWeekdayName,
  parseDateBR,
} from "@/utils/utils";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

interface SupplierCardProps {
  supplier: Supplier;
  updateSupplierList: () => void;
}

const SupplierCard = ({ supplier, updateSupplierList }: SupplierCardProps) => {
  const { finances } = useContext(UserContext);
  const [openEditSupplierModal, setOpenEditSupplierModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(SupplierFormSchema),
    defaultValues: {
      cnpj: supplier.cnpj || "",
      company_name: supplier.company_name || "",
      payment_term: supplier.payment_term || 0,
    },
  });

  const supplierWithFinance = useMemo(() => {
    const paymentDate = formatDateBR(
      addDays(new Date(), supplier.payment_term),
    );
    const weekday = getWeekdayName(parseDateBR(paymentDate));

    const valueForPaymentDate = getValueForDate(finances, paymentDate);

    if (valueForPaymentDate && weekday === "segunda-feira") {
      const baseDate = parseDateBR(paymentDate);
      const saturdayDate = formatDateBR(addDays(baseDate, -2));
      const sundayDate = formatDateBR(addDays(baseDate, -1));

      const valueToPaySaturday = getValueForDate(finances, saturdayDate);
      const valueToPaySunday = getValueForDate(finances, sundayDate);

      return {
        ...supplier,
        paymentDate,
        weekday,
        valueToPay: valueForPaymentDate + valueToPaySaturday + valueToPaySunday,
      };
    }

    return {
      ...supplier,
      paymentDate,
      weekday,
      valueToPay: valueForPaymentDate || 0,
    };
  }, [supplier, finances]);

  const onSubmit = async (data: SupplierFormData) => {
    try {
      setLoading(true);

      const supplierData: Supplier = {
        id: supplier.id,
        cnpj: data.cnpj,
        company_name: data.company_name,
        payment_term: Number(data.payment_term),
        created_at: supplier.created_at,
        updated_at: supplier.updated_at,
      };

      const response = await updateSupplier(supplierData);
      if (response.status) {
        toast.success(response.message);
        updateSupplierList();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error(
        "❌ Ocorreu um erro ao atualizar o fornecedor. Tente novamente.",
      );
    } finally {
      setLoading(false);
      setOpenEditSupplierModal(false);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteSupplier(id);
      if (response.status) {
        toast.success(response.message);
        updateSupplierList();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error(
        "❌ Ocorreu um erro ao deletar o fornecedor. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  // If supplier is not provided, return null to avoid rendering errors
  if (!supplier) return null;

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {supplierWithFinance.company_name}
        </CardTitle>
        <CardDescription>CNPJ: {supplierWithFinance.cnpj}</CardDescription>
      </CardHeader>

      <CardContent className="text-muted-foreground space-y-2 text-sm">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <Badge variant="outline">
            Prazo: {supplierWithFinance.payment_term} dias
          </Badge>
          <span>
            Pagamento em: <strong>{supplierWithFinance.paymentDate}</strong>
          </span>
          <div className="flex items-center gap-5">
            <SquarePen
              className="cursor-pointer text-green-500 hover:text-green-700"
              onClick={() => setOpenEditSupplierModal(true)}
            />
            <Trash2
              className="cursor-pointer text-red-500 hover:text-red-700"
              onClick={() =>
                confirm("Tem certeza que deseja deletar?") &&
                handleDeleteSupplier(supplier.id)
              }
            />
          </div>
        </div>

        <Separator className="my-2" />

        <div>
          Valor a pagar no dia: {}
          {supplierWithFinance.valueToPay ? (
            <strong className="text-red-600">
              {formatCurrency(supplierWithFinance.valueToPay)}
            </strong>
          ) : (
            "R$ 0,00"
          )}
          <span className="text-xs text-nowrap">
            {" "}
            {supplierWithFinance.weekday === "segunda-feira" ? (
              <>
                (Segunda-feira) + <span className="text-red-500">FDS</span>
              </>
            ) : (
              supplierWithFinance.weekday
            )}
          </span>
        </div>
        <Dialog
          open={openEditSupplierModal}
          onOpenChange={(state) => {
            setOpenEditSupplierModal(state);
          }}
        >
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>{supplierWithFinance.company_name}</DialogTitle>
              <DialogDescription>
                Edite os dados do fornecedor aqui.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>CNPJ</FormLabel> <FormMessage />
                        </div>
                        <FormControl>
                          <Input {...field} maxLength={18} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Razão Social</FormLabel> <FormMessage />
                        </div>

                        <FormControl>
                          <Input
                            placeholder="razao social do fornecedor"
                            {...field}
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payment_term"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Prazo de pagamento</FormLabel>{" "}
                          <FormMessage />
                        </div>

                        <FormControl>
                          <Input
                            placeholder="30"
                            {...field}
                            type="number"
                            min={0}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Fornecedor"}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SupplierCard;
