import ContactClient from "./ContactClient";
import { generateSEO } from "../../lib/seo";


export const metadata = generateSEO({
  title: "Contact",
  description:
    "Contact Boson Collective, a Bali-based social media agency. Let’s build consistent and scalable digital systems for your brand.",
  path: "contact",
});

export default function Page() {
  return <ContactClient />;
}