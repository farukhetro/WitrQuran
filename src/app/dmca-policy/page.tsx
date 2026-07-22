import type { Metadata } from 'next';
import LegalDocsLayout, { LegalSection } from '@/components/layout/LegalDocsLayout';

export const metadata: Metadata = {
  title: 'DMCA Policy',
  description: 'WITRQURAN Digital Millennium Copyright Act (DMCA) Policy. Instructions for reporting potential copyright infringement.',
  alternates: {
    canonical: 'https://witrquran.vercel.app/dmca-policy',
  },
  openGraph: {
    title: 'DMCA Policy | WITRQURAN',
    description: 'Instructions for reporting potential copyright infringement.',
    url: 'https://witrquran.vercel.app/dmca-policy',
  }
};

export default function DMCAPolicyPage() {
  const sections: LegalSection[] = [
    { id: 'respect-for-copyright', title: 'Respect for Copyright' },
    { id: 'reporting', title: 'Reporting Infringement' },
    { id: 'contact', title: 'DMCA Contact Information' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'DMCA Policy - WITRQURAN',
    description: 'DMCA Copyright takedown procedure for WITRQURAN.',
    url: 'https://witrquran.vercel.app/dmca-policy',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalDocsLayout 
        title="DMCA Policy" 
        description="Our standardized protocol for handling Digital Millennium Copyright Act (DMCA) notices and intellectual property claims."
        lastUpdated="July 22, 2026"
        readingTime="2 min"
        sections={sections}
      >
        
        <h2 id="respect-for-copyright">Respect for Copyright</h2>
        <p>
          WITRQURAN respects the intellectual property rights of creators and organizations, and we expect our users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA) and other applicable international laws, it is our strict policy to respond promptly to clear notices of alleged copyright infringement.
        </p>

        <h2 id="reporting">Reporting Infringement</h2>
        <p>
          If you are a copyright owner, or are authorized to act on behalf of one, and you believe that any content hosted or streamed on WITRQURAN infringes upon your copyrights, you may submit a formal DMCA takedown notification.
        </p>
        <div className="callout">
          <p><strong>A valid DMCA notification must include:</strong></p>
          <ul>
            <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright interest.</li>
            <li>Clear identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing and exactly where it is located on our platform (please provide specific URLs).</li>
            <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and an active email address.</li>
            <li>A statement that you have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement, made under penalty of perjury, that the information in your notification is accurate and that you are authorized to act on behalf of the copyright owner.</li>
          </ul>
        </div>

        <h2 id="contact">DMCA Contact Information</h2>
        <p>
          <strong>Official copyright and DMCA contact information will be published before the public launch of WITRQURAN.</strong>
        </p>
        <p>
          Once published, please send all infringement notices to the designated email address that will be provided here. We will review and address all complete and valid notices promptly.
        </p>

      </LegalDocsLayout>
    </>
  );
}
