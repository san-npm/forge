'use client';

import { useState } from 'react';
import { Icon } from './icons';
import { AquaIcon } from './aquaIcons';
import Sketch from './apps/Sketch';
import Snake from './apps/Snake';
import {
  STUDIO, SERVICES, WORK, ABOUT, CONTACT, PRICING, TOOLS, INSIGHTS,
  type WindowId, type ServiceData, type IconKey,
} from './osData';
import { HERO, type Lang } from './osI18n';

const statusLabel: Record<'eu' | 'ok' | 'care', string> = { eu: 'EU-hosted', ok: 'GDPR-ready', care: 'Review' };

const stepStyle: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6 };
const numStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--platinum-3)', flex: 'none' };

/* ---------- Welcome / Read Me ---------- */
export function WelcomeContent({ onOpen, lang = 'en' }: { onOpen: (id: WindowId) => void; lang?: Lang }) {
  const h = HERO[lang];
  const pillars: { id: WindowId; icon: IconKey; h: string; p: string }[] = [
    { id: 'ai', icon: 'ai', h: 'AI', p: 'Agents, automation & strategy that ship in weeks.' },
    { id: 'web3', icon: 'web3', h: 'Web3', p: 'dApps, smart contracts & token-gated products.' },
    { id: 'marketing', icon: 'growth', h: 'Growth', p: 'Sites, e-commerce & answer-engine SEO.' },
  ];
  return (
    <div>
      <p className="os-kicker">Welcome to {STUDIO.name}</p>
      <h1 className="os-h" style={{ fontSize: 26 }}>{h.tagline}</h1>
      <p className="os-lead"><strong>{h.sub}</strong> {h.welcomeLead}</p>
      {lang === 'en' && <p className="os-p" style={{ fontSize: 13, color: '#555' }}>{STUDIO.narrative}</p>}

      <div className="os-pillars">
        {pillars.map((p) => (
          <button key={p.id} type="button" className="os-pillar" onClick={() => onOpen(p.id)} style={{ textAlign: 'left' }}>
            <div className="os-pillar-ico"><AquaIcon name={p.icon} /></div>
            <h4>{p.h}</h4>
            <p>{p.p}</p>
          </button>
        ))}
      </div>

      <p className="os-note">{h.hint}</p>
      <div className="os-btn-row">
        <button type="button" className="os-btn os-btn--default" onClick={() => onOpen('contact')}>{h.newProject}</button>
        <button type="button" className="os-btn" onClick={() => onOpen('work')}>{h.seeWork}</button>
      </div>
    </div>
  );
}

