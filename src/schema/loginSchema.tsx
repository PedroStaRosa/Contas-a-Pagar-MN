import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Digite seu email." })
    .email({ message: "Digite um email válido." }),
  password: z.string().min(2, {
    message: "Digite sua senha.",
  }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
