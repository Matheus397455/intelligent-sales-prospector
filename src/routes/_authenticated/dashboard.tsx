import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Building2, Radar, ScanSearch, Star, Clock, ShieldCheck, Send, MessageCircle,
  FileSignature, Trophy, Wallet, Percent, Search,
} from "lucide-react";
import { fetchDashboard, fetchRecent, type Period } from "@/lib/dashboard";
import { EmptyState, ErrorState, MetricCard, PageHeader, SectionCard, StatusBadge } from "@/components/app/ui-states";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brl, fmtDate, statusInfo } from "@/lib/status";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SIPC" }, { name: "description", content: "Indicadores de prospecção e vendas." }] }),
  component: Dashboard,
});

const tooltipStyle = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)" };

function Dashboard() {
  const [period, setPeriod] = useState<Period>("30");
  const d = useQuery({ queryKey: ["dashboard", period], queryFn: () => fetchDashboard(period) });
  const r = useQuery({ queryKey: ["dashboard-recent"], queryFn: fetchRecent });
  const m = d.data?.metrics;
  const L = d.isLoading;
  const periodLabel = period === "all" ? "desde o início" : `últimos ${period} dias`;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Todos os números são calculados a partir dos seus dados."
        actions={
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="all">Todo o período</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {d.isError ? <ErrorState message={(d.error as Error).message} onRetry={() => d.refetch()} /> : (
        <>
          {!L && m && m.totalCompanies === 0 && (
            <div className="mb-6">
              <EmptyState
                icon={Radar}
                title="Seu painel ainda está vazio"
                description="Os indicadores aparecem quando houver empresas cadastradas. Comece configurando uma pesquisa por nicho e cidade."
                action={<Button asChild><Link to="/pesquisa"><Search className="mr-2 h-4 w-4" />Configurar nova pesquisa</Link></Button>}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <MetricCard loading={L} label="Empresas cadastradas" value={m?.totalCompanies} icon={Building2} />
            <MetricCard loading={L} label="Encontradas" value={m?.foundInPeriod} hint={periodLabel} icon={Radar} />
            <MetricCard loading={L} label="Analisadas" value={m?.analyzed} icon={ScanSearch} />
            <MetricCard loading={L} label="Leads qualificados" value={m?.qualified} icon={Star} />
            <MetricCard loading={L} label="Aguardando revisão" value={m?.review} icon={Clock} />
            <MetricCard loading={L} label="Aguardando aprovação" value={m?.pendingApprovals} icon={ShieldCheck} />
            <MetricCard loading={L} label="Contatos realizados" value={m?.contacts} hint={periodLabel} icon={Send} />
            <MetricCard loading={L} label="Respostas recebidas" value={m?.replies} hint={periodLabel} icon={MessageCircle} />
            <MetricCard loading={L} label="Propostas enviadas" value={m?.proposalsSent} hint={periodLabel} icon={FileSignature} />
            <MetricCard loading={L} label="Vendas fechadas" value={m?.salesClosed} hint={periodLabel} icon={Trophy} />
            <MetricCard loading={L} label="Receita registrada" value={m ? brl(m.revenue) : ""} hint={periodLabel} icon={Wallet} />
            <MetricCard loading={L} label="Taxa de conversão" value={m?.conversion == null ? "—" : `${m.conversion.toFixed(1)}%`} icon={Percent} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <SectionCard title="Leads encontrados por dia">
              {d.data && d.data.leadsOverTime.length > 1 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={d.data.leadsOverTime}>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => v.slice(5)} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} width={30} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="value" name="Leads" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <ChartEmpty />}
            </SectionCard>
            <SectionCard title="Distribuição por estágio">
              <Bars data={d.data?.byStage.map((s) => ({ ...s, name: statusInfo(s.name).label }))} />
            </SectionCard>
            <SectionCard title="Empresas por nicho"><Bars data={d.data?.byNiche} /></SectionCard>
            <SectionCard title="Empresas por cidade"><Bars data={d.data?.byCity} /></SectionCard>
          </div>
        </>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold text-muted-foreground">Atividades recentes</h2>
      {r.isError ? <ErrorState onRetry={() => r.refetch()} /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Recent title="Últimas pesquisas" items={r.data?.jobs.map((j) => ({ id: j.id, main: j.name, sub: j.city ?? "", badge: j.status, date: j.created_at }))} />
          <Recent title="Últimas análises" items={r.data?.audits.map((a) => ({ id: a.id, main: (a.companies as { name: string } | null)?.name ?? "—", sub: a.audit_type, badge: a.status, date: a.created_at }))} />
          <Recent title="Aprovações pendentes" items={r.data?.approvals.map((a) => ({ id: a.id, main: (a.companies as { name: string } | null)?.name ?? "—", sub: a.channel, badge: "pending_approval", date: a.created_at }))} />
          <Recent title="Últimas interações" items={r.data?.interactions.map((i) => ({ id: i.id, main: (i.companies as { name: string } | null)?.name ?? "—", sub: `${i.interaction_type} · ${i.direction === "inbound" ? "recebida" : "enviada"}`, date: i.occurred_at }))} />
          <Recent title="Tarefas a vencer (3 dias)" items={r.data?.tasks.map((t) => ({ id: t.id, main: t.title, badge: t.priority, date: t.due_at }))} />
          <Recent title="Erros de automação" items={r.data?.failures.map((f) => ({ id: f.id, main: f.job_type, sub: f.safe_error_message ?? "", badge: "failed", date: f.created_at }))} />
        </div>
      )}
    </div>
  );
}

function ChartEmpty() {
  return <div className="flex h-[220px] items-center justify-center text-center text-sm text-muted-foreground">Ainda não há dados suficientes para este gráfico.</div>;
}

function Bars({ data }: { data?: { name: string; value: number }[] }) {
  if (!data || data.length === 0) return <ChartEmpty />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
        <CartesianGrid stroke="var(--border)" horizontal={false} />
        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
        <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} width={110} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="value" name="Empresas" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Recent({ title, items }: { title: string; items?: { id: string; main: string; sub?: string; badge?: string; date: string | null }[] }) {
  return (
    <SectionCard title={title}>
      {!items ? <div className="h-16 animate-pulse rounded bg-muted" /> : items.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">Nenhum registro ainda.</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((i) => (
            <li key={i.id} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0">
                <div className="truncate font-medium">{i.main}</div>
                <div className="truncate text-xs text-muted-foreground">{i.sub ? `${i.sub} · ` : ""}{fmtDate(i.date)}</div>
              </div>
              {i.badge && <StatusBadge value={i.badge} />}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
