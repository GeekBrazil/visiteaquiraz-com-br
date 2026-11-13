import climaJson from "@/data/clima.json";
import Revelar from "@/components/Revelar";

export default function Clima() {
  const { medias, meses } = climaJson;

  return (
    <section id="clima" className="border-b border-duna-3 bg-duna-2/40 py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Revelar>
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div>
              <p className="olho">Quando Ir</p>
              <h2 className="t1 mt-3 text-tinta">Sol constante e ventos alísios</h2>
              <p className="mt-4 text-tinta-2 leading-relaxed">
                Com temperatura média de {medias.temperaturaAr}°C e mar a {medias.temperaturaAgua}°C,
                o litoral de Aquiraz é navegável e ensolarado praticamente o ano todo.
                O primeiro semestre enche as lagoas das dunas; o segundo é o paraíso dos esportes a vela.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 sm:justify-end">
              <div className="rounded-md border border-duna-3 bg-duna px-4 py-3 shadow-2xs">
                <span className="block text-xs uppercase tracking-wider text-tinta-3">Mar Cearense</span>
                <span className="font-serif text-2xl font-bold text-esmeralda">{medias.temperaturaAgua}°C</span>
                <span className="block text-[11px] text-tinta-3">água morna o ano todo</span>
              </div>
              <div className="rounded-md border border-duna-3 bg-duna px-4 py-3 shadow-2xs">
                <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-tinta-3">
                  <span>Vento Médio</span>
                  <span className="inline-flex items-center gap-0.5 rounded bg-esmeralda-claro px-1.5 py-0.5 text-[10px] font-semibold text-esmeralda">
                    E / SE
                  </span>
                </span>
                <span className="font-serif text-2xl font-bold text-sol">{medias.ventoMedioKnots} nós</span>
                <span className="block text-[11px] text-tinta-3">alísios no segundo semestre</span>
              </div>
            </div>
          </div>

          {/* Calendário mensal com barras de clima */}
          <div className="mt-12 overflow-x-auto pb-4">
            <div className="grid min-w-[700px] grid-cols-12 gap-2 text-center">
              {meses.map((m, idx) => {
                const destaqueVento = m.vento >= 18;
                return (
                  <div
                    key={m.mes}
                    className={`rounded-lg border p-3 transition-all ${
                      destaqueVento
                        ? "border-esmeralda/40 bg-duna shadow-2xs"
                        : "border-duna-3 bg-duna/50"
                    }`}
                  >
                    <span className="text-xs font-bold text-tinta">{m.mes}</span>
                    <span className="block font-serif text-base font-bold text-tinta mt-1">
                      {m.temp}°
                    </span>
                    <div className="my-2 h-1.5 w-full overflow-hidden rounded-full bg-duna-3">
                      <div
                        className="h-full w-full"
                        style={{ width: `${Math.min(100, (m.vento / 24) * 100)}%` }}
                      >
                        <div
                          className={`barra-vento h-full w-full ${
                            destaqueVento ? "bg-esmeralda" : "bg-sol"
                          }`}
                          style={{ transitionDelay: `${idx * 35}ms` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-tinta-3 block">
                      {m.vento} nós
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-3 text-right text-xs text-tinta-3">
            Barras indicam a intensidade média do vento (em nós) ao longo do ano.
          </p>
        </Revelar>
      </div>
    </section>
  );
}
