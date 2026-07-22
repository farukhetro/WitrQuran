import type { Metadata } from 'next';
import LegalDocsLayout, { LegalSection } from '@/components/layout/LegalDocsLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'WITRQURAN Cookie Policy. We do not use tracking cookies. Learn how we use local storage to improve your experience.',
  alternates: {
    canonical: 'https://witrquran.vercel.app/cookie-policy',
  },
  openGraph: {
    title: 'Cookie Policy | WITRQURAN',
    description: 'We do not use tracking cookies. Learn how we use local storage to improve your experience.',
    url: 'https://witrquran.vercel.app/cookie-policy',
  }
};

export default function CookiePolicyPage() {
  const sections: LegalSection[] = [
    { id: 'no-tracking-cookies', title: 'No Tracking Cookies' },
    { id: 'local-storage-only', title: 'Local Storage Only' },
    { id: 'managing-preferences', title: 'Managing Your Data' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Cookie Policy - WITRQURAN',
    description: 'Cookie policy explaining our strict no-tracking approach and usage of local storage.',
    url: 'https://witrquran.vercel.app/cookie-policy',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalDocsLayout 
        title="Cookie Policy" 
        description="We believe in absolute transparency. WITRQURAN uses zero tracking cookies, zero analytics cookies, and zero advertising cookies."
        lastUpdated="July 22, 2026"
        readingTime="1 min"
        sections={sections}
      >
        
        <h2 id="no-tracking-cookies">No Tracking Cookies</h2>
        <p>
          Most modern websites use cookies to track your behavior, profile your interests, and serve you targeted advertisements. <strong>WITRQURAN does none of this.</strong>
        </p>
        <p>
          We explicitly reject the use of:
        </p>
        <ul>
          <li><strong>Advertising Cookies:</strong> We do not show ads, so we do not need to track you across the web.</li>
          <li><strong>Analytics Cookies:</strong> We do not monitor how long you stay on the site or which pages you click.</li>
          <li><strong>Marketing Cookies:</strong> We do not build marketing profiles of our users.</li>
        </ul>

        <h2 id="local-storage-only">Local Storage Only</h2>
        <p>
          Instead of traditional HTTP cookies, we utilize a modern browser feature called <strong>Local Storage</strong>. This allows us to save a few essential preferences directly onto your device to enhance your listening experience.
        </p>
        <div className="callout">
          <p><strong>What we save locally:</strong></p>
          <ul>
            <li>Your last played Surah.</li>
            <li>Your preferred playback speed.</li>
            <li>Your volume level.</li>
          </ul>
        </div>
        <p>
          Because these data points are saved using Local Storage, they are never sent to our servers in network requests. They live and die entirely within your own browser.
        </p>

        <h2 id="managing-preferences">Managing Your Data</h2>
        <p>
          You have complete control over this data. Because it only exists in your browser, you can delete it at any time by simply clearing your browser's history and site data. 
        </p>
        <p>
          Doing so will reset your playback speed and volume back to their defaults the next time you visit WITRQURAN.
        </p>

      </LegalDocsLayout>
    </>
  );
}
