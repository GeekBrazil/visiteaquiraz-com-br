import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Roteiros de Aquiraz (CE)",
  description:
    "Artigos, guias de praias, janela de ventos para kitesurf no Pacoti, história colonial de 1699 e roteiros práticos em Aquiraz e Porto das Dunas.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const artigos = await getArticles(true);

  return (
    <div className="min-h-screen bg-duna text-tinta">
      <header className="sticky top-0 z-40 border-b border-duna-3 bg-duna/90 backdrop-blur-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-bold tracking-tight text-tinta sm:text-2xl">
              Visite Aquiraz
            </span>
            <span className="hidden text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-esmeralda sm:inline">
              Blog Editorial
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-md border border-duna-3 px-3 py-1.5 text-xs font-semibold text-tinta-2 hover:border-esmeralda hover:text-esmeralda transition-colors"
            >
              Painel Admin
            </Link>
            <Link
              href="/"
              className="rounded-md bg-esmeralda px-4 py-2 text-xs font-semibold text-renda hover:bg-esmeralda-esc transition-colors"
            >
              ← Voltar à Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-14 lg:px-8 sm:py-20">
        <p className="olho">Litoral Leste do Ceará · Primeira Capital</p>
        <h1 className="t1 mt-3 text-tinta">Blog &amp; Guias de Aquiraz</h1>
        <p className="mt-4 max-w-2xl text-tinta-2 leading-relaxed">
          Roteiros de praias, cultura da renda de bilro, condições climáticas mensais e dicas
          para explorar Porto das Dunas, Prainha, Iguape, Presídio, Batoque e Rio Pacoti.
        </p>

        {artigos.length === 0 ? (
          <div className="mt-12 rounded-lg border border-dashed border-duna-3 bg-duna-2/40 p-10 text-center">
            <h2 className="font-serif text-xl font-bold text-tinta">
              Ainda não há artigos publicados
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-tinta-2">
              Acesse o painel web em <code className="font-mono">/admin</code> para publicar seu
              primeiro artigo ou gerar um roteiro automático imediatamente.
            </p>
            <Link href="/admin" className="btn-esmeralda mt-6 inline-flex text-xs">
              Ir para o Painel Web
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {artigos.map((artigo) => (
              <Link
                key={artigo.id}
                href={`/blog/${artigo.id}`}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-lg border border-duna-3 bg-duna-2/40 transition-colors hover:border-esmeralda hover:bg-duna"
              >
                <div>
                  {artigo.coverImage && (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-duna-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={artigo.coverImage}
                        alt={artigo.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sol-esc">
                        {artigo.category}
                      </span>
                      <time dateTime={artigo.publishedAt} className="text-xs text-tinta-3">
                        {new Date(artigo.publishedAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    <h2 className="mt-2 font-serif text-xl font-bold leading-snug text-tinta group-hover:text-esmeralda transition-colors">
                      {artigo.title}
                    </h2>

                    {artigo.summary && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-tinta-2">
                        {artigo.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-duna-3 px-6 py-3 text-xs font-semibold text-esmeralda">
                  <span>Ler artigo</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
