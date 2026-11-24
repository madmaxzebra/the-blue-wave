import { PartnerDirectory } from '../components/PartnerDirectory'
import { tastePartners } from '../data/tastePartners'

export function TastePage() {
  return (
    <PartnerDirectory
      kicker="Culinary"
      title="Restaurants & tables"
      lead="Browse culinary partners for the holiday season. Tap a restaurant for their menu page — one advertiser, one table story."
      basePath="/taste"
      partners={tastePartners}
      foot="Sample restaurants for layout — real logos and menus replace these when partners confirm."
    />
  )
}
