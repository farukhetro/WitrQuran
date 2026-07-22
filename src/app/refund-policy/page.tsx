import type { Metadata } from 'next';
import LegalDocsLayout, { LegalSection } from '@/components/layout/LegalDocsLayout';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'WITRQURAN Refund Policy. Learn why refunds do not apply to our 100% free platform.',
  alternates: {
    canonical: 'https://witrquran.vercel.app/refund-policy',
  },
  openGraph: {
    title: 'Refund Policy | WITRQURAN',
    description: 'WITRQURAN Refund Policy. A 100% free platform.',
    url: 'https://witrquran.vercel.app/refund-policy',
  }
};

export default function RefundPolicyPage() {
  const sections: LegalSection[] = [
    { id: 'no-purchases', title: 'No Purchases or Subscriptions' },
    { id: 'refunds-not-applicable', title: 'Refunds Not Applicable' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Refund Policy - WITRQURAN',
    description: 'Refund policy explaining that WITRQURAN is completely free.',
    url: 'https://witrquran.vercel.app/refund-policy',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalDocsLayout 
        title="Refund Policy" 
        description="Clarifying our financial model: WITRQURAN is a 100% free platform, which means financial refunds are structurally not applicable."
        lastUpdated="July 22, 2026"
        readingTime="1 min"
        sections={sections}
      >
        
        <h2 id="no-purchases">No Purchases or Subscriptions</h2>
        <p>
          WITRQURAN is fiercely committed to providing a distraction-free, completely free experience for listening to the Holy Quran. 
        </p>
        <div className="callout">
          <p>
            <strong>Financial Transparency:</strong> We do not offer any paid services, premium memberships, subscriptions, or digital products for sale. There are absolutely no hidden fees, paywalls, or premium tiers anywhere on this platform.
          </p>
        </div>

        <h2 id="refunds-not-applicable">Refunds Not Applicable</h2>
        <p>
          Because we do not accept, process, or request payments of any kind, we cannot and do not issue refunds. 
        </p>
        <p>
          If you encounter an email, website, or mobile application claiming to charge money on behalf of WITRQURAN, please be aware that it is entirely fraudulent and not affiliated with our official service. Do not provide them with your payment details.
        </p>

      </LegalDocsLayout>
    </>
  );
}
