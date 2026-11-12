import { useRef, useState } from 'react'
import { Check, Copy, Share, X } from 'lucide-react'
import { brand } from './brand'

export function ShareButton() {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [result, setResult] = useState<'idle' | 'copied' | 'select'>('idle')

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: brand.seo.title, url: brand.seo.url })
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
      }
    }
    setResult('idle')
    dialog.current?.showModal()
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(brand.seo.url)
      setResult('copied')
    } catch {
      input.current?.focus()
      input.current?.select()
      setResult('select')
    }
  }

  return <>
    <button type="button" className="share-button" onClick={share}>
      <Share size={17} strokeWidth={1.65} aria-hidden="true" /> Paylaş
    </button>
    <dialog ref={dialog} className="share-dialog" aria-labelledby="share-title"
      onClick={event => { if (event.target === dialog.current) dialog.current.close() }}>
      <div className="share-content">
        <div className="flex items-center justify-between gap-2">
          <h2 id="share-title">Sayfayı paylaş</h2>
          <button className="close-button" type="button" aria-label="Kapat" onClick={() => dialog.current?.close()}>
            <X size={20} strokeWidth={1.65} aria-hidden="true" />
          </button>
        </div>
        <label htmlFor="share-url">{brand.name} bağlantısı</label>
        <input ref={input} id="share-url" value={brand.seo.url} readOnly dir="ltr" />
        <button type="button" onClick={copyAddress} className="copy-button">
          {result === 'copied' ? <Check size={18} strokeWidth={1.65} aria-hidden="true" /> : <Copy size={18} strokeWidth={1.65} aria-hidden="true" />}
          {result === 'copied' ? 'Bağlantı kopyalandı' : 'Bağlantıyı kopyala'}
        </button>
        <p role="status" className={result === 'select' ? 'copy-hint' : 'sr-only'}>
          {result === 'copied' && 'Bağlantı panoya kopyalandı.'}
          {result === 'select' && 'Adres seçildi. Cihazınızın kopyala komutunu kullanabilirsiniz.'}
        </p>
      </div>
    </dialog>
  </>
}
