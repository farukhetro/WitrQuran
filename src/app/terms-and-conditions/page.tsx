import type { Metadata } from 'next';
import LegalDocsLayout, { LegalSection } from '@/components/layout/LegalDocsLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'WITRQURAN Terms and Conditions. Guidelines for using our free platform.',
  alternates: {
    canonical: 'https://witrquran.vercel.app/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms & Conditions | WITRQURAN',
    description: 'Guidelines for using our free platform.',
    url: 'https://witrquran.vercel.app/terms-and-conditions',
  }
};

export default function TermsPage() {
  const sections: LegalSection[] = [
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'usage', title: 'Acceptable Use' },
    { id: 'changes', title: 'Changes to Terms' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms and Conditions - WITRQURAN',
    description: 'Terms and conditions for using the WITRQURAN platform.',
    url: 'https://witrquran.vercel.app/terms-and-conditions',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalDocsLayout 
        title="Terms & Conditions" 
        description="By accessing and using WITRQURAN, you agree to these simple terms designed to keep the platform safe, free, and accessible for everyone."
        lastUpdated="July 22, 2026"
        readingTime="3 min"
        sections={sections}
      >
        
        <h2 id="introduction">Introduction</h2>
        <p>
          Welcome to WITRQURAN. These Terms & Conditions outline the rules and regulations for the use of our website and services. By accessing this platform, we assume you accept these terms in full. Do not continue to use WITRQURAN if you do not agree with all of the terms and conditions stated on this page.
        </p>

        <h2 id="free-service">Free Service & Access</h2>
        <p>
          WITRQURAN is, and always will be, a completely free service. We do not charge fees, require accounts, or hide any content behind paywalls. 
        </p>
        <p>
          You access the website and its resources at your own discretion. While we strive to maintain perfect uptime, we cannot guarantee that the website will always be available without disruption.
        </p>

        <h2 id="acceptable-use">Acceptable Use</h2>
        <p>
          We ask that you treat this platform with respect so that it may continue to serve the global Muslim community effectively. 
        </p>
        <div className="callout">
          <p><strong>When using WITRQURAN, you expressly agree not to:</strong></p>
          <ul>
            <li><strong>Abuse the Platform:</strong> Engage in any activity that disrupts or interferes with our servers or networks.</li>
            <li><strong>Reverse Engineer:</strong> Attempt to decompile, reverse engineer, or extract source code from the website.</li>
            <li><strong>Perform Excessive Scraping:</strong> Use automated bots, scrapers, or scripts to aggressively pull audio files or data, which could degrade performance for normal users.</li>
            <li><strong>Attack the Service:</strong> Introduce malicious code, viruses, or attempt denial-of-service (DoS) attacks.</li>
          </ul>
        </div>
        <p>
          Any user found violating these rules may have their access to the platform permanently blocked to ensure the integrity of the service for others.
        </p>

        <h2 id="modifications">Modifications to Service</h2>
        <p>
          We are constantly working to improve WITRQURAN. Therefore, we reserve the right to modify, update, or discontinue certain features of the platform at any time without prior notice. 
        </p>
        <p>
          Future features, such as additional reciters or new listening capabilities, will be added at our sole discretion. We do not guarantee release dates for any upcoming improvements.
        </p>

        <h2 id="limitations">Limitations of Liability</h2>
        <p>
          WITRQURAN is provided "as is," with all faults, and we express no representations or warranties of any kind related to this website or the materials contained on it. In no event shall WITRQURAN, nor any of its owners or contributors, be held liable for anything arising out of or in any way connected with your use of this website.
        </p>

      </LegalDocsLayout>
    </>
  );
}
