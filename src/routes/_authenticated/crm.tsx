import { createFileRoute } from "@tanstack/react-router";
import { KanbanSquare } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/crm")({
  head: () => ({ meta: [{ title: "CRM Kanban — SIPC" }, { name: "description", content: "Pipeline comercial por estágio." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="CRM Kanban"
      description="Pipeline comercial por estágio."
      table="companies"
      columns={[{key:"name",label:"Empresa"},{key:"commercial_status",label:"Estágio",type:"status"},{key:"city",label:"Cidade"},{key:"updated_at",label:"Atualizada",type:"date"}]}
      emptyIcon={KanbanSquare}
      emptyTitle="Pipeline vazio"
      emptyDescription="Cadastre empresas para acompanhá-las pelos estágios do funil."
      notice={<PhaseNotice phase={2}>O quadro Kanban com arrastar e soltar chega na Fase 2. Por enquanto, veja as empresas por estágio.</PhaseNotice>}
    />
  );
}
