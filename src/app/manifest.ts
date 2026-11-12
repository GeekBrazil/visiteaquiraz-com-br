import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Visite Aquiraz",
    short_name: "Aquiraz",
    description: "Guia oficial e independente de Aquiraz e Porto das Dunas.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6ee",
    theme_color: "#faf6ee",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

