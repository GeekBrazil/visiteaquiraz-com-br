import climaJson from "@/data/clima.json";
import oficialJson from "@/data/oficial.json";
import { DESTINOS, EXPERIENCIAS, PRATICO } from "@/data/aquiraz";
import { markdownToHtml, slugify } from "@/lib/markdown";
import {
  type ArtigoBlog,
  getArticles,
  getFotos,
  upsertArticle,
} from "@/lib/storage";

interface PautaSeed {
  slugBase: string;
  titulo: string;
  categoria: string;
  localSlug: string;
  tags: string[];
  resumo: string;
  foco: string;
}

const PAUTAS_AQUIRAZ: PautaSeed[] = [
  {
    slugBase: "guia-porto-das-dunas-aquiraz",
    titulo: "Porto das Dunas além dos parques: dunas de quartzo, gastronomia e acesso rápido",
    categoria: "Praias & Roteiros",
    localSlug: "porto-das-dunas",
    tags: ["Porto das Dunas", "Aquiraz", "Dunas", "CE-025"],
    resumo:
      "Como aproveitar os 22 km entre Fortaleza e o Porto das Dunas combinando passeios nas cristas de areia clara, mar aberto e infraestrutura hoteleira.",
    foco: "Explorar a infraestrutura do Porto das Dunas (mais de 845 empresas ativas), a paisagem de dunas móveis e o acesso duplicado pela CE-025.",
  },
  {
    slugBase: "prainha-centro-das-rendeiras-renda-bilro",
    titulo: "Prainha de Aquiraz e Centro das Rendeiras: o patrimônio vivo da Renda de Bilro",
    categoria: "Cultura & Tradição",
    localSlug: "prainha-e-rendeiras",
    tags: ["Prainha", "Renda de Bilro", "Artesanato", "Indicação Geográfica"],
    resumo:
      "Conheça a antiga vila de pescadores a 6 km do centro onde a renda de bilro ganhou Indicação Geográfica do INPI e encontra piscinas naturais.",
    foco: "Valorizar as artesãs do Centro das Rendeiras, a Lagoa da Prainha, as barracas rústicas e a gastronomia de peixe fresco.",
  },
  {
    slugBase: "foz-rio-pacoti-kitesurf-ecoturismo",
    titulo: "Foz do Rio Pacoti: o encontro entre manguezal preservado e ventos para kitesurf",
    categoria: "Esportes & Natureza",
    localSlug: "foz-do-rio-pacoti",
    tags: ["Rio Pacoti", "Kitesurf", "Manguezal", "APA"],
    resumo:
      "Na divisa entre Fortaleza e o Porto das Dunas, a APA do Rio Pacoti reúne passeios ecológicos de caiaque e ventos alísios de julho a dezembro.",
    foco: "Detalhar a dinâmica de ventos constantes, segurança para iniciantes em água abrigada e observação de aves migratórias no estuário.",
  },
  {
    slugBase: "centro-historico-aquiraz-primeira-capital-1699",
    titulo: "Centro Histórico de Aquiraz: o roteiro a pé pela primeira capital do Ceará (1699)",
    categoria: "História & Patrimônio",
    localSlug: "centro-historico",
    tags: ["Primeira Capital", "Centro Histórico", "Museu Sacro", "1699"],
    resumo:
      "Da Igreja Matriz de 1713 ao Museu Sacro na antiga cadeia colonial e o Mercado da Carne em madeira de carnaúba.",
    foco: "Conectar o visitante com a memória colonial da Capitania do Ceará antes da transferência para Fortaleza.",
  },
  {
    slugBase: "reserva-extrativista-batoque-ecoturismo",
    titulo: "Reserva Extrativista do Batoque: como visitar a praia preservada de Aquiraz",
    categoria: "Ecoturismo",
    localSlug: "praia-do-batoque",
    tags: ["RESEX Batoque", "Batoque", "Turismo Comunitário", "Lagoas"],
    resumo:
      "A 28 km da sede, a primeira RESEX do litoral cearense mantém dunas virgens, lagoas entre areias e pesca artesanal sem grandes empreendimentos.",
    foco: "Orientar o visitante sobre respeito ambiental, culinária comunitária local e roteiro entre mar e lagoas.",
  },
  {
    slugBase: "praia-do-presidio-bicas-agua-doce",
    titulo: "Praia do Presídio: enseada calma e as bicas naturais de água doce na areia",
    categoria: "Praias & Roteiros",
    localSlug: "praia-do-presidio",
    tags: ["Praia do Presídio", "Família", "Enseada", "Aquiraz"],
    resumo:
      "Por que a enseada protegida do Presídio é uma das preferidas de famílias e viajantes em busca de sossego a 16 km do centro.",
    foco: "Explicar o fenômeno do lençol freático das dunas que forma bicas de água doce à beira-mar e a história colonial local.",
  },
  {
    slugBase: "praia-do-iguape-jangadas-duna-encantada",
    titulo: "Praia do Iguape: jangadas na enseada, artesanato de labirinto e o Morro da Encantada",
    categoria: "Praias & Roteiros",
    localSlug: "praia-do-iguape",
    tags: ["Praia do Iguape", "Jangadas", "Labirinto", "Morro da Encantada"],
    resumo:
      "A 18 km da sede, o Iguape guarda uma das enseadas mais fotogênicas do litoral leste, lendas indígenas e pesca de jangada.",
    foco: "Destacar o porto natural dos jangadeiros, a subida ao Morro da Encantada e as rendeiras de labirinto.",
  },
  {
    slugBase: "melhor-epoca-viajar-aquiraz-vento-chuva-sol",
    titulo: "Quando ir a Aquiraz: sol acima de 300 dias no ano, lagoas cheias e pico dos ventos",
    categoria: "Planejamento",
    localSlug: "aquiraz-geral",
    tags: ["Clima Aquiraz", "Quando Ir", "Vento", "Lagoas"],
    resumo:
      "Comparativo mês a mês com dados médios de chuva, temperatura da água (26,8 °C) e rajadas em nós para escolher sua data ideal.",
    foco: "Ajudar quem quer lagoas cheias (fev-jun) versus quem busca céu limpo e kitesurf (jul-dez).",
  },
  {
    slugBase: "bate-volta-fortaleza-aquiraz-ce025",
    titulo: "Bate-volta de Fortaleza a Aquiraz: roteiro de 1 dia pela CE-025 e Costa Leste",
    categoria: "Planejamento",
    localSlug: "porto-das-dunas",
    tags: ["Bate-volta", "Fortaleza", "CE-025", "Roteiro 1 Dia"],
    resumo:
      "Como sair cedo de Fortaleza, passar pela Foz do Pacoti e Porto das Dunas, almoçar na Prainha e fechar a tarde no Centro Histórico.",
    foco: "Logística prática de horários, deslocamento pelos 22 km e paradas com melhor luz para fotos.",
  },
  {
    slugBase: "gastronomia-litoral-leste-prainha-iguape",
    titulo: "Onde e o que comer em Aquiraz: do peixe fresco da jangada ao Mercado da Carne",
    categoria: "Gastronomia & Cultura",
    localSlug: "prainha-e-rendeiras",
    tags: ["Gastronomia", "Frutos do Mar", "Peixada Cearense", "Mercado da Carne"],
    resumo:
      "Um retrato da culinária litorânea entre as barracas familiares da Prainha, a enseada do Iguape e as mesas tradicionais da sede.",
    foco: "Valorizar pesca artesanal, receitas com leite de coco, tapioca e doces tradicionais no Mercado Histórico.",
  },
];

