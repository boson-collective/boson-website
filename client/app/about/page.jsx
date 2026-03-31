import AboutClient from "./AboutClient";
import { generateSEO } from "../../lib/seo";

export const metadata = generateSEO({
  title: "About",
  description: "About Boson Collective, a Bali-based social media agency.",
  path: "about",
});

export default function Page() {
  return <AboutClient />;
}