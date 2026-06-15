import { describe, it, expect } from 'vitest';
import { HERO, LANGS } from '@/data/hero-i18n';
import { STUDIO, getStudio } from '@/data/studio';

describe('HERO i18n', () => {
  it('has exactly en/fr/de (LB dropped)', () => {
    expect(Object.keys(HERO).sort()).toEqual(['de', 'en', 'fr']);
  });
  it('en aliases STUDIO', () => {
    expect(HERO.en.tagline).toBe(STUDIO.tagline);
    expect(HERO.en.sub).toBe(STUDIO.sub);
    expect(HERO.en.welcomeLead).toBe(STUDIO.welcomeLead);
    expect(HERO.en.hint).toBe(STUDIO.hint);
  });
  it('fr/de carry localized taglines and CTA labels', () => {
    expect(HERO.fr.tagline).toBe('Des sites qui pensent, bougent et transigent.');
    expect(HERO.fr.newProject).toBe('Démarrer un projet');
    expect(HERO.de.tagline).toBe('Websites, die denken, bewegen und handeln.');
    expect(HERO.de.newProject).toBe('Projekt starten');
  });
  it('fr/de hero identity aliases the translated studio module (one source of truth)', () => {
    expect(HERO.fr.tagline).toBe(getStudio('fr').tagline);
    expect(HERO.fr.sub).toBe(getStudio('fr').sub);
    expect(HERO.fr.welcomeLead).toBe(getStudio('fr').welcomeLead);
    expect(HERO.fr.hint).toBe(getStudio('fr').hint);
    expect(HERO.de.tagline).toBe(getStudio('de').tagline);
    expect(HERO.de.welcomeLead).toBe(getStudio('de').welcomeLead);
  });
  it('carries no Aqua-OS-shell copy in any locale', () => {
    for (const k of ['en', 'fr', 'de'] as const) {
      const blob = `${HERO[k].welcomeLead} ${HERO[k].hint} ${HERO[k].newProject}`;
      expect(blob).not.toMatch(/double-?click|doppelklick|new project|nouveau projet|neues projekt|icon|icône/i);
    }
  });
  it('every locale has a seeWork label', () => {
    for (const k of ['en', 'fr', 'de'] as const) {
      expect(HERO[k].seeWork.length).toBeGreaterThan(0);
    }
  });
});

describe('LANGS', () => {
  it('lists exactly en/fr/de in order (LB dropped)', () => {
    expect(LANGS.map((l) => l.code)).toEqual(['en', 'fr', 'de']);
  });
  it('each lang has a flag and label', () => {
    for (const l of LANGS) {
      expect(l.flag.length).toBeGreaterThan(0);
      expect(l.label.length).toBeGreaterThan(0);
    }
  });
});