async function tentarGerarComOpenAI(
  pauta: PautaSeed,
  mesAtual: (typeof climaJson.meses)[number],
  coverUrl?: string
): Promise<{ title: string; summary: string; markdown: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const destino = DESTINOS.find((d) => d.slug === pauta.localSlug);
  const contextoFactual = {
    municipio: "Aquiraz (CE)",
    fundacao: oficialJson.estatisticas.anoFundacao,
    extensaoLitoralKm: oficialJson.estatisticas.extensaoLitoralKm,
    distanciaFortalezaKm: oficialJson.estatisticas.distanciaCapitalKm,
    diasDeSolAno: oficialJson.estatisticas.diasDeSolAno,
    empresasPortoDasDunas: oficialJson.estatisticas.empresasPortoDasDunas,
    mesAtual,
    destino,
    pratico: PRATICO,
    coverUrl: coverUrl || null,
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_BLOG_MODEL || "gpt-4o-mini",
        temperature: 0.65,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Você é editor do portal independente Visite Aquiraz (Ceará). Escreva em português brasileiro natural, jornalístico, direto e útil. Nunca invente nomes de hotéis fictícios, preços fechados de terceiros ou números fora do JSON fornecido. Responda apenas JSON válido com as chaves: title, summary, markdown (600 a 900 palavras com ## subtítulos, listas e tabela prática de planejamento).",
          },
          {
            role: "user",
            content: `Redija um artigo para a pauta "${pauta.titulo}". Foco: ${pauta.foco}. Use exclusivamente estes fatos reais do projeto quando citar números: ${JSON.stringify(contextoFactual)}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      title?: string;
      summary?: string;
      markdown?: string;
    };
    if (!parsed.title || !parsed.markdown) return null;
    return {
      title: parsed.title,
      summary: parsed.summary || pauta.resumo,
      markdown: parsed.markdown,
    };
  } catch (err) {
    console.error("[blogGenerator OpenAI fallback]", err);
    return null;
  }
}

function montarMarkdownEditorial(
  pauta: PautaSeed,
  mesAtual: (typeof climaJson.meses)[number]
): string {
  const destino = DESTINOS.find((d) => d.slug === pauta.localSlug);
  const expRelacionadas = EXPERIENCIAS.slice(0, 3);
  const est = oficialJson.estatisticas;

  const blocoDestino = destino
    ? `## O que torna ${destino.nome} especial

${destino.texto}

- **Localização e acesso:** ${destino.distancia}
${destino.destaques.map((d) => `- ${d}`).join("\n")}`
    : `## Um litoral diverso a ${est.distanciaCapitalKm} km de Fortaleza

Ao longo de **${est.extensaoLitoralKm} km de costa contínua**, Aquiraz alterna praias urbanizadas com resorts de grande porte, enseadas históricas de pescadores artesanais, manguezais protegidos e áreas de preservação ambiental.`;

  return `## Panorama de ${mesAtual.mes} em Aquiraz

Quem planeja visitar o litoral leste do Ceará neste período encontra temperatura média de **${mesAtual.temp} °C**, água do mar em torno de **${climaJson.medias.temperaturaAgua} °C** e vento médio de **${mesAtual.vento} nós** — cenário descrito nos registros locais como: *${mesAtual.condicao}*.

Fundada em **${est.anoFundacao}** como primeira sede administrativa da Capitania do Ceará, Aquiraz reúne hoje história colonial preservada, tradição artesanal e infraestrutura turística consolidada com mais de **${est.leitosHoteleiros} leitos hoteleiros** na faixa costeira.

${blocoDestino}

## Guia rápido de planejamento local

| Indicador real | Referência para a viagem |
| :--- | :--- |
| Extensão do litoral | ${est.extensaoLitoralKm} km de praias entre Pacoti e Batoque |
| Distância da capital | ${est.distanciaCapitalKm} km a partir de Fortaleza (CE-025 / CE-040) |
| Clima no mês (${mesAtual.mes}) | ${mesAtual.temp} °C · chuva média ${mesAtual.chuvaMm} mm · vento ${mesAtual.vento} nós |
| Sol ao longo do ano | ${est.diasDeSolAno}+ dias ensolarados |
| Polo Porto das Dunas | ${est.empresasPortoDasDunas} empresas registradas e georreferenciadas |

## Vivências que combinam com este roteiro

${expRelacionadas
  .map((e) => `### ${e.nome}\n\n${e.texto}\n\n- **Época recomendada:** ${e.epoca}`)
  .join("\n\n")}

## Dicas práticas antes de sair

- **Como chegar:** ${PRATICO.comoChegar}
- **Melhor janela de vento e sol:** ${PRATICO.quandoIr}
- **Onde se hospedar:** ${PRATICO.ondeFicar}
- **Mapa e custos:** Use o [Mapa Interativo das Praias](/#mapa) e a [Calculadora de Custos](/#calculadora) na página inicial para montar sua logística por distância e perfil de viagem.

> Nota editorial: informações baseadas nos levantamentos geográficos, históricos e climáticos oficiais compilados no portal Visite Aquiraz (IBGE ${oficialJson.codigoIbge}, INMET & Marinha do Brasil).`;
}

export async function gerarEPublicarArtigoAutomatico(opts?: {
  topicSlug?: string;
}): Promise<{ artigo: ArtigoBlog; modo: "openai" | "editorial" }> {
  const [existentes, fotos] = await Promise.all([getArticles(false), getFotos()]);

  const slugsExistentes = new Set(existentes.map((a) => a.id));
  const mesIdx = new Date().getMonth();
  const mesAtual = climaJson.meses[mesIdx] || climaJson.meses[0];

  let pauta = opts?.topicSlug
    ? PAUTAS_AQUIRAZ.find((p) => p.slugBase === opts.topicSlug)
    : PAUTAS_AQUIRAZ.find(
        (p) => !Array.from(slugsExistentes).some((id) => id.startsWith(p.slugBase))
      );

  if (!pauta) {
    // Ciclo sazonal quando todas as pautas-base já estiverem publicadas
    const rotacao = existentes.length % PAUTAS_AQUIRAZ.length;
    pauta = PAUTAS_AQUIRAZ[rotacao];
  }

  const hojeTag = new Date().toISOString().slice(0, 10);
  const slugFinal = slugsExistentes.has(pauta.slugBase)
    ? `${pauta.slugBase}-${hojeTag}`
    : pauta.slugBase;

  const fotoCompativel =
    fotos.find((f) => f.localSlug === pauta.localSlug && f.destaque) ||
    fotos.find((f) => f.localSlug === pauta.localSlug) ||
    fotos.find((f) => f.destaque) ||
    fotos[0];

  const coverImage = fotoCompativel?.url;

  const ia = await tentarGerarComOpenAI(pauta, mesAtual, coverImage);
  const title = ia?.title || pauta.titulo;
  const summary = ia?.summary || pauta.resumo;
  const markdown = ia?.markdown || montarMarkdownEditorial(pauta, mesAtual);
  const id = slugify(slugFinal);

  const artigo: ArtigoBlog = {
    id,
    title,
    summary,
    category: pauta.categoria,
    coverImage,
    markdown,
    content: markdownToHtml(markdown),
    tags: pauta.tags,
    publishedAt: new Date().toISOString(),
    status: "published",
    featured: existentes.length === 0,
    autoGenerated: true,
  };

  await upsertArticle(artigo);

  return {
    artigo,
    modo: ia ? "openai" : "editorial",
  };
}

export function listarPautasDisponiveis() {
  return PAUTAS_AQUIRAZ.map((p) => ({
    slugBase: p.slugBase,
    titulo: p.titulo,
    categoria: p.categoria,
    localSlug: p.localSlug,
  }));
}
