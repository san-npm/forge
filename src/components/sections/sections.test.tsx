import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServicesGridSection } from '@/components/sections/ServicesGridSection';
import { HowWeWorkSection } from '@/components/sections/HowWeWorkSection';
import { SelectedWorkSection } from '@/components/sections/SelectedWorkSection';
import { DeeperProofSection } from '@/components/sections/DeeperProofSection';
import { TrustBlockSection } from '@/components/sections/TrustBlockSection';
import { EnquiryFormSection } from '@/components/sections/EnquiryFormSection';
import { SERVICES } from '@/data/services';
import { WORK } from '@/data/work';
import { ABOUT } from '@/data/about';
import { CONTACT } from '@/data/contact';

describe('ServicesGridSection', () => {
  it('renders the 3 pillars numbered 01/02/03 with one CTA each', () => {
    render(
      <ServicesGridSection
        type="servicesGrid"
        order={['ai', 'marketing', 'web3']}
        ctaLabel="Start a project"
        ctaHref="#enquiry"
        locale="en"
      />,
    );
    expect(screen.getByText(SERVICES.ai.title)).toBeInTheDocument();
    expect(screen.getByText(SERVICES.marketing.title)).toBeInTheDocument();
    expect(screen.getByText(SERVICES.web3.title)).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /start a project/i })).toHaveLength(3);
  });
});

describe('HowWeWorkSection', () => {
  it('renders each step and the soft SME Package line', () => {
    render(
      <HowWeWorkSection
        type="howWeWork"
        steps={SERVICES.ai.how}
        smePackageNote={SERVICES.ai.footer ?? ''}
        stickyScroll={false}
      />,
    );
    for (const step of SERVICES.ai.how) expect(screen.getByText(step)).toBeInTheDocument();
    expect(screen.getByText(/SME Package/i)).toBeInTheDocument();
  });
});

describe('SelectedWorkSection', () => {
  it('renders all 6 work cards as links to the live products + view-all', () => {
    render(
      <SelectedWorkSection type="selectedWork" items={WORK} viewAllHref="/work" locale="en" />,
    );
    for (const w of WORK) {
      const link = screen.getByRole('link', { name: new RegExp(w.name, 'i') });
      expect(link).toHaveAttribute('href', w.link);
    }
    expect(screen.getByRole('link', { name: /view all work/i })).toHaveAttribute('href', '/work');
  });
});

describe('DeeperProofSection', () => {
  it('renders metrics and is empty-safe with no testimonials', () => {
    render(
      <DeeperProofSection
        type="deeperProof"
        shippedCount={WORK.length}
        metrics={[{ id: 'shipped', label: 'Shipped', value: 6, suffix: '+' }]}
        testimonials={[]}
      />,
    );
    expect(screen.getByText('Shipped')).toBeInTheDocument();
    expect(document.querySelector('blockquote')).toBeNull();
  });

  it('renders inline testimonials when present', () => {
    render(
      <DeeperProofSection
        type="deeperProof"
        shippedCount={6}
        metrics={[]}
        testimonials={[{ quote: 'Shipped fast.', name: 'X', role: 'CEO', company: 'Y' }]}
      />,
    );
    expect(screen.getByText(/shipped fast/i)).toBeInTheDocument();
  });
});

describe('TrustBlockSection', () => {
  it('renders all ABOUT facts and the headline', () => {
    render(
      <TrustBlockSection type="trustBlock" facts={ABOUT.facts} headline="European by default." />,
    );
    for (const fact of ABOUT.facts) expect(screen.getByText(fact)).toBeInTheDocument();
    expect(screen.getByText('European by default.')).toBeInTheDocument();
  });
});

describe('EnquiryFormSection', () => {
  it('renders the #enquiry anchor, headline, call line and form island', () => {
    const { container } = render(
      <EnquiryFormSection
        type="enquiryForm"
        id="enquiry"
        headline={CONTACT.lead}
        pillars={CONTACT.types}
        callLine={CONTACT.callLine}
        bookCallHref="/contact"
      />,
    );
    expect(container.querySelector('#enquiry')).toBeInTheDocument();
    expect(screen.getByText(CONTACT.lead)).toBeInTheDocument();
    expect(screen.getByText(/15-minute intro call/i)).toBeInTheDocument();
    expect(container.querySelector('[data-enquiry-form]')).toBeInTheDocument();
  });
});
