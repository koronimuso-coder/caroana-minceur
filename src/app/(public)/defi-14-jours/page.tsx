import type { Metadata } from "next";
import DefiMinceurClient from "./DefiMinceurClient";

export const metadata: Metadata = {
  title: "Le Défi Minceur 14 Jours | Caroana Minceur",
  description: "Relevez le défi détox de 14 jours ! Validez vos rituels quotidiens, suivez votre régularité et débloquez une surprise exclusive à la fin de votre cure.",
};

export default function DefiMinceurPage() {
  return <DefiMinceurClient />;
}
