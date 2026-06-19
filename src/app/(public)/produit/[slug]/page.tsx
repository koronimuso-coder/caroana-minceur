import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductRepository } from "@/server/repositories/product.repository";
import ProductDetailsClient from "./ProductDetailsClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const productRepo = new ProductRepository();
  const product = await productRepo.getBySlug(slug);

  if (!product) {
    return {
      title: "Produit Non Trouvé | CAROANA MINCEUR",
    };
  }

  return {
    title: `${product.name} | CAROANA MINCEUR`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | CAROANA MINCEUR`,
      description: product.shortDescription,
      images: [{ url: product.images[0]?.url || "" }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const productRepo = new ProductRepository();
  const product = await productRepo.getBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch all published products to show as related items
  const allProducts = await productRepo.getAll("published");
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="pt-28 pb-20 bg-theme-bg text-theme-fg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-theme-fg/50 mb-8 flex items-center space-x-2">
          <Link href="/" className="hover:text-theme-accent transition-smooth">Accueil</Link>
          <span>/</span>
          <Link href="/boutique" className="hover:text-theme-accent transition-smooth">Boutique</Link>
          <span>/</span>
          <span className="text-theme-accent-hover font-semibold text-glow">{product.name}</span>
        </div>

        {/* Client side details wrapper for interactive elements */}
        <ProductDetailsClient product={product} relatedProducts={relatedProducts} />

      </div>
    </div>
  );
}
