export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://gosync-zero.vercel.app/sitemap.xml",
  };
}
