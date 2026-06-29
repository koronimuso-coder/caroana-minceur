import { MOCK_BLOG_POSTS, BlogPost } from "../mockDb";

export class BlogRepository {
  async getAll(category?: string): Promise<BlogPost[]> {
    if (category && category !== "all") {
      return MOCK_BLOG_POSTS.filter((post) => post.category === category);
    }
    return MOCK_BLOG_POSTS;
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    return MOCK_BLOG_POSTS.find((post) => post.slug === slug) || null;
  }

  async getRelatedPosts(currentSlug: string, limit = 2): Promise<BlogPost[]> {
    const current = await this.getBySlug(currentSlug);
    if (!current) return [];

    return MOCK_BLOG_POSTS
      .filter((post) => post.slug !== currentSlug)
      .filter((post) => post.category === current.category || post.tags.some(t => current.tags.includes(t)))
      .slice(0, limit);
  }
}
