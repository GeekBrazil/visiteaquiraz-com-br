import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artigo = await getArticleById(id);
  if (!artigo) return { title: "Artigo não encontrado" };

  return {
    title: artigo.title,
    description: artigo.summary || `${artigo.title} · Guia completo de Aquiraz (CE).`,
    alternates: { canonical: `/blog/${artigo.id}` },
    openGraph: {
      type: "article",
      title: artigo.title,
      description: artigo.summary,
      publishedTime: artigo.publishedAt,
      images: artigo.coverImage ? [{ url: artigo.coverImage }] : undefined,
    },
  };
}

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artigo = await getArticleById(id);
  if (!artigo) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artigo.title,
    description: artigo.summary,
    datePublished: artigo.publishedAt,
    image: artigo.coverImage ? [artigo.coverImage] : undefined,
    author: { "@type": "Person", name: "Allan Candido" },
    publisher: { "@type": "Organization", name: "Visite Aquiraz" },
    mainEntityOfPage: `https://visiteaquiraz.com.br/blog/${artigo.id}`,
  };

  return (
    <div className="min-h-screen bg-duna text-tinta">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="sticky top-0 z-40 border-b border-duna-3 bg-duna/90 backdrop-blur-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link href="/blog" className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-bold text-tinta">
              Visite Aquiraz
            </span>
            <span className="text-xs font-mono text-esmeralda">/ blog</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="rounded-md border border-duna-3 px-3.5 py-1.5 text-xs font-semibold text-tinta-2 hover:border-esmeralda hover:text-esmeralda transition-colors"
            >
              ← Todos os artigos
            </Link>
            <Link
              href="/"
              className="rounded-md bg-esmeralda px-3.5 py-1.5 text-xs font-semibold text-renda hover:bg-esmeralda-esc transition-colors"
            >
              Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-sol/30 bg-sol-claro px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sol-esc">
            {artigo.category}
          </span>
          <time dateTime={artigo.publishedAt} className="text-xs text-tinta-3">
            {new Date(artigo.publishedAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>

        <h1 className="t1 mt-4 text-tinta">{artigo.title}</h1>

        {artigo.summary && (
          <p className="mt-5 text-lg leading-relaxed text-tinta-2">{artigo.summary}</p>
        )}

        {artigo.coverImage && (
          <figure className="mt-8 overflow-hidden rounded-lg border border-duna-3 bg-duna-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artigo.coverImage}
              alt={artigo.title}
              fetchPriority="high"
              className="max-h-[28rem] w-full object-cover"
            />
          </figure>
        )}

        <hr className="my-8 border-duna-3" />

        <article
          className="prose-editorial text-base leading-relaxed text-tinta-2"
          dangerouslySetInnerHTML={{ __html: artigo.content }}
        />

        {artigo.tags && artigo.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-duna-3 pt-6">
            {artigo.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-duna-3 bg-duna-2/60 px-3 py-1 text-xs font-medium text-tinta-2"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-duna-3 bg-duna-2/50 p-6">
          <div>
            <p className="font-serif text-base font-bold text-tinta">
              Planejando sua ida para Aquiraz?
            </p>
            <p className="mt-1 text-xs text-tinta-2">
              Explore o mapa interativo das praias e calcule os custos da viagem.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/#mapa" className="btn-secundario px-4 py-2 text-xs">
              Ver Mapa
            </Link>
            <Link href="/#calculadora" className="btn-esmeralda px-4 py-2 text-xs">
              Calcular Viagem
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
