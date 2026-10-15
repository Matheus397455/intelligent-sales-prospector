import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Radar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search =>
    typeof s["redirect"] === "string" && s["redirect"].startsWith("/") && !s["redirect"].startsWith("//")
      ? { redirect: s["redirect"] }
      : {},
  head: () => ({
    meta: [
      { title: "Entrar — SIPC" },
      { name: "description", content: "Acesse o SIPC, seu sistema inteligente de prospecção comercial." },
      { property: "og:title", content: "Entrar — SIPC" },
      { property: "og:description", content: "Acesse o SIPC, seu sistema inteligente de prospecção comercial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const target = redirect ?? "/dashboard";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: target });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/dashboard" } });
        if (error) throw error;
        toast.success("Conta criada. Confirme seu e-mail para entrar.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        toast.success("Enviamos um link de redefinição para seu e-mail.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(translate((err as Error).message));
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) { toast.error("Não foi possível entrar com Google."); return; }
    if (result.redirected) return;
    navigate({ to: target });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Radar className="h-5 w-5" /></div>
          <h1 className="text-xl font-semibold tracking-tight">SIPC</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sistema Inteligente de Prospecção Comercial</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold">
            {mode === "signin" ? "Entrar na sua conta" : mode === "signup" ? "Criar conta" : "Recuperar senha"}
          </h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  {mode === "signin" && (
                    <button type="button" className="text-xs text-primary hover:underline" onClick={() => setMode("forgot")}>Esqueci a senha</button>
                  )}
                </div>
                <Input id="password" type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
            </Button>
          </form>
          {mode !== "forgot" && (
            <>
              <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />ou<div className="h-px flex-1 bg-border" /></div>
              <Button variant="outline" className="w-full" onClick={google}>Continuar com Google</Button>
            </>
          )}
          <p className="mt-5 text-center text-xs text-muted-foreground">
            {mode === "signin" ? (
              <>Ainda não tem conta? <button className="text-primary hover:underline" onClick={() => setMode("signup")}>Criar conta</button></>
            ) : (
              <button className="text-primary hover:underline" onClick={() => setMode("signin")}>Voltar para o login</button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function translate(msg: string) {
  if (/invalid login/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/not confirmed/i.test(msg)) return "Confirme seu e-mail antes de entrar.";
  if (/already registered/i.test(msg)) return "Este e-mail já está cadastrado.";
  if (/password/i.test(msg)) return "Senha inválida. Use pelo menos 8 caracteres.";
  return "Não foi possível concluir. Tente novamente.";
}
