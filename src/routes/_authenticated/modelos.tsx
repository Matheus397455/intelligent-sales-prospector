import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/modelos")({
  head: () => ({ meta: [{ title: "Modelos de mensagens — SIPC" }, { name: "description", content: "Modelos reutilizáveis de abordagem." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Modelos de mensagens"
      description="Modelos reutilizáveis de abordagem."
      table="outreach_drafts"
      filter={{column:"status",op:"eq",value:"__template__"}}
      columns={[{key:"channel",label:"Canal"},{key:"tone",label:"Tom"},{key:"created_at",label:"Criado em",type:"date"}]}
      emptyIcon={FileText}
      emptyTitle="Nenhum modelo"
      emptyDescription="Modelos de mensagens poderão ser criados e reutilizados."
      notice={<PhaseNotice phase={6}>A biblioteca de modelos chega junto com o gerador, na Fase 6.</PhaseNotice>}
    />
  );
}
