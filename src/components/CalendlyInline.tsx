'use client';

import Script from 'next/script';

// Clément's Calendly. The hide_* params are his; primary_color is kept as a
// forward-compatible hint (Calendly's current booking UI ignores the legacy
// background/text color params, so we don't set them and instead frame the
// widget ourselves). The cross-origin iframe can't be restyled from here, so
// the scheduler renders on its own light surface; we present it as a deliberate
// light card floating on the ink background. The widget.js (loaded once,
// lazily) scans for the `.calendly-inline-widget` element and injects the
// scheduling iframe into it.
const CALENDLY_URL =
  'https://calendly.com/san-clemente' +
  '?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=c6ff3a';

export function CalendlyInline() {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/25 bg-white shadow-[0_0_0_1px_rgba(198,255,58,0.10),0_30px_90px_-24px_rgba(0,0,0,0.65)]">
      <div
        className="calendly-inline-widget"
        data-url={CALENDLY_URL}
        style={{ minWidth: '320px', height: '700px' }}
        aria-label="Book a call with Openletz via Calendly"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
