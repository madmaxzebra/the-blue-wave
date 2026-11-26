import { PartnerDetailPage } from '../components/PartnerDetailPage'
import { getMorePartner } from '../data/morePartners'

export function MorePartnerPage() {
  return (
    <PartnerDetailPage
      listPath="/more"
      listLabel="All sponsors"
      partnerKind="Season sponsor"
      noun="business"
      getPartner={getMorePartner}
    />
  )
}
