import type { Metadata } from 'next';
import LegalDocsLayout, { LegalSection } from '@/components/layout/LegalDocsLayout';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about WITRQURAN, a free, distraction-free platform dedicated to the Holy Quran.',
  alternates: {
    canonical: 'https://witrquran.vercel.app/about',
  },
  openGraph: {
    title: 'About | WITRQURAN',
    description: 'Learn about WITRQURAN and our mission.',
    url: 'https://witrquran.vercel.app/about',
  }
};

export default function AboutPage() {
  const sections: LegalSection[] = [
    { id: 'our-mission', title: 'Our Mission' },
    { id: 'why-we-exist', title: 'Why WITRQURAN Exists' },
    { id: 'peaceful-experience', title: 'A Peaceful Listening Experience' },
    { id: 'free-forever', title: '100% Free Forever' },
    { id: 'built-for-muslims', title: 'Built For Muslims Around The World' },
    { id: 'future-vision', title: 'Our Vision for the Future' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    description: 'Information about the WITRQURAN platform and its mission.',
    url: 'https://quranlisten.com/about',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalDocsLayout 
        title="About WITRQURAN" 
        description="Learn about our mission to provide a completely free, distraction-free environment for connecting with the words of Allah."
        lastUpdated="July 22, 2026"
        readingTime="2 min"
        sections={sections}
      >
        
        <h2 id="our-mission">Our Mission</h2>
        <p>
          At WITRQURAN, our mission is straightforward: to make listening to the Holy Quran accessible, beautiful, and completely distraction-free for everyone.
        </p>
        <p>
          We believe that connecting with the words of Allah is a profound spiritual experience that should never be interrupted by advertisements, paywalls, or cluttered interfaces.
        </p>

        <h2 id="why-we-exist">Why WITRQURAN Exists</h2>
        <p>
          The modern internet is incredibly noisy. Many existing platforms that host the Quran are overwhelmed with visual clutter, complex navigation, and disruptive marketing trackers. 
        </p>
        <div className="callout">
          <p>
            <strong>Our Solution:</strong> We built WITRQURAN as a sanctuary. A clean, elegant space where you can focus entirely on the recitation without any background noise.
          </p>
        </div>

        <h2 id="peaceful-experience">A Peaceful Listening Experience</h2>
        <p>
          Every detail of our platform has been meticulously designed to promote tranquility. From the premium dark aesthetic to the seamless audio playback, we prioritize your peace of mind.
        </p>
        <p>
          Currently, we are honored to feature the timeless and profound recitations of Mahmoud Khalil Al-Hussary, delivered globally via high-speed infrastructure to ensure flawless playback.
        </p>

        <h2 id="free-forever">100% Free Forever</h2>
        <p>
          The Quran is a gift to humanity, and access to its recitation should never be monetized.
        </p>
        <ul>
          <li>We will never charge you for access.</li>
          <li>We will never display advertisements.</li>
          <li>We will never ask you to buy a subscription.</li>
        </ul>
        <p>
          WITRQURAN is fully funded by its creator and is provided as a lasting resource for the community.
        </p>

        <h2 id="built-for-muslims">Built For Muslims Around The World</h2>
        <p>
          Whether you are memorizing Surahs, seeking comfort after a long day, or simply wanting to fill your home with the remembrance of Allah, this platform was engineered for you. 
        </p>
        <p>
          We respect your privacy completely. There are no accounts to create, no tracking scripts to disable, and nothing standing between you and the Quran.
        </p>

        <h2 id="future-vision">Our Vision for the Future</h2>
        <p>
          While WITRQURAN currently offers a streamlined, focused experience, we have a clear vision for its future. 
        </p>
        <p>
          We plan to carefully introduce new features that enhance your listening journey, including:
        </p>
        <ul>
          <li>More world-renowned reciters.</li>
          <li>Offline listening and secure downloads.</li>
          <li>Personalized bookmarks and sharing capabilities.</li>
          <li>Advanced playback controls.</li>
        </ul>
        <p>
          These updates will be introduced thoughtfully, ensuring they never compromise the simplicity and privacy that define WITRQURAN.
        </p>

      </LegalDocsLayout>
    </>
  );
}
