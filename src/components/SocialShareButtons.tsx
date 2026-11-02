// Componente de botones de compartición social específicos por plataforma
// Facilita la compartición directa en Facebook, Twitter, WhatsApp, LinkedIn

import { Facebook, Twitter, MessageCircle, Linkedin, Mail } from 'lucide-react'
import { trackSocialShare } from '../services/ga4Service'

interface SocialShareButtonsProps {
  url?: string
  title?: string
  description?: string
  hashtags?: string[]
  className?: string
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : 'https://www.salentoalamano.com',
  title = 'Salento a la Mano - Guía Turística Oficial de Salento, Quindío',
  description = 'Descubre Salento con la guía oficial digital: hoteles, coffee tours, Valle de Cocora y experiencias directas sin intermediarios.',
  hashtags = ['Salento', 'EjeCafetero', 'Colombia', 'TurismoColombia', 'Quindio'],
  className = ''
}) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)
  const encodedHashtags = hashtags.map(tag => encodeURIComponent('#' + tag)).join(',')

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    whatsapp: `https://wa.me/?text=${encodedDescription} ${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription} ${encodedUrl}`
  }

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks]
    if (link) {
      window.open(link, '_blank', 'width=600,height=400')
      // Track en GA4
      trackSocialShare(platform)
    }
  }

  return (
    <div className={`social-share-buttons ${className}`}>
      <button
        onClick={() => handleShare('facebook')}
        className="social-btn facebook"
        aria-label="Compartir en Facebook"
      >
        <Facebook size={20} />
        <span>Facebook</span>
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="social-btn twitter"
        aria-label="Compartir en Twitter"
      >
        <Twitter size={20} />
        <span>Twitter</span>
      </button>
      <button
        onClick={() => handleShare('whatsapp')}
        className="social-btn whatsapp"
        aria-label="Compartir en WhatsApp"
      >
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="social-btn linkedin"
        aria-label="Compartir en LinkedIn"
      >
        <Linkedin size={20} />
        <span>LinkedIn</span>
      </button>
      <button
        onClick={() => handleShare('email')}
        className="social-btn email"
        aria-label="Compartir por email"
      >
        <Mail size={20} />
        <span>Email</span>
      </button>
    </div>
  )
}

export default SocialShareButtons
