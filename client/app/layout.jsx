import "./globals.css";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Providers from "./providers";
import LoaderGate from "../components/atoms/LoaderGate";

/* =========================
   GLOBAL SEO METADATA
========================= */
export const metadata = {
  metadataBase: new URL("https://boson.agency"), // ← GANTI DOMAIN LO

  title: {
    default: "Boson Collective — Social Media Agency Bali",
    template: "%s | Boson Collective",
  },

  description:
    "Boson is a Bali-based social media agency helping brands grow through content, strategy, and consistent digital systems.",

  openGraph: {
    title: "Boson Collective — Social Media Agency Bali",
    description:
      "Social media agency in Bali working with global brands.",
    url: "https://boson.agency",
    siteName: "Boson Collective",
    images: [
      {
        url: "/og/main.jpg", // nanti lo bikin
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Boson Collective — Social Media Agency Bali",
    description:
      "Social media agency in Bali working with global brands.",
    images: ["/og/main.jpg"],
  },

  alternates: {
    canonical: "https://boson.agency",
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* FONT */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bitcount+Prop+Single:wght@100..900&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
          rel="stylesheet"
        />

        {/* =========================
           STRUCTURED DATA (SEO)
        ========================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Boson Collective",
              url: "https://boson.agency", // ← GANTI
              logo: "https://boson.agency/boson-black.png", // ← pastikan ada di /public
              sameAs: [
                "https://instagram.com/boson.collective", // ← GANTI
              ],
            }),
          }}
        />
      </head>

      <body className="bg-neutral-950 text-neutral-100 min-h-screen">
        <Providers>
          {/* <Navbar /> */}
          {/* <main className="pt-16"> */}
          <LoaderGate>{children}</LoaderGate>
          {/* </main> */}
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}


