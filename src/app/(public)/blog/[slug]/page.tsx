import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogRepository } from "@/server/repositories/blog.repository";
import { ProductRepository } from "@/server/repositories/product.repository";
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, ShoppingCart, MessageCircle, Star } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCtaCard from "./ProductCtaCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blogRepo = new BlogRepository();
  const post = await blogRepo.getBySlug(slug);

  if (!post) {
    return { title: "Article Non Trouvé | CAROANA MINCEUR" };
  }

  return {
    title: `${post.title} | Blog CAROANA MINCEUR`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Blog CAROANA MINCEUR`,
      description: post.excerpt,
      images: [{ url: post.imageUrl }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blogRepo = new BlogRepository();
  const post = await blogRepo.getBySlug(slug);

  if (!post) {
    notFound();
  }

  const productRepo = new ProductRepository();
  const product = post.recommendedProductSlug 
    ? await productRepo.getBySlug(post.recommendedProductSlug) 
    : null;

  const relatedPosts = await blogRepo.getRelatedPosts(post.slug, 2);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-theme-bg transition-colors duration-500" style={{ color: "var(--color-theme-fg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumbs */}
        <div className="text-xs opacity-50 mb-8 flex items-center space-x-2">
          <Link href="/" className="hover:underline">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <span>/</span>
          <span className="opacity-80 truncate max-w-[200px]">{post.title}</span>
        </div>

        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-accent hover:underline mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour aux articles
        </Link>

        {/* Article Header */}
        <header className="space-y-6 mb-10">
          <span className="px-3 py-1 bg-theme-accent/10 border border-theme-accent/25 rounded-full text-[9px] font-bold text-theme-accent uppercase tracking-widest">
            {post.category}
          </span>
          
          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm opacity-70 font-medium italic border-l-2 border-theme-accent pl-4 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-y py-4 text-xs opacity-60" style={{ borderColor: "var(--color-theme-border)" }}>
            <div>
              <span className="opacity-50 block text-[9px] uppercase tracking-wider">Auteur</span>
              <strong className="font-bold">{post.author}</strong>
            </div>
            <div className="h-6 w-px bg-theme-border hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-theme-accent" />
              <span>Publié le {post.publishedAt}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-theme-accent" />
              <span>Temps de lecture : {post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Banner Cover Image */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border mb-12" style={{ borderColor: "var(--color-theme-border)" }}>
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Content Panel */}
        <article className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6 opacity-90">
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="space-y-6" />
        </article>

        {/* PRODUCT CTA INTEGRATION */}
        {product && (
          <div className="my-16">
            <ProductCtaCard product={JSON.parse(JSON.stringify(product))} />
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-6 border-t mt-12 text-xs" style={{ borderColor: "var(--color-theme-border)" }}>
            <span className="opacity-50 font-bold uppercase tracking-wider flex items-center gap-1">
              Mots-clés :
            </span>
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-theme-fg/5 rounded-lg border text-[10px] opacity-75 font-semibold" style={{ borderColor: "var(--color-theme-border)" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* RELATED ARTICLES */}
        {relatedPosts.length > 0 && (
          <section className="border-t pt-16 mt-16 space-y-8" style={{ borderColor: "var(--color-theme-border)" }}>
            <h3 className="font-serif text-2xl font-bold">Articles similaires recommandés</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rPost) => (
                <Link 
                  href={`/blog/${rPost.slug}`} 
                  key={rPost.id}
                  className="group flex gap-4 p-4 rounded-xl border bg-theme-card hover:border-theme-accent/30 transition-all text-xs"
                  style={{ borderColor: "var(--color-theme-border)" }}
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img src={rPost.imageUrl} alt={rPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-center min-w-0">
                    <span className="text-[8px] font-bold text-theme-accent uppercase tracking-widest">{rPost.category}</span>
                    <h4 className="font-bold truncate group-hover:text-theme-accent transition-colors leading-snug">{rPost.title}</h4>
                    <p className="opacity-60 text-[10px] line-clamp-2">{rPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
