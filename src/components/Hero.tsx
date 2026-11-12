import Revelar from "@/components/Revelar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-duna-3 bg-duna pt-14 pb-16 sm:pt-20 sm:pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Revelar>
          <div className="flex flex-wrap items-center gap-3">
            <span className="olho">Litoral Leste do Ceará</span>
            <span className="h-3 w-px bg-duna-3" aria-hidden="true" />
            <span className="olho-sol">Primeira Capital (1699)</span>
          </div>

          <h1 className="display mt-6 max-w-[17ch] text-tinta">
            Dunas móveis, mar esmeralda e a terra onde o{" "}
            <em className="not-italic text-esmeralda">Ceará começou</em>.
          </h1>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <p className="text-lg leading-relaxed text-tinta-2 sm:text-xl">
              A 25 minutos de Fortaleza, Aquiraz combina a infraestrutura de resorts e lazer
              do Porto das Dunas com a preservação secular da renda de bilro na Prainha,
              as águas calmas do Presídio e o berço colonial da capitania.
            </p>

            <dl className="grid grid-cols-3 gap-4 border-t border-duna-3 pt-6 md:border-0 md:pt-0">
              <div className="border-l border-duna-3 pl-4">
                <dt className="text-xs uppercase tracking-wider text-tinta-3">Litoral</dt>
                <dd className="font-serif text-2xl font-bold text-tinta sm:text-3xl">36 km</dd>
                <span className="text-xs text-tinta-3">de praias contínuas</span>
              </div>
              <div className="border-l border-duna-3 pl-4">
                <dt className="text-xs uppercase tracking-wider text-tinta-3">Sol</dt>
                <dd className="font-serif text-2xl font-bold text-sol sm:text-3xl">300+</dd>
                <span className="text-xs text-tinta-3">dias ensolarados/ano</span>
              </div>
              <div className="border-l border-duna-3 pl-4">
                <dt className="text-xs uppercase tracking-wider text-tinta-3">Distância</dt>
                <dd className="font-serif text-2xl font-bold text-esmeralda sm:text-3xl">22 km</dd>
                <span className="text-xs text-tinta-3">de Fortaleza (CE-025)</span>
              </div>
            </dl>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#destinos" className="btn-esmeralda">
              Explorar as Praias
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a href="#mapa" className="btn-secundario">
              Ver Mapa de Acesso
            </a>
            <a href="#calculadora" className="btn-secundario">
              Calcular Custos de Viagem
            </a>
          </div>
        </Revelar>
      </div>

      {/* Traço arquitetônico decorativo */}
      <div aria-hidden="true" className="relative mt-12 h-6">
        <div className="absolute inset-x-0 bottom-0 h-px bg-duna-3" />
        <div className="absolute bottom-0 left-8 h-4 w-px bg-duna-3" />
        <div className="absolute bottom-0 right-8 h-6 w-px bg-duna-3" />
      </div>
    </section>
  );
}
