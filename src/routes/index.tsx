import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIPC — Sistema Inteligente de Prospecção Comercial" },
      { name: "description", content: "Encontre, analise e aborde empresas com IA, com controle total sobre cada mensagem." },
      { property: "og:title", content: "SIPC — Sistema Inteligente de Prospecção Comercial" },
      { property: "og:description", content: "Encontre, analise e aborde empresas com IA, com controle total sobre cada mensagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
