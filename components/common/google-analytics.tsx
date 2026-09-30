import Script from "next/script";

import { GA_MEASUREMENT_ID } from "@/lib/site";

/**
 * Google Analytics 4 (gtag.js).
 *
 * `next/script` rather than raw `<script>` tags: in the App Router a bare
 * inline script in the layout is not guaranteed to run once on client-side
 * navigation, and `afterInteractive` keeps the loader off the critical path
 * while still firing before the page settles.
 *
 * GA4 tracks SPA route changes by itself, so there is no manual `page_view`
 * push here — adding one would double-count every navigation.
 */
export function GoogleAnalytics() {
  // Deliberately not gated to production, so the tag can be verified in GA's
  // Realtime view while developing. Gate on `process.env.NODE_ENV` here if you
  // would rather keep localhost sessions out of the reports.
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
