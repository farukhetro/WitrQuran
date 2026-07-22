import type { Metadata } from 'next';
import LegalDocsLayout, { LegalSection } from '@/components/layout/LegalDocsLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'WITRQURAN Privacy Policy. We do not track you, collect personal data, or serve ads.',
  alternates: {
    canonical: 'https://witrquran.vercel.app/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | WITRQURAN',
    description: 'We do not track you, collect personal data, or serve ads.',
    url: 'https://witrquran.vercel.app/privacy-policy',
  }
};

export default function PrivacyPolicyPage() {
  const sections: LegalSection[] = [
    { id: 'data-collection', title: 'Data Collection' },
    { id: 'cookies', title: 'Cookies & Local Storage' },
    { id: 'third-parties', title: 'Third Parties' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy - WITRQURAN',
    description: 'Privacy policy explaining our commitment to zero data collection.',
    url: 'https://witrquran.vercel.app/privacy-policy',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalDocsLayout 
        title="Privacy Policy" 
        description="Your spirituality is private. We guarantee that your data remains yours, with absolutely no tracking, no analytics, and zero data collection."
        lastUpdated="July 22, 2026"
        readingTime="2 min"
        sections={sections}
      >
        
        <h2 id="our-philosophy">Our Privacy Philosophy</h2>
        <p>
          At WITRQURAN, your privacy is our highest technical priority. We believe that listening to the Holy Quran is a deeply personal and spiritual experience. Because of this, we have engineered our platform from the ground up to respect your privacy unconditionally.
        </p>

        <h2 id="no-data-collection">Zero Personal Data Collection</h2>
        <p>
          We do <strong>not</strong> collect, harvest, request, or store any personally identifiable information.
        </p>
        <div className="callout">
          <p>
            <strong>Our Guarantee:</strong>
          </p>
          <ul>
            <li><strong>No Logins:</strong> You will never be asked to create an account or provide an email address.</li>
            <li><strong>No Subscriptions:</strong> There are no paid plans, meaning we do not collect or process payment information.</li>
            <li><strong>No Newsletters:</strong> We will never ask for your email to send marketing materials.</li>
          </ul>
        </div>

        <h2 id="browser-storage">How We Use Browser Storage</h2>
        <p>
          To make your listening experience smooth and convenient, WITRQURAN uses a small amount of local storage entirely within your own web browser. This is strictly functional.
        </p>
        <p>We only store the following preferences locally on your device:</p>
        <ul>
          <li><strong>Last Listened:</strong> To remember which Surahs you recently played, allowing you to quickly resume listening.</li>
          <li><strong>Playback Speed:</strong> To remember your preferred audio speed.</li>
          <li><strong>Volume Preference:</strong> To remember your chosen volume level so you aren't startled upon returning.</li>
        </ul>
        <p>
          <strong>Crucially:</strong> These preferences remain exclusively inside your browser. They are never transmitted to our servers, they are never sold, and they are never shared with anyone. If you clear your browser data, these preferences will simply reset.
        </p>

        <h2 id="no-tracking">No Analytics or Tracking</h2>
        <p>
          Unlike the vast majority of modern websites, WITRQURAN does not embed third-party analytics tools. We do not track your browsing behavior, we do not profile your usage patterns, and we do not monitor which Surahs you listen to on our servers.
        </p>

        <h2 id="no-ads">No Advertisements</h2>
        <p>
          WITRQURAN is a 100% free platform. We do not display advertisements. Consequently, there are absolutely no advertising trackers, retargeting pixels, or third-party marketing cookies present anywhere on our website.
        </p>

      </LegalDocsLayout>
    </>
  );
}
