import type { Metadata } from "next";
import ResultatsClient from "./ResultatsClient";

export const metadata: Metadata = {
  title: "Témoignages & Résultats Avant/Après | Caroana Minceur",
  description: "Découvrez les résultats réels et les photos Avant/Après de nos clientes après leurs cures de gélules et de tisanes Caroana Minceur.",
};

export default function ResultatsPage() {
  return <ResultatsClient />;
}
