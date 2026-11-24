import { PartnerDirectory } from '../components/PartnerDirectory'
import { homesPartners } from '../data/homesPartners'

export function HomesPage() {
  return (
    <PartnerDirectory
      kicker="Real Estate"
      title="Real estate partners"
      lead="Browse agencies for the holiday season. Tap a partner for featured homes — one advertiser, one listing page."
      basePath="/homes"
      partners={homesPartners}
      foot="Sample agencies for layout — real logos and listings replace these when partners confirm."
    />
  )
}
