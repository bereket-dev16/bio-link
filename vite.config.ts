import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { loadBrand } from './build/brand-config.ts'

const root = fileURLToPath(new URL('.', import.meta.url))
const html = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')

export default defineConfig(({ mode }) => {
  const { VITE_BRAND = 'mnc' } = loadEnv(mode, root, 'VITE_BRAND')
  const { brand, links, assetDir, files } = loadBrand(root, VITE_BRAND)
  const seo = brand.seo
  const shareImage = html(new URL(seo.image, seo.url).href)
  const { cover, coverSmall, fontStylesheet } = brand.theme
  const coverSources = coverSmall && cover
    ? ` imagesrcset="${html(coverSmall)} 600w, ${html(cover)} 960w" imagesizes="(max-width: 555px) 100vw, 512px"`
    : ''
  const head = [
    ...(brand.preloadFonts ?? []).map(font =>
      `<link rel="preload" as="font" href="${html(font)}" crossorigin />`,
    ),
    cover && `<link rel="preload" as="image" href="${html(cover)}"${coverSources} fetchpriority="high" />`,
    fontStylesheet && `<link rel="stylesheet" href="${html(fontStylesheet)}" />`,
    brand.colors.canvas && `<meta name="theme-color" content="${html(brand.colors.canvas)}" />`,
    `<title>${html(seo.title)}</title>`,
    `<meta name="description" content="${html(seo.description)}" />`,
    `<link rel="canonical" href="${html(seo.url)}" />`,
    `<link rel="icon" href="${html(brand.favicon)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="tr_TR" />',
    `<meta property="og:site_name" content="${html(brand.name)}" />`,
    `<meta property="og:title" content="${html(seo.title)}" />`,
    `<meta property="og:description" content="${html(seo.description)}" />`,
    `<meta property="og:url" content="${html(seo.url)}" />`,
    `<meta property="og:image" content="${shareImage}" />`,
    `<meta property="og:image:alt" content="${html(seo.imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ].filter(Boolean).join('\n    ')
  const fallback = links.map((link) =>
    `<li><a class="link-card" href="${html(link.url)}">${html(link.title)}</a></li>`,
  ).join('')

  return {
    publicDir: assetDir,
    define: {
      __ACTIVE_BRAND__: JSON.stringify(brand),
      __PUBLISHED_LINKS__: JSON.stringify(links),
    },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'brand-page',
        configureServer(server) {
          server.watcher.add(files)
          server.watcher.on('change', (file) => {
            if (files.includes(file)) void server.restart()
          })
        },
        transformIndexHtml(page) {
          return page.replace('<!-- brand-head -->', () => head)
            .replace('<!-- brand-links -->', () =>
              `<main class="page"><h1 class="brand-name">${html(brand.name)}</h1><p>${html(brand.description)}</p><nav aria-label="Bağlantılar"><ul class="link-list grid">${fallback}</ul></nav></main>`,
            )
        },
      },
    ],
  }
})
