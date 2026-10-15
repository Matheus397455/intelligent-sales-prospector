import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/gerador")({
  head: () => ({ meta: [{ title: "Gerador de abordagens — SIPC" }, { name: "description", content: "Mensagens personalizadas com base nas evidências de cada empresa." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Gerador de abordagens"
      description="Mensagens personalizadas com base nas evidências de cada empresa."
      table="outreach_drafts"
      select={"id, channel, objective, status, created_at, companies(name)"}
      columns={[{key:"company",label:"Empresa",render:(r)=>(r.companies as {name:string}|null)?.name ?? "—"},{key:"objective",label:"Objetivo"},{key:"status",label:"Status",type:"status"},{key:"created_at",label:"Criada em",type:"date"}]}
      emptyIcon={Sparkles}
      emptyTitle="Nenhuma abordagem gerada"
      emptyDescription="O gerador usa a auditoria e a pontuação da empresa para escrever a mensagem."
      notice={<PhaseNotice phase={6}>O gerador com IA chega na Fase 6 — ele depende das auditorias (Fase 4) e da pontuação (Fase 5).</PhaseNotice>}
    />
  );
}
