import { NextResponse } from 'next/server';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { SITE_URL, LOCALES, type Locale } from '@/lib/site-config';
import fs from 'fs';
import path from 'path';

function asLocale(lang: string): Locale | undefined {
  return (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : undefined;
}

// Markdown-for-Agents endpoint.
// The middleware rewrites GETs carrying `Accept: text/markdown` on any locale
// page to /api/md/<original pathname segments>, which lands here. We return a
// markdown rendering of the page — blog posts are already MDX, other pages
// fall back to the curated llms-full.txt.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const segments = slug ?? [];
  const pathname = '/' + segments.join('/');
  const body = renderMarkdown(pathname.replace(/\/+$/, '') || '/');

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Markdown-Tokens': String(Math.ceil(body.length / 4)),
      Vary: 'Accept',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

function renderMarkdown(pathname: string): string {
  // Insights post: locale-prefixed `/fr/insights/<slug>` OR the canonical
  // unprefixed English `/insights/<slug>` (en is unprefixed with
  // localePrefix: 'as-needed', so it must be matched explicitly as 'en').
  const blogPost =
    pathname.match(/^\/([a-z]{2})\/insights\/([^/]+)$/) ??
    pathname.match(/^()(?:\/insights\/([^/]+))$/);
  if (blogPost) {
    const lang = blogPost[1] || 'en';
    const slug = blogPost[2];
    const loc = asLocale(lang);
    const post = getPostBySlug(slug);
    if (post) {
      const title = (loc && post.title?.[loc]) ?? post.title?.fr ?? slug;
      const excerpt = (loc && post.excerpt?.[loc]) ?? post.excerpt?.fr ?? '';
      return `# ${title}\n\n_${post.date}_\n\n> ${excerpt}\n\n${post.content.trim()}\n`;
    }
  }

  // Insights index: locale-prefixed `/fr/insights` OR unprefixed English `/insights`.
  const blogIndex =
    pathname.match(/^\/([a-z]{2})\/insights$/) ?? pathname.match(/^()(?:\/insights)$/);
  if (blogIndex) {
    const lang = blogIndex[1] || 'en';
    const loc = asLocale(lang);
    const posts = getAllPosts();
    const lines = posts.map((p) => {
      const title = (loc && p.title?.[loc]) ?? p.title?.fr ?? p.slug;
      const excerpt = (loc && p.excerpt?.[loc]) ?? p.excerpt?.fr ?? '';
      return `- [${title}](${SITE_URL}/${lang}/insights/${p.slug}) · ${p.date}\n  ${excerpt}`;
    });
    return `# OpenLetz Blog\n\n${lines.join('\n\n')}\n`;
  }

  try {
    return fs.readFileSync(
      path.join(process.cwd(), 'public', 'llms-full.txt'),
      'utf-8',
    );
  } catch {
    return `# OpenLetz\n\nSee ${SITE_URL}/en for the site.\n`;
  }
}
