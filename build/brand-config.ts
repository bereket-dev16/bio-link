import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import type { Brand, BrandLink } from '../src/brand'

function fields(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} bir JSON nesnesi olmalı.`)
  }
  return value as Record<string, unknown>
}

function text(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} için bir metin girin.`)
  }
  return value.trim()
}

function stringMap(value: unknown, label: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fields(value, label)).map(([key, entry]) => [key, text(entry, `${label}.${key}`)]),
  )
}

function secureUrl(value: unknown, label: string): string {
  const address = text(value, label)
  const url = URL.canParse(address) && new URL(address)
  if (!url || url.protocol !== 'https:' || url.username || url.password) {
    throw new Error(`${label} geçerli bir HTTPS adresi olmalı.`)
  }
  return address
}

function localAsset(value: unknown, assetDir: string, label: string): string {
  const url = text(value, label)
  if (!url.startsWith('/') || url.startsWith('//') || /[?#%\\]/.test(url) ||
      url.split('/').some((part) => part === '.' || part === '..') ||
      !statSync(join(assetDir, url), { throwIfNoEntry: false })?.isFile()) {
    throw new Error(`${label}: "${url}" marka assets klasöründe mevcut bir dosyaya işaret etmeli.`)
  }
  return url
}

function readBrand(value: unknown, assetDir: string): Brand {
  const brand = fields(value, 'brand.json')
  const seo = fields(brand.seo, 'seo')
  const theme = stringMap(brand.theme, 'theme')
  const preloadFonts = brand.preloadFonts ?? []
  if (!Array.isArray(preloadFonts)) throw new Error('preloadFonts bir dosya listesi olmalı.')
  for (const [key, setting] of Object.entries(theme)) {
    if (setting.startsWith('/')) localAsset(setting, assetDir, `theme.${key}`)
  }
  return {
    name: text(brand.name, 'name'),
    description: text(brand.description, 'description'),
    logo: brand.logo == null ? null : localAsset(brand.logo, assetDir, 'logo'),
    favicon: localAsset(brand.favicon, assetDir, 'favicon'),
    preloadFonts: preloadFonts.map(file => localAsset(file, assetDir, 'preloadFonts')),
    colors: stringMap(brand.colors, 'colors'),
    theme,
    seo: {
      title: text(seo.title, 'seo.title'),
      description: text(seo.description, 'seo.description'),
      url: secureUrl(seo.url, 'seo.url'),
      image: localAsset(seo.image, assetDir, 'seo.image'),
      imageAlt: text(seo.imageAlt, 'seo.imageAlt'),
    },
  }
}

function publishedLinks(value: unknown): BrandLink[] {
  if (!Array.isArray(value)) throw new Error('links.json bir dizi olmalı.')
  const ids = new Set<string>()
  const links = value.map((entry, index): BrandLink => {
    const link = fields(entry, `links[${index}]`)
    const id = text(link.id, `links[${index}].id`)
    if (ids.has(id)) throw new Error(`Yinelenen bağlantı ID’si: ${id}`)
    ids.add(id)
    if (typeof link.active !== 'boolean' || typeof link.featured !== 'boolean' ||
        typeof link.order !== 'number' || !Number.isFinite(link.order) ||
        (link.type !== 'link' && link.type !== 'social')) {
      throw new Error(`${id}: active, featured, order veya type alanlarını kontrol edin.`)
    }
    return {
      id, title: text(link.title, `${id}.title`), icon: text(link.icon, `${id}.icon`),
      description: link.description == null || link.description === '' ? undefined : text(link.description, `${id}.description`),
      url: !link.active && link.url === '' ? '' : secureUrl(link.url, `${id}.url`),
      order: link.order, active: link.active, featured: link.featured, type: link.type,
    }
  })
  return links.filter((link) => link.active).sort((a, b) => a.order - b.order)
}

export function loadBrand(root: string, id: string) {
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(id)) throw new Error('VITE_BRAND geçerli bir marka klasör adı olmalı.')
  const brandDir = join(root, 'brands', id)
  const assetDir = join(brandDir, 'assets')
  const configFile = join(brandDir, 'brand.json')
  const linksFile = join(brandDir, 'links.json')
  const read = (file: string): unknown => JSON.parse(readFileSync(file, 'utf8'))
  return {
    brand: readBrand(read(configFile), assetDir),
    links: publishedLinks(read(linksFile)),
    assetDir,
    files: [configFile, linksFile],
  }
}
