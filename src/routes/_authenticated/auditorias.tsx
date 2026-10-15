import { createFileRoute } from "@tanstack/react-router";
import { ScanSearch } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/auditorias")({
  head: () => ({ meta: [{ title: "Auditorias digitais — SIPC" }, { name: "description", content: "Análises da presença digital das empresas." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Auditorias digitais"
      description="Análises da presença digital das empresas."
      table="digital_audits"
      select={"id, audit_type, status, confidence_score, created_at, companies(name)"}
      columns={[{key:"company",label:"Empresa",render:(r)=>(r.companies as {name:string}|null)?.name ?? "—"},{key:"audit_type",label:"Tipo"},{key:"status",label:"Status",type:"status"},{key:"confidence_score",label:"Confiança"},{key:"created_at",label:"Criada em",type:"date"}]}
      emptyIcon={ScanSearch}
      emptyTitle="Nenhuma auditoria realizada"
      emptyDescription="As auditorias analisam sites e perfis com IA, registrando evidências e achados."
      notice={<PhaseNotice phase={4}>A auditoria digital com IA chega na Fase 4.</PhaseNotice>}
    />
  );
}
