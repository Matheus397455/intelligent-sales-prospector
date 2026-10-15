import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { DataListPage, PhaseNotice } from "@/components/app/data-list-page";

export const Route = createFileRoute("/_authenticated/campanhas")({
  head: () => ({ meta: [{ title: "Campanhas — SIPC" }, { name: "description", content: "Pesquisas de prospecção criadas e seus resultados." }] }),
  component: Page,
});

function Page() {
  return (
    <DataListPage
      title="Campanhas"
      description="Pesquisas de prospecção criadas e seus resultados."
      table="search_jobs"
      columns={[{key:"name",label:"Nome"},{key:"niche",label:"Nicho"},{key:"city",label:"Cidade"},{key:"status",label:"Status",type:"status"},{key:"results_count",label:"Resultados"},{key:"created_at",label:"Criada em",type:"date"}]}
      emptyIcon={Megaphone}
      emptyTitle="Nenhuma campanha criada"
      emptyDescription="Crie sua primeira pesquisa em Nova pesquisa."
      notice={<PhaseNotice phase={3}>A execução automática das pesquisas chega na Fase 3, com um provedor de dados de empresas configurado.</PhaseNotice>}
    />
  );
}
