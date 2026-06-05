'use client';

import { useState } from 'react';
import { Icon } from './icons';
import { AquaIcon } from './aquaIcons';
import Sketch from './apps/Sketch';
import Snake from './apps/Snake';
import {
  STUDIO, SERVICES, WORK, ABOUT, CONTACT, PRICING,
  type WindowId, type ServiceData, type IconKey, type WorkItem,
} from './osData';
import { HERO, type Lang } from './osI18n';

const stepStyle: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6 };
const numStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--platinum-3)', flex: 'none' };

/* ---------- Welcome / Read Me ---------- */
export function WelcomeContent({ onOpen, lang = 'en' }: { onOpen: (id: WindowId) => void; lang?: Lang }) {
  const h = HERO[lang];
  const pillars: { id: WindowId; icon: IconKey; h: string; p: string }[] = [
    { id: 'ai', icon: 'ai', h: 'AI', p: 'Agents, chatbots and automations that save time.' },
    { id: 'marketing', icon: 'growth', h: 'Growth', p: 'Websites, shops and the marketing to get them seen.' },
    { id: 'web3', icon: 'web3', h: 'Web3', p: 'Smart contracts and on-chain apps, when you need them.' },
  ];
  return (
    <div>
      <p className="os-kicker">Welcome to {STUDIO.name}</p>
      <h1 className="os-h" style={{ fontSize: 26 }}>{h.tagline}</h1>
      <p className="os-lead"><strong>{h.sub}</strong> {h.welcomeLead}</p>

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

      {data.footer && <div className="os-note-box" style={{ marginTop: 14 }}>{data.footer}</div>}

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
      <h1 className="os-h">What it costs</h1>
      <p className="os-lead">{PRICING.lead}</p>
      <div className="os-price-grid">
        {PRICING.tiers.map((t) => (
          <div key={t.name} className={`os-price-card${t.highlight ? ' is-hot' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ width: 26, height: 26, flex: 'none' }}><AquaIcon name={t.icon} /></span>
              <h4 style={{ margin: 0 }}>{t.name}</h4>
            </div>
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

/* ---------- Work (Finder list) ---------- */
export function WorkContent({ onOpen, onOpenProject }: { onOpen: (id: WindowId) => void; onOpenProject: (slug: string) => void }) {
  return (
    <div>
      <p className="os-kicker">Macintosh HD ▸ Work — {WORK.length} items</p>
      <table className="os-finder">
        <thead>
          <tr><th>Name</th><th>Kind</th><th /></tr>
        </thead>
        <tbody>
          {WORK.map((w) => (
            <tr key={w.slug} onClick={() => onOpenProject(w.slug)} style={{ cursor: 'pointer' }}>
              <td>
                <span className="file-ico" style={{ display: 'inline-block' }}><AquaIcon name="doc" /></span>
                <strong>{w.name}</strong>
                <div className="meta" style={{ paddingLeft: 25 }}>{w.blurb}</div>
              </td>
              <td>{w.kind}</td>
              <td className="meta" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Open ›</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="os-note" style={{ marginTop: 10 }}>Click a project to open its page.</p>
      <div className="os-btn-row" style={{ marginTop: 10 }}>
        <button type="button" className="os-btn os-btn--default" onClick={() => onOpen('contact')}>Build something like this ▸</button>
      </div>
    </div>
  );
}

/* ---------- Project detail (opened from Work) ---------- */
export function ProjectContent({ project, onOpen }: { project: WorkItem | null; onOpen: (id: WindowId) => void }) {
  if (!project) return null;
  return (
    <div>
      <p className="os-kicker">{project.kind}</p>
      <h1 className="os-h">{project.name}</h1>
      <p className="os-lead">{project.about}</p>

      <p className="os-kicker" style={{ marginBottom: 8 }}>What we did</p>
      <ul className="os-list">
        {project.did.map((d) => <li key={d}>{d}</li>)}
      </ul>

      <div className="os-tags">
        {project.stack.map((s) => <span key={s} className="os-tag">{s}</span>)}
      </div>

      <hr className="os-hr" />
      <div className="os-btn-row">
        <a className="os-btn os-btn--default" href={project.link} target="_blank" rel="noopener noreferrer">Visit {project.name} ↗</a>
        <button type="button" className="os-btn" onClick={() => onOpen('contact')}>Build something like this</button>
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
export function WindowBody({ id, onOpen, onOpenProject, project, lang }: {
  id: WindowId;
  onOpen: (id: WindowId) => void;
  onOpenProject: (slug: string) => void;
  project: WorkItem | null;
  lang?: Lang;
}) {
  switch (id) {
    case 'welcome': return <WelcomeContent onOpen={onOpen} lang={lang} />;
    case 'ai': return <ServiceContent data={SERVICES.ai} onOpen={onOpen} />;
    case 'web3': return <ServiceContent data={SERVICES.web3} onOpen={onOpen} />;
    case 'marketing': return <ServiceContent data={SERVICES.marketing} onOpen={onOpen} />;
    case 'pricing': return <PricingContent onOpen={onOpen} />;
    case 'work': return <WorkContent onOpen={onOpen} onOpenProject={onOpenProject} />;
    case 'project': return <ProjectContent project={project} onOpen={onOpen} />;
    case 'about': return <AboutContent onOpen={onOpen} />;
    case 'contact': return <ContactContent />;
    case 'sketch': return <Sketch />;
    case 'snake': return <Snake />;
    default: return null;
  }
}
