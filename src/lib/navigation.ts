import {
  LayoutDashboard, Search, Megaphone, Building2, ScanSearch, ListChecks,
  KanbanSquare, MessageSquareText, ShieldCheck, CalendarCheck, FileSignature,
  Sparkles, FileText, Tags, Plug, Settings, History, AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  description: string;
};
export type NavSection = { label: string; items: NavItem[] };

export const navSections: NavSection[] = [
  {
    label: "Visão geral",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, description: "Indicadores calculados a partir dos seus dados." }],
  },
  {
    label: "Prospecção",
    items: [
      { title: "Nova pesquisa", url: "/pesquisa", icon: Search, description: "Configure uma campanha de prospecção por nicho e cidade." },
      { title: "Campanhas", url: "/campanhas", icon: Megaphone, description: "Pesquisas criadas e seus resultados." },
      { title: "Empresas e leads", url: "/empresas", icon: Building2, description: "Empresas cadastradas e status comercial." },
      { title: "Auditorias digitais", url: "/auditorias", icon: ScanSearch, description: "Análises de presença digital e achados." },
      { title: "Fila de análise", url: "/fila", icon: ListChecks, description: "Empresas aguardando análise." },
    ],
  },
  {
    label: "Vendas",
    items: [
      { title: "CRM Kanban", url: "/crm", icon: KanbanSquare, description: "Pipeline comercial por estágio." },
      { title: "Mensagens e áudios", url: "/mensagens", icon: MessageSquareText, description: "Abordagens geradas e enviadas." },
      { title: "Aprovações pendentes", url: "/aprovacoes", icon: ShieldCheck, description: "Abordagens aguardando sua aprovação." },
      { title: "Tarefas", url: "/tarefas", icon: CalendarCheck, description: "Acompanhamentos e próximas ações." },
      { title: "Propostas e vendas", url: "/propostas", icon: FileSignature, description: "Propostas enviadas e vendas fechadas." },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { title: "Gerador de abordagens", url: "/gerador", icon: Sparkles, description: "Crie mensagens personalizadas com IA." },
      { title: "Modelos de mensagens", url: "/modelos", icon: FileText, description: "Modelos reutilizáveis de abordagem." },
      { title: "Serviços e preços", url: "/servicos", icon: Tags, description: "Catálogo de serviços oferecidos." },
      { title: "Integrações", url: "/integracoes", icon: Plug, description: "Status das fontes e serviços externos." },
    ],
  },
  {
    label: "Administração",
    items: [
      { title: "Configurações", url: "/configuracoes", icon: Settings, description: "Perfil e preferências." },
      { title: "Histórico de automações", url: "/automacoes", icon: History, description: "Execuções automáticas registradas." },
      { title: "Logs e erros", url: "/logs", icon: AlertTriangle, description: "Erros registrados pela aplicação." },
    ],
  },
];

export const allNavItems = navSections.flatMap((s) => s.items);
export function findNavItem(pathname: string) {
  return allNavItems.find((i) => pathname === i.url || pathname.startsWith(i.url + "/"));
}
