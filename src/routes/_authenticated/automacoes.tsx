import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/automacoes")({
  head: () => ({ meta: [{ title: "Histórico de automações — SIPC" }, { name: "description", content: "Execuções automáticas e seus resultados." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Histórico de automações"
      description="Execuções automáticas e seus resultados."
      table="automation_runs"
      columns={[{key:"job_type",label:"Tipo"},{key:"status",label:"Status",type:"status"},{key:"attempt_count",label:"Tentativas"},{key:"safe_error_message",label:"Erro"},{key:"created_at",label:"Criada em",type:"date"}]}
      emptyIcon={History}
      emptyTitle="Nenhuma execução registrada"
      emptyDescription="Pesquisas, análises e outras tarefas automáticas serão registradas aqui."
      notice={<PhaseNotice phase={8}>As automações chegam a partir da Fase 3.</PhaseNotice>}
    />
  );
}
