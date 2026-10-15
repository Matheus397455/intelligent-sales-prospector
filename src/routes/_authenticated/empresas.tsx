import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/empresas")({
  head: () => ({ meta: [{ title: "Empresas e leads — SIPC" }, { name: "description", content: "Empresas cadastradas e seu status comercial." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Empresas e leads"
      description="Empresas cadastradas e seu status comercial."
      table="companies"
      columns={[{key:"name",label:"Empresa"},{key:"niche",label:"Nicho"},{key:"city",label:"Cidade"},{key:"commercial_status",label:"Status",type:"status"},{key:"analysis_status",label:"Análise",type:"status"},{key:"created_at",label:"Cadastrada em",type:"date"}]}
      emptyIcon={Building2}
      emptyTitle="Nenhuma empresa cadastrada"
      emptyDescription="Empresas aparecerão aqui após o cadastro manual ou a importação de uma campanha."
      notice={<PhaseNotice phase={2}>Cadastro manual, busca, filtros e detalhes da empresa chegam na Fase 2.</PhaseNotice>}
    />
  );
}
