import { fashionStores, type FashionStore } from './fashionStores'
import { tastePartners } from './tastePartners'
import { homesPartners, type PartnerProfile } from './homesPartners'
import { magazinePartners } from './magazinePartners'
import { morePartners } from './morePartners'

export type FoundPartner = {
  route: 'fashion' | 'taste' | 'homes' | 'magazine' | 'more'
  partner: FashionStore | PartnerProfile
}

/** Finds a company page by its id, across all sections. */
export function findPartner(id: string): FoundPartner | null {
  const fashion = fashionStores.find((p) => p.id === id)
  if (fashion) return { route: 'fashion', partner: fashion }
  const sections: [FoundPartner['route'], PartnerProfile[]][] = [
    ['taste', tastePartners],
    ['homes', homesPartners],
    ['magazine', magazinePartners],
    ['more', morePartners],
  ]
  for (const [route, list] of sections) {
    const partner = list.find((p) => p.id === id)
    if (partner) return { route, partner }
  }
  return null
}
