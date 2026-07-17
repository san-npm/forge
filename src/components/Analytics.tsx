'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
// GA4 measurement IDs are public (exposed client-side anyway); default to the
// Openletz property, overridable via env.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-H3JLD7XB5Y';

/**
 * Analytics with Google Consent Mode v2 (GDPR-appropriate). The gtag base loads
 * for every visitor, but consent DEFAULT is `denied`, so GA4 sends only
 * cookieless, aggregated pings until a choice is made: traffic is measurable
 * (and Google's tag check passes) without setting any cookie pre-consent. When
 * the visitor accepts (cookie/localStorage flag `openletz-consent=granted`, set
 * by ConsentBanner, which also fires the `openletz-consent` event) we push a
 * consent UPDATE to `granted`, unlocking full cookie-based measurement with no
 * reload. Declining keeps the denied default. The default is seeded from the
 * cookie so returning consenters get full measurement on first paint. Core Web
 * Vitals report into dataLayer. Scripts use next/script afterInteractive so they
 * never block paint.
 */
export function Analytics() {
  useEffect(() => {
    const grant = () => {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      const granted =
        document.cookie.includes('openletz-consent=granted') ||
        window.localStorage.getItem('openletz-consent') === 'granted';
      if (granted && typeof w.gtag === 'function') {
        w.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      }
    };
    grant();
    // ConsentBanner dispatches this on Accept so tracking upgrades without a reload.
    window.addEventListener('openletz-consent', grant);
    return () => window.removeEventListener('openletz-consent', grant);
  }, []);

  useReportWebVitals((metric) => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: 'web-vitals',
      metric_name: metric.name,
      metric_value: metric.value,
      metric_id: metric.id,
    });
  });

  if (!GTM_ID && !GA_ID) return null;

  return (
    <>
      {GTM_ID ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}
      {GA_ID ? (
        <>
          <Script id="gtag-consent-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var __olGranted = document.cookie.indexOf('openletz-consent=granted') !== -1;
gtag('consent', 'default', {
  ad_storage: __olGranted ? 'granted' : 'denied',
  ad_user_data: __olGranted ? 'granted' : 'denied',
  ad_personalization: __olGranted ? 'granted' : 'denied',
  analytics_storage: __olGranted ? 'granted' : 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
        </>
      ) : null}
    </>
  );
}
