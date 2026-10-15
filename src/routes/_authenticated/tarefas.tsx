import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/tarefas")({
  head: () => ({ meta: [{ title: "Tarefas e acompanhamento — SIPC" }, { name: "description", content: "Próximas ações e follow-ups." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Tarefas e acompanhamento"
      description="Próximas ações e follow-ups."
      table="tasks"
      columns={[{key:"title",label:"Tarefa"},{key:"priority",label:"Prioridade",type:"status"},{key:"status",label:"Status",type:"status"},{key:"due_at",label:"Vencimento",type:"date"}]}
      emptyIcon={CalendarCheck}
      emptyTitle="Nenhuma tarefa"
      emptyDescription="Tarefas de acompanhamento aparecerão aqui."
      notice={<PhaseNotice phase={2}>Criação e conclusão de tarefas chegam na Fase 2.</PhaseNotice>}
    />
  );
}
