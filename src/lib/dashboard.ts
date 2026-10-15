import { supabase } from "@/integrations/supabase/client";

export type Period = "7" | "30" | "90" | "all";

function since(period: Period) {
  if (period === "all") return null;
  return new Date(Date.now() - Number(period) * 86400000).toISOString();
}

async function count(table: Parameters<typeof supabase.from>[0], apply?: (q: any) => any) {
  let q: any = supabase.from(table).select("id", { count: "exact", head: true });
  if (apply) q = apply(q);
  const { count: c, error } = await q;
  if (error) throw error;
  return c ?? 0;
}

/** All dashboard numbers come from the database — nothing is estimated. */
export async function fetchDashboard(period: Period) {
  const from = since(period);
  const inPeriod = (col: string) => (q: any) => (from ? q.gte(col, from) : q);

  const [
    totalCompanies, foundInPeriod, analyzed, qualified, review, pendingApprovals,
    contacts, replies, proposalsSent, salesClosed,
  ] = await Promise.all([
    count("companies", (q) => q.is("archived_at", null)),
    count("companies", inPeriod("first_discovered_at")),
    count("companies", (q) => q.eq("analysis_status", "analyzed")),
    count("companies", (q) => q.in("commercial_status", ["qualified", "approach_ready", "contacted", "replied", "meeting", "proposal_sent", "negotiation", "won"])),
    count("companies", (q) => q.eq("commercial_status", "review")),
    count("outreach_drafts", (q) => q.eq("status", "pending_approval")),
    count("interactions", (q) => inPeriod("occurred_at")(q.eq("direction", "outbound"))),
    count("interactions", (q) => inPeriod("occurred_at")(q.eq("direction", "inbound"))),
    count("proposals", (q) => inPeriod("sent_at")(q.not("sent_at", "is", null))),
    count("sales", (q) => inPeriod("closed_at")(q.neq("status", "cancelled"))),
  ]);

  let salesQ = supabase.from("sales").select("contracted_amount, closed_at").neq("status", "cancelled");
  if (from) salesQ = salesQ.gte("closed_at", from);
  const { data: salesRows, error: sErr } = await salesQ;
  if (sErr) throw sErr;
  const revenue = (salesRows ?? []).reduce((a, r) => a + Number(r.contracted_amount), 0);

  const { data: companies, error: cErr } = await supabase
    .from("companies")
    .select("niche, city, commercial_status, first_discovered_at")
    .is("archived_at", null)
    .limit(5000);
  if (cErr) throw cErr;

  const group = (key: "niche" | "city" | "commercial_status") => {
    const m = new Map<string, number>();
    for (const c of companies ?? []) {
      const k = (c[key] as string | null) || "Não informado";
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

  const byDay = new Map<string, number>();
  for (const c of companies ?? []) {
    if (from && c.first_discovered_at < from) continue;
    const d = c.first_discovered_at.slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + 1);
  }
  const leadsOverTime = [...byDay.entries()].sort().map(([date, value]) => ({ date, value }));

  return {
    metrics: {
      totalCompanies, foundInPeriod, analyzed, qualified, review, pendingApprovals,
      contacts, replies, proposalsSent, salesClosed, revenue,
      conversion: totalCompanies > 0 ? (salesClosed / totalCompanies) * 100 : null,
    },
    byStage: group("commercial_status"),
    byNiche: group("niche").slice(0, 8),
    byCity: group("city").slice(0, 8),
    leadsOverTime,
  };
}

export async function fetchRecent() {
  const soon = new Date(Date.now() + 3 * 86400000).toISOString();
  const [jobs, audits, approvals, interactions, tasks, failures] = await Promise.all([
    supabase.from("search_jobs").select("id, name, city, status, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("digital_audits").select("id, audit_type, status, created_at, companies(name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("outreach_drafts").select("id, channel, created_at, companies(name)").eq("status", "pending_approval").order("created_at", { ascending: false }).limit(5),
    supabase.from("interactions").select("id, interaction_type, direction, occurred_at, companies(name)").order("occurred_at", { ascending: false }).limit(5),
    supabase.from("tasks").select("id, title, due_at, priority").in("status", ["open", "in_progress"]).not("due_at", "is", null).lte("due_at", soon).order("due_at").limit(5),
    supabase.from("automation_runs").select("id, job_type, safe_error_message, created_at").eq("status", "failed").order("created_at", { ascending: false }).limit(5),
  ]);
  for (const r of [jobs, audits, approvals, interactions, tasks, failures]) if (r.error) throw r.error;
  return {
    jobs: jobs.data ?? [], audits: audits.data ?? [], approvals: approvals.data ?? [],
    interactions: interactions.data ?? [], tasks: tasks.data ?? [], failures: failures.data ?? [],
  };
}
