import type { Metadata } from 'next';
import LegalDocsLayout, { LegalSection } from '@/components/layout/LegalDocsLayout';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for WITRQURAN. Understand the operational boundaries and limitations of liability for our free platform.',
  alternates: {
    canonical: 'https://witrquran.vercel.app/disclaimer',
  },
  openGraph: {
    title: 'Disclaimer | WITRQURAN',
    description: 'Disclaimer regarding the usage of WITRQURAN.',
    url: 'https://witrquran.vercel.app/disclaimer',
  }
};

export default function DisclaimerPage() {
  const sections: LegalSection[] = [
    { id: 'as-is', title: 'Service Provided "As Is"' },
    { id: 'availability', title: 'Service Availability' },
    { id: 'accuracy', title: 'Content Accuracy' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Disclaimer - WITRQURAN',
    description: 'Disclaimer regarding the usage and availability of the WITRQURAN platform.',
    url: 'https://witrquran.vercel.app/disclaimer',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalDocsLayout 
        title="Disclaimer" 
        description="Understanding the operational boundaries, technical dependencies, and limitations of liability for our free platform."
        lastUpdated="July 22, 2026"
        readingTime="2 min"
        sections={sections}
      >
        
        <h2 id="as-is">Service Provided "As Is"</h2>
        <p>
          WITRQURAN is a free platform created for the benefit of the community. All services, features, and audio content provided through this website are offered on an "as is" and "as available" basis.
        </p>
        <p>
          We provide this service without any warranties of any kind, either express or implied, including but not limited to the implied warranties of merchantability or fitness for a particular purpose.
        </p>

        <h2 id="availability">Service Availability</h2>
        <p>
          While we make every reasonable effort to ensure that WITRQURAN remains online, fast, and accessible at all times, we cannot guarantee completely uninterrupted access. 
        </p>
        <div className="callout">
          <p>
            <strong>Technical Dependencies:</strong> The platform relies on third-party infrastructure, specifically Cloudflare R2, for the global delivery of audio files. We are not liable for temporary downtimes, network routing interruptions, or performance issues caused by circumstances beyond our direct control.
          </p>
        </div>

        <h2 id="accuracy">Content Accuracy</h2>
        <p>
          We strive to provide accurate translations, transliterations, and exact audio mappings for all 114 Surahs. The Quranic text and audio provided are sourced from verified, globally recognized repositories.
        </p>
        <p>
          However, human errors in mapping or technical glitches can occasionally occur. If you encounter an incorrect audio file playing for a specific Surah, a typo in a translation, or any other issue, please understand that this is unintentional. 
        </p>
        <p>
          WITRQURAN cannot be held liable for any such inaccuracies. For critical theological study or memorization verification, we strongly encourage users to cross-reference with official, scholarly Islamic sources.
        </p>

      </LegalDocsLayout>
    </>
  );
}
