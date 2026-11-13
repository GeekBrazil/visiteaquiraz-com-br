export interface ParsedArticleInput {
  id: string;
  title: string;
  summary: string;
  category: string;
  coverImage?: string;
  publishedAt: string;
  tags?: string[];
  status: "published" | "draft";
  featured?: boolean;
  markdown: string;
  content: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHref(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  ) {
    return escapeHtml(trimmed);
  }
  return "#";
}

function formatInline(raw: string): string {
  let out = escapeHtml(raw);
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label: string, href: string) =>
      `<a href="${safeHref(href)}" class="text-esmeralda font-medium underline decoration-esmeralda/40 underline-offset-2 hover:text-esmeralda-esc">${label}</a>`
  );
  out = out.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-semibold text-tinta">$1</strong>'
  );
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-duna-2 px-1.5 py-0.5 font-mono text-[0.85em] text-esmeralda-esc">$1</code>'
  );
  return out;
}

export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let inTable = false;

  const closeList = () => {
    if (inList) {
      html.push(inList === "ul" ? "</ul>" : "</ol>");
      inList = null;
    }
  };
  const closeTable = () => {
    if (inTable) {
      html.push("</tbody></table></div>");
      inTable = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("|") && line.endsWith("|")) {
      closeList();
      if (/^\|[\s\-:]+(\|[\s\-:]+)*\|$/.test(line)) continue;
      const cells = line
        .slice(1, -1)
        .split("|")
        .map((c) => formatInline(c.trim()));

      if (!inTable) {
        inTable = true;
        html.push(
          '<div class="my-6 overflow-x-auto rounded-lg border border-duna-3 bg-duna-2/40"><table class="w-full border-collapse text-left text-sm text-tinta-2">'
        );
        html.push(
          `<thead class="border-b border-duna-3 bg-duna-2 text-tinta"><tr>${cells
            .map((c) => `<th class="px-4 py-2.5 font-semibold">${c}</th>`)
            .join("")}</tr></thead><tbody>`
        );
      } else {
        html.push(
          `<tr class="border-b border-duna-3/70 last:border-0">${cells
            .map((c) => `<td class="px-4 py-2.5">${c}</td>`)
            .join("")}</tr>`
        );
      }
      continue;
    } else {
      closeTable();
    }

    if (!line) {
      closeList();
      continue;
    }

    if (line === "---" || line === "***") {
      closeList();
      html.push('<hr class="my-8 border-duna-3" />');
      continue;
    }

    if (line.startsWith("### ")) {
      closeList();
      html.push(
        `<h3 class="mt-7 mb-2 font-serif text-xl font-bold text-tinta">${formatInline(line.slice(4))}</h3>`
      );
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html.push(
        `<h2 class="mt-9 mb-3 font-serif text-2xl font-bold text-tinta">${formatInline(line.slice(3))}</h2>`
      );
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      html.push(
        `<h2 class="mt-9 mb-3 font-serif text-2xl font-bold text-tinta">${formatInline(line.slice(2))}</h2>`
      );
      continue;
    }

    if (line.startsWith("> ")) {
      closeList();
      html.push(
        `<blockquote class="my-6 border-l-4 border-esmeralda bg-duna-2/60 px-5 py-3.5 text-tinta-2 italic rounded-r-md">${formatInline(line.slice(2))}</blockquote>`
      );
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (inList !== "ul") {
        closeList();
        inList = "ul";
        html.push('<ul class="my-4 space-y-2 list-disc pl-6 text-tinta-2">');
      }
      html.push(`<li class="leading-relaxed">${formatInline(line.slice(2))}</li>`);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.*)$/);
    if (ordered) {
      if (inList !== "ol") {
        closeList();
        inList = "ol";
        html.push('<ol class="my-4 space-y-2 list-decimal pl-6 text-tinta-2">');
      }
      html.push(`<li class="leading-relaxed">${formatInline(ordered[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p class="my-4 leading-relaxed text-tinta-2">${formatInline(line)}</p>`);
  }

  closeList();
  closeTable();
  return html.join("\n");
}

export function parseMarkdownArticle(rawContent: string): ParsedArticleInput {
  let frontmatter = "";
  let body = rawContent;

  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (match) {
    frontmatter = match[1];
    body = match[2];
  }

  const meta: Record<string, string | string[] | boolean> = {};
  for (const line of frontmatter.split("\n")) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val.startsWith("[") && val.endsWith("]")) {
      meta[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else if (val === "true" || val === "false") {
      meta[key] = val === "true";
    } else {
      meta[key] = val;
    }
  }

  const title = String(meta.title || "Guia de Aquiraz");
  const id = slugify(String(meta.slug || meta.id || title)) || `artigo-${Date.now()}`;
  const summary = String(meta.excerpt || meta.summary || meta.description || "");
  const category = String(meta.category || "Turismo & Litoral");
  const coverRaw = meta.coverImage || meta.image || meta.cover;
  const coverImage = typeof coverRaw === "string" && coverRaw.trim() ? coverRaw.trim() : undefined;
  const dateRaw = typeof meta.date === "string" ? new Date(meta.date) : new Date();
  const publishedAt = Number.isNaN(dateRaw.getTime())
    ? new Date().toISOString()
    : dateRaw.toISOString();

  return {
    id,
    title,
    summary,
    category,
    coverImage,
    publishedAt,
    tags: Array.isArray(meta.tags) ? meta.tags : undefined,
    status: meta.status === "draft" ? "draft" : "published",
    featured: Boolean(meta.featured),
    markdown: body.trim(),
    content: markdownToHtml(body.trim()),
  };
}
