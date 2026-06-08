'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Consent-gated analytics. GA4 + GTM only load after the visitor has granted
 * consent (cookie or localStorage flag `openletz-consent=granted`). Core Web
 * Vitals report via useReportWebVitals into dataLayer (a no-op until GTM
 * loads). Scripts use next/script afterInteractive so they never block paint.
 */
export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const has =
      typeof document !== 'undefined' &&
      (document.cookie.includes('openletz-consent=granted') ||
        window.localStorage.getItem('openletz-consent') === 'granted');
    setConsented(Boolean(has));
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

  if (!consented || (!GTM_ID && !GA_ID)) return null;

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
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
