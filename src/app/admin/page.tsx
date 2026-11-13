import type { Metadata } from "next";
import AdminPainel from "@/components/admin/AdminPainel";
import { isAdminSessionServer } from "@/lib/auth";
import { listarPautasDisponiveis } from "@/lib/blogGenerator";
import { getArticles, getFotos } from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Painel Admin · Fotos R2 & Blog",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authenticated = await isAdminSessionServer();
  const [fotos, artigos] = authenticated
    ? await Promise.all([getFotos(), getArticles(false)])
    : [[], []];

  return (
    <AdminPainel
      initialAuth={authenticated}
      initialFotos={fotos}
      initialArtigos={artigos}
      pautas={listarPautasDisponiveis()}
    />
  );
}
