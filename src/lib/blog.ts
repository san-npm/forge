import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from '@/lib/site-config';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type LocalizedText = Partial<Record<Locale, string>>;

export interface BlogPost {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  date: string;
  content: string;
  metaDescription?: LocalizedText;
  keywords?: string[];
  image?: string;
  author?: string;
}

function pickLocales(raw: unknown): LocalizedText {
  const out: LocalizedText = {};
  if (raw && typeof raw === 'object') {
    for (const k of ['en', 'fr', 'de'] as const) {
      const v = (raw as Record<string, unknown>)[k];
      if (typeof v === 'string') out[k] = v;
    }
  }
  return out;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);

    return {
      slug: (data.slug as string) || filename.replace('.mdx', ''),
      title: pickLocales(data.title),
      excerpt: pickLocales(data.excerpt),
      date: data.date as string,
      content,
      metaDescription: pickLocales(data.metaDescription),
      keywords: data.keywords as string[] | undefined,
      image: data.image as string | undefined,
      author: data.author as string | undefined,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
