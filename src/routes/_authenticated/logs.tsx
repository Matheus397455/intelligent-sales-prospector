import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { DataListPage } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/logs")({
  head: () => ({ meta: [{ title: "Logs e erros — SIPC" }, { name: "description", content: "Erros registrados pela aplicação na sua conta." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Logs e erros"
      description="Erros registrados pela aplicação na sua conta."
      table="app_error_logs"
      columns={[{key:"level",label:"Nível",type:"status"},{key:"source",label:"Origem"},{key:"message",label:"Mensagem"},{key:"created_at",label:"Data",type:"date"}]}
      emptyIcon={AlertTriangle}
      emptyTitle="Nenhum erro registrado"
      emptyDescription="Ótimo! Erros da aplicação aparecerão aqui com detalhes seguros."
      
    />
  );
}
