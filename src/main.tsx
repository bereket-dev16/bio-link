import { createRoot } from 'react-dom/client'
import type { ReactNode } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { brand, links, type BrandLink } from './brand'
import { LinkIcon } from './LinkIcon'
import { ShareButton } from './ShareButton'
import './styles.css'

const { theme } = brand
const tagline = [theme.headline, theme.headlineEmphasis].filter(Boolean).join(' ')
const socialLinks = links.filter(link => link.type === 'social')
const mainLinks = links.filter(link => link.type === 'link')
const rootStyle = document.documentElement.style
for (const [key, color] of Object.entries(brand.colors)) rootStyle.setProperty(`--${key}`, color)
if (theme.fontBody) rootStyle.setProperty('--font-body', theme.fontBody)
if (theme.fontHeading) rootStyle.setProperty('--font-heading', theme.fontHeading)

function DestinationLink({ link, className, children }: { link: BrandLink; className: string; children: ReactNode }) {
  const email = link.url.startsWith('mailto:')
  return <a href={link.url} className={className} target={email ? undefined : '_blank'} rel={email ? undefined : 'noopener noreferrer'}>
    {link.type === 'social' && link.description && <span className="sr-only">{link.title} </span>}
    {children}
    <span className="sr-only">{email ? ' (e-posta uygulamasında açılır)' : ' (yeni sekmede açılır)'}</span>
  </a>
}

function Profile() {
  return <header className="profile" aria-labelledby="profile-heading">
    <div className="profile-cover">
      {theme.cover && <img className="hero-image" alt="" src={theme.cover}
        srcSet={theme.coverSmall ? `${theme.coverSmall} 600w, ${theme.cover} 960w` : undefined}
        sizes="(max-width: 555px) 100vw, 512px" fetchPriority="high" />}
    </div>
    <div className="profile-body">
      {brand.logo && <div className="logo-frame">
        <img src={brand.logo} alt="" width="60" height="60" />
      </div>}
      <div className="profile-copy">
        <h1 id="profile-heading">{brand.name}</h1>
        {tagline && <p className="profile-tagline">{tagline}</p>}
        <p className="intro">{brand.description}</p>
      </div>
      <div className="profile-actions">
        {socialLinks.length > 0 && <nav className="social-links" aria-label="Sosyal medya">
          {socialLinks.map(link =>
            <DestinationLink key={link.id} link={link} className="social-link">
              <LinkIcon name={link.icon} size={17} />
              <span>{link.description || link.title}</span>
            </DestinationLink>
          )}
        </nav>}
        <ShareButton />
      </div>
    </div>
  </header>
}

function LinkCard({ link }: { link: BrandLink }) {
  return <li>
    <DestinationLink link={link} className={`link-card${link.featured ? ' is-featured' : ''}`}>
      <span className="link-icon"><LinkIcon name={link.icon} size={22} /></span>
      <span className="card-copy">
        <span className="card-title">{link.title}</span>
        {link.description && <span className="card-description">{link.description}</span>}
      </span>
      <ArrowUpRight className="card-arrow" size={18} strokeWidth={1.65} aria-hidden="true" />
    </DestinationLink>
  </li>
}

function App() {
  return <div className="page">
    <main className="profile-sheet">
      <Profile />
      {mainLinks.length > 0 && <nav className="links-section" aria-labelledby="links-heading">
        <h2 id="links-heading">Bağlantılar</h2>
        <ul className="link-list">{mainLinks.map(link => <LinkCard key={link.id} link={link} />)}</ul>
      </nav>}
    </main>
    <footer className="footer">
      <small>© {new Date().getFullYear()} {brand.name}</small>
      {theme.location && <span className="place"><MapPin size={14} strokeWidth={1.65} aria-hidden="true" />{theme.location}</span>}
    </footer>
  </div>
}

createRoot(document.getElementById('root')!).render(<App />)
