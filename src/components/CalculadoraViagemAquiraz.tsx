"use client";

import { useState, useMemo } from "react";

interface Passeio {
  id: string;
  nome: string;
  descricao: string;
  precoPessoa: number;
  temporada?: string;
}

const PASSEIOS: Passeio[] = [
  {
    id: "buggy-dunas",
    nome: "Passeio de Buggy nas Dunas Móveis",
    descricao: "Circuito pelas dunas de Porto das Dunas e Prainha com descida de esquibunda",
    precoPessoa: 180,
  },
  {
    id: "beach-park",
    nome: "Dia no Beach Park",
    descricao: "Maior parque aquático da América Latina com atrações radicais e infantis",
    precoPessoa: 290,
  },
  {
    id: "kitesurf-pacoti",
    nome: "Aula & Prática de Kitesurf no Rio Pacoti",
    descricao: "Instrutor credenciado em águas calmas e vento constante na foz do rio",
    precoPessoa: 220,
    temporada: "Julho a Dezembro",
  },
  {
    id: "resex-batoque",
    nome: "Expedição 4x4 à Reserva do Batoque",
    descricao: "Travessia costeira por praia selvagem, lagoas virgens e vilas de pescadores",
    precoPessoa: 200,
  },
  {
    id: "rota-historica",
    nome: "Rota Histórica (Museu Sacro + Engenhos)",
    descricao: "Primeira capital do Ceará, casario colonial do século XVII e degustação",
    precoPessoa: 80,
  },
  {
    id: "oficina-rendeiras",
    nome: "Vivência de Renda de Bilro na Prainha",
    descricao: "Visita guiada ao Centro das Rendeiras e aprendizado direto com as mestras",
    precoPessoa: 60,
  },
];

const PERFIS = [
  {
    id: "economico",
    nome: "Econômico & Rústico",
    diariaPessoa: 160,
    descricao: "Pousadas acolhedoras na Prainha ou Presídio, peixe fresco em barracas nativas e passeios livres.",
  },
  {
    id: "conforto",
    nome: "Conforto & Família",
    diariaPessoa: 340,
    descricao: "Flats e condomínios no Porto das Dunas, restaurantes com gastronomia litorânea e carro alugado.",
  },
  {
    id: "resort",
    nome: "Resort & Experiência",
    diariaPessoa: 680,
    descricao: "Resorts à beira-mar com estrutura completa de lazer, alta gastronomia de frutos do mar e transfers privativos.",
  },
];

