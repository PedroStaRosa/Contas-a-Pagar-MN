import { CloudUpload, FileInput } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { UserContext } from "@/contexts/userContext";
import { atualizarOuCriarValorAPagar } from "@/services/updateAccountsPayble";
import { formatCurrency } from "@/utils/utils";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type ValoresPorData = {
  dataFormatada: string;
  valor: number;
};

const AccountsPayableReader = () => {
  const [valores, setValores] = useState<ValoresPorData[]>([]);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(
    null,
  );
  const { userAuth } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setArquivoSelecionado(file);
  };

  const handleFileUpload = () => {
    setValores([]);

    if (!arquivoSelecionado) {
      toast.error("Selecione um arquivo antes de verificar os dados.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const valoresExtraidos: ValoresPorData[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsonData.forEach((row: any) => {
        const vencimento = row["Relatório de Contas a Pagar - Consolidado"];
        const valorRaw = row["_18"];
        if (!vencimento || !valorRaw) return;

        // Tratando valor no formato brasileiro: "14.047,97" => 14047.97
        const valor = parseFloat(
          String(valorRaw).replace(/\./g, "").replace(",", "."),
        );

        if (isNaN(valor)) return;

        valoresExtraidos.push({
          dataFormatada: vencimento,
          valor,
        });
      });

      if (valoresExtraidos.length === 0) {
        toast.error(
          "Formatação do arquivo inválido. verifique o modelo e reenvie.",
        );
        return;
      }
      setValores(valoresExtraidos);
    };

    reader.readAsArrayBuffer(arquivoSelecionado);
  };

  const handleUpdateAccounts = async () => {
    try {
      setIsLoading(true);
      if (!userAuth) {
        toast.error("Faça login para atualizar as contas a pagar.");
        return;
      }
      await atualizarOuCriarValorAPagar(valores, userAuth.uid);
      toast.success("Contas a pagar atualizadas com sucesso!");
      handleClearFile();
    } catch {
      toast.error("Erro ao atualizar as contas a pagar:");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFile = () => {
    setArquivoSelecionado(null);
    setValores([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded bg-white p-4 shadow">Carregando...</div>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Enviar relatório de Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex h-32 cursor-pointer items-center justify-center rounded-sm border-2 border-dotted border-gray-400 bg-gray-100 p-2 transition-colors hover:bg-gray-200">
            <div className="absolute cursor-pointer">
              {arquivoSelecionado ? (
                <div className="flex max-w-full min-w-0 items-center gap-2 rounded px-2 py-1">
                  <FileInput size={48} className="shrink-0" />
                  <span
                    className="max-w-[140px] truncate overflow-hidden rounded-lg bg-zinc-500 px-4 py-2 text-sm whitespace-nowrap text-white lg:max-w-xs"
                    title={arquivoSelecionado.name}
                  >
                    {arquivoSelecionado.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-zinc-500">
                  <CloudUpload size={32} />
                  <p className="text-center">
                    <span className="font-bold">Clique para selecionar</span> ou
                    arraste e solte
                  </p>
                  <p className="text-sm">XLS, XLSX (MAX. 10MB) </p>
                </div>
              )}
            </div>
            <div className="h-full w-full cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx"
                className="h-full w-full cursor-pointer opacity-0"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex w-full flex-col justify-between gap-2 p-2 md:flex-row">
            <Button onClick={handleFileUpload}>Verificar dados</Button>
            <Button variant="destructive" onClick={handleClearFile}>
              Limpar
            </Button>
          </div>
          <h2 className="mb-2 text-xl font-semibold">Totais por Vencimento:</h2>
          <ul className="grid w-full [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] gap-2">
            {valores.map((item) => (
              <li
                key={item.dataFormatada}
                className="flex min-w-0 flex-col rounded-lg border pl-3 shadow-sm"
              >
                <span className="font-medium">{item.dataFormatada}:</span>
                <span>{formatCurrency(item.valor)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button
              onClick={handleUpdateAccounts}
              disabled={!arquivoSelecionado || isLoading}
            >
              {isLoading ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPayableReader;
