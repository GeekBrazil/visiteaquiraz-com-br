"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { FotoGaleria } from "@/lib/storage";

interface Props {
  fotos: FotoGaleria[];
}

export default function GaleriaFotos({ fotos }: Props) {
  const [filtroLocal, setFiltroLocal] = useState<string>("todos");
  const [ativaIdx, setAtivaIdx] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const locaisDisponiveis = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const f of fotos) {
      if (!mapa.has(f.localSlug)) mapa.set(f.localSlug, f.localNome);
    }
    return Array.from(mapa.entries()).map(([slug, nome]) => ({ slug, nome }));
  }, [fotos]);

  const visiveis = useMemo(() => {
    if (filtroLocal === "todos") return fotos;
    return fotos.filter((f) => f.localSlug === filtroLocal);
  }, [fotos, filtroLocal]);

  const fotoAtiva = ativaIdx !== null ? visiveis[ativaIdx] ?? null : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (ativaIdx !== null && !dialog.open) {
      dialog.showModal();
    } else if (ativaIdx === null && dialog.open) {
      dialog.close();
    }
  }, [ativaIdx]);

  // Fallback para light-dismiss em navegadores sem <dialog closedby="any">
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    const outside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };

    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = outside(e);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && outside(e)) dialog.close();
    };

    dialog.addEventListener("pointerdown", onDown);
    dialog.addEventListener("pointerup", onUp);
    return () => {
      dialog.removeEventListener("pointerdown", onDown);
      dialog.removeEventListener("pointerup", onUp);
    };
  }, [fotoAtiva]);

  return (
    <section id="galeria" className="border-b border-duna-3 bg-duna-2/35 py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="olho">Acervo Fotográfico · Cloudflare R2</p>
            <h2 className="t1 mt-3 text-tinta">Olhar real sobre Aquiraz</h2>
            <p className="mt-3 max-w-2xl text-tinta-2 leading-relaxed">
              Registros autorais das praias, dunas, jangadas e lagoas ao longo dos 36 km
              de costa entre o Porto das Dunas e a Reserva do Batoque.
            </p>
          </div>

          <Link
            href="/admin"
            className="text-xs font-semibold uppercase tracking-wider text-esmeralda hover:text-esmeralda-esc transition-colors"
          >
            Gerenciar acervo →
          </Link>
        </div>

        {fotos.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-duna-3 bg-duna p-10 text-center">
            <p className="font-serif text-lg font-semibold text-tinta">
              Galeria pronta para receber suas fotos
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-tinta-2">
              Envie suas imagens pelo painel administrativo para armazená-las na CDN do
              Cloudflare R2 e exibi-las automaticamente aqui.
            </p>
            <Link href="/admin" className="btn-esmeralda mt-6 inline-flex text-xs">
              Postar primeiras fotos no R2
            </Link>
          </div>
        ) : (
          <>
            {locaisDisponiveis.length > 1 && (
              <div
                className="mt-8 flex flex-wrap gap-2"
                role="group"
                aria-label="Filtrar fotos por praia ou região"
              >
                <button
                  type="button"
                  onClick={() => {
                    setAtivaIdx(null);
                    setFiltroLocal("todos");
                  }}
                  aria-pressed={filtroLocal === "todos"}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    filtroLocal === "todos"
                      ? "bg-esmeralda text-renda"
                      : "border border-duna-3 bg-duna text-tinta-2 hover:border-esmeralda"
                  }`}
                >
                  Todas ({fotos.length})
                </button>
                {locaisDisponiveis.map((loc) => (
                  <button
                    key={loc.slug}
                    type="button"
                    onClick={() => {
                      setAtivaIdx(null);
                      setFiltroLocal(loc.slug);
                    }}
                    aria-pressed={filtroLocal === loc.slug}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      filtroLocal === loc.slug
                        ? "bg-esmeralda text-renda"
                        : "border border-duna-3 bg-duna text-tinta-2 hover:border-esmeralda"
                    }`}
                  >
                    {loc.nome}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visiveis.map((foto, idx) => (
                <article
                  key={foto.id}
                  className="group overflow-hidden rounded-lg border border-duna-3 bg-duna transition-colors hover:border-esmeralda/60"
                >
                  <button
                    type="button"
                    onClick={() => setAtivaIdx(idx)}
                    className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-esmeralda"
                    aria-label={`Ampliar foto: ${foto.titulo}`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-duna-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={foto.url}
                        alt={foto.titulo}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute bottom-3 left-3 rounded bg-tinta/85 px-2.5 py-1 text-[11px] font-semibold text-renda">
                        {foto.localNome}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base font-bold text-tinta">
                        {foto.titulo}
                      </h3>
                      {foto.legenda && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-tinta-2">
                          {foto.legenda}
                        </p>
                      )}
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <dialog
        ref={dialogRef}
        {...({ closedby: "any" } as Record<string, string>)}
        aria-labelledby="lightbox-titulo"
        onClose={() => setAtivaIdx(null)}
        className="m-auto w-[min(94vw,56rem)] rounded-lg border border-duna-3 bg-duna p-0 text-tinta shadow-2xl"
      >
        {fotoAtiva && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-duna-3 px-5 py-3.5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-esmeralda">
                  {fotoAtiva.localNome}
                </p>
                <h3 id="lightbox-titulo" className="font-serif text-lg font-bold text-tinta">
                  {fotoAtiva.titulo}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="rounded-md border border-duna-3 bg-duna-2 px-3 py-1.5 text-xs font-semibold text-tinta hover:border-esmeralda"
              >
                Fechar
              </button>
            </div>

            <div className="bg-tinta/5 p-3 sm:p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotoAtiva.url}
                alt={fotoAtiva.titulo}
                className="mx-auto max-h-[68vh] w-auto rounded object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-duna-3 px-5 py-3.5">
              <p className="text-xs text-tinta-2">
                {fotoAtiva.legenda || `Registro em ${fotoAtiva.localNome}, Aquiraz (CE).`}
              </p>

              {visiveis.length > 1 && ativaIdx !== null && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAtivaIdx((ativaIdx - 1 + visiveis.length) % visiveis.length)
                    }
                    className="rounded border border-duna-3 px-3 py-1.5 text-xs font-semibold text-tinta hover:border-esmeralda"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setAtivaIdx((ativaIdx + 1) % visiveis.length)}
                    className="rounded border border-duna-3 px-3 py-1.5 text-xs font-semibold text-tinta hover:border-esmeralda"
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
