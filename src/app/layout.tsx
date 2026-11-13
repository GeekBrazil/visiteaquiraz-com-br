import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-display",
});

const corpo = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-corpo",
});

const SITE = "https://visiteaquiraz.com.br";
const TITULO = "Visite Aquiraz — Porto das Dunas, Beach Park, Prainha e Primeira Capital do Ceará";
const DESCRICAO =
  "Guia completo de Aquiraz e Porto das Dunas: as grandes dunas móveis, Beach Park, o artesanato de renda de bilro na Prainha, a enseada do Presídio, kitesurf no Rio Pacoti e o centro histórico colonial de 1699.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITULO,
    template: "%s · Visite Aquiraz",
  },
  description: DESCRICAO,
  keywords: [
    "Aquiraz Ceará",
    "Porto das Dunas",
    "Beach Park Aquiraz",
    "Prainha Aquiraz",
    "Centro das Rendeiras",
    "Praia do Presídio",
    "Praia do Iguape",
    "Reserva do Batoque",
    "Primeira Capital do Ceará",
    "Turismo Ceará",
    "Dunas de Aquiraz",
  ],
  authors: [{ name: "Allan Candido" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE,
    siteName: "Visite Aquiraz",
    title: TITULO,
    description: DESCRICAO,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: { capable: true, title: "Visite Aquiraz", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#faf6ee",
  colorScheme: "light",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  name: "Aquiraz",
  description: DESCRICAO,
  url: SITE,
  touristType: [
    "Turismo de Sol e Praia",
    "Ecoturismo",
    "Turismo Cultural e Histórico",
    "Esportes Náuticos e Kitesurf",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Aquiraz",
    addressRegion: "CE",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -3.838,
    longitude: -38.393,
  },
  includesAttraction: [
    { "@type": "TouristAttraction", name: "Porto das Dunas" },
    { "@type": "TouristAttraction", name: "Beach Park" },
    { "@type": "TouristAttraction", name: "Prainha e Centro das Rendeiras" },
    { "@type": "TouristAttraction", name: "Praia do Presídio" },
    { "@type": "TouristAttraction", name: "Praia do Iguape" },
    { "@type": "TouristAttraction", name: "Reserva Extrativista do Batoque" },
    { "@type": "TouristAttraction", name: "Centro Histórico de Aquiraz (1699)" },
    { "@type": "TouristAttraction", name: "Área de Proteção Ambiental do Rio Pacoti" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} h-full`}
    >
      <body className="min-h-full">
        <div aria-hidden="true" className="progresso-leitura" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[4px] focus:bg-tinta focus:px-5 focus:py-3 focus:text-duna"
        >
          Ir para o conteúdo
        </a>
        {children}
        <Script src="https://allancandido.com/r.js" data-site="visiteaquiraz" strategy="afterInteractive" />
        <Script src="https://allancandido.com/chat/widget.js" data-site="visiteaquiraz" strategy="lazyOnload" />
      </body>
    </html>
  );
}
