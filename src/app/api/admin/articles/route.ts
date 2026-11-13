import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { markdownToHtml, parseMarkdownArticle, slugify } from "@/lib/markdown";
import {
  type ArtigoBlog,
  deleteArticle,
  getArticles,
  upsertArticle,
} from "@/lib/storage";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const list = await getArticles(false);
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      rawMarkdown?: string;
      id?: string;
      title?: string;
      summary?: string;
      category?: string;
      coverImage?: string;
      markdown?: string;
      tags?: string[] | string;
      publishedAt?: string;
      status?: "published" | "draft";
      featured?: boolean;
    };

    let artigo: ArtigoBlog;

    if (body.rawMarkdown && body.rawMarkdown.trim()) {
      const parsed = parseMarkdownArticle(body.rawMarkdown);
      artigo = {
        ...parsed,
        coverImage: body.coverImage || parsed.coverImage,
        status: body.status || parsed.status,
      };
    } else {
      const title = (body.title || "").trim();
      const markdown = (body.markdown || "").trim();
      if (!title || !markdown) {
        return NextResponse.json(
          { error: "Título e conteúdo em Markdown são obrigatórios." },
          { status: 400 }
        );
      }

      const tags = Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === "string"
        ? body.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined;

      const id = slugify(body.id || title) || `artigo-${Date.now()}`;

      artigo = {
        id,
        title,
        summary: (body.summary || "").trim(),
        category: (body.category || "Turismo & Litoral").trim(),
        coverImage: body.coverImage?.trim() || undefined,
        markdown,
        content: markdownToHtml(markdown),
        tags,
        publishedAt: body.publishedAt || new Date().toISOString(),
        status: body.status === "draft" ? "draft" : "published",
        featured: Boolean(body.featured),
      };
    }

    await upsertArticle(artigo);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${artigo.id}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true, article: artigo });
  } catch (err) {
    console.error("[Articles POST erro]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao salvar artigo." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) {
    return NextResponse.json({ error: "id obrigatório." }, { status: 400 });
  }

  const removed = await deleteArticle(id);
  if (!removed) {
    return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${id}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ ok: true });
}
