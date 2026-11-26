import { PartnerDetailPage } from '../components/PartnerDetailPage'
import { getHomesPartner } from '../data/homesPartners'

export function HomesPartnerPage() {
  return (
    <PartnerDetailPage
      listPath="/homes"
      listLabel="All real estate partners"
      partnerKind="Real estate partner"
      noun="real estate agency"
      getPartner={getHomesPartner}
    />
  )
}
