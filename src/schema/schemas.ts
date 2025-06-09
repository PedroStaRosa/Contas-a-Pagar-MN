import { z } from "zod";

export const SupplierFormSchema = z.object({
  cnpj: z
    .string({
      required_error: "CNPJ é obrigatório.",
    })
    .refine((doc) => {
      const digits = doc.replace(/\D/g, "");
      return digits.length === 14;
    }, "CNPJ deve conter 14 números.")
    .refine((doc) => {
      const digits = doc.replace(/\D/g, "");
      return /^\d+$/.test(digits);
    }, "CNPJ deve conter apenas números."),
  company_name: z.string().min(1, {
    message: "Razão social é obrigatória.",
  }),
  payment_term: z.coerce
    .number({
      required_error: "Prazo de pagamento é obrigatório.",
    })
    .min(1, { message: "O prazo não pode ser negativo ou zero." }),
});

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Digite seu email." })
    .email({ message: "Digite um email válido." }),
  password: z.string().min(2, {
    message: "Digite sua senha.",
  }),
});

export type SupplierFormData = z.infer<typeof SupplierFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
