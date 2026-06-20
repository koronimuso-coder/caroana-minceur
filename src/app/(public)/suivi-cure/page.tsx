import type { Metadata } from "next";
import SuiviCureClient from "./SuiviCureClient";

export const metadata: Metadata = {
  title: "Suivi de Cure Silhouette & Routine — CAROANA MINCEUR",
  description: "Planifiez et suivez votre cure minceur de 14 ou 28 jours en ligne. Cochez vos jours de prise pour vos gélules et thés détox et recevez vos conseils au quotidien.",
};

export default function SuiviCurePage() {
  return <SuiviCureClient />;
}
