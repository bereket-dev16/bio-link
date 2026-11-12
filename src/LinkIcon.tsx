import { BookOpen, Globe, Link as Chain, Mail, MapPin, MessageCircle, Phone, Pill } from 'lucide-react'

const symbols = {
  'book-open': BookOpen,
  globe: Globe,
  link: Chain,
  mail: Mail,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  phone: Phone,
  pill: Pill,
}

export function LinkIcon({ name, size = 23 }: { name: string; size?: number }) {
  const props = {
    width: size, height: size, fill: 'none', stroke: 'currentColor',
    strokeWidth: 1.65, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true, focusable: false,
  } as const

  if (name === 'instagram') {
    return <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.1" /><circle cx="17.6" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  }
  if (name === 'linkedin') {
    return <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="7.8" cy="8" r="1" fill="currentColor" stroke="none" />
      <path d="M7.8 11v6M12 17v-6m0 2.7c0-3.6 5-3.6 5 0V17" />
    </svg>
  }
  if (name === 'youtube') {
    return <svg viewBox="0 0 24 24" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
    </svg>
  }

  const Icon = Object.hasOwn(symbols, name) ? symbols[name as keyof typeof symbols] : Chain
  return <Icon {...props} />
}
