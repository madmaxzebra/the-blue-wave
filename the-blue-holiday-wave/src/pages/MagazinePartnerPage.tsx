import { PartnerDetailPage } from '../components/PartnerDetailPage'
import { getMagazinePartner } from '../data/magazinePartners'

export function MagazinePartnerPage() {
  return (
    <PartnerDetailPage
      listPath="/magazine"
      listLabel="All magazine partners"
      partnerKind="Magazine partner"
      getPartner={getMagazinePartner}
    />
  )
}
