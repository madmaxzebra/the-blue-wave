import { PartnerDirectory } from '../components/PartnerDirectory'
import { magazinePartners } from '../data/magazinePartners'

export function MagazinePage() {
  return (
    <PartnerDirectory
      kicker="Magazine"
      title="Magazine partners"
      lead="Editorial, advertising, and print partners for the holiday edition. Tap one for their full feature page."
      basePath="/magazine"
      partners={magazinePartners}
      foot="All magazine partners are real businesses in Curaçao. Tap any partner for address, opening hours, WhatsApp, and Google Maps."
    />
  )
}
