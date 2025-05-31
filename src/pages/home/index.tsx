import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/contexts/userContext";
import { useRedirectAfterLogin } from "@/hooks/useRedirectAfterLogin";
import { type LoginFormData, loginFormSchema } from "@/schema/loginSchema";

import logo from "../../assets/Logo.png";

const HomePage = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loadingLogin, setLoadingLogin] = useState(false);
  const { login, signed } = useContext(UserContext);
  const { redirect } = useRedirectAfterLogin();

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setLoadingLogin(false);

    try {
      const user = await login(data.email, data.password);

      if (user) {
        toast.success(`Bem vindo! ${user.email}`);
        redirect();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      form.setError("email", { message: error.message });
      form.setError("password", { message: error.message });
      toast.error("Confira suas credenciais e tente novamente.");
    }
  };

  useEffect(() => {
    if (signed) {
      redirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signed]);

  return (
    <section className="relative flex h-full flex-col items-center justify-center gap-4">
      {/*       <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg_homePage})`,
          opacity: 0.05,
        }}
      /> */}

      {/* Conteúdo acima do fundo */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-4">
        <img src={logo} className="mb-10 h-40" alt="logo" />
        <section className="mt-5 min-w-[300px] rounded-lg bg-white p-6 shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Email</FormLabel> <FormMessage />
                    </div>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel> <FormMessage />
                    </div>

                    <FormControl>
                      <Input
                        placeholder="*********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loadingLogin}>
                {loadingLogin ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </section>
        <section className="mt-5 flex items-center justify-center gap-4">
          <Button variant="link" disabled={loadingLogin}>
            Esqueci minha senha
          </Button>
        </section>
      </div>
    </section>
  );
};

export default HomePage;
