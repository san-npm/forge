import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

describe('blog reader (post-salvage)', () => {
  it('returns no grants-era posts', () => {
    const slugs = getAllPosts().map((p) => p.slug);
    expect(slugs).not.toContain('fit-4-ai-guide-complet');
    expect(slugs).not.toContain('sme-package-digital-guide-complet');
    expect(slugs).not.toContain('aides-luxembourg-2026-annuaire-complet');
  });

  it('includes the new agency post and exposes en/fr/de title only', () => {
    const post = getPostBySlug('ai-agents-luxembourg-businesses');
    expect(post).not.toBeNull();
    expect(post!.title.en).toMatch(/AI agents/i);
    expect(Object.keys(post!.title).sort()).toEqual(['de', 'en', 'fr']);
  });

  it('drops dropped-locale frontmatter keys (no lb/it/pt)', () => {
    for (const p of getAllPosts()) {
      expect(p.title).not.toHaveProperty('lb');
      expect(p.title).not.toHaveProperty('it');
      expect(p.title).not.toHaveProperty('pt');
    }
  });
});
