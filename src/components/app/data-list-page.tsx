import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, PageHeader, StatusBadge } from "./ui-states";
import { fmtDate } from "@/lib/status";

type TableName = keyof Database["public"]["Tables"];
type Row = Record<string, unknown>;

export type Column = {
  key: string;
  label: string;
  type?: "text" | "status" | "date" | "money";
  render?: (row: Row) => ReactNode;
};

const PAGE = 25;

export function DataListPage(props: {
  title: string;
  description: string;
  table: TableName;
  columns: Column[];
  select?: string;
  filter?: { column: string; op: "eq" | "in"; value: string | string[] };
  orderBy?: string;
  emptyIcon?: LucideIcon;
  emptyTitle: string;
  emptyDescription: ReactNode;
  actions?: ReactNode;
  notice?: ReactNode;
}) {
  const [page, setPage] = useState(0);
  const q = useQuery({
    queryKey: ["list", props.table, props.filter, page],
    queryFn: async () => {
      let query = supabase
        .from(props.table)
        .select(props.select ?? "*", { count: "exact" })
        .order(props.orderBy ?? "created_at", { ascending: false })
        .range(page * PAGE, page * PAGE + PAGE - 1);
      if (props.filter) {
        query = props.filter.op === "eq"
          ? query.eq(props.filter.column, props.filter.value as string)
          : query.in(props.filter.column, props.filter.value as string[]);
      }
      const { data, error, count } = await query;
      if (error) throw error;
      return { rows: (data ?? []) as unknown as Row[], count: count ?? 0 };
    },
  });

  const pages = Math.max(1, Math.ceil((q.data?.count ?? 0) / PAGE));

  return (
    <div>
      <PageHeader title={props.title} description={props.description} actions={props.actions} />
      {props.notice}
      {q.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-11 animate-pulse rounded-md bg-card" />)}
        </div>
      ) : q.isError ? (
        <ErrorState message={(q.error as Error).message} onRetry={() => q.refetch()} />
      ) : q.data!.rows.length === 0 ? (
        <EmptyState icon={props.emptyIcon} title={props.emptyTitle} description={props.emptyDescription} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>{props.columns.map((c) => <th key={c.key} className="px-4 py-2.5 font-medium">{c.label}</th>)}</tr>
              </thead>
              <tbody>
                {q.data!.rows.map((row) => (
                  <tr key={String(row["id"])} className="border-b border-border last:border-0 hover:bg-muted/30">
                    {props.columns.map((c) => (
                      <td key={c.key} className="px-4 py-2.5">{renderCell(c, row)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
            <span>{q.data!.count} registro(s)</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage((p) => p - 1)} aria-label="Página anterior"><ChevronLeft className="h-4 w-4" /></Button>
              <span>{page + 1} / {pages}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)} aria-label="Próxima página"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderCell(c: Column, row: Row): ReactNode {
  if (c.render) return c.render(row);
  const v = row[c.key];
  if (c.type === "status") return <StatusBadge value={v as string} />;
  if (c.type === "date") return <span className="text-muted-foreground">{fmtDate(v as string)}</span>;
  if (c.type === "money") return <span className="font-mono tabular-nums">{Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>;
  if (v === null || v === undefined || v === "") return <span className="text-muted-foreground">—</span>;
  return String(v);
}

export function PhaseNotice({ phase, children }: { phase: number; children: ReactNode }) {
  return (
    <div className="mb-4 rounded-lg border border-info/25 bg-info/5 px-4 py-3 text-sm text-muted-foreground">
      <span className="mr-2 rounded bg-info/15 px-1.5 py-0.5 text-xs font-medium text-info">Fase {phase}</span>
      {children}
    </div>
  );
}
