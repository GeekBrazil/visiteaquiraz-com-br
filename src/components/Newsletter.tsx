"use client";

import { useState } from "react";
import Revelar from "@/components/Revelar";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "enviando" | "sucesso">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("enviando");
    setTimeout(() => {
      setStatus("sucesso");
    }, 600);
  }

  return (
    <section id="newsletter" className="border-t border-duna-3 bg-duna py-20">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <Revelar>
          <span className="olho">Guia Semanal de Aquiraz</span>
          <h2 className="t2 mt-3 text-tinta">
            Receba roteiros locais, tábua de marés e eventos
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-tinta-2 leading-relaxed">
            Sem spam e sem conteúdo genérico. Dicas práticas de restaurantes,
            condições de vento para velejo no Pacoti e programações culturais na Prainha.
          </p>

          {status === "sucesso" ? (
            <div className="mx-auto mt-8 max-w-md rounded-md bg-esmeralda/10 p-4 text-sm font-semibold text-esmeralda">
              Pronto! Você receberá os novos roteiros e dicas direto no seu e-mail.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="flex-1 rounded-md border border-duna-3 bg-duna-2 px-4 py-3 text-sm text-tinta placeholder:text-tinta-3 focus:border-esmeralda focus:outline-hidden focus:ring-1 focus:ring-esmeralda"
              />
              <button
                type="submit"
                disabled={status === "enviando"}
                className="btn-esmeralda shrink-0"
              >
                {status === "enviando" ? "Enviando..." : "Quero receber"}
              </button>
            </form>
          )}

          <p className="mt-3 text-xs text-tinta-3">
            Privacidade respeitada. Cancele a qualquer momento com 1 clique.
          </p>
        </Revelar>
      </div>
    </section>
  );
}
