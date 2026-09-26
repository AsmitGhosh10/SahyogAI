import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SahyogAI — Cooperative assistant",
    short_name: "SahyogAI",
    description: "Voice-first cooperative rights, documents and grievance help in Hindi, Bengali and English.",
    start_url: "/assistant",
    display: "standalone",
    background_color: "#fbf8f1",
    theme_color: "#1f6b45",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
