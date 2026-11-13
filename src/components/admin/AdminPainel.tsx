"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LOCAIS_AQUIRAZ, type ArtigoBlog, type FotoGaleria } from "@/lib/storage";

interface PautaItem {
  slugBase: string;
  titulo: string;
  categoria: string;
  localSlug: string;
}

interface Props {
  initialAuth: boolean;
  initialFotos: FotoGaleria[];
  initialArtigos: ArtigoBlog[];
  pautas: PautaItem[];
}

type Aba = "fotos" | "blog" | "cron";

async function otimizarImagemParaWebP(file: File, maxDim = 1920): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/webp") {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.88)
    );
    if (!blob || blob.size >= file.size) return file;
    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

export default function AdminPainel({
  initialAuth,
  initialFotos,
  initialArtigos,
  pautas,
}: Props) {
  const [auth, setAuth] = useState(initialAuth);
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [aba, setAba] = useState<Aba>("fotos");
  const [fotos, setFotos] = useState<FotoGaleria[]>(initialFotos);
  const [artigos, setArtigos] = useState<ArtigoBlog[]>(initialArtigos);
  const [statusMsg, setStatusMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null
  );

  // Upload de fotos
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [localSlug, setLocalSlug] = useState<string>("porto-das-dunas");
  const [tituloFoto, setTituloFoto] = useState("");
  const [legendaFoto, setLegendaFoto] = useState("");
  const [destaqueFoto, setDestaqueFoto] = useState(false);
  const [otimizarWebp, setOtimizarWebp] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editor de artigo
  const [artId, setArtId] = useState("");
  const [artTitle, setArtTitle] = useState("");
  const [artCategory, setArtCategory] = useState("Praias & Roteiros");
  const [artSummary, setArtSummary] = useState("");
  const [artCover, setArtCover] = useState("");
  const [artTags, setArtTags] = useState("Aquiraz, Ceará, Turismo");
  const [artMarkdown, setArtMarkdown] = useState("");
  const [artStatus, setArtStatus] = useState<"published" | "draft">("published");
  const [savingArt, setSavingArt] = useState(false);

  // Cron
  const [pautaSelecionada, setPautaSelecionada] = useState("");
  const [runningCron, setRunningCron] = useState(false);

  // Diálogo nativo de confirmação de exclusão
  const [confirmTarget, setConfirmTarget] = useState<
    { kind: "foto" | "artigo"; id: string; label: string } | null
  >(null);
  const confirmDialogRef = useRef<HTMLDialogElement>(null);

  // Seletor de capa do R2 no modal nativo
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerDialogRef = useRef<HTMLDialogElement>(null);

  const flash = (tipo: "ok" | "erro", texto: string) => {
    setStatusMsg({ tipo, texto });
  };

  async function recarregarDados() {
    const [fRes, aRes] = await Promise.all([
      fetch("/api/admin/fotos"),
      fetch("/api/admin/articles"),
    ]);
    if (fRes.ok) setFotos((await fRes.json()) as FotoGaleria[]);
    if (aRes.ok) setArtigos((await aRes.json()) as ArtigoBlog[]);
  }

  useEffect(() => {
    const d = confirmDialogRef.current;
    if (!d) return;
    if (confirmTarget && !d.open) d.showModal();
    else if (!confirmTarget && d.open) d.close();
  }, [confirmTarget]);

  useEffect(() => {
    const d = pickerDialogRef.current;
    if (!d) return;
    if (pickerOpen && !d.open) d.showModal();
    else if (!pickerOpen && d.open) d.close();
  }, [pickerOpen]);

  // Fallback light-dismiss para Safari nos diálogos modais
  useEffect(() => {
    const attach = (dialog: HTMLDialogElement | null) => {
      if (!dialog || "closedBy" in HTMLDialogElement.prototype) return () => {};
      const outside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let pressed = false;
      const down = (e: PointerEvent) => { pressed = outside(e); };
      const up = (e: PointerEvent) => { if (pressed && outside(e)) dialog.close(); };
      dialog.addEventListener("pointerdown", down);
      dialog.addEventListener("pointerup", up);
      return () => {
        dialog.removeEventListener("pointerdown", down);
        dialog.removeEventListener("pointerup", up);
      };
    };
    const off1 = attach(confirmDialogRef.current);
    const off2 = attach(pickerDialogRef.current);
    return () => {
      off1();
      off2();
    };
  }, [confirmTarget, pickerOpen]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setLoginError(data.error || "Credencial incorreta.");
        return;
      }
      setAuth(true);
      setPassword("");
      await recarregarDados();
      flash("ok", "Sessão autenticada. Cloudflare R2 pronto.");
    } catch {
      setLoginError("Falha de conexão ao autenticar.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuth(false);
    setStatusMsg(null);
  }

  async function handleUploadFotos(e: React.FormEvent) {
    e.preventDefault();
    if (arquivos.length === 0) {
      flash("erro", "Escolha pelo menos uma imagem.");
      return;
    }

    setUploading(true);
    setStatusMsg(null);
    try {
      const form = new FormData();
      form.append("localSlug", localSlug);
      form.append("titulo", tituloFoto);
      form.append("legenda", legendaFoto);
      form.append("destaque", String(destaqueFoto));

      for (const file of arquivos) {
        const finalFile = otimizarWebp ? await otimizarImagemParaWebP(file) : file;
        form.append("files", finalFile);
      }

      const res = await fetch("/api/admin/fotos", { method: "POST", body: form });
      const data = (await res.json()) as {
        ok?: boolean;
        count?: number;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Erro no upload.");

      setArquivos([]);
      setTituloFoto("");
      setLegendaFoto("");
      setDestaqueFoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await recarregarDados();
      flash(
        "ok",
        `${data.count} foto(s) enviada(s) para o Cloudflare R2 e publicada(s) no site.`
      );
    } catch (err) {
      flash("erro", err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function toggleDestaqueFoto(foto: FotoGaleria) {
    const res = await fetch("/api/admin/fotos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: foto.id, destaque: !foto.destaque }),
    });
    if (res.ok) {
      await recarregarDados();
      flash("ok", `Foto "${foto.titulo}" atualizada.`);
    }
  }

  async function confirmarExclusao() {
    if (!confirmTarget) return;
    const { kind, id } = confirmTarget;
    confirmDialogRef.current?.close();
    setConfirmTarget(null);

    const url =
      kind === "foto"
        ? `/api/admin/fotos?id=${encodeURIComponent(id)}`
        : `/api/admin/articles?id=${encodeURIComponent(id)}`;
    const res = await fetch(url, { method: "DELETE" });
    if (res.ok) {
      await recarregarDados();
      flash(
        "ok",
        kind === "foto"
          ? "Foto removida do Cloudflare R2 e da galeria."
          : "Artigo excluído do blog."
      );
    } else {
      flash("erro", "Não foi possível excluir o item.");
    }
  }

  async function handleSalvarArtigo(e: React.FormEvent) {
    e.preventDefault();
    setSavingArt(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: artId || undefined,
          title: artTitle,
          category: artCategory,
          summary: artSummary,
          coverImage: artCover || undefined,
          tags: artTags,
          markdown: artMarkdown,
          status: artStatus,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; article?: ArtigoBlog; error?: string };
      if (!res.ok) throw new Error(data.error || "Erro ao publicar artigo.");

      await recarregarDados();
      flash("ok", `Artigo "${data.article?.title}" salvo em R2 e publicado.`);
    } catch (err) {
      flash("erro", err instanceof Error ? err.message : "Erro ao salvar artigo.");
    } finally {
      setSavingArt(false);
    }
  }

  async function handleImportarMarkdown(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const raw = await file.text();
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawMarkdown: raw }),
    });
    const data = (await res.json()) as { ok?: boolean; article?: ArtigoBlog; error?: string };
    e.target.value = "";
    if (!res.ok) {
      flash("erro", data.error || "Falha ao importar Markdown.");
      return;
    }
    await recarregarDados();
    flash("ok", `Arquivo "${file.name}" importado e publicado como "${data.article?.title}".`);
  }

  function carregarParaEdicao(a: ArtigoBlog) {
    setArtId(a.id);
    setArtTitle(a.title);
    setArtCategory(a.category);
    setArtSummary(a.summary);
    setArtCover(a.coverImage || "");
    setArtTags((a.tags || []).join(", "));
    setArtMarkdown(a.markdown || a.summary || "");
    setArtStatus(a.status);
    setAba("blog");
  }

  function limparEditor() {
    setArtId("");
    setArtTitle("");
    setArtCategory("Praias & Roteiros");
    setArtSummary("");
    setArtCover("");
    setArtTags("Aquiraz, Ceará, Turismo");
    setArtMarkdown("");
    setArtStatus("published");
  }

  async function handleDispararCron() {
    setRunningCron(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/cron/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pautaSelecionada ? { topicSlug: pautaSelecionada } : {}),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        modo?: string;
        article?: { title: string; id: string };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Erro ao executar gerador.");
      await recarregarDados();
      setPautaSelecionada("");
      flash(
        "ok",
        `Artigo "${data.article?.title}" publicado automaticamente (modo: ${data.modo}).`
      );
    } catch (err) {
      flash("erro", err instanceof Error ? err.message : "Erro ao gerar artigo.");
    } finally {
      setRunningCron(false);
    }
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-duna px-6 py-16 text-tinta">
        <div className="mx-auto max-w-md rounded-lg border border-duna-3 bg-duna-2/50 p-8">
          <p className="olho">Visite Aquiraz · Administração</p>
          <h1 id="admin-login-titulo" className="t2 mt-2 text-tinta">
            Entrar no painel
          </h1>
          <p className="mt-2 text-sm text-tinta-2">
            Publique fotos direto no Cloudflare R2, edite o blog e controle os artigos do cron.
          </p>

          <form
            method="POST"
            onSubmit={handleLogin}
            aria-labelledby="admin-login-titulo"
            className="mt-6 space-y-4"
          >
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-tinta">
                Senha de administrador <span aria-hidden="true">*</span>
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  id="admin-password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  aria-invalid={loginError ? "true" : "false"}
                  aria-describedby={loginError ? "admin-login-error" : "admin-login-help"}
                  className="min-h-12 flex-1 rounded-md border border-duna-3 bg-duna px-3.5 text-base text-tinta focus:border-esmeralda focus:outline-2 focus:outline-esmeralda"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-pressed={showPwd}
                  aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                  className="min-h-12 rounded-md border border-duna-3 bg-duna px-3 text-xs font-semibold text-tinta-2 hover:border-esmeralda"
                >
                  {showPwd ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <span id="admin-login-help" className="mt-1 block text-xs text-tinta-3">
                Aceita ADMIN_PASSWORD ou ADMIN_SECRET configurado no Coolify.
              </span>
              {loginError && (
                <p id="admin-login-error" role="alert" className="mt-2 text-xs font-semibold text-red-700">
                  {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginBusy}
              className="btn-esmeralda w-full min-h-12"
            >
              {loginBusy ? "Verificando..." : "Entrar no painel"}
            </button>
          </form>

          <div className="mt-6 border-t border-duna-3 pt-4 text-center">
            <Link href="/" className="text-xs font-semibold text-esmeralda hover:underline">
              ← Voltar para visiteaquiraz.com.br
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-duna text-tinta">
      <header className="sticky top-0 z-40 border-b border-duna-3 bg-duna/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-baseline gap-2.5">
            <Link href="/" className="font-serif text-xl font-bold text-tinta">
              Visite Aquiraz
            </Link>
            <span className="text-xs font-mono uppercase tracking-wider text-esmeralda">
              Painel · R2 &amp; Blog
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/blog"
              className="rounded-md border border-duna-3 px-3 py-1.5 text-xs font-semibold text-tinta-2 hover:border-esmeralda"
            >
              Ver Blog
            </Link>
            <Link
              href="/#galeria"
              className="rounded-md border border-duna-3 px-3 py-1.5 text-xs font-semibold text-tinta-2 hover:border-esmeralda"
            >
              Ver Galeria
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-duna-3 bg-duna-2 px-3 py-1.5 text-xs font-semibold text-tinta hover:border-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div
          role="status"
          aria-live="polite"
          className={
            statusMsg
              ? `mb-6 rounded-md border px-4 py-3 text-sm font-medium ${
                  statusMsg.tipo === "ok"
                    ? "border-esmeralda/40 bg-esmeralda-claro text-esmeralda-esc"
                    : "border-red-300 bg-red-50 text-red-800"
                }`
              : "visually-hidden"
          }
        >
          {statusMsg?.texto || ""}
        </div>

        <nav
          aria-label="Seções do painel"
          className="mb-8 flex flex-wrap gap-2 border-b border-duna-3 pb-4"
        >
          <button
            type="button"
            onClick={() => setAba("fotos")}
            aria-pressed={aba === "fotos"}
            className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              aba === "fotos"
                ? "bg-esmeralda text-renda"
                : "border border-duna-3 bg-duna-2/60 text-tinta-2 hover:border-esmeralda"
            }`}
          >
            Fotos no Cloudflare R2 ({fotos.length})
          </button>
          <button
            type="button"
            onClick={() => setAba("blog")}
            aria-pressed={aba === "blog"}
            className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              aba === "blog"
                ? "bg-esmeralda text-renda"
                : "border border-duna-3 bg-duna-2/60 text-tinta-2 hover:border-esmeralda"
            }`}
          >
            Blog &amp; Artigos ({artigos.length})
          </button>
          <button
            type="button"
            onClick={() => setAba("cron")}
            aria-pressed={aba === "cron"}
            className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              aba === "cron"
                ? "bg-esmeralda text-renda"
                : "border border-duna-3 bg-duna-2/60 text-tinta-2 hover:border-esmeralda"
            }`}
          >
            Artigos Automáticos (Cron)
          </button>
        </nav>

        {aba === "fotos" && (
          <div className="space-y-10">
            <section className="rounded-lg border border-duna-3 bg-duna-2/40 p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-tinta">
                Enviar fotos para o Cloudflare R2
              </h2>
              <p className="mt-1 text-sm text-tinta-2">
                Destino físico: bucket <code className="font-mono">allan-midia</code>{" "}
                em <code className="font-mono">visiteaquiraz/fotos/</code>, servido pela CDN{" "}
                <code className="font-mono">midia.allancandido.com</code>.
              </p>

              <form onSubmit={handleUploadFotos} className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="foto-files" className="block text-sm font-semibold text-tinta">
                    Escolher foto(s) (JPG, PNG, WebP, AVIF) <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    id="foto-files"
                    name="files"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    required
                    onChange={(e) => setArquivos(Array.from(e.target.files || []))}
                    className="mt-2 block w-full rounded-md border border-duna-3 bg-duna p-3 text-sm text-tinta file:mr-4 file:rounded file:border-0 file:bg-esmeralda file:px-4 file:py-2 file:text-xs file:font-semibold file:text-renda hover:file:bg-esmeralda-esc"
                  />
                  {arquivos.length > 0 && (
                    <p className="mt-2 text-xs text-esmeralda-esc">
                      {arquivos.length} arquivo(s) selecionado(s).
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="foto-local" className="block text-sm font-semibold text-tinta">
                    Praia ou ponto de Aquiraz
                  </label>
                  <select
                    id="foto-local"
                    name="localSlug"
                    value={localSlug}
                    onChange={(e) => setLocalSlug(e.target.value)}
                    className="mt-1.5 min-h-12 w-full rounded-md border border-duna-3 bg-duna px-3 text-base text-tinta"
                  >
                    {LOCAIS_AQUIRAZ.map((loc) => (
                      <option key={loc.slug} value={loc.slug}>
                        {loc.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="foto-titulo" className="block text-sm font-semibold text-tinta">
                    Título curto (opcional)
                  </label>
                  <input
                    id="foto-titulo"
                    name="titulo"
                    type="text"
                    value={tituloFoto}
                    onChange={(e) => setTituloFoto(e.target.value)}
                    placeholder="Ex: Pôr do sol nas Dunas do Porto"
                    className="mt-1.5 min-h-12 w-full rounded-md border border-duna-3 bg-duna px-3.5 text-base text-tinta"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="foto-legenda" className="block text-sm font-semibold text-tinta">
                    Legenda ou contexto (opcional)
                  </label>
                  <textarea
                    id="foto-legenda"
                    name="legenda"
                    rows={2}
                    value={legendaFoto}
                    onChange={(e) => setLegendaFoto(e.target.value)}
                    placeholder="Detalhes do momento, maré, ângulo ou dica para o visitante"
                    className="mt-1.5 w-full rounded-md border border-duna-3 bg-duna p-3 text-base text-tinta"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
                  <label className="inline-flex items-center gap-2 text-sm text-tinta">
                    <input
                      type="checkbox"
                      checked={otimizarWebp}
                      onChange={(e) => setOtimizarWebp(e.target.checked)}
                      className="h-4 w-4 accent-esmeralda"
                    />
                    Otimizar automaticamente para WebP (máx. 1920px)
                  </label>

                  <label className="inline-flex items-center gap-2 text-sm text-tinta">
                    <input
                      type="checkbox"
                      checked={destaqueFoto}
                      onChange={(e) => setDestaqueFoto(e.target.checked)}
                      className="h-4 w-4 accent-esmeralda"
                    />
                    Priorizar como capa automática do blog
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-esmeralda min-h-12"
                  >
                    {uploading ? "Enviando para R2..." : "Publicar foto(s) no R2"}
                  </button>
                </div>
              </form>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold text-tinta">
                Acervo publicado ({fotos.length})
              </h3>
              {fotos.length === 0 ? (
                <p className="mt-3 text-sm text-tinta-2">
                  Nenhuma foto enviada ainda. Suba a primeira acima.
                </p>
              ) : (
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {fotos.map((f) => (
                    <article
                      key={f.id}
                      className="flex flex-col justify-between overflow-hidden rounded-lg border border-duna-3 bg-duna-2/30"
                    >
                      <div>
                        <div className="relative aspect-[4/3] bg-duna-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={f.url}
                            alt={f.titulo}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 rounded bg-tinta/85 px-2 py-0.5 text-[11px] font-semibold text-renda">
                            {f.localNome}
                          </span>
                        </div>
                        <div className="p-4">
                          <h4 className="font-serif text-base font-bold text-tinta">
                            {f.titulo}
                          </h4>
                          {f.legenda && (
                            <p className="mt-1 text-xs text-tinta-2">{f.legenda}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 border-t border-duna-3 p-3">
                        <button
                          type="button"
                          onClick={async () => {
                            await navigator.clipboard.writeText(f.url);
                            flash("ok", `URL copiada: ${f.url}`);
                          }}
                          className="rounded border border-duna-3 bg-duna px-2.5 py-1 text-xs font-semibold text-tinta hover:border-esmeralda"
                        >
                          Copiar URL
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleDestaqueFoto(f)}
                          className={`rounded border px-2.5 py-1 text-xs font-semibold ${
                            f.destaque
                              ? "border-sol bg-sol-claro text-sol-esc"
                              : "border-duna-3 bg-duna text-tinta-2"
                          }`}
                        >
                          {f.destaque ? "★ Destaque" : "Destacar"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmTarget({
                              kind: "foto",
                              id: f.id,
                              label: f.titulo,
                            })
                          }
                          className="ml-auto rounded border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {aba === "blog" && (
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-lg border border-duna-3 bg-duna-2/40 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-2xl font-bold text-tinta">
                  {artId ? "Editar artigo" : "Novo artigo no blog"}
                </h2>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer rounded border border-duna-3 bg-duna px-3 py-1.5 text-xs font-semibold text-tinta hover:border-esmeralda">
                    Importar .md
                    <input
                      type="file"
                      accept=".md,.markdown,.txt"
                      onChange={handleImportarMarkdown}
                      className="visually-hidden"
                    />
                  </label>
                  {artId && (
                    <button
                      type="button"
                      onClick={limparEditor}
                      className="rounded border border-duna-3 px-3 py-1.5 text-xs font-semibold text-tinta-2"
                    >
                      Limpar / Novo
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSalvarArtigo} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="art-title" className="block text-sm font-semibold text-tinta">
                    Título <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="art-title"
                    type="text"
                    required
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    placeholder="Ex: Guia de kitesurf na Foz do Rio Pacoti"
                    className="mt-1.5 min-h-12 w-full rounded-md border border-duna-3 bg-duna px-3.5 text-base text-tinta"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="art-category" className="block text-sm font-semibold text-tinta">
                      Categoria
                    </label>
                    <input
                      id="art-category"
                      type="text"
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      className="mt-1.5 min-h-12 w-full rounded-md border border-duna-3 bg-duna px-3.5 text-base text-tinta"
                    />
                  </div>
                  <div>
                    <label htmlFor="art-status" className="block text-sm font-semibold text-tinta">
                      Status
                    </label>
                    <select
                      id="art-status"
                      value={artStatus}
                      onChange={(e) => setArtStatus(e.target.value as "published" | "draft")}
                      className="mt-1.5 min-h-12 w-full rounded-md border border-duna-3 bg-duna px-3 text-base text-tinta"
                    >
                      <option value="published">Publicado</option>
                      <option value="draft">Rascunho</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="art-cover" className="block text-sm font-semibold text-tinta">
                    Foto de capa (URL R2)
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="art-cover"
                      type="url"
                      value={artCover}
                      onChange={(e) => setArtCover(e.target.value)}
                      placeholder="https://midia.allancandido.com/visiteaquiraz/fotos/..."
                      className="min-h-12 flex-1 rounded-md border border-duna-3 bg-duna px-3.5 text-sm text-tinta"
                    />
                    <button
                      type="button"
                      onClick={() => setPickerOpen(true)}
                      className="min-h-12 rounded-md border border-duna-3 bg-duna px-3.5 text-xs font-semibold text-esmeralda hover:border-esmeralda"
                    >
                      Escolher do R2
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="art-summary" className="block text-sm font-semibold text-tinta">
                    Resumo SEO
                  </label>
                  <textarea
                    id="art-summary"
                    rows={2}
                    value={artSummary}
                    onChange={(e) => setArtSummary(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-duna-3 bg-duna p-3 text-base text-tinta"
                  />
                </div>

                <div>
                  <label htmlFor="art-tags" className="block text-sm font-semibold text-tinta">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    id="art-tags"
                    type="text"
                    value={artTags}
                    onChange={(e) => setArtTags(e.target.value)}
                    className="mt-1.5 min-h-12 w-full rounded-md border border-duna-3 bg-duna px-3.5 text-sm text-tinta"
                  />
                </div>

                <div>
                  <label htmlFor="art-md" className="block text-sm font-semibold text-tinta">
                    Conteúdo em Markdown <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="art-md"
                    rows={11}
                    required
                    value={artMarkdown}
                    onChange={(e) => setArtMarkdown(e.target.value)}
                    placeholder={"## Introdução\n\nEscreva aqui seu roteiro sobre Aquiraz..."}
                    className="mt-1.5 w-full rounded-md border border-duna-3 bg-duna p-3 font-mono text-sm text-tinta"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingArt}
                  className="btn-esmeralda min-h-12"
                >
                  {savingArt ? "Publicando..." : "Salvar e publicar artigo"}
                </button>
              </form>
            </section>

            <section className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-tinta">
                Artigos salvos no R2 ({artigos.length})
              </h3>
              {artigos.length === 0 ? (
                <p className="text-sm text-tinta-2">
                  Nenhum artigo ainda. Crie acima ou dispare o gerador na aba Cron.
                </p>
              ) : (
                <div className="space-y-3">
                  {artigos.map((a) => (
                    <article
                      key={a.id}
                      className="rounded-lg border border-duna-3 bg-duna-2/30 p-4"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-bold uppercase tracking-wider text-sol-esc">
                          {a.category}
                        </span>
                        <span className="rounded bg-duna px-2 py-0.5 font-mono text-tinta-3">
                          {a.status === "published" ? "Publicado" : "Rascunho"}
                        </span>
                      </div>
                      <h4 className="mt-1.5 font-serif text-base font-bold text-tinta">
                        {a.title}
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          href={`/blog/${a.id}`}
                          className="rounded border border-duna-3 bg-duna px-2.5 py-1 text-xs font-semibold text-esmeralda hover:border-esmeralda"
                        >
                          Abrir
                        </Link>
                        <button
                          type="button"
                          onClick={() => carregarParaEdicao(a)}
                          className="rounded border border-duna-3 bg-duna px-2.5 py-1 text-xs font-semibold text-tinta"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmTarget({
                              kind: "artigo",
                              id: a.id,
                              label: a.title,
                            })
                          }
                          className="ml-auto rounded border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {aba === "cron" && (
          <section className="max-w-3xl space-y-6 rounded-lg border border-duna-3 bg-duna-2/40 p-6 sm:p-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-tinta">
                Publicação Automática com Cron
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-tinta-2">
                O endpoint <code className="font-mono">POST /api/cron/blog</code> gera um
                artigo completo de Aquiraz usando dados reais de clima (INMET), economia local
                (Receita Federal) e seleciona automaticamente uma foto do seu Cloudflare R2
                como capa. Se <code className="font-mono">OPENAI_API_KEY</code> estiver
                definida no Coolify, usa LLM; caso contrário, utiliza o motor editorial factual
                embutido.
              </p>
            </div>

            <div className="rounded-md border border-duna-3 bg-duna p-4">
              <label htmlFor="cron-topic" className="block text-sm font-semibold text-tinta">
                Escolher pauta específica ou deixar no automático
              </label>
              <select
                id="cron-topic"
                value={pautaSelecionada}
                onChange={(e) => setPautaSelecionada(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-md border border-duna-3 bg-duna-2/40 px-3 text-sm text-tinta"
              >
                <option value="">Automático (próxima pauta ainda não publicada)</option>
                {pautas.map((p) => (
                  <option key={p.slugBase} value={p.slugBase}>
                    [{p.categoria}] {p.titulo}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={runningCron}
                onClick={handleDispararCron}
                className="btn-esmeralda mt-4 min-h-12"
              >
                {runningCron ? "Gerando e publicando..." : "Gerar e publicar artigo agora"}
              </button>
            </div>

            <div className="rounded-md border border-duna-3 bg-duna p-4 text-xs leading-relaxed text-tinta-2">
              <p className="font-semibold text-tinta">Agenda programada no VPS Hetzner:</p>
              <p className="mt-1">
                Cron configurado no servidor (<code className="font-mono">0 11 * * 1,4</code>{" "}
                UTC = segundas e quintas às 08h00 BRT), autenticando via{" "}
                <code className="font-mono">Authorization: Bearer &lt;CRON_SECRET&gt;</code> em{" "}
                <code className="font-mono">https://visiteaquiraz.com.br/api/cron/blog</code>.
              </p>
            </div>
          </section>
        )}
      </main>

      <dialog
        ref={confirmDialogRef}
        {...({ closedby: "any" } as Record<string, string>)}
        aria-labelledby="confirm-del-title"
        onClose={() => setConfirmTarget(null)}
        className="m-auto w-[min(92vw,28rem)] rounded-lg border border-duna-3 bg-duna p-6 text-tinta shadow-xl"
      >
        <h3 id="confirm-del-title" className="font-serif text-lg font-bold text-tinta">
          Confirmar exclusão
        </h3>
        <p className="mt-2 text-sm text-tinta-2">
          Deseja remover permanentemente{" "}
          <strong className="text-tinta">{confirmTarget?.label}</strong>?{" "}
          {confirmTarget?.kind === "foto" &&
            "O arquivo também será apagado do bucket allan-midia no Cloudflare R2."}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            onClick={() => confirmDialogRef.current?.close()}
            className="rounded-md border border-duna-3 bg-duna-2 px-4 py-2 text-xs font-semibold text-tinta"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmarExclusao}
            className="rounded-md bg-red-700 px-4 py-2 text-xs font-semibold text-white hover:bg-red-800"
          >
            Excluir definitivamente
          </button>
        </div>
      </dialog>

      <dialog
        ref={pickerDialogRef}
        {...({ closedby: "any" } as Record<string, string>)}
        aria-labelledby="picker-title"
        onClose={() => setPickerOpen(false)}
        className="m-auto w-[min(94vw,46rem)] rounded-lg border border-duna-3 bg-duna p-6 text-tinta shadow-xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-duna-3 pb-3">
          <h3 id="picker-title" className="font-serif text-lg font-bold text-tinta">
            Escolher capa do Cloudflare R2
          </h3>
          <button
            type="button"
            onClick={() => pickerDialogRef.current?.close()}
            className="rounded border border-duna-3 px-3 py-1 text-xs font-semibold text-tinta"
          >
            Fechar
          </button>
        </div>
        {fotos.length === 0 ? (
          <p className="py-8 text-center text-sm text-tinta-2">
            Suba uma foto na aba &ldquo;Fotos no Cloudflare R2&rdquo; para escolhê-la aqui.
          </p>
        ) : (
          <div className="mt-4 grid max-h-[60vh] gap-3 overflow-y-auto sm:grid-cols-3">
            {fotos.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setArtCover(f.url);
                  pickerDialogRef.current?.close();
                }}
                className="overflow-hidden rounded border border-duna-3 text-left hover:border-esmeralda"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.titulo} className="aspect-[4/3] w-full object-cover" />
                <p className="truncate p-2 text-xs font-semibold text-tinta">{f.titulo}</p>
              </button>
            ))}
          </div>
        )}
      </dialog>
    </div>
  );
}
