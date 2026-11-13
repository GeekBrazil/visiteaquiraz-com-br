import Revelar from "@/components/Revelar";

const POLOS_COSTA = [
  { nome: "Porto das Dunas", tag: "Dunas & Resorts", km: "0 km" },
  { nome: "Prainha", tag: "Renda de Bilro", km: "9 km" },
  { nome: "Presídio", tag: "Enseada Mansa", km: "15 km" },
  { nome: "Iguape & Barro Preto", tag: "Jangadas", km: "22 km" },
  { nome: "Resex do Batoque", tag: "Dunas Virgens", km: "36 km" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-duna-3 bg-duna pt-8 pb-14 sm:pt-12 sm:pb-18">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Revelar>
          <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-center">
            {/* Coluna Editorial Principal */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="olho">Litoral Leste do Ceará</span>
                <span className="h-3 w-px bg-duna-3" aria-hidden="true" />
                <span className="olho-sol">Primeira Capital (1699)</span>
              </div>

              <h1 className="display mt-4 max-w-[18ch] text-tinta">
                Dunas móveis, mar esmeralda e a terra onde o{" "}
                <em className="not-italic text-esmeralda">Ceará começou</em>.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-tinta-2 sm:text-lg">
                A 25 minutos de Fortaleza, Aquiraz combina a infraestrutura de resorts e lazer
                do Porto das Dunas com a preservação secular da renda de bilro na Prainha,
                as águas calmas do Presídio e o berço colonial da capitania.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#destinos" className="btn-esmeralda">
                  Explorar as Praias
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <a href="#mapa" className="btn-secundario">
                  Ver Mapa de Acesso
                </a>
                <a href="#calculadora" className="btn-secundario">
                  Calcular Custos
                </a>
              </div>

              <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-duna-3 pt-5">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-tinta-3">Litoral</dt>
                  <dd className="font-serif text-2xl font-bold text-tinta sm:text-3xl">
                    36 km
                    <span className="mt-0.5 block font-sans text-xs font-normal text-tinta-3">praias contínuas</span>
                  </dd>
                </div>
                <div className="border-l border-duna-3 pl-4">
                  <dt className="text-xs uppercase tracking-wider text-tinta-3">Sol</dt>
                  <dd className="font-serif text-2xl font-bold text-sol-esc sm:text-3xl">
                    300+
                    <span className="mt-0.5 block font-sans text-xs font-normal text-tinta-3">dias/ano</span>
                  </dd>
                </div>
                <div className="border-l border-duna-3 pl-4">
                  <dt className="text-xs uppercase tracking-wider text-tinta-3">Distância</dt>
                  <dd className="font-serif text-2xl font-bold text-esmeralda sm:text-3xl">
                    22 km
                    <span className="mt-0.5 block font-sans text-xs font-normal text-tinta-3">de Fortaleza</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Coluna Direita: Carta Costeira Interativa + Emblema 3D */}
            <aside className="rounded-xl border border-duna-3 bg-renda p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between gap-3 border-b border-duna-2 pb-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icon-192.png"
                    alt=""
                    width={46}
                    height={46}
                    fetchPriority="high"
                    className="h-11 w-11 rounded-xl border border-duna-3 object-cover shrink-0 shadow-2xs"
                  />
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-esmeralda">
                      Carta Náutica · Aquiraz
                    </span>
                    <strong className="font-serif text-base font-bold text-tinta">
                      Rota dos 36 km de Litoral
                    </strong>
                  </div>
                </div>
                <span className="rounded-full bg-esmeralda-claro px-2.5 py-1 text-[11px] font-semibold text-esmeralda">
                  CE-025 / CE-040
                </span>
              </div>

              {/* Traço vetorial animado da costa leste */}
              <div className="relative my-4 overflow-hidden rounded-lg border border-duna-2 bg-duna p-3">
                <svg
                  viewBox="0 0 360 150"
                  className="h-36 w-full"
                  role="img"
                  aria-label="Mapa esquemático dos cinco trechos litorâneos de Aquiraz, de Porto das Dunas ao Batoque"
                >
                  <defs>
                    <linearGradient id="mar-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0a7e82" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#d98218" stopOpacity="0.06" />
                    </linearGradient>
                  </defs>
                  {/* Faixa Atlântico */}
                  <path
                    d="M0,0 L360,0 L360,150 C250,115 160,82 58,28 L20,0 Z"
                    fill="url(#mar-grad)"
                  />
                  {/* Linha costeira animada na entrada */}
                  <path
                    d="M36,24 C105,52 162,74 214,92 C258,107 298,118 332,126"
                    fill="none"
                    stroke="#0a7e82"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="traco-costa-svg"
                  />
                  {/* Pontos geográficos proporcionais NW -> SE */}
                  <g fill="#0a7e82" stroke="#ffffff" strokeWidth="2">
                    <circle cx="44" cy="28" r="5.5" />
                    <circle cx="116" cy="56" r="5" />
                    <circle cx="184" cy="82" r="5" />
                    <circle cx="252" cy="105" r="5" />
                    <circle cx="322" cy="123" r="5.5" fill="#d98218" />
                  </g>
                  <g fontSize="9.5" fontWeight="600" fill="#142326">
                    <text x="52" y="23">Porto das Dunas</text>
                    <text x="122" y="51">Prainha</text>
                    <text x="188" y="76">Presídio</text>
                    <text x="242" y="96">Iguape</text>
                    <text x="275" y="140" fill="#b3660d">Batoque (36 km)</text>
                  </g>
                </svg>
              </div>

              <ol className="space-y-2">
                {POLOS_COSTA.map((polo, i) => (
                  <li key={polo.nome}>
                    <a
                      href="#destinos"
                      className="flex items-center justify-between rounded-md border border-duna-2 bg-duna/60 px-3 py-2 text-xs transition-colors hover:border-esmeralda/50 hover:bg-esmeralda-claro/40"
                    >
                      <span className="flex items-center gap-2 font-semibold text-tinta">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-esmeralda text-[10px] font-bold text-renda">
                          {i + 1}
                        </span>
                        {polo.nome}
                      </span>
                      <span className="text-[11px] text-tinta-3">
                        {polo.tag} &bull; {polo.km}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
