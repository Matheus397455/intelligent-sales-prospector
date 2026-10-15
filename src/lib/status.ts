export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "primary";

const map: Record<string, { label: string; tone: Tone }> = {
  // commercial
  new: { label: "Novo", tone: "neutral" },
  qualified: { label: "Qualificado", tone: "primary" },
  review: { label: "Em revisão", tone: "warning" },
  approach_ready: { label: "Abordagem pronta", tone: "info" },
  contacted: { label: "Contatado", tone: "info" },
  replied: { label: "Respondeu", tone: "success" },
  meeting: { label: "Reunião", tone: "info" },
  proposal_sent: { label: "Proposta enviada", tone: "primary" },
  negotiation: { label: "Negociação", tone: "warning" },
  won: { label: "Ganho", tone: "success" },
  lost: { label: "Perdido", tone: "danger" },
  discarded: { label: "Descartado", tone: "neutral" },
  // generic
  draft: { label: "Rascunho", tone: "neutral" },
  queued: { label: "Na fila", tone: "neutral" },
  running: { label: "Executando", tone: "info" },
  analyzing: { label: "Analisando", tone: "info" },
  completed: { label: "Concluída", tone: "success" },
  succeeded: { label: "Sucesso", tone: "success" },
  analyzed: { label: "Analisada", tone: "success" },
  failed: { label: "Falhou", tone: "danger" },
  cancelled: { label: "Cancelada", tone: "neutral" },
  pending: { label: "Pendente", tone: "warning" },
  pending_approval: { label: "Aguardando aprovação", tone: "warning" },
  approved: { label: "Aprovada", tone: "success" },
  rejected: { label: "Rejeitada", tone: "danger" },
  sent: { label: "Enviada", tone: "info" },
  accepted: { label: "Aceita", tone: "success" },
  expired: { label: "Expirada", tone: "neutral" },
  open: { label: "Aberta", tone: "warning" },
  in_progress: { label: "Em andamento", tone: "info" },
  done: { label: "Concluída", tone: "success" },
  paid: { label: "Paga", tone: "success" },
  partially_paid: { label: "Parcial", tone: "warning" },
  not_configured: { label: "Não configurada", tone: "neutral" },
  configured: { label: "Configurada", tone: "success" },
  error: { label: "Erro", tone: "danger" },
  warning: { label: "Aviso", tone: "warning" },
  info: { label: "Info", tone: "info" },
  disabled: { label: "Desativada", tone: "neutral" },
  low: { label: "Baixa", tone: "neutral" },
  medium: { label: "Média", tone: "warning" },
  high: { label: "Alta", tone: "danger" },
  urgent: { label: "Urgente", tone: "danger" },
  critical: { label: "Crítica", tone: "danger" },
};

export function statusInfo(value: string | null | undefined) {
  if (!value) return { label: "—", tone: "neutral" as Tone };
  return map[value] ?? { label: value, tone: "neutral" as Tone };
}

export const pipelineStages = [
  "new", "qualified", "review", "approach_ready", "contacted", "replied",
  "meeting", "proposal_sent", "negotiation", "won", "lost",
] as const;

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";
