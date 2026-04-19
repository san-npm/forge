import { NextResponse } from 'next/server';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import fs from 'fs';
import path from 'path';

// Markdown-for-Agents endpoint.
// The middleware rewrites GETs carrying `Accept: text/markdown` on any locale
// page to /api/md/<original pathname segments>, which lands here. We return a
// markdown rendering of the page — blog posts are already MDX, other pages
// fall back to the curated llms-full.txt.
export async function GET(
  _req: Request,
  { params }: { params: { slug?: string[] } },
) {
  const segments = params.slug ?? [];
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
  const blogPost = pathname.match(/^\/([a-z]{2})\/blog\/([^/]+)$/);
  if (blogPost) {
    const [, lang, slug] = blogPost;
    const post = getPostBySlug(slug);
    if (post) {
      const title = post.title?.[lang] ?? post.title?.fr ?? slug;
      const excerpt = post.excerpt?.[lang] ?? post.excerpt?.fr ?? '';
      return `# ${title}\n\n_${post.date}_\n\n> ${excerpt}\n\n${post.content.trim()}\n`;
    }
  }

  const blogIndex = pathname.match(/^\/([a-z]{2})\/blog$/);
  if (blogIndex) {
    const [, lang] = blogIndex;
    const posts = getAllPosts();
    const lines = posts.map((p) => {
      const title = p.title?.[lang] ?? p.title?.fr ?? p.slug;
      const excerpt = p.excerpt?.[lang] ?? p.excerpt?.fr ?? '';
      return `- [${title}](https://www.openletz.com/${lang}/blog/${p.slug}) — ${p.date}\n  ${excerpt}`;
    });
    return `# OpenLetz Blog\n\n${lines.join('\n\n')}\n`;
  }

  try {
    return fs.readFileSync(
      path.join(process.cwd(), 'public', 'llms-full.txt'),
      'utf-8',
    );
  } catch {
    return '# OpenLetz\n\nSee https://www.openletz.com/en for the site.\n';
  }
}
