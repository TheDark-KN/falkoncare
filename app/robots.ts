import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/sign-in/',
          '/sign-up/',
          '/*.json',
          '/test/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/sign-in/',
          '/sign-up/',
          '/test/',
        ],
      },
    ],
    sitemap: 'https://falkoncare.com/sitemap.xml',
  }
}
