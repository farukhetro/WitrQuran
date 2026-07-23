import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WITRQURAN',
    short_name: 'WITRQURAN',
    description: 'A premium, native-feeling application to listen to the Holy Quran online for free.',
    start_url: '/',
    display: 'standalone',
    background_color: '#121212',
    theme_color: '#121212',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
    ],
  };
}
