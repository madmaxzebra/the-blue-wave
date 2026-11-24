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
      foot="Sample sponsors for layout — real logos and offers replace these when partners confirm."
    />
  )
}
