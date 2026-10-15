import { createFileRoute } from "@tanstack/react-router";
import { Tags } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/servicos")({
  head: () => ({ meta: [{ title: "Serviços e preços — SIPC" }, { name: "description", content: "Catálogo dos serviços que você oferece." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Serviços e preços"
      description="Catálogo dos serviços que você oferece."
      table="offers"
      columns={[{key:"name",label:"Serviço"},{key:"reference_price",label:"Preço de referência",type:"money"},{key:"estimated_delivery_days",label:"Prazo (dias)"},{key:"active",label:"Ativo",render:(r)=>r.active ? "Sim" : "Não"}]}
      emptyIcon={Tags}
      emptyTitle="Nenhum serviço cadastrado"
      emptyDescription="Cadastre serviços como sites institucionais, landing pages e cardápios digitais."
      notice={<PhaseNotice phase={2}>O cadastro de serviços chega na Fase 2.</PhaseNotice>}
    />
  );
}
