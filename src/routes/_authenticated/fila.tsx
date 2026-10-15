import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/fila")({
  head: () => ({ meta: [{ title: "Fila de análise — SIPC" }, { name: "description", content: "Empresas aguardando análise." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Fila de análise"
      description="Empresas aguardando análise."
      table="companies"
      filter={{column:"analysis_status",op:"in",value:["pending","queued","analyzing"]}}
      columns={[{key:"name",label:"Empresa"},{key:"city",label:"Cidade"},{key:"website_url",label:"Site"},{key:"analysis_status",label:"Status",type:"status"},{key:"created_at",label:"Entrada",type:"date"}]}
      emptyIcon={ListChecks}
      emptyTitle="Fila vazia"
      emptyDescription="Empresas com análise pendente ou em andamento aparecerão aqui."
      notice={<PhaseNotice phase={4}>O processamento automático da fila chega na Fase 4.</PhaseNotice>}
    />
  );
}
