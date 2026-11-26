import { PartnerDetailPage } from '../components/PartnerDetailPage'
import { getTastePartner } from '../data/tastePartners'

export function TastePartnerPage() {
  return (
    <PartnerDetailPage
      listPath="/taste"
      listLabel="All restaurants"
      partnerKind="Culinair partner"
      noun="restaurant"
      getPartner={getTastePartner}
    />
  )
}
