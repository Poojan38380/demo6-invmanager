import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InvManager",
    short_name: "InvManager",
    description: "Manage your inventory seamlessly!",

    theme_color: "#f1f1f1",
    background_color: "#f1f1f1",
    display: "standalone",
    start_url: "/admin",
    orientation: "portrait",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
