import oficial from "@/data/oficial.json";
import Revelar from "@/components/Revelar";

const nf = new Intl.NumberFormat("pt-BR");

export default function NumerosOficiais() {
  const { estatisticas, marcos } = oficial;

  return (
    <section id="numeros" className="border-y border-duna-3 bg-duna-2">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <Revelar>
            <p className="olho">Dados Oficiais e Históricos</p>
            <h2 className="t1 mt-4 text-tinta">A infraestrutura e o peso de Aquiraz</h2>
            <p className="mt-5 text-tinta-2 leading-relaxed">
              Números extraídos da base da Receita Federal do Brasil, IBGE e registros
              estaduais de turismo. Sem estimativas infladas: são os dados reais que
              posicionam Aquiraz como o maior polo de hospitalidade costeira do Ceará.
            </p>
            <div className="mt-6 rounded-md border border-duna-3 bg-duna p-4">
              <p className="text-xs font-semibold text-esmeralda uppercase tracking-wider">
                Patrimônio & História
              </p>
              <p className="mt-1 text-sm text-tinta-2">
                {marcos.primeiraCapital}
              </p>
            </div>
          </Revelar>

          <Revelar atraso={80}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-2">
              <div className="border-l-2 border-esmeralda pl-4">
                <span className="font-serif text-3xl font-bold text-tinta sm:text-4xl">
                  {nf.format(estatisticas.empresasPortoDasDunas)}
                </span>
                <p className="text-sm font-semibold text-tinta mt-1">
                  Empresas ativas no Porto das Dunas
                </p>
                <p className="text-xs text-tinta-3 mt-0.5">
                  Registros na Receita Federal no bairro da orla
                </p>
              </div>

              <div className="border-l-2 border-sol pl-4">
                <span className="font-serif text-3xl font-bold text-tinta sm:text-4xl">
                  {estatisticas.extensaoLitoralKm} km
                </span>
                <p className="text-sm font-semibold text-tinta mt-1">
                  Extensão de litoral
                </p>
                <p className="text-xs text-tinta-3 mt-0.5">
                  Do Rio Pacoti até a Reserva do Batoque
                </p>
              </div>

              <div className="border-l-2 border-duna-3 pl-4">
                <span className="font-serif text-3xl font-bold text-tinta sm:text-4xl">
                  +{nf.format(estatisticas.leitosHoteleiros)}
                </span>
                <p className="text-sm font-semibold text-tinta mt-1">
                  Leitos de hospedagem
                </p>
                <p className="text-xs text-tinta-3 mt-0.5">
                  Resorts, hotéis, pousadas e flats de temporada
                </p>
              </div>

              <div className="border-l-2 border-duna-3 pl-4">
                <span className="font-serif text-3xl font-bold text-tinta sm:text-4xl">
                  {estatisticas.anoInstalacaoCapital}
                </span>
                <p className="text-sm font-semibold text-tinta mt-1">
                  Instalação da Primeira Capital
                </p>
                <p className="text-xs text-tinta-3 mt-0.5">
                  Sede oficial da Capitania antes de Fortaleza
                </p>
              </div>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