export default function CalculadoraViagemAquiraz() {
  const [dias, setDias] = useState(4);
  const [pessoas, setPessoas] = useState(2);
  const [perfilId, setPerfilId] = useState("conforto");
  const [selecionados, setSelecionados] = useState<string[]>([
    "buggy-dunas",
    "beach-park",
  ]);

  const perfil = useMemo(
    () => PERFIS.find((p) => p.id === perfilId) ?? PERFIS[1],
    [perfilId]
  );

  const custoEstadia = useMemo(
    () => dias * pessoas * perfil.diariaPessoa,
    [dias, pessoas, perfil]
  );

  const custoPasseios = useMemo(() => {
    return selecionados.reduce((acc, id) => {
      const p = PASSEIOS.find((item) => item.id === id);
      return acc + (p ? p.precoPessoa * pessoas : 0);
    }, 0);
  }, [selecionados, pessoas]);

  const custoTotal = custoEstadia + custoPasseios;
  const porPessoa = Math.round(custoTotal / pessoas);
  const nf = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function alternarPasseio(id: string) {
    setSelecionados((atuais) =>
      atuais.includes(id) ? atuais.filter((item) => item !== id) : [...atuais, id]
    );
  }

  return (
    <section id="calculadora" className="border-b border-duna-3 bg-duna py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="olho">Planejamento Transparente</p>
          <h2 className="t1 mt-3 text-tinta">Quanto custa uma viagem a Aquiraz?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-tinta-2">
            Simule os custos reais de hospedagem, alimentação e passeios no Porto das Dunas
            e praias vizinhas, sem taxas ocultas ou números fabricados.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Controles */}
          <div className="space-y-8 rounded-lg border border-duna-3 bg-duna-2/60 p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-3">
                  Duração da Viagem
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDias((d) => Math.max(1, d - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-duna-3 bg-duna font-bold text-tinta hover:bg-duna-2"
                  >
                    -
                  </button>
                  <span className="font-serif text-xl font-bold text-tinta">
                    {dias} {dias === 1 ? "dia" : "dias"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDias((d) => Math.min(30, d + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-duna-3 bg-duna font-bold text-tinta hover:bg-duna-2"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-3">
                  Viajantes
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPessoas((p) => Math.max(1, p - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-duna-3 bg-duna font-bold text-tinta hover:bg-duna-2"
                  >
                    -
                  </button>
                  <span className="font-serif text-xl font-bold text-tinta">
                    {pessoas} {pessoas === 1 ? "pessoa" : "pessoas"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPessoas((p) => Math.min(10, p + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-duna-3 bg-duna font-bold text-tinta hover:bg-duna-2"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-3">
                Estilo de Viagem
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {PERFIS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPerfilId(p.id)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      perfilId === p.id
                        ? "border-esmeralda bg-duna shadow-xs ring-1 ring-esmeralda"
                        : "border-duna-3 bg-duna/50 hover:bg-duna"
                    }`}
                  >
                    <p className="text-sm font-bold text-tinta">{p.nome}</p>
                    <p className="mt-1 text-xs text-tinta-3">
                      ~{nf.format(p.diariaPessoa)}/dia por pessoa
                    </p>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-tinta-3">{perfil.descricao}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-3">
                Experiências e Passeios Selecionados
              </label>
              <div className="mt-3 space-y-2">
                {PASSEIOS.map((item) => {
                  const ativo = selecionados.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => alternarPasseio(item.id)}
                      className={`flex w-full items-center justify-between rounded-md border p-3 text-left transition-all ${
                        ativo
                          ? "border-esmeralda bg-duna shadow-2xs"
                          : "border-duna-3 bg-duna/40 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="pr-4">
                        <p className="text-sm font-semibold text-tinta">{item.nome}</p>
                        <p className="text-xs text-tinta-3">{item.descricao}</p>
                      </div>
                      <span className="shrink-0 font-serif text-sm font-bold text-esmeralda">
                        {nf.format(item.precoPessoa)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resumo Consolidado */}
          <div className="flex flex-col justify-between rounded-lg border border-duna-3 bg-duna p-6 sm:p-8 shadow-xs">
            <div>
              <p className="olho">Estimativa Total</p>
              <div className="mt-4 border-b border-duna-3 pb-6">
                <span className="font-serif text-4xl font-bold text-tinta sm:text-5xl">
                  {nf.format(custoTotal)}
                </span>
                <p className="mt-1 text-sm text-tinta-2">
                  equivalente a <strong className="text-esmeralda">{nf.format(porPessoa)}</strong> por viajante
                </p>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-tinta-2">
                  <span>Hospedagem & Alimentação ({dias} dias)</span>
                  <span className="font-medium text-tinta">{nf.format(custoEstadia)}</span>
                </div>
                <div className="flex justify-between text-tinta-2">
                  <span>Passeios ({selecionados.length} opções)</span>
                  <span className="font-medium text-tinta">{nf.format(custoPasseios)}</span>
                </div>
              </div>

              <div className="mt-8 rounded-md bg-duna-2 p-4 text-xs text-tinta-2 leading-relaxed">
                <strong className="text-tinta">Base de cálculo honesta:</strong> Os valores de diária
                englobam hospedagem média do perfil somada a duas refeições diárias e transporte
                local. Não inclui passagens aéreas.
              </div>
            </div>

            <div className="mt-8 border-t border-duna-3 pt-6">
              <a
                href="#destinos"
                className="btn-esmeralda w-full text-center"
              >
                Conhecer os Destinos do Roteiro
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
