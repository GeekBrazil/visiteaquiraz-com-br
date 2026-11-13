import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/auth";
import {
  gerarEPublicarArtigoAutomatico,
  listarPautasDisponiveis,
} from "@/lib/blogGenerator";

async function handleCron(req: NextRequest, topicSlug?: string) {
  if (!verifyCronRequest(req)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const { artigo, modo } = await gerarEPublicarArtigoAutomatico({ topicSlug });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${artigo.id}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      ok: true,
      modo,
      article: {
        id: artigo.id,
        title: artigo.title,
        category: artigo.category,
        coverImage: artigo.coverImage || null,
        publishedAt: artigo.publishedAt,
        url: `https://visiteaquiraz.com.br/blog/${artigo.id}`,
      },
    });
  } catch (err) {
    console.error("[Cron blog erro]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha no cron de blog." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("list") === "1") {
    if (!verifyCronRequest(req)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ pautas: listarPautasDisponiveis() });
  }
  const topicSlug = req.nextUrl.searchParams.get("topic") || undefined;
  return handleCron(req, topicSlug);
}

export async function POST(req: NextRequest) {
  let topicSlug: string | undefined;
  try {
    const body = (await req.json()) as { topicSlug?: string };
    topicSlug = body?.topicSlug;
  } catch {
    // Corpo vazio em chamadas cron é permitido
  }
  return handleCron(req, topicSlug);
}
