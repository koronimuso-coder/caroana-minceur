"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BlogRepository } from "@/server/repositories/blog.repository";
import { BlogPost } from "@/server/mockDb";
import { Sparkles, ArrowRight, BookOpen, Clock, Calendar, Tag } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CATEGORIES = [
  { label: "Tous les articles", val: "all" },
  { label: "🌿 Phytothérapie", val: "phytotherapie" },
  { label: "🍎 Nutrition", val: "nutrition" },
  { label: "🍼 Maternité", val: "maternite" },
  { label: "✨ Bien-être", val: "bien-etre" },
];

export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const repo = new BlogRepository();
      const list = await repo.getAll(activeCategory);
      setPosts(list);
      setLoading(false);
    }
    loadPosts();
  }, [activeCategory]);

  return (
    <div className="pt-28 pb-20 min-h-screen transition-colors duration-500" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <ScrollReveal animation="scale-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-bold tracking-widest uppercase"
              style={{
                borderColor: "rgba(var(--color-theme-accent-rgb), 0.3)",
                background: "rgba(var(--color-theme-accent-rgb), 0.06)",
                color: "var(--color-theme-accent)",
              }}>
              <BookOpen className="w-3.5 h-3.5" />
              Le Mag Caroana Minceur
              <Sparkles className="w-3 h-3" />
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Conseils, Phytothérapie <br />
              <span style={{ color: "var(--color-theme-accent)" }}>& Nutrition Naturelle</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-xs sm:text-sm opacity-65 leading-relaxed">
              Découvrez les secrets de la pharmacopée africaine, nos recettes détox et des guides experts pour accompagner votre cure minceur au quotidien.
            </p>
          </ScrollReveal>
        </div>

        {/* Filters */}
        <ScrollReveal animation="fade-up" delay={300} className="mb-12 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.val}
              onClick={() => setActiveCategory(cat.val)}
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded border transition-all duration-300 cursor-pointer"
              style={{
                background: activeCategory === cat.val ? "var(--color-theme-accent)" : "transparent",
                color: activeCategory === cat.val ? "var(--color-theme-bg)" : "var(--color-theme-muted)",
                borderColor: activeCategory === cat.val ? "var(--color-theme-accent)" : "var(--color-theme-border)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </ScrollReveal>

        {/* Grid List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-theme-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 opacity-60 text-xs font-bold uppercase tracking-wider">
            Aucun article dans cette catégorie pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <ScrollReveal 
                key={post.id} 
                animation="fade-up" 
                delay={idx * 100}
                className="border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-theme-card relative group"
                style={{ borderColor: "var(--color-theme-border)" }}
              >
                {/* Image aspect-video */}
                <div className="aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[8px] font-bold text-white uppercase tracking-widest">
                    {CATEGORIES.find(c => c.val === post.category)?.label || post.category}
                  </div>
                </div>

                {/* Content Panel */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-[9px] opacity-45 uppercase font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-theme-accent-hover transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-[11px] opacity-70 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--color-theme-border)" }}>
                    <span className="text-[9px] opacity-50 font-bold uppercase tracking-wider">Par {post.author.split(",")[0]}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[10px] font-black uppercase tracking-widest text-theme-accent hover:text-theme-accent-hover flex items-center gap-1 transition-colors"
                    >
                      <span>Lire l'article</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
