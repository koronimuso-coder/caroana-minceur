import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CAROANA MINCEUR",
    short_name: "Caroana Minceur",
    description: "Produits de bien-être et compléments naturels d'inspiration africaine premium",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F0E2",
    theme_color: "#0A3823",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
