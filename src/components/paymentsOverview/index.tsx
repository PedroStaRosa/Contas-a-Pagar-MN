import { zodResolver } from "@hookform/resolvers/zod";
import type { Timestamp } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UserContext } from "@/contexts/userContext";
import { getUser } from "@/services/userService";
import type { Finances } from "@/types/finances";
import { getTotalReceived } from "@/utils/utils";

import FinanceTable from "../financeTable";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const balanceSchema = z.object({
  startingBalanceForm: z.coerce.number(),
});

const PaymentsOverview = () => {
  const [dates, setDates] = useState<Finances[]>([]);
  const [balanceOfDay, setBalanceOfDay] = useState<number>();
  const [ignoreTodayChecked, setIgnoreTodayChecked] = useState<boolean>(false);
  const [lastUpdatedPayment, setLastUpdatedPayment] = useState<string | null>(
    null,
  );
  const { finances, userAuth } = useContext(UserContext);

  const form = useForm<z.infer<typeof balanceSchema>>({
    resolver: zodResolver(balanceSchema),
    defaultValues: {
      startingBalanceForm: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof balanceSchema>) => {
    if (values.startingBalanceForm < 0) {
      form.setError("startingBalanceForm", {
        type: "custom",
        message: "O valor deve ser maior que zero",
      });
      return;
    }
    setBalanceOfDay(values.startingBalanceForm);
    updateBalanceToDay(values.startingBalanceForm);
  };

  const updateBalanceToDay = (initialBalance: number) => {
    if (typeof initialBalance !== "number" || isNaN(initialBalance)) return;

    let previousBalance = initialBalance;
    let itemsToIterate = finances;

    if (ignoreTodayChecked) {
      itemsToIterate = finances.slice(1);
    }

    /*     if (ignoreTodayChecked) {
      const firstDate = finances[0];
      const totalReceivedFirstDate = getTotalReceived(firstDate);
      const totalPayableFirstDate = firstDate.valueAccountsPayable ?? 0;
      const balanceFirstDate =
        initialBalance - totalReceivedFirstDate + totalPayableFirstDate;
      previousBalance = balanceFirstDate;

      console.log("a", balanceFirstDate);
    } */

    const balanceupdated = itemsToIterate.map((obj) => {
      const totalReceived = getTotalReceived(obj);
      const totalPayable = obj.valueAccountsPayable ?? 0;
      const balance = previousBalance + totalReceived - totalPayable;
      const result = {
        ...obj,
        balanceOfDay: balance,
      };

      previousBalance = balance;

      return result;
    });

    if (ignoreTodayChecked && finances.length > 0) {
      const firstDate = {
        ...finances[0],
        balanceOfDay: initialBalance,
      };
      setDates([firstDate, ...balanceupdated]);
    } else {
      setDates(balanceupdated);
    }
  };

  const getLastUpdatedPayment = async () => {
    if (!userAuth?.uid) return;
    const user = await getUser(userAuth?.uid);

    const data = user.lastUpdatedPayments as Timestamp;
    const dataFormatada = data.toDate().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setLastUpdatedPayment(dataFormatada);
  };

  useEffect(() => {
    setDates(finances);
    getLastUpdatedPayment();
  }, [finances]);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          <div>
            <p>Resumo Financeiro</p>
            <span>
              Contas a pagar atualizado em{" "}
              {lastUpdatedPayment ? lastUpdatedPayment : "Nunca"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col p-2"
            >
              <div className="flex w-full flex-col gap-4 md:flex-row">
                <FormField
                  control={form.control}
                  name="startingBalanceForm"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-center gap-2 md:w-96">
                      <div className="flex w-full gap-2">
                        <FormLabel className="text-xl text-nowrap">
                          * Saldo do dia:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Informe o saldo do dia"
                            step="0.01"
                            {...field}
                            onBlur={form.handleSubmit(onSubmit)}
                          />
                        </FormControl>
                      </div>

                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-center gap-2 border-l-2 border-gray-300 pl-2">
                  <Checkbox
                    id="meu-checkbox"
                    checked={ignoreTodayChecked}
                    onCheckedChange={(checked) => {
                      setIgnoreTodayChecked(!!checked);
                      // `checked` pode ser boolean ou "indeterminate"
                    }}
                  />
                  <Label htmlFor="meu-checkbox" className="text-xl text-nowrap">
                    Dia atual já pago.
                  </Label>
                </div>
                <Button type="submit">Atualizar</Button>
              </div>
            </form>
          </Form>
        </div>

        {!balanceOfDay && (
          <span className="font-bold text-red-500">
            * Informe o saldo do dia.
          </span>
        )}

        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <FinanceTable finances={dates} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsOverview;
