export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://boson.agency/sitemap.xml", // ← ganti domain lo
  };
}