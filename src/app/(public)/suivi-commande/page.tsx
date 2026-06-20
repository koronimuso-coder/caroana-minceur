import type { Metadata } from "next";
import SuiviCommandeClient from "./SuiviCommandeClient";

export const metadata: Metadata = {
  title: "Suivi de Commande — CAROANA MINCEUR | Espace Client",
  description: "Suivez en temps réel l'avancement et la livraison de votre commande Caroana Minceur. Saisissez votre numéro de commande pour commencer.",
};

export default function SuiviCommandePage() {
  return <SuiviCommandeClient />;
}
