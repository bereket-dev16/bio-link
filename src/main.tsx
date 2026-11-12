import type { CSSProperties } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { brand, links, type BrandLink } from './brand'
import { LinkIcon } from './LinkIcon'
import { ShareButton } from './ShareButton'
import './styles.css'

const { theme } = brand
const socialLinks = links.filter(link => link.type === 'social')
const mainLinks = links.filter(link => link.type === 'link')
const rootStyle = document.documentElement.style
for (const [key, color] of Object.entries(brand.colors)) rootStyle.setProperty(`--${key}`, color)
if (theme.fontBody) rootStyle.setProperty('--font-body', theme.fontBody)
if (theme.fontHeading) rootStyle.setProperty('--font-heading', theme.fontHeading)

function Background() {
  return <div className="backdrop" aria-hidden="true">
    <div className="contour contour-north" /><div className="contour contour-south" />
  </div>
}

function Profile() {
  return <section className="hero relative isolate" aria-labelledby="profile-heading">
    {theme.cover && <img className="hero-image" alt="" src={theme.cover}
      srcSet={theme.coverSmall ? `${theme.coverSmall} 600w, ${theme.cover} 960w` : undefined}
      sizes="(max-width: 555px) 100vw, 512px" fetchPriority="high" />}
    <div className="hero-content">
      <h1 id="profile-heading">
        {theme.headline && <span className="sr-only">{brand.name} — </span>}
        {theme.headline || brand.name}
        {theme.headlineEmphasis && <> <em>{theme.headlineEmphasis}</em></>}
      </h1>
      <p className="intro">{brand.description}</p>
      {socialLinks.length > 0 && <nav className="social-links flex flex-wrap gap-2" aria-label="Sosyal medya">
        {socialLinks.map(link =>
          <a key={link.id} className="social-link" href={link.url} target="_blank" rel="noopener noreferrer"
            aria-label={`${link.title}${link.description ? ' ' + link.description : ''} (yeni sekmede açılır)`}>
            <LinkIcon name={link.icon} size={16} />
            <span>{link.description || link.title}</span>
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        )}
      </nav>}
    </div>
  </section>
}

function LinkCard({ link, index }: { link: BrandLink; index: number }) {
  return <li style={{ '--index': Math.min(index, 5) } as CSSProperties}>
    <a className={`link-card${link.featured ? ' is-featured' : ''}`} href={link.url} target="_blank" rel="noopener noreferrer">
      <span className="link-icon" data-icon={link.icon}><LinkIcon name={link.icon} /></span>
      <div className="card-copy min-w-0">
        <span className="card-title">{link.title}</span>
        {link.description && <span className="card-description">{link.description}</span>}
      </div>
      <span className="card-arrow"><ArrowUpRight size={17} strokeWidth={1.7} aria-hidden="true" /></span>
      <span className="sr-only"> (yeni sekmede açılır)</span>
    </a>
  </li>
}

function App() {
  return <>
    <Background />
    <div className="page">
      <header className="masthead flex items-center justify-between gap-3">
        {brand.logo
          ? <img className="wordmark" src={brand.logo} alt={brand.name} width="156" height="54" />
          : <span className="brand-name">{brand.name}</span>}
        <ShareButton />
      </header>
      <main>
        <Profile />
        {mainLinks.length > 0 && <nav className="links-section" aria-labelledby="links-heading">
          <div className="section-head flex items-center">
            <h2 id="links-heading">Bağlantılar</h2><div className="section-rule" aria-hidden="true" />
          </div>
          <ul className="link-list grid">{mainLinks.map((link, index) => <LinkCard key={link.id} link={link} index={index} />)}</ul>
        </nav>}
      </main>
      <footer className="footer flex flex-wrap items-center justify-between">
        <small>© {new Date().getFullYear()} {brand.name}</small>
        {theme.location && <span className="place inline-flex items-center"><MapPin size={13} strokeWidth={1.6} aria-hidden="true" />{theme.location}</span>}
      </footer>
    </div>
  </>
}

createRoot(document.getElementById('root')!).render(<App />)
