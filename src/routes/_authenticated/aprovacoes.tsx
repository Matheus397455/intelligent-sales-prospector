import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/aprovacoes")({
  head: () => ({ meta: [{ title: "Aprovações pendentes — SIPC" }, { name: "description", content: "Nenhuma mensagem é enviada sem sua aprovação explícita." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Aprovações pendentes"
      description="Nenhuma mensagem é enviada sem sua aprovação explícita."
      table="outreach_drafts"
      select={"id, channel, content, created_at, companies(name)"}
      filter={{column:"status",op:"eq",value:"pending_approval"}}
      columns={[{key:"company",label:"Empresa",render:(r)=>(r["companies"] as {name:string}|null)?.name ?? "—"},{key:"channel",label:"Canal"},{key:"content",label:"Prévia",render:(r)=>String(r["content"]).slice(0,80)},{key:"created_at",label:"Criada em",type:"date"}]}
      emptyIcon={ShieldCheck}
      emptyTitle="Nada aguardando aprovação"
      emptyDescription="Quando uma abordagem estiver pronta, ela aparecerá aqui para você revisar."
      notice={<PhaseNotice phase={6}>A aprovação vinculada à versão exata do texto chega na Fase 6.</PhaseNotice>}
    />
  );
}
