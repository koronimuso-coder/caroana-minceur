import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact & Conseil — CAROANA MINCEUR | Notre Assistance",
  description: "Contactez l'équipe de CAROANA MINCEUR. Posez vos questions sur nos cures, demandez un conseil personnalisé gratuit ou suivez votre commande.",
};

export default function ContactPage() {
  return <ContactClient />;
}
