/**
 * Conteúdo editorial do portal Visite Aquiraz.
 * Regra: nada de dados inventados ou falsos. Descrição autêntica
 * baseada na geografia, cultura e história da primeira capital do Ceará.
 */

export interface Destino {
  slug: string;
  nome: string;
  chapeu: string;
  distancia: string;
  texto: string;
  destaques: string[];
}

export const DESTINOS: Destino[] = [
  {
    slug: "porto-das-dunas",
    nome: "Porto das Dunas",
    chapeu: "O polo das grandes dunas e lazer",
    distancia: "22 km de Fortaleza (via CE-025)",
    texto:
      "A praia mais famosa de Aquiraz combina imensas dunas de quartzo claro com um mar aberto de águas verdes e mornas. É a casa do complexo Beach Park e de um dos maiores parques hoteleiros do Nordeste, com resorts pé na areia e condomínios de alto padrão. Para além do entretenimento, os passeios de buggy pelas cristas das dunas e o pôr do sol com vista panorâmica do oceano são paradas obrigatórias.",
    destaques: [
      "Beach Park & infraestrutura de resorts",
      "Dunas de areia branca e passeios de buggy",
      "Mar morno com ondas para surf e banho",
      "Fácil acesso duplicado pela CE-025",
    ],
  },
  {
    slug: "prainha-e-rendeiras",
    nome: "Prainha & Centro das Rendeiras",
    chapeu: "Tradição viva da renda de bilro",
    distancia: "6 km do centro de Aquiraz",
    texto:
      "Antiga vila de pescadores que preserva uma das maiores expressões culturais do Brasil: a renda de bilro, reconhecida com Indicação Geográfica. No Centro das Rendeiras, mestras artesãs tecem toalhas, caminhos de mesa e peças de vestuário ao ritmo estalado dos bilros de madeira. A praia é abrigada, com piscinas naturais na maré baixa, barracas rústicas e a foz da Lagoa da Prainha.",
    destaques: [
      "Centro das Rendeiras com venda direta das artesãs",
      "Piscinas naturais e mar calmo na maré baixa",
      "Passeios ecológicos na Lagoa da Prainha",
      "Gastronomia com peixe fresco e caranguejo",
    ],
  },
  {
    slug: "praia-do-presidio",
    nome: "Praia do Presídio",
    chapeu: "Enseada histórica e águas tranquilas",
    distancia: "16 km do centro de Aquiraz",
    texto:
      "Batizada na época colonial por ter abrigado prisioneiros holandeses e jesuítas, a Praia do Presídio tem uma enseada curva de mar calmo e seguro para famílias. O diferencial são as bicas de água doce natural que brotam do lençol freático das dunas diretamente na beira da praia, permitindo um banho de água doce após o mergulho no mar.",
    destaques: [
      "Bicas naturais de água doce na areia",
      "Mar calmo sem correnteza forte",
      "Carnaval tradicional de rua",
      "Casarões coloniais e pousadas acolhedoras",
    ],
  },
  {
    slug: "praia-do-iguape",
    nome: "Praia do Iguape",
    chapeu: "Vila de pescadores e duna encantada",
    distancia: "18 km do centro de Aquiraz",
    texto:
      "Uma das praias mais pitorescas do Ceará, com dezenas de jangadas ancoradas na enseada protegida. O Morro da Encantada, uma imensa duna avermelhada, guarda lendas indígenas sobre lagoas que apareciam e desapareciam. O Iguape também é famoso pelo artesanato de rendas de labirinto e pela cerâmica artesanal.",
    destaques: [
      "Cenário autêntico de jangadas na enseada",
      "Morro do Iguape / Duna da Encantada",
      "Tradição do artesanato em labirinto",
      "Porto de pescadores e frutos do mar frescos",
    ],
  },
  {
    slug: "praia-do-batoque",
    nome: "Reserva Extrativista do Batoque",
    chapeu: "Natureza intocada e preservação",
    distancia: "28 km do centro de Aquiraz",
    texto:
      "A primeira Reserva Extrativista do litoral cearense (RESEX Batoque). Não há asfalto na orla, grandes empreendimentos nem tráfego desordenado. A comunidade tradicional vive da pesca artesanal e da agricultura de subsistência, cuidando de quilômetros de praia selvagem, lagoas cristalinas e dunas virgens.",
    destaques: [
      "Praia 100% selvagem e protegida por lei",
      "Lagoas de água doce entre as dunas",
      "Turismo de base comunitária",
      "Silêncio absoluto e horizonte desobstruído",
    ],
  },
  {
    slug: "centro-historico",
    nome: "Centro Histórico de Aquiraz",
    chapeu: "Primeira Capital do Ceará (1699)",
    distancia: "Sede do Município",
    texto:
      "Antes de Fortaleza existir como centro administrativo, Aquiraz foi a primeira capital da Capitania do Ceará, fundada formalmente em 1699 e instalada em 1713. O Centro Histórico preserva a Igreja Matriz de São José de Ribamar (século XVIII), as Ruínas do Colégio dos Jesuítas e o Museu Sacro São José de Ribamar, instalado na antiga cadeia colonial.",
    destaques: [
      "Museu Sacro São José de Ribamar (antiga cadeia colonial)",
      "Igreja Matriz de São José de Ribamar (1713)",
      "Mercado da Carne com arquitetura em carnaúba",
      "Ruínas históricas dos Jesuítas do século XVII",
    ],
  },
  {
    slug: "foz-do-rio-pacoti",
    nome: "Foz do Rio Pacoti & Manguezais",
    chapeu: "Ecoturismo e esportes de vento",
    distancia: "Divisa entre Fortaleza e Porto das Dunas",
    texto:
      "Área de Proteção Ambiental (APA do Rio Pacoti) com rica biodiversidade de manguezal, restinga e estuário. A água morna e abrigada do rio, somada aos ventos alísios constantes de julho a dezembro, torna o local um dos melhores spots do Nordeste para a prática e aprendizado de Kitesurf, Caiaque e Stand Up Paddle.",
    destaques: [
      "Spot internacional de Kitesurf e Windsurf",
      "Passeios ecológicos de barco e caiaque pelo manguezal",
      "Área de Proteção Ambiental com aves migratórias",
      "Ponte da CE-025 com mirante para o rio e mar",
    ],
  },
];

