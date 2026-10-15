import { createFileRoute } from "@tanstack/react-router";
import { FileSignature } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/propostas")({
  head: () => ({ meta: [{ title: "Propostas e vendas — SIPC" }, { name: "description", content: "Propostas enviadas e valores negociados." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Propostas e vendas"
      description="Propostas enviadas e valores negociados."
      table="proposals"
      select={"id, status, total, sent_at, created_at, companies(name)"}
      columns={[{key:"company",label:"Empresa",render:(r)=>(r.companies as {name:string}|null)?.name ?? "—"},{key:"status",label:"Status",type:"status"},{key:"total",label:"Total",type:"money"},{key:"sent_at",label:"Enviada",type:"date"}]}
      emptyIcon={FileSignature}
      emptyTitle="Nenhuma proposta"
      emptyDescription="Propostas e vendas registradas aparecerão aqui."
      notice={<PhaseNotice phase={9}>Criação de propostas e registro de vendas chegam na Fase 9.</PhaseNotice>}
    />
  );
}
