import type { Metadata } from "next";
import HerbierClient from "./HerbierClient";

export const metadata: Metadata = {
  title: "L'Herbier Caroana | Sagesse Botanique Africaine & Bien-être",
  description: "Découvrez les secrets de nos plantes d'Afrique de l'Ouest : Kinkéliba, Moringa, Djeka, Citronnelle. Apprenez leurs bienfaits scientifiques et traditionnels.",
};

export default function HerbierPage() {
  return <HerbierClient />;
}
