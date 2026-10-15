import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ErrorState, PageHeader, StatusBadge } from "@/components/app/ui-states";

export const Route = createFileRoute("/_authenticated/integracoes")({
  head: () => ({ meta: [{ title: "Integrações — SIPC" }, { name: "description", content: "Status das fontes e serviços externos." }] }),
  component: Integrations,
});

const catalog = [
  { provider: "lovable_ai", name: "IA (análise e geração de texto)", type: "Modelo de linguagem", builtIn: true, phase: "Fases 4–6" },
  { provider: "business_search", name: "Pesquisa de empresas", type: "Fonte de dados", builtIn: false, phase: "Fase 3" },
  { provider: "web_search", name: "Pesquisa web", type: "Fonte de dados", builtIn: false, phase: "Fase 3" },
  { provider: "tts", name: "Síntese de voz", type: "Áudio", builtIn: false, phase: "Fase 7" },
  { provider: "messaging", name: "Envio de mensagens", type: "Mensageria", builtIn: false, phase: "Fase 8" },
  { provider: "n8n", name: "n8n (opcional)", type: "Orquestração", builtIn: false, phase: "Fase 8" },
];

function Integrations() {
  const q = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("integrations").select("provider, status, last_tested_at");
      if (error) throw error;
      return data;
    },
  });
  return (
    <div>
      <PageHeader title="Integrações" description="Nenhum resultado é simulado: sem integração configurada, o recurso fica indisponível." />
      {q.isError ? <ErrorState onRetry={() => q.refetch()} /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {catalog.map((c) => {
            const row = q.data?.find((r) => r.provider === c.provider);
            const status = c.builtIn ? "configured" : row?.status ?? "not_configured";
            return (
              <div key={c.provider} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.type} · usada a partir da {c.phase}</div>
                  </div>
                  <StatusBadge value={status} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {c.builtIn ? "Disponível pelo Lovable Cloud, sem chave adicional." : "Integração não configurada. Será solicitada quando a fase correspondente for implementada."}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
