import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { UserContext } from "@/contexts/userContext";
import { createOrUpdateFinance } from "@/services/financesService";
import { formatCurrency, getTotalReceived } from "@/utils/utils";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
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

const financeSchema = z.object({
  credito: z.number().min(0, "Obrigatório"),
  debito: z.number().min(0, "Obrigatório"),
  pix: z.number().min(0, "Obrigatório"),
  dinheiro: z.number().min(0, "Obrigatório"),
  alelo: z.number().min(0, "Obrigatório"),
  ticket: z.number().min(0, "Obrigatório"),
  vr: z.number().min(0, "Obrigatório"),
  sodexo: z.number().min(0, "Obrigatório"),
});

type FinanceFormData = z.infer<typeof financeSchema>;
const campos = [
  "credito",
  "debito",
  "pix",
  "dinheiro",
  "alelo",
  "ticket",
  "vr",
  "sodexo",
] as const;

const FinanceCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [totalReceived, setTotalReceived] = useState(0);
  const [open, setOpen] = useState(false);
  const { userAuth, getFinances, finances } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      credito: 0,
      debito: 0,
      pix: 0,
      dinheiro: 0,
      alelo: 0,
      ticket: 0,
      vr: 0,
      sodexo: 0,
    },
  });

  const handleInputBlur = (field: keyof FinanceFormData) => {
    const value = form.getValues(field).toString();
    const cleaned = value.replace(/^0+(?=\d)/, ""); // Remove zero à esquerda
    form.setValue(field, cleaned === "" ? 0 : parseFloat(cleaned));
    updatedTotalReceived();
  };

  const updatedTotalReceived = () => {
    const total =
      form.getValues("alelo") +
      form.getValues("ticket") +
      form.getValues("vr") +
      form.getValues("sodexo") +
      form.getValues("pix") +
      form.getValues("dinheiro") +
      form.getValues("debito") +
      form.getValues("credito");
    setTotalReceived(total);
  };

  const onSubmit = async (data: FinanceFormData) => {
    if (!selectedDate || !userAuth) return;

    try {
      setLoading(true);
      const response = await createOrUpdateFinance(
        selectedDate,
        data,
        userAuth,
      );

      if (!response?.status) {
        toast.error(response?.message);
        return;
      }

      toast.success(response.message);
      getFinances();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
    form.reset();
    setOpen(false);
  };

  const loadFinanceData = (date: Date) => {
    const formatedDate = format(date, "dd/MM/yyyy", { locale: ptBR });

    const finance = finances.find((finance) => {
      const dataBanco = finance.date.trim();
      return dataBanco === formatedDate;
    });
    if (finance) {
      form.setValue("credito", finance.credito ?? 0);
      form.setValue("debito", finance.debito ?? 0);
      form.setValue("pix", finance.pix ?? 0);
      form.setValue("dinheiro", finance.dinheiro ?? 0);
      form.setValue("alelo", finance.alelo ?? 0);
      form.setValue("ticket", finance.ticket ?? 0);
      form.setValue("vr", finance.vr ?? 0);
      form.setValue("sodexo", finance.sodexo ?? 0);
      setTotalReceived(getTotalReceived(finance));
    } else {
      form.reset();
    }
  };

  return (
    <>
      <Card className="flex-1 rounded-md bg-white p-2 shadow">
        <CardHeader>
          <CardTitle>Calendário Financeiro</CardTitle>
          <CardDescription>
            Selecione uma data para visualizar as informações financeiras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            disabled={(date) =>
              isBefore(startOfDay(date), startOfDay(new Date()))
            }
            required
            locale={ptBR}
            selected={selectedDate!}
            onSelect={(date) => {
              if (!date) return;
              loadFinanceData(date);
              setSelectedDate(date); // sempre define a data
              setOpen(true); // sempre abre o diálogo
            }}
          />
        </CardContent>
      </Card>
      <Dialog
        open={open}
        onOpenChange={(state) => {
          setOpen(state);
          if (!state) form.reset(); // Zera campos ao fechar
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Registrar movimentações em{" "}
              {selectedDate
                ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                : ""}
            </DialogTitle>
            <DialogDescription>
              Preencha os campos de forma detalhada para a data selecionada.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-4"
            >
              {campos.map((campo) => (
                <div key={campo} className="flex flex-col gap-1">
                  <FormField
                    control={form.control}
                    name={campo}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{campo}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...form.register(campo as keyof FinanceFormData, {
                              onBlur: () =>
                                handleInputBlur(campo as keyof FinanceFormData),
                            })}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <span className="text-lg">
                Total a receber:{" "}
                <span className="font-bold text-green-500">
                  {formatCurrency(totalReceived)}
                </span>
              </span>
              <Button type="submit" className="mt-5 w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default FinanceCalendarPage;