/* ---------- Service window (AI / Web3 / Growth) ---------- */
export function ServiceContent({ data, onOpen }: { data: ServiceData; onOpen: (id: WindowId) => void }) {
  return (
    <div>
      <p className="os-kicker">{data.kicker}</p>
      <h1 className="os-h">{data.title}</h1>
      <p className="os-lead">{data.lead}</p>

      <ul className="os-list">
        {data.what.map((w) => (
          <li key={w.t}><strong>{w.t}.</strong> {w.d}</li>
        ))}
      </ul>

      <hr className="os-hr" />
      <p className="os-kicker" style={{ marginBottom: 8 }}>How we work</p>
      <div>
        {data.how.map((s, i) => (
          <div key={s} style={stepStyle}>
            <span style={numStyle}>{String(i + 1).padStart(2, '0')}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <p className="os-note" style={{ marginTop: 12 }}>{data.proof}</p>

      {data.footer && (
        <div style={{ border: '1.5px solid var(--ink)', padding: '10px 12px', marginTop: 14, fontSize: 13 }}>
          {data.footer}
        </div>
      )}

      <div className="os-btn-row" style={{ marginTop: 16 }}>
        <button type="button" className="os-btn os-btn--default" onClick={() => onOpen('contact')}>Start a project ▸</button>
        <button type="button" className="os-btn" onClick={() => onOpen('pricing')}>Pricing</button>
        <button type="button" className="os-btn" onClick={() => onOpen('work')}>Our work</button>
      </div>
    </div>
  );
}

/* ---------- Pricing ---------- */
export function PricingContent({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <div>
      <p className="os-kicker">Pricing</p>
      <h1 className="os-h">Simple, honest pricing</h1>
      <p className="os-lead">{PRICING.lead}</p>
      <div className="os-price-grid">
        {PRICING.tiers.map((t) => (
          <div key={t.name} className={`os-price-card${t.highlight ? ' is-hot' : ''}`}>
            <h4>{t.name}</h4>
            <div className="os-price">{t.price}</div>
            <p className="os-price-desc">{t.desc}</p>
            <ul className="os-list os-price-feats">
              {t.feats.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="os-note-box">{PRICING.note}</div>
      <div className="os-btn-row" style={{ marginTop: 14 }}>
        <button type="button" className="os-btn os-btn--default" onClick={() => onOpen('contact')}>Get a quote ▸</button>
        <button type="button" className="os-btn" onClick={() => onOpen('work')}>See our work</button>
      </div>
    </div>
  );
}

/* ---------- AI Tools directory ---------- */
export function ToolsContent({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <div>
      <p className="os-kicker">AI Tools · {TOOLS.items.length} rated</p>
      <h1 className="os-h">Tools we trust</h1>
      <p className="os-lead">{TOOLS.lead}</p>
      <table className="os-finder">
        <thead>
          <tr><th>Name</th><th>Category</th><th>Compliance</th></tr>
        </thead>
        <tbody>
          {TOOLS.items.map((t) => (
            <tr key={t.name}>
              <td>
                <strong>{t.name}</strong>
                <div className="meta">{t.note}</div>
              </td>
              <td>{t.cat}</td>
              <td><span className={`os-badge ${t.status}`}>{statusLabel[t.status]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="os-btn-row" style={{ marginTop: 14 }}>
        <button type="button" className="os-btn os-btn--default" onClick={() => onOpen('ai')}>Build with these ▸</button>
      </div>
    </div>
  );
}

/* ---------- Insights ---------- */
export function InsightsContent({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <div>
      <p className="os-kicker">Insights</p>
      <h1 className="os-h">From the studio</h1>
      <p className="os-lead">{INSIGHTS.lead}</p>
      {INSIGHTS.items.map((a) => (
        <div key={a.title} className="os-article">
          <span className="os-article-tag">{a.tag}</span>
          <h4>{a.title}</h4>
          <p>{a.excerpt}</p>
        </div>
      ))}
      <p className="os-note" style={{ marginTop: 6 }}>More notes soon.</p>
      <div className="os-btn-row" style={{ marginTop: 12 }}>
        <button type="button" className="os-btn os-btn--default" onClick={() => onOpen('contact')}>Work with us ▸</button>
      </div>
    </div>
  );
}

/* ---------- Work (Finder list) ---------- */
export function WorkContent({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <div>
      <p className="os-kicker">Macintosh HD ▸ Work — {WORK.length} items</p>
      <table className="os-finder">
        <thead>
          <tr><th>Name</th><th>Kind</th><th style={{ textAlign: 'right' }}>Year</th></tr>
        </thead>
        <tbody>
          {WORK.map((w) => (
            <tr key={w.name}>
              <td>
                <span className="file-ico" style={{ display: 'inline-block' }}><AquaIcon name="doc" /></span>
                <strong>{w.name}</strong>
                <div className="meta" style={{ paddingLeft: 25 }}>{w.blurb}</div>
              </td>
              <td>{w.kind}</td>
              <td style={{ textAlign: 'right' }} className="meta">{w.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="os-btn-row" style={{ marginTop: 16 }}>
        <button type="button" className="os-btn os-btn--default" onClick={() => onOpen('contact')}>Build something like this ▸</button>
      </div>
    </div>
  );
}

/* ---------- About ---------- */
export function AboutContent({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <div>
      <p className="os-kicker">About this studio</p>
      <div className="os-bio">
        <div className="os-portrait"><Icon name="about" /></div>
        <div>
          <h1 className="os-h" style={{ fontSize: 18, marginBottom: 2 }}>{ABOUT.founderName}</h1>
          <p className="os-note" style={{ marginBottom: 0 }}>{ABOUT.founderRole}</p>
        </div>
      </div>
      <p className="os-p">{ABOUT.bioLead}</p>
      <ul className="os-list">
        {ABOUT.facts.map((f) => <li key={f}>{f}</li>)}
      </ul>
      <hr className="os-hr" />
      <p className="os-note">{ABOUT.entity}</p>
      <div className="os-btn-row" style={{ marginTop: 14 }}>
        <button type="button" className="os-btn os-btn--default" onClick={() => onOpen('contact')}>Work with us ▸</button>
      </div>
    </div>
  );
}

/* ---------- Contact / New Project ---------- */
export function ContactContent() {
  const [sent, setSent] = useState(false);
  const [type, setType] = useState(CONTACT.types[0]);

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 8px' }}>
        <div style={{ width: 56, height: 56, margin: '0 auto 14px' }}><Icon name="disk" /></div>
        <h1 className="os-h" style={{ fontSize: 20 }}>Message sent ✓</h1>
        <p className="os-p">Thanks — we’ll reply within one business day.</p>
        <button type="button" className="os-btn" onClick={() => setSent(false)}>Send another</button>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      projectType: type,
      message: data.get('message'),
      source: 'openletz-os',
    };
    setSent(true); // optimistic — UX always completes
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => { /* lead is non-critical; ignore network errors */ });
  };

  return (
    <form onSubmit={onSubmit}>
      <p className="os-kicker">New Project</p>
      <p className="os-lead" style={{ fontSize: 14 }}>{CONTACT.lead}</p>

      <div className="os-field">
        <label htmlFor="c-name">Name</label>
        <input id="c-name" name="name" className="os-input" required placeholder="Jane Doe" />
      </div>
      <div className="os-field">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" className="os-input" required placeholder="jane@company.lu" />
      </div>
      <div className="os-field">
        <label htmlFor="c-type">What do you need?</label>
        <select id="c-type" className="os-select" value={type} onChange={(e) => setType(e.target.value)}>
          {CONTACT.types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="os-field">
        <label htmlFor="c-msg">Tell us about it</label>
        <textarea id="c-msg" name="message" className="os-textarea" rows={3} placeholder="A few lines about the project, timeline and budget." />
      </div>

      <div className="os-btn-row">
        <button type="submit" className="os-btn os-btn--default">Send ▸</button>
        <span className="os-note">{CONTACT.callLine}</span>
      </div>
    </form>
  );
}

/* ---------- registry: id -> content ---------- */
export function WindowBody({ id, onOpen, lang }: { id: WindowId; onOpen: (id: WindowId) => void; lang?: Lang }) {
  switch (id) {
    case 'welcome': return <WelcomeContent onOpen={onOpen} lang={lang} />;
    case 'ai': return <ServiceContent data={SERVICES.ai} onOpen={onOpen} />;
    case 'web3': return <ServiceContent data={SERVICES.web3} onOpen={onOpen} />;
    case 'marketing': return <ServiceContent data={SERVICES.marketing} onOpen={onOpen} />;
    case 'pricing': return <PricingContent onOpen={onOpen} />;
    case 'tools': return <ToolsContent onOpen={onOpen} />;
    case 'insights': return <InsightsContent onOpen={onOpen} />;
    case 'work': return <WorkContent onOpen={onOpen} />;
    case 'about': return <AboutContent onOpen={onOpen} />;
    case 'contact': return <ContactContent />;
    case 'sketch': return <Sketch />;
    case 'snake': return <Snake />;
    default: return null;
  }
}
