import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/ui-states";
import { PhaseNotice } from "@/components/app/data-list-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logAppError } from "@/lib/error-log";

export const Route = createFileRoute("/_authenticated/pesquisa")({
  head: () => ({ meta: [{ title: "Nova pesquisa — SIPC" }, { name: "description", content: "Configure uma campanha de prospecção." }] }),
  component: NovaPesquisa,
});

function NovaPesquisa() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", niche: "", subniche: "", city: "", state: "", keywords: "", max_results: "50" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const create = useMutation({
    mutationFn: async () => {
      const max = Number(f.max_results);
      if (!f.name.trim() || !f.niche.trim()) throw new Error("Informe nome e nicho.");
      if (!Number.isInteger(max) || max < 1 || max > 1000) throw new Error("Máximo de resultados deve ser entre 1 e 1000.");
      const { error } = await supabase.from("search_jobs").insert({
        name: f.name.trim(), niche: f.niche.trim(), subniche: f.subniche.trim() || null,
        city: f.city.trim() || null, state: f.state.trim().toUpperCase() || null,
        keywords: f.keywords.split(",").map((k) => k.trim()).filter(Boolean), max_results: max, status: "draft",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Campanha salva como rascunho.");
      qc.invalidateQueries();
      navigate({ to: "/campanhas" });
    },
    onError: (e) => {
      toast.error((e as Error).message);
      logAppError("nova-pesquisa", e);
    },
  });

  return (
    <div className="max-w-2xl">
      <PageHeader title="Nova pesquisa" description="Defina o nicho e a região que deseja prospectar." />
      <PhaseNotice phase={3}>A campanha é salva como rascunho. A busca automática de empresas será ativada na Fase 3, quando um provedor de dados for configurado em Integrações.</PhaseNotice>
      <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-2">
        <Field label="Nome da campanha *" className="sm:col-span-2"><Input value={f.name} onChange={set("name")} placeholder="Hamburguerias Bauru — Outubro" required maxLength={120} /></Field>
        <Field label="Nicho *"><Input value={f.niche} onChange={set("niche")} placeholder="Hamburguerias" required maxLength={80} /></Field>
        <Field label="Subnicho"><Input value={f.subniche} onChange={set("subniche")} placeholder="Artesanais" maxLength={80} /></Field>
        <Field label="Cidade"><Input value={f.city} onChange={set("city")} placeholder="Bauru" maxLength={80} /></Field>
        <Field label="UF"><Input value={f.state} onChange={set("state")} placeholder="SP" maxLength={2} /></Field>
        <Field label="Palavras-chave (separadas por vírgula)" className="sm:col-span-2"><Input value={f.keywords} onChange={set("keywords")} placeholder="delivery, smash burger" maxLength={300} /></Field>
        <Field label="Máximo de resultados"><Input type="number" min={1} max={1000} value={f.max_results} onChange={set("max_results")} /></Field>
        <div className="flex items-end justify-end sm:col-span-2">
          <Button type="submit" disabled={create.isPending}>{create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar campanha</Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 ${className ?? ""}`}><Label>{label}</Label>{children}</div>;
}
