// Server-rendered, semantically-structured copy that mirrors the OS windows.
// The Aqua desktop is a client-rendered facade; this guarantees the same copy
// is in the initial HTML for Googlebot and AI answer engines (GPTBot/ClaudeBot
// don't run JS). Visually hidden, but real, matching content — not cloaking.
import { STUDIO, SERVICES, PRICING, ABOUT, WORK } from './osData';

const PILLARS = ['ai', 'marketing', 'web3'] as const;

export default function CrawlableContent() {
  return (
    <div className="os-seo">
      <h1>{STUDIO.name} — {STUDIO.tagline}</h1>
      <p>{STUDIO.sub} {STUDIO.welcomeLead}</p>

      <h2>What we do</h2>
      {PILLARS.map((k) => {
        const s = SERVICES[k];
        return (
          <section key={k}>
            <h3>{s.title}</h3>
            <p>{s.lead}</p>
            <ul>{s.what.map((w) => <li key={w.t}><strong>{w.t}</strong>: {w.d}</li>)}</ul>
            <p>{s.proof}</p>
          </section>
        );
      })}

      <section>
        <h2>Pricing</h2>
        <p>{PRICING.lead}</p>
        <ul>{PRICING.tiers.map((t) => <li key={t.name}>{t.name} ({t.price}): {t.desc}</li>)}</ul>
        <p>{PRICING.note}</p>
      </section>

      <section>
        <h2>Work</h2>
        <ul>
          {WORK.map((w) => (
            <li key={w.slug}>
              <a href={w.link}><strong>{w.name}</strong></a> ({w.kind}): {w.about} What we did: {w.did.join('; ')}.
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>About Openletz</h2>
        <p>{ABOUT.bioLead}</p>
        <p>{ABOUT.founderName} — {ABOUT.founderRole}</p>
        <p>{ABOUT.facts.join('. ')}.</p>
        <p>{ABOUT.entity}</p>
      </section>
    </div>
  );
}
