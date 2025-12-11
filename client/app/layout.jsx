import "./globals.css";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Providers from "./providers";
import LoaderGate from "../components/atoms/LoaderGate";

export const metadata = {
  title: "BOSON COLLECTIVE | Social Media Agency",
  description: "Transforming signals into stories. We turn chaos into meaning through creative digital experiences.",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <link href="https://fonts.googleapis.com/css2?family=Bitcount+Prop+Single:wght@100..900&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" rel="stylesheet"></link>
       </head>
      <body className="bg-neutral-950 text-neutral-100 min-h-screen">
        <Providers>
          {/* <Navbar />   */}
          {/* <main className="pt-16"> */}
            <LoaderGate>
              {children}
            </LoaderGate>
          {/* </main> */}
          {/* <Footer />   */}
        </Providers>
      </body>
    </html>
  );
}
