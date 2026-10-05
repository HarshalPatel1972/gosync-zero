const base = "https://gosync-zero.vercel.app";

const docs = ["introduction", "quick-start", "server-setup", "conflict-resolution", "api-reference", "production"];

export default function sitemap() {
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/examples`, changeFrequency: "monthly", priority: 0.6 },
    ...docs.map((slug) => ({
      url: `${base}/docs/${slug}`,
      changeFrequency: "weekly",
      priority: slug === "quick-start" ? 0.9 : 0.8,
    })),
  ];
}
