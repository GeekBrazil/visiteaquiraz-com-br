import Link from "next/link";
import dynamicImport from "next/dynamic";
import Hero from "@/components/Hero";
import Revelar from "@/components/Revelar";
import GaleriaFotos from "@/components/GaleriaFotos";
import UltimosArtigos from "@/components/UltimosArtigos";
import NumerosOficiais from "@/components/NumerosOficiais";
import CalculadoraViagemAquiraz from "@/components/CalculadoraViagemAquiraz";
import Clima from "@/components/Clima";
import Newsletter from "@/components/Newsletter";
import { DESTINOS, EXPERIENCIAS, PRATICO } from "@/data/aquiraz";
import { getArticles, getFotos } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Leaflet carregado apenas no cliente via dynamic import para proteger o LCP
const MapaAquiraz = dynamicImport(() => import("@/components/MapaAquiraz"), {
  loading: () => (
    <div className="h-[30rem] w-full animate-pulse rounded-[8px] border border-duna-3 bg-duna-2" />
  ),
});

export default async function Home() {
  const [fotos, artigos] = await Promise.all([getFotos(), getArticles(true)]);

  return (
    <>
      <Cabecalho />

      <main id="conteudo" className="relative z-10">
        <Hero />
        <Destinos />
        <GaleriaFotos fotos={fotos} />
        <SecaoMapa />
        <NumerosOficiais />
        <SecaoExperiencias />
        <Clima />
        <CalculadoraViagemAquiraz />
        <SecaoPratico />
        <UltimosArtigos artigos={artigos} />
        <Newsletter />
      </main>

      <Rodape />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Cabecalho() {
  return (
    <header className="sticky top-0 z-40 border-b border-duna-3 bg-duna/90 backdrop-blur-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-bold tracking-tight text-tinta sm:text-2xl">
            Visite Aquiraz
          </span>
          <span className="hidden text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-esmeralda sm:inline">
            Ceará
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          <Link href="#destinos" className="text-sm font-medium text-tinta-2 hover:text-esmeralda transition-colors">
            Praias
          </Link>
          <Link href="#galeria" className="text-sm font-medium text-tinta-2 hover:text-esmeralda transition-colors">
            Fotos
          </Link>
          <Link href="#mapa" className="text-sm font-medium text-tinta-2 hover:text-esmeralda transition-colors">
            Mapa
          </Link>
          <Link href="#clima" className="text-sm font-medium text-tinta-2 hover:text-esmeralda transition-colors">
            Quando Ir
          </Link>
          <Link href="#calculadora" className="text-sm font-medium text-tinta-2 hover:text-esmeralda transition-colors">
            Custos
          </Link>
          <Link href="/blog" className="text-sm font-medium text-tinta-2 hover:text-esmeralda transition-colors">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin"
            className="rounded-md border border-duna-3 px-3 py-2 text-xs font-semibold text-tinta-2 hover:border-esmeralda hover:text-esmeralda transition-colors"
          >
            Painel
          </Link>
          <a
            href="#newsletter"
            className="rounded-md bg-esmeralda px-4 py-2 text-xs font-semibold text-renda hover:bg-esmeralda-esc transition-colors"
          >
            Guia Semanal
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */

function Destinos() {
  return (
    <section id="destinos" className="border-b border-duna-3 bg-duna py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Revelar>
          <p className="olho">Destinos & Praias</p>
          <h2 className="t1 mt-3 text-tinta">Os 36 km de costa e história de Aquiraz</h2>
          <p className="mt-4 max-w-2xl text-tinta-2 leading-relaxed">
            Do glamour dos resorts no Porto das Dunas à tranquilidade rústica
            da Reserva do Batoque e a memória colonial do centro histórico.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINOS.map((d, i) => (
            <Revelar key={d.slug} atraso={i * 60}>
              <article className="flex h-full flex-col justify-between rounded-lg border border-duna-3 bg-duna-2/50 p-6 transition-all hover:border-esmeralda/50 hover:bg-duna">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sol-esc">
                    {d.chapeu}
                  </span>
                  <h3 className="t3 mt-2 text-tinta">{d.nome}</h3>
                  <p className="mt-1 text-xs font-medium text-esmeralda">
                    {d.distancia}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-tinta-2">
                    {d.texto}
                  </p>
                </div>

                <ul className="mt-6 space-y-1.5 border-t border-duna-3 pt-4 text-xs text-tinta-2">
                  {d.destaques.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-esmeralda" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SecaoMapa() {
  return (
    <section id="mapa" className="border-b border-duna-3 bg-duna-2/30 py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Revelar>
          <p className="olho">Geolocalização</p>
          <h2 className="t1 mt-3 text-tinta">Mapa das Praias e Atrativos</h2>
          <p className="mt-4 max-w-2xl text-tinta-2 leading-relaxed">
            Navegue pelos pontos de interesse georreferenciados ao longo do litoral de Aquiraz.
            Clique nos marcadores para detalhes e orientações de rota.
          </p>
        </Revelar>

        <div className="mt-8">
          <MapaAquiraz />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SecaoExperiencias() {
  return (
    <section id="experiencias" className="border-b border-duna-3 bg-duna py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Revelar>
          <p className="olho">Cultura & Aventura</p>
          <h2 className="t1 mt-3 text-tinta">O que viver além da beira da praia</h2>
          <p className="mt-4 max-w-2xl text-tinta-2 leading-relaxed">
            Vivências autênticas guiadas por moradores tradicionais, esportes com vento constante
            e o testemunho histórico da primeira capital.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCIAS.map((exp, i) => (
            <Revelar key={exp.nome} atraso={i * 70}>
              <div className="h-full rounded-lg border border-duna-3 bg-duna-2/40 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-esmeralda">
                    {exp.chapeu}
                  </span>
                  <h3 className="text-base font-bold text-tinta mt-2">{exp.nome}</h3>
                  <p className="mt-3 text-sm text-tinta-2 leading-relaxed">{exp.texto}</p>
                </div>
                <div className="mt-6 border-t border-duna-3 pt-3">
                  <span className="text-xs font-semibold text-sol-esc">
                    Época ideal: {exp.epoca}
                  </span>
                </div>
              </div>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SecaoPratico() {
  return (
    <section id="pratico" className="border-b border-duna-3 bg-duna-2/40 py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Revelar>
          <p className="olho">Informações Práticas</p>
          <h2 className="t1 mt-3 text-tinta">Como chegar e organizar a estadia</h2>
        </Revelar>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <Revelar atraso={0}>
            <div className="h-full rounded-lg border border-duna-3 bg-duna p-6">
              <h3 className="font-serif text-lg font-bold text-tinta">Como Chegar</h3>
              <p className="mt-3 text-sm text-tinta-2 leading-relaxed">{PRATICO.comoChegar}</p>
            </div>
          </Revelar>

          <Revelar atraso={80}>
            <div className="h-full rounded-lg border border-duna-3 bg-duna p-6">
              <h3 className="font-serif text-lg font-bold text-tinta">Melhor Época</h3>
              <p className="mt-3 text-sm text-tinta-2 leading-relaxed">{PRATICO.quandoIr}</p>
            </div>
          </Revelar>

          <Revelar atraso={160}>
            <div className="h-full rounded-lg border border-duna-3 bg-duna p-6">
              <h3 className="font-serif text-lg font-bold text-tinta">Onde se Hospedar</h3>
              <p className="mt-3 text-sm text-tinta-2 leading-relaxed">{PRATICO.ondeFicar}</p>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Rodape() {
  return (
    <footer className="bg-duna-3/40 border-t border-duna-3 py-12 text-center text-xs text-tinta-3">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-4">
        <p className="font-serif text-base font-bold text-tinta">
          Visite Aquiraz · O portal independente do litoral cearense
        </p>
        <p>
          Dados oficiais compilados via OpenStreetMap, Receita Federal do Brasil, IBGE e Cadastur.
        </p>
        <p>
          Desenvolvido por <strong className="text-tinta">Allan Candido</strong> · Primeira Capital do Ceará ·{" "}
          <Link href="/blog" className="underline hover:text-esmeralda">Blog</Link> ·{" "}
          <Link href="/admin" className="underline hover:text-esmeralda">Painel Admin</Link>
        </p>
      </div>
    </footer>
  );
}
