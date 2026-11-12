export interface Brand {
  name: string
  description: string
  logo: string | null
  favicon: string
  preloadFonts?: string[]
  colors: Record<string, string>
  theme: Record<string, string>
  seo: {
    title: string
    description: string
    url: string
    image: string
    imageAlt: string
  }
}

export interface BrandLink {
  id: string
  title: string
  url: string
  icon: string
  description?: string
  order: number
  active: boolean
  featured: boolean
  type: 'link' | 'social'
}

// Vite embeds only the chosen brand and its published links.
declare const __ACTIVE_BRAND__: Brand
declare const __PUBLISHED_LINKS__: BrandLink[]

export const brand = __ACTIVE_BRAND__
export const links = __PUBLISHED_LINKS__