export interface Experiencia {
  nome: string;
  chapeu: string;
  texto: string;
  epoca: string;
}

export const EXPERIENCIAS: Experiencia[] = [
  {
    nome: "Downwind e Velejo de Kitesurf",
    chapeu: "Ventos Alísios",
    texto:
      "A costa de Aquiraz recebe os ventos alísios do leste de forma constante e limpa entre julho e dezembro. A foz do Rio Pacoti e a ponta do Porto das Dunas oferecem condições para iniciantes em água plana e rotas de downwind em mar aberto.",
    epoca: "Julho a Dezembro (temporada de ventos)",
  },
  {
    nome: "Passeio de Buggy pelas Dunas Móveis",
    chapeu: "Aventura e Contemplação",
    texto:
      "Circuitos autorizados por motoristas credenciados pelas cristas das dunas do Porto das Dunas, Prainha e Iguape, com paradas estratégicas em lagoas naturais e descida de esquibunda na areia.",
    epoca: "O ano todo (melhores lagoas de março a agosto)",
  },
  {
    nome: "Oficina Viva de Renda de Bilro",
    chapeu: "Cultura Tradicional",
    texto:
      "No Centro das Rendeiras da Prainha e no Iguape, o visitante acompanha de perto a agilidade das rendeiras manipulando dezenas de bilros sobre a almofada de fita. As peças exclusivas são comercializadas direto pelas famílias produtoras.",
    epoca: "O ano todo (diariamente das 8h às 17h)",
  },
  {
    nome: "Rota Histórica e Arqueológica",
    chapeu: "Patrimônio Colonial",
    texto:
      "Visita guiada pelo Museu Sacro São José de Ribamar, pelas ruínas dos padres jesuítas e pelo Mercado da Carne, compreendendo como o Ceará nasceu e se organizou no século XVII antes da fundação de Fortaleza.",
    epoca: "Terça a Domingo",
  },
  {
    nome: "Engenhos Coloniais e Rota da Cachaça",
    chapeu: "Tradição Canavieira",
    texto:
      "Visitação aos antigos alambiques e engenhos de Aquiraz, conhecendo o processo de destilação artesanal em tachos de cobre e a história da produção secular da cana no Ceará.",
    epoca: "O ano todo",
  },
];

export const PRATICO = {
  comoChegar:
    "Aquiraz fica colada na região metropolitana de Fortaleza. O acesso ao Porto das Dunas é feito pela rodovia duplicada CE-025 (cerca de 25 minutos partindo do aeroporto ou da orla de Fortaleza). Para o Centro Histórico, Prainha, Presídio e Iguape, o trajeto é pela CE-040 em pista dupla com sinalização clara.",
  quandoIr:
    "O sol brilha mais de 300 dias por ano no litoral cearense com temperatura média de 27°C. A época das chuvas rápidas vai de fevereiro a maio (quando as lagoas entre as dunas ficam cheias e cristalinas). De julho a dezembro, os ventos alísios sopram com força total e o céu fica predominantemente azul sem nuvens.",
  ondeFicar:
    "O Porto das Dunas concentra resorts internacionais, flats e pousadas de alto padrão à beira-mar. Para uma experiência mais rústica e bucólica, a Prainha e o Presídio contam com pousadas acolhedoras em vilas de pescadores.",
};
