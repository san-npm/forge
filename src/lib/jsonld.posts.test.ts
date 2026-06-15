import { describe, it, expect } from 'vitest';
import { blogPostingJsonLd, blogListingJsonLd, caseStudyJsonLd } from '@/lib/jsonld';
import { SITE_URL, localeUrl } from '@/lib/site-config';
import type { BlogPost } from '@/lib/blog';
import { getCaseStudy } from '@/data/case-studies';

const samplePost: BlogPost = {
  slug: 'ai-agents-luxembourg-businesses',
  title: { en: 'AI agents for Luxembourg', fr: 'Agents IA au Luxembourg', de: 'KI-Agenten in Luxemburg' },
  excerpt: { en: 'Excerpt EN', fr: 'Extrait FR' },
  date: '2026-06-07',
  content: 'body',
  contentByLocale: { en: 'body' },
  metaDescription: { en: 'Meta EN', fr: 'Meta FR' },
  author: 'Clément Fermaud',
  image: '/og-image.png',
};

describe('blogPostingJsonLd', () => {
  const url = localeUrl('en', '/insights/ai-agents-luxembourg-businesses');
  const node = blogPostingJsonLd({ post: samplePost, locale: 'en', url }) as Record<string, unknown>;

  it('is a BlogPosting with locale headline + description', () => {
    expect(node['@type']).toBe('BlogPosting');
    expect(node.headline).toBe('AI agents for Luxembourg');
    expect(node.description).toBe('Meta EN');
    expect(node.inLanguage).toBe('en');
  });

  it('carries datePublished/dateModified as the post date', () => {
    expect(node.datePublished).toBe('2026-06-07');
    expect(node.dateModified).toBe('2026-06-07');
  });

  it('references the Organization publisher and uses the canonical url', () => {
    expect((node.publisher as Record<string, unknown>)['@id']).toBe(`${SITE_URL}/#organization`);
    expect(node.url).toBe(url);
    expect((node.mainEntityOfPage as Record<string, unknown>)['@id']).toBe(url);
    expect(url.startsWith(SITE_URL)).toBe(true);
  });

  it('falls back to the EN title/excerpt for a locale with no meta', () => {
    const frUrl = localeUrl('fr', '/insights/ai-agents-luxembourg-businesses');
    const fr = blogPostingJsonLd({ post: samplePost, locale: 'fr', url: frUrl }) as Record<string, unknown>;
    expect(fr.headline).toBe('Agents IA au Luxembourg');
    expect(fr.inLanguage).toBe('fr');
  });

  it('uses the og-image fallback when the post has no image', () => {
    const noImg = blogPostingJsonLd({ post: { ...samplePost, image: undefined }, locale: 'en', url }) as Record<string, unknown>;
    expect(noImg.image).toBe(`${SITE_URL}/og-image.png`);
  });
});

describe('blogListingJsonLd', () => {
  const node = blogListingJsonLd([samplePost], 'en') as Record<string, unknown>;

  it('is a Blog node with the openletz.ai @id and Organization publisher', () => {
    expect(node['@type']).toBe('Blog');
    expect(node['@id']).toBe(`${localeUrl('en', '/insights')}#blog`);
    expect(node.inLanguage).toBe('en');
    expect((node.publisher as Record<string, unknown>)['@id']).toBe(`${SITE_URL}/#organization`);
  });

  it('lists one BlogPosting entry per post with a canonical url', () => {
    const entries = node.blogPost as Array<Record<string, unknown>>;
    expect(entries).toHaveLength(1);
    expect(entries[0]['@type']).toBe('BlogPosting');
    expect(entries[0].headline).toBe('AI agents for Luxembourg');
    expect(entries[0].url).toBe(localeUrl('en', '/insights/ai-agents-luxembourg-businesses'));
    expect(entries[0].datePublished).toBe('2026-06-07');
  });
});

describe('caseStudyJsonLd', () => {
  const cs = getCaseStudy('vinsfins', 'en')!;
  const url = localeUrl('en', '/work/vinsfins');
  const node = caseStudyJsonLd({ caseStudy: cs, locale: 'en', url, image: '/work/vinsfins.webp' }) as Record<string, unknown>;

  it('is an Article about the project, authored + published by the Organization', () => {
    expect(node['@type']).toBe('Article');
    expect(node.headline).toBe('Vins Fins');
    expect(node.about).toBe('Vins Fins');
    expect((node.author as Record<string, unknown>)['@id']).toBe(`${SITE_URL}/#organization`);
    expect((node.publisher as Record<string, unknown>)['@id']).toBe(`${SITE_URL}/#organization`);
    expect(node.inLanguage).toBe('en');
  });

  it('uses the canonical case-study url and an absolute image on openletz.ai', () => {
    expect(node.url).toBe(url);
    expect((node.mainEntityOfPage as Record<string, unknown>)['@id']).toBe(url);
    expect(url.startsWith(SITE_URL)).toBe(true);
    expect((node.image as string).startsWith(SITE_URL)).toBe(true);
  });
});
