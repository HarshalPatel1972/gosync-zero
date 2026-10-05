export default function manifest() {
  return {
    name: "GoSync",
    short_name: "GoSync",
    description: "Offline-first, real-time sync for web apps. Self-hosted, written in Go.",
    start_url: "/",
    display: "standalone",
    background_color: "#050508",
    theme_color: "#050508",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
