import { PartnerDirectory } from '../components/PartnerDirectory'
import { morePartners } from '../data/morePartners'

export function MorePage() {
  return (
    <PartnerDirectory
      kicker="More"
      title="Sponsors & partners"
      lead="Official season partners — hospitality, finance, and events. Tap one for their full partner page."
      basePath="/more"
      partners={morePartners}
      foot="All sponsors are real businesses in Curaçao. Tap any sponsor for address, opening hours, phone, and Google Maps."
    />
  )
}
