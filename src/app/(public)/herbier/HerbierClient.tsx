"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, X, Leaf, HelpCircle, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Ingredient {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  emoji: string;
  image: string;
  origin: string;
  categories: string[];
  benefits: string[];
  traditionalUse: string;
  scientificProof: string;
  preparation: string;
  products: { name: string; slug: string }[];
}

const INGREDIENTS: Ingredient[] = [
  {
    id: "kinkeliba",
    name: "Kinkéliba",
    scientificName: "Combretum micranthum",
    family: "Combretaceae",
    emoji: "🍃",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    origin: "Savanes de Côte d'Ivoire & Sahel",
    categories: ["detox", "digestion", "ventre-plat"],
    benefits: [
      "Favorise le drainage et l'élimination des toxines de l'organisme",
      "Soutient activement la fonction hépatique et biliaire (détox du foie)",
      "Aide à réduire la rétention d'eau et à affiner la silhouette",
      "Améliore le transit intestinal et réduit les ballonnements"
    ],
    traditionalUse: "Traditionnellement consommé en infusion matinale dans toute l'Afrique de l'Ouest, le Kinkéliba est surnommé 'la tisane de longue vie' pour ses propriétés purifiantes exceptionnelles.",
    scientificProof: "Les feuilles de Kinkéliba sont extrêmement riches en flavonoïdes, en tanins et en combrétines, des composés antioxydants puissants reconnus par la pharmacopée européenne et africaine pour stimuler la sécrétion de bile et faciliter la digestion.",
    preparation: "Faire infuser 1 cuillère à soupe de feuilles dans de l'eau bouillante (95°C) pendant 8 à 10 minutes. Consommer de préférence à jeun le matin.",
    products: [
      { name: "Thé Détox Premium", slug: "the-detox" },
      { name: "Tisane Minceur", slug: "tisane-minceur" }
    ]
  },
  {
    id: "citronnelle",
    name: "Citronnelle Sauvage",
    scientificName: "Cymbopogon citratus",
    family: "Poaceae",
    emoji: "🌱",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    origin: "Régions forestières et humides de Côte d'Ivoire",
    categories: ["digestion", "detox", "ventre-plat"],
    benefits: [
      "Soulage instantanément les spasmes digestifs et les gaz",
      "Active la thermogenèse douce pour aider à brûler les calories",
      "Possède des propriétés calmantes propices à un sommeil réparateur",
      "Diurétique naturel facilitant l'évacuation rénale"
    ],
    traditionalUse: "La citronnelle sauvage est utilisée dans les rituels de tisane du soir pour détendre le corps, apaiser l'esprit et purifier le système digestif après les repas.",
    scientificProof: "Le citral et le myrcène contenus dans ses huiles essentielles confèrent à la citronnelle ses propriétés antispasmodiques et anti-inflammatoires prouvées, qui détendent les muscles de l'estomac et dégonflent le ventre.",
    preparation: "Laisser infuser dans de l'eau frémissante à 90°C pendant 5 à 7 minutes. Idéal après le dîner.",
    products: [
      { name: "Thé Détox Premium", slug: "the-detox" },
      { name: "Tisane Ventre Plat", slug: "tisane-ventre-plat" }
    ]
  },
  {
    id: "moringa",
    name: "Moringa Premium",
    scientificName: "Moringa oleifera",
    family: "Moringaceae",
    emoji: "🌿",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    origin: "Coopératives biologiques du Centre de la Côte d'Ivoire",
    categories: ["energie", "ventre-plat"],
    benefits: [
      "Coupe-faim naturel grâce à sa haute teneur en nutriments et fibres",
      "Régule la glycémie sanguine, évitant les fringales de sucre",
      "Apporte un regain d'énergie durable sans exciter le cœur",
      "Renforce les défenses naturelles grâce à ses vitamines A, C, E"
    ],
    traditionalUse: "Considéré comme un arbre miracle en Afrique, ses feuilles sont traditionnellement pilées et consommées pour lutter contre la fatigue intellectuelle et physique et pour purifier le sang.",
    scientificProof: "Des études cliniques démontrent que les isothiocyanates présents dans le Moringa contribuent à réduire la résistance à l'insuline et soutiennent la perte de poids en améliorant le métabolisme lipidique.",
    preparation: "En gélules, à prendre avec un grand verre d'eau 15 minutes avant le repas du midi.",
    products: [
      { name: "Gélules Minceur Kaylie", slug: "gelules-kaylie" },
      { name: "Gélules Minceur Skinny", slug: "gelules-skinny" }
    ]
  },
  {
    id: "djeka",
    name: "Feuilles de Djeka",
    scientificName: "Alchornea cordifolia",
    family: "Euphorbiaceae",
    emoji: "🍂",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    origin: "Forêts denses ivoiriennes",
    categories: ["post-partum", "ventre-plat"],
    benefits: [
      "Aide à raffermir les muscles abdominaux après l'accouchement",
      "Purifie l'organisme des nouvelles mamans en douceur",
      "Propriétés antibactériennes et cicatrisantes intimes naturelles",
      "Aide à réguler le cycle féminin et soulager les douleurs"
    ],
    traditionalUse: "La feuille de Djeka est l'ingrédient phare des bains de vapeur et des infusions de maternité en Afrique subsaharienne. Elle est transmise de mère en fille pour restaurer la vitalité intime et physique de la nouvelle accouchée.",
    scientificProof: "Reconnue pour sa forte concentration en flavonoïdes, tanins astringents et alcaloïdes, elle resserre les tissus musculaires distendus et favorise la résorption utérine après la grossesse.",
    preparation: "Faire bouillir une poignée de feuilles pendant 15 minutes. Boire tiède tout au long de la journée ou utiliser en bain de siège.",
    products: [
      { name: "Gélules Ventre Plat Nourrice", slug: "gelules-ventre-plat-nourrice" },
      { name: "Tisane Ventre Plat Nourrice", slug: "tisane-ventre-plat-nourrice" }
    ]
  },
  {
    id: "gingembre",
    name: "Gingembre Sauvage",
    scientificName: "Zingiber officinale",
    family: "Zingiberaceae",
    emoji: "🔥",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    origin: "Cultures traditionnelles de Côte d'Ivoire",
    categories: ["energie", "detox"],
    benefits: [
      "Stimule fortement la thermogenèse pour activer le brûlage des graisses",
      "Améliore considérablement la digestion en stimulant les enzymes de l'estomac",
      "Effet anti-fatigue puissant et tonifiant général",
      "Puissant anti-inflammatoire naturel"
    ],
    traditionalUse: "Consommé frais ou séché en boisson tonifiante, il est utilisé depuis des siècles pour redonner de la force au corps fatigué et faciliter la digestion des repas lourds.",
    scientificProof: "Le gingérol et le shogaol stimulent l'activité gastrique, accélèrent le métabolisme de base et augmentent la dépense énergétique du corps au repos.",
    preparation: "À consommer directement sous forme d'extrait sec purifié en gélules ou intégré à nos thés infusés.",
    products: [
      { name: "Gélules Minceur Skinny", slug: "gelules-skinny" },
      { name: "Thé Détox Premium", slug: "the-detox" }
    ]
  },
  {
    id: "caolin",
    name: "Caolin Purifié & Plantes",
    scientificName: "Kaolinite & Herbes",
    family: "Minéral & Botanique",
    emoji: "🫙",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    origin: "Argiles pures ivoiriennes enrichies d'extraits végétaux",
    categories: ["post-partum"],
    benefits: [
      "Raffermit la peau du ventre relâchée après la grossesse",
      "Absorbe les toxines cutanées et purifie l'épiderme",
      "Atténue l'apparence des vergetures et cicatrices de grossesse",
      "Apporte des minéraux essentiels à la régénération cutanée"
    ],
    traditionalUse: "Le caolin est appliqué sur le corps des femmes enceintes et des nouvelles mamans en couche d'onguent (kaolin blanc mélangé à des décoctions d'écorces) pour raffermir la peau et retrouver un ventre plat.",
    scientificProof: "Les minéraux d'argiles pures ont un pouvoir d'absorption élevé qui élimine les impuretés et stimule la microcirculation sanguine locale, favorisant la synthèse naturelle de collagène.",
    preparation: "Mélanger une cuillère à soupe avec de l'eau tiède pour former une pâte. Appliquer sur le ventre en massage circulaire, laisser poser 20 minutes puis rincer.",
    products: [
      { name: "Caolin Ventre Plat Nourrice", slug: "caolin-ventre-plat-nourrice" }
    ]
  },
  {
    id: "sene",
    name: "Feuilles de Séné",
    scientificName: "Cassia senna",
    family: "Fabaceae",
    emoji: "🌿",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    origin: "Zones semi-arides ouest-africaines",
    categories: ["detox", "digestion"],
    benefits: [
      "Soulage efficacement la constipation occasionnelle",
      "Nettoie et détoxifie le côlon en profondeur",
      "Aide à éliminer l'effet 'ventre gonflé' rapidement",
      "Régule les mouvements péristaltiques"
    ],
    traditionalUse: "Utilisé comme purgatif naturel traditionnel lors des cures de détoxification saisonnières pour purifier l'appareil digestif.",
    scientificProof: "Les sennosides A et B sont des principes actifs qui stimulent la motricité intestinale et augmentent l'hydratation des selles, favorisant une évacuation naturelle rapide.",
    preparation: "Faire infuser avec parcimonie (1/2 cuillère) dans une eau tiède pendant 5 minutes. Ne pas dépasser une cure de 7 jours consécutifs.",
    products: [
      { name: "Tisane Ventre Plat", slug: "tisane-ventre-plat" },
      { name: "Tisane Minceur", slug: "tisane-minceur" }
    ]
  }
];

