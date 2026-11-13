"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import lugaresJson from "@/data/lugares.json";

export interface Lugar {
  id: string;
  nome: string;
  categoria: string;
  tipo: string;
  lat: number;
  lng: number;
  site?: string;
  descricao?: string;
}

const LUGARES = lugaresJson.lugares as Lugar[];

const CATEGORIAS = [
  { id: "praia", rotulo: "Praias & Lazer", cor: "#066367" },
  { id: "atrativo", rotulo: "História & Cultura", cor: "#8c4a05" },
  { id: "natureza", rotulo: "Ecoturismo & APA", cor: "#28533c" },
];

const COR: Record<string, string> = Object.fromEntries(
  CATEGORIAS.map((c) => [c.id, c.cor])
);

function escapar(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function MapaAquiraz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<LeafletMap | null>(null);
  const camadaRef = useRef<LayerGroup | null>(null);
  const [ativas, setAtivas] = useState<string[]>(() =>
    CATEGORIAS.map((c) => c.id)
  );
  const [pronto, setPronto] = useState(false);

  const visiveis = useMemo(
    () => LUGARES.filter((l) => ativas.includes(l.categoria)),
    [ativas]
  );

  useEffect(() => {
    let cancelado = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelado || !containerRef.current || mapaRef.current) return;

      const mapa = L.map(containerRef.current, {
        center: [-3.895, -38.335],
        zoom: 11.5,
        zoomSnap: 0.5,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; Esri',
          maxZoom: 16,
        }
      ).addTo(mapa);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        { attribution: "", maxZoom: 16 }
      ).addTo(mapa);

      L.control.zoom({ position: "bottomright" }).addTo(mapa);
      camadaRef.current = L.layerGroup().addTo(mapa);
      mapaRef.current = mapa;
      setPronto(true);
    })();

    return () => {
      cancelado = true;
      mapaRef.current?.remove();
      mapaRef.current = null;
      camadaRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!pronto) return;
    let cancelado = false;

    (async () => {
      const L = (await import("leaflet")).default;
      const camada = camadaRef.current;
      const mapa = mapaRef.current;
      if (cancelado || !camada || !mapa) return;

      camada.clearLayers();

      visiveis.forEach((lugar) => {
        const cor = COR[lugar.categoria] ?? "#3d5056";
        const icone = L.divIcon({
          className: "",
          html: `<span style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;"><span style="display:block;width:16px;height:16px;border-radius:50%;background:${cor};border:2.5px solid #faf6ee;box-shadow:0 2px 6px rgba(20,35,38,.4)"></span><span class="sr-only">${escapar(lugar.nome)}</span></span>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const partes = [
          `<strong style="font-size:14px;display:block;line-height:1.3;color:#142326">${escapar(lugar.nome)}</strong>`,
          `<span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:${cor}">${escapar(lugar.tipo)}</span>`,
        ];
        if (lugar.descricao) {
          partes.push(
            `<p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#3d5056">${escapar(lugar.descricao)}</p>`
          );
        }

        const marcador = L.marker([lugar.lat, lugar.lng], {
          icon: icone,
          title: lugar.nome,
          alt: lugar.nome,
        });
        marcador.bindPopup(
          `<div style="font-family:sans-serif;padding:4px">${partes.join("")}</div>`
        );
        camada.addLayer(marcador);
      });
    })();

    return () => {
      cancelado = true;
    };
  }, [visiveis, pronto]);

  function alternar(id: string) {
    setAtivas((atuais) =>
      atuais.includes(id) ? atuais.filter((c) => c !== id) : [...atuais, id]
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-tinta-3">
          Filtrar no mapa:
        </span>
        {CATEGORIAS.map((cat) => {
          const ativo = ativas.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => alternar(cat.id)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                ativo
                  ? "bg-duna-2 text-tinta shadow-xs ring-1 ring-duna-3"
                  : "bg-transparent text-tinta-2 border border-duna-3/70 hover:bg-duna-2/60"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cat.cor }}
                aria-hidden="true"
              />
              {cat.rotulo}
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        className="h-[30rem] w-full overflow-hidden rounded-[8px] border border-duna-3 bg-duna-2 shadow-xs"
        aria-label="Mapa de Aquiraz e Porto das Dunas"
      />
    </div>
  );
}
