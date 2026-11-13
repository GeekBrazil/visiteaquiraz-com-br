import Link from "next/link";
import type { ArtigoBlog } from "@/lib/storage";

interface Props {
  artigos: ArtigoBlog[];
}

export default function UltimosArtigos({ artigos }: Props) {
  const recentes = artigos.slice(0, 3);

  return (
    <section id="blog" className="border-b border-duna-3 bg-duna py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="olho">Caderno de Aquiraz · Blog</p>
            <h2 className="t1 mt-3 text-tinta">Roteiros, marés e cultura local</h2>
            <p className="mt-3 max-w-2xl text-tinta-2 leading-relaxed">
              Guias atualizados sobre o litoral leste cearense, janela de ventos no Pacoti,
              história colonial e dicas práticas de visita.
            </p>
          </div>

          <Link href="/blog" className="btn-secundario text-xs">
            Ver todos os artigos →
          </Link>
        </div>

        {recentes.length === 0 ? (
          <div className="mt-10 rounded-lg border border-duna-3 bg-duna-2/40 p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-tinta">
                Publicações automáticas prontas para iniciar
              </h3>
              <p className="mt-1 text-sm text-tinta-2">
                O cron editorial gera novos roteiros de Aquiraz no piloto automático. Você também pode gerar o primeiro agora pelo painel.
              </p>
            </div>
            <Link href="/admin" className="btn-esmeralda text-xs">
              Abrir Painel Editorial
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {recentes.map((artigo) => (
              <Link
                key={artigo.id}
                href={`/blog/${artigo.id}`}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-lg border border-duna-3 bg-duna-2/40 transition-colors hover:border-esmeralda"
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
                    <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-sol-esc">
                      <span>{artigo.category}</span>
                      <time dateTime={artigo.publishedAt} className="text-tinta-3 font-normal">
                        {new Date(artigo.publishedAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </time>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-tinta group-hover:text-esmeralda transition-colors">
                      {artigo.title}
                    </h3>
                    {artigo.summary && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-tinta-2">
                        {artigo.summary}
                      </p>
                    )}
                  </div>
                </div>
                <div className="border-t border-duna-3 px-6 py-3 text-xs font-semibold text-esmeralda">
                  Ler roteiro completo →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
