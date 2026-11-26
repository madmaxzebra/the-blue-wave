import { assetUrl } from '../lib/ownerContent'
import '../pages/OwnerPages.css'

/** Extra photos added by the page owner. Shows nothing when there are none. */
export function PartnerGallery({ photos, name }: { photos?: string[]; name: string }) {
  if (!photos || photos.length === 0) return null
  return (
    <section className="partner-gallery" aria-label={`More photos of ${name}`}>
      <h3 className="fashion-store__section">More photos</h3>
      <ul className="partner-gallery__grid">
        {photos.map((url) => (
          <li key={url}>
            <img src={assetUrl(url)} alt="" loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  )
}
