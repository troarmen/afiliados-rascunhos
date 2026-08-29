import type { MetadataRoute } from 'next'
import { areasComPagina } from '@/lib/programa'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date()

  const fixas: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: agora, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${site.url}/programa`,
      lastModified: agora,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${site.url}/perguntas-frequentes`,
      lastModified: agora,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: `${site.url}/termos`, lastModified: agora, changeFrequency: 'yearly', priority: 0.3 },
    {
      url: `${site.url}/privacidade`,
      lastModified: agora,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const porArea: MetadataRoute.Sitemap = areasComPagina.map((area) => ({
    url: `${site.url}/para-criadores/${area.slug}`,
    lastModified: agora,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...fixas, ...porArea]
}
