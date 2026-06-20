import type { Metadata } from "next";
import AProposClient from "./AProposClient";

export const metadata: Metadata = {
  title: "À Propos — CAROANA MINCEUR | Notre Histoire & Mission",
  description: "Découvrez l'histoire de CAROANA MINCEUR, marque ivoirienne de bien-être naturel inspirée des plantes africaines. Notre mission, nos valeurs et notre engagement pour votre santé.",
};

export default function AProposPage() {
  return <AProposClient />;
}
