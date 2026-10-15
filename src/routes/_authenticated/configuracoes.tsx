import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, SectionCard } from "@/components/app/ui-states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — SIPC" }, { name: "description", content: "Perfil e preferências." }] }),
  component: Settings,
});

function Settings() {
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("profiles").select("*").eq("id", u.user!.id).maybeSingle();
      if (error) throw error;
      return { id: u.user!.id, email: u.user!.email, display_name: data?.display_name ?? "" };
    },
  });
  const [name, setName] = useState("");
  useEffect(() => { if (profile.data) setName(profile.data.display_name); }, [profile.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").upsert({ id: profile.data!.id, display_name: name.trim().slice(0, 80) });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Perfil atualizado."); qc.invalidateQueries({ queryKey: ["me"] }); qc.invalidateQueries({ queryKey: ["profile"] }); },
    onError: () => toast.error("Não foi possível salvar."),
  });

  return (
    <div className="max-w-2xl">
      <PageHeader title="Configurações" description="Seu perfil e preferências." />
      <SectionCard title="Perfil">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <div className="space-y-1.5"><Label>E-mail</Label><Input value={profile.data?.email ?? ""} disabled /></div>
          <div className="space-y-1.5"><Label htmlFor="dn">Nome de exibição</Label><Input id="dn" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></div>
          <div className="flex justify-end"><Button type="submit" disabled={save.isPending || !profile.data}>Salvar</Button></div>
        </form>
      </SectionCard>
    </div>
  );
}
