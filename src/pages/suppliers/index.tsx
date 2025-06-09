import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import SupplierCard from "@/components/supplierCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SupplierFormData, SupplierFormSchema } from "@/schema/schemas";
import { createSupplier, fetchSuppliers } from "@/services/supplierService";
import type { Supplier } from "@/types/supplier";
import { formatCNPJ } from "@/utils/utils";

const Suppliers = () => {
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(SupplierFormSchema),
    defaultValues: {
      cnpj: "",
      company_name: "",
      payment_term: 0,
    },
  });

  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [originalSuppliers, setOriginalSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: SupplierFormData) => {
    // Logic to handle form submission
    try {
      setLoading(true);
      const supplierData = {
        ...data,
        id: data.cnpj.replace(/\D/g, ""), // Use CNPJ as ID
        created_at: new Date(),
        updated_at: new Date(),
      };
      const response = await createSupplier(supplierData);
      if (response.status) {
        toast.success(response.message); // Reset form fields after successful submission
        fetchSuppliersData(); // Refresh suppliers list
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar fornecedor.");
    } finally {
      form.reset();
      setLoading(false);
      setOpen(false); // Close dialog after submission
    }
  };

  const fetchSuppliersData = async () => {
    try {
      // Fetch suppliers from the database
      const suppliersResponse = await fetchSuppliers();

      if (!suppliersResponse || suppliersResponse.length === 0) {
        toast.info("Nenhum fornecedor encontrado.");
      }
      setSuppliers(suppliersResponse);
      setOriginalSuppliers(suppliersResponse); // Store original suppliers for filtering
    } catch {
      toast.error("Erro ao buscar fornecedores.");
    }
  };

  const handleFilterSuppilers = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Debounce the filter input to avoid excessive filtering
    const filterValue = e.target.value.toLowerCase();

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (!filterValue) {
        setSuppliers(originalSuppliers); // Reset to original suppliers if filter is empty
        return;
      }
      // Filter suppliers based on CNPJ or company name
      const filteredSuppliers = suppliers.filter((supplier) => {
        const companyName = supplier.cnpj;
        return (
          companyName.includes(filterValue) ||
          supplier.company_name.toLowerCase().includes(filterValue)
        );
      });
      setSuppliers(filteredSuppliers);
    }, 300); // Debounce the filter input
  };

  const handleFilterSuppilersByCnpj = () => {
    const cnpj = document.getElementById("cnpj_company") as HTMLInputElement;
    if (!cnpj || !cnpj.value) {
      setSuppliers(originalSuppliers); // Reset to original suppliers if CNPJ is empty
      toast.info("Informe um CNPJ para pesquisar.");
      return;
    }
    const findedSupplier = suppliers.find(
      (supplier) => supplier.cnpj === cnpj.value,
    );
    if (!findedSupplier) {
      toast.error("Fornecedor não encontrado.");
      setSuppliers(originalSuppliers);
      return;
    }
    // If supplier is found, you can handle it as needed
    setSuppliers([findedSupplier]); // Update suppliers to show only the found supplier
    toast.success("Fornecedor encontrado.");
  };

  useEffect(() => {
    fetchSuppliersData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50 p-6">
      <h1 className="text-xl">Fornecedores</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar</CardTitle>
          <CardDescription>Informe CNPJ ou razão social</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:w-1/2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="99.999.999/0001-99"
                  type="text"
                  onChange={(e) => {
                    const formattedValue = formatCNPJ(e.target.value);
                    e.target.value = formattedValue;
                  }}
                  id="cnpj_company"
                  name="cnpj_company"
                  maxLength={18}
                />
                <div className="bg-primary flex h-10 items-center justify-center rounded-lg px-2 text-white md:hidden">
                  <Search size={32} onClick={handleFilterSuppilersByCnpj} />
                </div>
                <Button
                  className="hidden h-10 max-w-56 flex-1 md:block"
                  onClick={handleFilterSuppilersByCnpj}
                >
                  Pesquisar
                </Button>
              </div>
              <Input
                type="text"
                placeholder="Razão social"
                className=""
                onChange={handleFilterSuppilers}
              />
              <span className="text-sm text-gray-500">
                Razão social do fornecedor é dinnamicamente filtrada.
              </span>
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <button
                className="flex h-10 max-w-32 items-center justify-center rounded-md bg-green-500 p-5 text-white hover:bg-green-600"
                onClick={() => setOpen(true)}
              >
                <PlusCircleIcon className="" />
                <span className="ml-2">Novo</span>
              </button>
              <Dialog
                open={open}
                onOpenChange={(state) => {
                  setOpen(state);
                  if (!state) form.reset(); // Zera campos ao fechar
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Fornecedor</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para cadastrar um novo fornecedor.
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
                                <Input
                                  placeholder="99.999.999/0001-99"
                                  {...field}
                                  onChange={(e) => {
                                    const formattedValue = formatCNPJ(
                                      e.target.value,
                                    );
                                    field.onChange(formattedValue);
                                  }}
                                  maxLength={18}
                                />
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
                                <FormLabel>Razão Social</FormLabel>{" "}
                                <FormMessage />
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
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? "Salvando..." : "Salvar Fornecedor"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>Lista de fornecedores cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for suppliers list */}
          {suppliers.length > 0 ? (
            <ul className="space-y-2">
              {suppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  updateSupplierList={fetchSuppliersData}
                />
              ))}
            </ul>
          ) : (
            <p>Nenhum fornecedor cadastrado</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Suppliers;
