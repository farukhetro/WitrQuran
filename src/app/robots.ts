import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://witrquran.vercel.app/sitemap.xml',
    host: 'https://witrquran.vercel.app',
  };
}
