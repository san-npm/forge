import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/site-config';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type LocalizedText = Partial<Record<Locale, string>>;

export interface BlogPost {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  date: string;
  /** The default-locale (EN) body. Use getPostBody(post, locale) for FR/DE. */
  content: string;
  /** Per-locale body text (EN from the base file; fr/de from `slug.<loc>.mdx`). */
  contentByLocale: LocalizedText;
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

/**
 * Per-locale body files live next to the base post as `<slug>.<locale>.mdx`
 * (body only, no frontmatter). The base `<slug>.mdx` carries the en/fr/de
 * frontmatter and the EN body. A missing locale file falls back to EN, so the
 * reader never errors and EN behaviour is unchanged.
 */
function readLocaleBody(baseFilename: string, locale: Locale): string | undefined {
  if (locale === DEFAULT_LOCALE) return undefined;
  const localeFile = path.join(BLOG_DIR, baseFilename.replace(/\.mdx$/, `.${locale}.mdx`));
  if (!fs.existsSync(localeFile)) return undefined;
  const raw = fs.readFileSync(localeFile, 'utf-8');
  // These files are body-only, but tolerate optional frontmatter just in case.
  return matter(raw).content.trim();
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  // Only base post files; the per-locale `<slug>.<loc>.mdx` siblings are bodies.
  const localeSuffix = new RegExp(`\\.(${LOCALES.join('|')})\\.mdx$`);
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx') && !localeSuffix.test(f));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);

    const contentByLocale: LocalizedText = { en: content };
    for (const loc of LOCALES) {
      const body = readLocaleBody(filename, loc);
      if (body) contentByLocale[loc] = body;
    }

    return {
      slug: (data.slug as string) || filename.replace('.mdx', ''),
      title: pickLocales(data.title),
      excerpt: pickLocales(data.excerpt),
      date: data.date as string,
      content,
      contentByLocale,
      metaDescription: pickLocales(data.metaDescription),
      keywords: data.keywords as string[] | undefined,
      image: data.image as string | undefined,
      author: data.author as string | undefined,
    };
  });

  return posts.sort((a, b) => {
    const at = new Date(a.date).getTime() || 0;
    const bt = new Date(b.date).getTime() || 0;
    return bt - at;
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** The post body for the active locale, falling back to EN. */
export function getPostBody(post: BlogPost, locale: Locale): string {
  return post.contentByLocale[locale] ?? post.contentByLocale.en ?? post.content;
}
