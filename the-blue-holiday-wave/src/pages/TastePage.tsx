import { PartnerDirectory } from '../components/PartnerDirectory'
import { tastePartners } from '../data/tastePartners'

export function TastePage() {
  return (
    <PartnerDirectory
      kicker="Culinair"
      title="Restaurants & tables"
      lead="Browse Culinair partners for the holidays. Tap a restaurant for their menu page — one advertiser, one table story."
      basePath="/taste"
      partners={tastePartners}
      foot="All restaurants are real places in Curaçao with verified contact details. Tap any restaurant for its full page, hours, WhatsApp, and directions."
    />
  )
}
