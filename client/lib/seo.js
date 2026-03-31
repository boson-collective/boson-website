import { SITE } from "./constants";

export function generateSEO({
  title,
  description,
  path = "",
  image = "/og/main.jpg",
}) {
  const baseUrl = SITE.url;
  const url = path ? `${baseUrl}/${path}` : baseUrl;

  return {
    title: title ? `${title} | ${SITE.name}` : SITE.name,
    description: description || SITE.description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: title || SITE.name,
      description: description || SITE.description,
      url,
      siteName: SITE.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: title || SITE.name,
      description: description || SITE.description,
      images: [image],
    },
  };
}