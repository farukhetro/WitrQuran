import { MetadataRoute } from 'next';
import surahsData from '@/data/surahs.json';
import { Surah } from '@/types/surah';

export default function sitemap(): MetadataRoute.Sitemap {
  const surahs = surahsData as Surah[];
  const baseUrl = 'https://witrquran.vercel.app';
  
  const surahUrls = surahs.map((surah) => ({
    url: `${baseUrl}/surah/${surah.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticPages = [
    '',
    '/surahs',
    '/about',
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookie-policy',
    '/disclaimer',
    '/copyright-policy',
    '/dmca-policy',
    '/refund-policy'
  ];

  const staticUrls = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'monthly' as const,
    priority: route === '' ? 1 : route === '/surahs' ? 0.9 : 0.5,
  }));

  return [
    ...staticUrls,
    ...surahUrls,
  ];
}
