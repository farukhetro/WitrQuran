import type { Metadata } from 'next';
import LegalDocsLayout, { LegalSection } from '@/components/layout/LegalDocsLayout';

export const metadata: Metadata = {
  title: 'Copyright Policy',
  description: 'WITRQURAN Copyright Policy. Details regarding audio ownership, licensing, and usage rights for the recitations provided on our platform.',
  alternates: {
    canonical: 'https://witrquran.vercel.app/copyright-policy',
  },
  openGraph: {
    title: 'Copyright Policy | WITRQURAN',
    description: 'Details regarding audio ownership, licensing, and usage rights.',
    url: 'https://witrquran.vercel.app/copyright-policy',
  }
};

export default function CopyrightPolicyPage() {
  const sections: LegalSection[] = [
    { id: 'ownership', title: 'Ownership of Content' },
    { id: 'audio-licensing', title: 'Audio Licensing & Permissions' },
    { id: 'usage-restrictions', title: 'User Restrictions' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Copyright Policy - WITRQURAN',
    description: 'Copyright policy regarding the audio content provided by WITRQURAN.',
    url: 'https://witrquran.vercel.app/copyright-policy',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalDocsLayout 
        title="Copyright Policy" 
        description="Understanding the intellectual property boundaries, audio licensing, and proper attribution for the resources utilized by WITRQURAN."
        lastUpdated="July 22, 2026"
        readingTime="2 min"
        sections={sections}
      >
        
        <h2 id="ownership">Ownership of Content</h2>
        <p>
          First and foremost, the Holy Quran is the divine word of Allah. WITRQURAN does not, and cannot, claim ownership over the Quran itself. 
        </p>
        <p>
          However, the specific audio recordings, website architecture, frontend code, and graphical assets used to present the Quran on this platform are subject to copyright and licensing agreements.
        </p>

        <h2 id="audio-licensing">Audio Licensing & Permissions</h2>
        <p>
          WITRQURAN currently provides audio recitations by the esteemed <strong>Mahmoud Khalil Al-Hussary</strong>. 
        </p>
        <p>
          We operate with proper permission to stream these recitations to our users. These audio files are hosted and delivered securely via Cloudflare R2 infrastructure. The recitations themselves remain the exclusive property of their rightful owners, licensors, or the respective Islamic organizations that originally recorded and distributed them.
        </p>
        <div className="callout">
          <p>
            <strong>Our Role:</strong> WITRQURAN serves solely as a free platform to provide seamless access to these recordings for the global Muslim community. We claim no ownership over the voice or the recordings.
          </p>
        </div>

        <h2 id="usage-restrictions">User Restrictions</h2>
        <p>
          While we strongly encourage you to listen, learn, and benefit from the recitations provided on WITRQURAN, you must respect the copyright of the audio files.
        </p>
        <ul>
          <li><strong>No Commercial Exploitation:</strong> You may not download, copy, re-upload, sell, or commercially exploit the audio files provided on this platform under any circumstances.</li>
          <li><strong>No Redistribution:</strong> You may not package these audio files into other applications, websites, mobile apps, or software without obtaining direct authorization from the original copyright holders.</li>
        </ul>
        <p>
          Your use of the audio on WITRQURAN is strictly restricted to personal, non-commercial listening.
        </p>

      </LegalDocsLayout>
    </>
  );
}