export default function HerbierClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const filteredIngredients = INGREDIENTS.filter((ing) => {
    const matchesSearch =
      ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.benefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || ing.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <ScrollReveal animation="scale-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold tracking-widest uppercase"
            style={{
              borderColor: "rgba(var(--color-theme-accent-rgb), 0.3)",
              background: "rgba(var(--color-theme-accent-rgb), 0.05)",
              color: "var(--color-theme-accent)",
            }}>
            <Sparkles className="w-3 h-3" />
            Secrets Botaniques
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-theme-fg uppercase leading-tight">
            L&apos;Herbier <span className="text-theme-accent">Caroana</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-sm text-theme-muted leading-relaxed font-medium">
            Explorez notre bibliothèque d&apos;ingrédients d&apos;Afrique de l&apos;Ouest. De la cueillette sauvage éthique aux formulations scientifiques, découvrez le pouvoir des plantes actives sur votre silhouette et votre santé.
          </p>
        </ScrollReveal>
      </div>

      {/* Search & Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-theme-surface border border-theme-border p-4 rounded-xl shadow-premium">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            placeholder="Rechercher une plante, un bienfait..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-theme-bg border border-theme-border rounded-lg pl-10 pr-4 py-2.5 text-xs text-theme-fg placeholder-theme-muted focus:outline-none focus:border-theme-accent transition-all"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
          {[
            { id: "all", label: "Toutes les plantes" },
            { id: "ventre-plat", label: "Ventre Plat 腹" },
            { id: "detox", label: "Détox 🍃" },
            { id: "digestion", label: "Digestion 🍵" },
            { id: "post-partum", label: "Maman & Allaitement 🍼" },
            { id: "energie", label: "Énergie & Tonus ⚡" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                selectedCategory === cat.id
                  ? "bg-theme-accent border-theme-accent text-theme-bg"
                  : "bg-theme-bg border-theme-border text-theme-muted hover:text-theme-fg hover:border-theme-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of plants */}
      {filteredIngredients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredIngredients.map((ing, index) => (
            <ScrollReveal
              key={ing.id}
              animation="fade-up"
              delay={index * 50}
              className="group cursor-pointer bg-theme-surface border border-theme-border rounded-2xl overflow-hidden hover:border-theme-accent transition-all duration-300 shadow-premium flex flex-col justify-between"
            >
              <div onClick={() => setSelectedIngredient(ing)}>
                {/* Image Container with Hover Zoom */}
                <div className="relative h-48 w-full overflow-hidden bg-forest-dark/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ing.image}
                    alt={ing.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-80"
                  />
                  <div className="absolute top-4 left-4 bg-theme-bg/90 border border-theme-border rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-md">
                    {ing.emoji}
                  </div>
                  {/* Sourcing Badge */}
                  <div className="absolute bottom-4 right-4 bg-theme-bg/85 border border-theme-border/60 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-theme-fg">
                    🌍 {ing.origin.split(" ")[0]}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold group-hover:text-theme-accent transition-colors">
                      {ing.name}
                    </h3>
                    <p className="text-[11px] italic text-theme-muted">
                      {ing.scientificName} — Famille des {ing.family}
                    </p>
                  </div>

                  <p className="text-xs text-theme-muted line-clamp-3">
                    {ing.traditionalUse}
                  </p>

                  {/* Highlights of benefits */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {ing.benefits.slice(0, 2).map((benefit, i) => (
                      <span
                        key={i}
                        className="bg-forest-dark/30 border border-theme-border px-2.5 py-1 rounded-md text-[9px] font-medium text-theme-fg"
                      >
                        ✓ {benefit.split(" ").slice(0, 4).join(" ")}...
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-theme-border/40 flex items-center justify-between">
                <button
                  onClick={() => setSelectedIngredient(ing)}
                  className="text-[10px] font-bold uppercase tracking-wider text-theme-accent group-hover:underline flex items-center gap-1.5"
                >
                  Lire la fiche scientifique <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-theme-surface border border-theme-border rounded-2xl space-y-3">
          <HelpCircle className="w-12 h-12 text-theme-muted mx-auto" />
          <p className="font-serif text-lg font-bold">Aucune plante trouvée</p>
          <p className="text-xs text-theme-muted max-w-md mx-auto">
            Ajustez votre recherche ou sélectionnez une autre catégorie pour explorer notre herbier botanique.
          </p>
        </div>
      )}

      {/* Interactive Modal */}
      {selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-bg/80 backdrop-blur-md transition-all duration-300 animate-fade-in-fast">
          <div
            className="relative bg-theme-surface border border-theme-border max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Header */}
            <div className="relative h-56 w-full flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedIngredient.image}
                alt={selectedIngredient.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theme-surface via-theme-surface/40 to-transparent" />
              <button
                onClick={() => setSelectedIngredient(null)}
                className="absolute top-4 right-4 bg-theme-bg/80 border border-theme-border rounded-full p-2 hover:bg-theme-accent hover:text-theme-bg transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-6 left-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{selectedIngredient.emoji}</span>
                  <span className="bg-theme-accent/90 text-theme-bg text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Source éthique
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-black text-theme-fg uppercase">
                  {selectedIngredient.name}
                </h2>
                <p className="text-xs italic text-theme-muted">
                  {selectedIngredient.scientificName} — {selectedIngredient.family}
                </p>
              </div>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto text-xs text-theme-fg leading-relaxed">
              {/* Sourcing & Origin */}
              <div className="flex items-center gap-2 bg-theme-bg p-3 rounded-lg border border-theme-border">
                <span className="text-lg">🌍</span>
                <div>
                  <div className="font-bold text-[9px] uppercase text-theme-muted tracking-wider">Origine du Sourcing</div>
                  <div className="font-semibold text-theme-fg">{selectedIngredient.origin}</div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-theme-accent uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-theme-accent" />
                  Bienfaits Majeurs
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedIngredient.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 bg-forest-dark/20 p-2.5 rounded-lg border border-theme-border/40">
                      <span className="text-theme-accent font-bold mt-0.5">✓</span>
                      <span className="text-theme-muted font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Traditional Use */}
              <div className="space-y-1.5">
                <h4 className="font-serif text-sm font-bold text-theme-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  Sagesse Traditionnelle
                </h4>
                <p className="text-theme-muted bg-theme-bg/40 p-3 rounded-lg border border-theme-border/20 italic">
                  &ldquo;{selectedIngredient.traditionalUse}&rdquo;
                </p>
              </div>

              {/* Scientific proof */}
              <div className="space-y-1.5">
                <h4 className="font-serif text-sm font-bold text-theme-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" />
                  Validation Scientifique
                </h4>
                <p className="text-theme-muted font-medium">
                  {selectedIngredient.scientificProof}
                </p>
              </div>

              {/* Preparation tips */}
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-1">
                <div className="font-bold text-[9px] uppercase text-amber-500 tracking-wider flex items-center gap-1">
                  ⏱️ Conseil de préparation & infusion
                </div>
                <p className="text-theme-muted text-[11px] font-medium leading-relaxed">
                  {selectedIngredient.preparation}
                </p>
              </div>

              {/* Linked Products */}
              <div className="space-y-2 pt-2 border-t border-theme-border/40">
                <div className="font-bold text-[9px] uppercase text-theme-muted tracking-wider">
                  Retrouvez cet ingrédient dans :
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredient.products.map((p, i) => (
                    <Link
                      key={i}
                      href={`/produit/${p.slug}`}
                      onClick={() => setSelectedIngredient(null)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-theme-accent/40 rounded-lg hover:bg-theme-accent hover:text-theme-bg font-bold uppercase tracking-wider text-[9px] transition-all bg-theme-surface"
                    >
                      {p.name}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
