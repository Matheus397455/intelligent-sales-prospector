import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareText } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens e áudios — SIPC" }, { name: "description", content: "Abordagens geradas, aprovadas e enviadas." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Mensagens e áudios"
      description="Abordagens geradas, aprovadas e enviadas."
      table="outreach_drafts"
      select={"id, channel, status, tone, created_at, companies(name)"}
      columns={[{key:"company",label:"Empresa",render:(r)=>(r.companies as {name:string}|null)?.name ?? "—"},{key:"channel",label:"Canal"},{key:"tone",label:"Tom"},{key:"status",label:"Status",type:"status"},{key:"created_at",label:"Criada em",type:"date"}]}
      emptyIcon={MessageSquareText}
      emptyTitle="Nenhuma mensagem ainda"
      emptyDescription="Mensagens geradas pela IA aparecerão aqui para revisão."
      notice={<PhaseNotice phase={6}>A geração de mensagens chega na Fase 6 e os áudios na Fase 7.</PhaseNotice>}
    />
  );
}
