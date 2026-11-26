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
      foot="All agencies are real real estate offices in Curaçao with verified contact details. Tap any agency for its full page, hours, WhatsApp, and directions."
    />
  )
}
