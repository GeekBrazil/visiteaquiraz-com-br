@AGENTS.md

# visiteaquiraz.com.br — Contexto para o Agente

> **Guia de destino de Aquiraz e Porto das Dunas (litoral leste do Ceará).**
> Primeira Capital do Ceará (1699/1713). Dunas móveis, mar verde-esmeralda, Beach Park, Centro das Rendeiras, foz do Pacoti e patrimônio colonial.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript |
| Estilo | Tailwind CSS 4 + sistema próprio em `globals.css` |
| Tipografia | Fraunces (display, serifada) + Inter (corpo) via `next/font` |
| Mapas | Leaflet (dinâmico via dynamic import sem pesar LCP) |
| Deploy | Coolify/VPS ou Vercel Edge |

## Regras Críticas

- **Nunca** adicionar `Co-Authored-By: Claude` em commits — autoria exclusiva de Allan Candido.
- **Tema claro, sempre.** Nada de modo escuro nesta marca.
- **Sem estética de IA**: proibido gradiente roxo, glassmorphism, emoji em heading, sombra neon, escassez falsa ("3 vagas restantes") e preço inventado.
- **Nada de dado fabricado.** Sem preço, data ou vaga que não seja real. O que não for verificável vira descrição honesta da experiência.
- **Acessibilidade estrita**: conformidade WCAG AA/AAA em todos os contrastes de cores.

## Identidade Visual

Paleta extraída da paisagem real de Porto das Dunas e Aquiraz:

| Token | Hex | Uso |
|---|---|---|
| `duna` | `#faf6ee` | Fundo principal (papel quente) |
| `duna-2` / `duna-3` | `#f1e7d4` / `#e5d7be` | Faixas alternadas, superfícies, bordas |
| `tinta` | `#142326` | Texto principal (contraste profundo) |
| `tinta-2` / `tinta-3` | `#3d5056` / `#586c73` | Corpo, legenda |
| `esmeralda` | `#0a7e82` | Acento primário (o mar de Porto das Dunas). Texto em cima é branco puro |
| `sol` | `#d98218` | Acento secundário (sol poente nas dunas do Ceará) |
| `renda` | `#ffffff` | Branco puro sobre acentos sólidos (renda de bilro da Prainha) |
| `pacoti` | `#28533c` | Acento de apoio (manguezais e restinga da foz do Rio Pacoti) |

Textura de grão sutil no `body::before` para afastar do aspecto de "flat template".

## Estrutura

```
src/
├── app/
│   ├── layout.tsx      fontes, metadata, OG, JSON-LD TouristDestination
│   ├── globals.css     sistema de design completo (@theme Tailwind 4)
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── manifest.ts
│   └── page.tsx        composição das seções (server component)
├── components/
│   ├── Hero.tsx        hero editorial com dunas, mar esmeralda e selo colonial
│   ├── MapaAquiraz.tsx mapa interativo com as 8 praias e atrativos
│   ├── Revelar.tsx     scroll-reveal suave (prefers-reduced-motion safe)
│   ├── NumerosOficiais.tsx dados reais do Cadastur, IBGE e Receita Federal
│   ├── CalculadoraViagemAquiraz.tsx simulador de viagem e estadia
│   ├── Clima.tsx       vento para velejo, tábua de marés e temperatura da água
│   └── Newsletter.tsx  captura limpa de visitantes
└── data/
    ├── aquiraz.ts      destinos, experiências, perguntas frequentes, histórico
    ├── lugares.json    coordenadas georreferenciadas das praias e atrações
    ├── oficial.json    métricas públicas oficiais
    └── clima.json      médias climáticas reais do Ceará
```
