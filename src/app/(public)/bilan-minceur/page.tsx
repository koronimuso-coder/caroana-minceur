import type { Metadata } from "next";
import BilanMinceurClient from "./BilanMinceurClient";

export const metadata: Metadata = {
  title: "Bilan Minceur & Calculateur IMC — CAROANA MINCEUR",
  description: "Calculez votre Indice de Masse Corporelle (IMC) en ligne et obtenez un bilan minceur personnalisé. Découvrez la cure de plantes ou le pack de compléments naturels adaptés à vos objectifs.",
};

export default function BilanMinceurPage() {
  return <BilanMinceurClient />;
}
