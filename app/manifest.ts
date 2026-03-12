import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coffee Log",
    short_name: "Coffee Log",
    description: "Track bean bags and grind settings from your phone.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5efe4",
    theme_color: "#6f3b1f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

