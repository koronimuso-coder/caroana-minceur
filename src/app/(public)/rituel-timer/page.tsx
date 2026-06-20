import type { Metadata } from "next";
import RituelTimerClient from "./RituelTimerClient";

export const metadata: Metadata = {
  title: "Rituel d'Infusion — CAROANA MINCEUR | Votre Bien-être",
  description: "Accompagnez la préparation de votre Thé Détox ou Tisane Minceur Caroana grâce à notre minuteur interactif. Température, temps d'infusion et conseils herboristes.",
};

export default function RituelTimerPage() {
  return <RituelTimerClient />;
}
