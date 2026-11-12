import type { ReactNode } from 'react'
import type { BrandLink } from './brand'
import { LinkIcon } from './LinkIcon.tsx'

export function DestinationLink({ link, className, title, children }: {
  link: BrandLink
  className: string
  title?: string
  children: ReactNode
}) {
  const email = link.url.startsWith('mailto:')
  return <a href={link.url} className={className} title={title}
    target={email ? undefined : '_blank'} rel={email ? undefined : 'noopener noreferrer'}>
    {children}
    <span className="sr-only">{email ? ' (e-posta uygulamasında açılır)' : ' (yeni sekmede açılır)'}</span>
  </a>
}

export function SocialLinks({ links }: { links: BrandLink[] }) {
  const social = links.filter(link => link.type === 'social')
  if (!social.length) return null

  return <nav className="social-links" aria-label="Sosyal medya ve e-posta">
    {social.map(link => {
      const label = [link.title, link.description].filter(Boolean).join(' · ')
      return <DestinationLink key={link.id} link={link} className="social-link" title={label}>
        <LinkIcon name={link.icon} size={22} />
        <span className="sr-only">{label}</span>
      </DestinationLink>
    })}
  </nav>
}
