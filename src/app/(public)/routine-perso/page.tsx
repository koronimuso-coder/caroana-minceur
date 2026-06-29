import type { Metadata } from "next";
import RoutineBuilderClient from "./RoutineBuilderClient";

export const metadata: Metadata = {
  title: "Routine Minceur Sur-Mesure | Caroana Minceur",
  description: "Créez votre routine minceur personnalisée en 3 étapes. Choisissez vos gélules, vos tisanes et vos boosters pour une cure adaptée à vos objectifs et économisez sur votre pack.",
};

export default function RoutineBuilderPage() {
  return <RoutineBuilderClient />;
}
