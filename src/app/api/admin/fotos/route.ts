import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { FOTOS_PREFIX, uploadFileToR2 } from "@/lib/r2";
import { slugify } from "@/lib/markdown";
import {
  type FotoGaleria,
  addFoto,
  deleteFoto,
  getFotos,
  nomeDoLocal,
  updateFoto,
} from "@/lib/storage";

const ALLOWED_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

const MAX_BYTES = 20 * 1024 * 1024;

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const localSlug = req.nextUrl.searchParams.get("local") || undefined;
  const fotos = await getFotos(localSlug);
  return NextResponse.json(fotos);
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const rawFiles = [...form.getAll("files"), form.get("file")].filter(
      (f): f is File => f instanceof File && f.size > 0
    );

    if (rawFiles.length === 0) {
      return NextResponse.json(
        { error: "Selecione pelo menos uma imagem para enviar." },
        { status: 400 }
      );
    }

    const localSlug = String(form.get("localSlug") || "porto-das-dunas").trim();
    const localNome = nomeDoLocal(localSlug);
    const tituloBase = String(form.get("titulo") || "").trim();
    const legenda = String(form.get("legenda") || "").trim();
    const destaque = String(form.get("destaque") || "false") === "true";

    const criadas: FotoGaleria[] = [];

    for (let i = 0; i < rawFiles.length; i++) {
      const file = rawFiles[i];
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: `Arquivo "${file.name}" excede o limite de 20 MB.` },
          { status: 400 }
        );
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const fallbackMime = ALLOWED_EXT[ext];
      if (!fallbackMime) {
        return NextResponse.json(
          { error: `Formato inválido (${file.name}). Use JPG, PNG, WebP ou AVIF.` },
          { status: 400 }
        );
      }

      const base =
        slugify(file.name.replace(/\.[^.]+$/, "")) || slugify(localSlug) || "foto";
      const stamp = `${Date.now()}-${i}`;
      const key = `${FOTOS_PREFIX}${stamp}-${base}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType = file.type || fallbackMime;
      const url = await uploadFileToR2(buffer, key, contentType);

      const tituloPadrao =
        tituloBase && rawFiles.length > 1
          ? `${tituloBase} (${i + 1})`
          : tituloBase || `${localNome} · Aquiraz`;

      const registro: FotoGaleria = {
        id: `foto-${stamp}`,
        url,
        key,
        titulo: tituloPadrao,
        legenda,
        localSlug,
        localNome,
        destaque,
        createdAt: new Date().toISOString(),
      };

      await addFoto(registro);
      criadas.push(registro);
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true, count: criadas.length, fotos: criadas });
  } catch (err) {
    console.error("[Upload R2 erro]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao enviar foto para R2." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      id?: string;
      titulo?: string;
      legenda?: string;
      localSlug?: string;
      destaque?: boolean;
    };
    if (!body.id) {
      return NextResponse.json({ error: "id obrigatório." }, { status: 400 });
    }

    const updated = await updateFoto(body.id, {
      titulo: body.titulo,
      legenda: body.legenda,
      localSlug: body.localSlug,
      destaque: body.destaque,
    });

    if (!updated) {
      return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });
    }

    revalidatePath("/");
    return NextResponse.json({ ok: true, foto: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao atualizar foto." },
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

  const deleted = await deleteFoto(id);
  if (!deleted) {
    return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
