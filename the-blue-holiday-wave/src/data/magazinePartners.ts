import type { PartnerProfile } from './homesPartners'

const base = import.meta.env.BASE_URL

/** Real Curaçao editorial, advertising, and print partners for the holiday edition */
export const magazinePartners: PartnerProfile[] = [
  {
    id: 'amigoe-nieuws',
    name: 'Amigoe',
    area: 'Editorial · Scherpenheuvel',
    intro:
      'Amigoe is the biggest and longest-running Dutch-language newspaper in Curaçao. It lands at subscribers’ doors in the afternoon, six days a week, and comes with the Ñapa weekend supplement every Saturday. A trusted voice for local news, culture, and business.',
    tagline: 'Daily paper · Ñapa weekend edition · online edition',
    logoLabel: 'AM',
    logoColor: '#00669e',
    logoImg: `${base}magazine-media/logos/amigoe-nieuws-gold.png?v=20261127logo`,
    logoWide: true,
    highlightImg: `${base}magazine-media/amigoe-nieuws-paper.jpg`,
    highlightCaption: 'The Amigoe daily paper',
    heroImg: `${base}magazine-media/amigoe-nieuws-online.jpg`,
    heroTitle: 'The island’s afternoon paper',
    heroText:
      'Amigoe has been bringing Curaçao and Bonaire the news for decades. Read it on paper at home, or online on any device — the online edition is free for print subscribers.',
    quote: 'Amigoe is read by 15.5% of all households in Curaçao.',
    itemsHeading: 'In the paper',
    items: [
      {
        img: `${base}magazine-media/amigoe-nieuws-paper.jpg`,
        tag: 'Daily',
        title: 'Amigoe Curaçao',
        text: 'Delivered to subscribers’ homes six days a week.',
      },
      {
        img: `${base}magazine-media/amigoe-nieuws-devices.jpg`,
        tag: 'Online',
        title: 'Amigoe Online',
        text: 'The full paper as a flipbook on phone, tablet, and computer.',
      },
      {
        img: `${base}magazine-media/amigoe-nieuws-advert.jpg`,
        tag: 'Advertise',
        title: 'Advertising in Amigoe',
        text: 'Reach readers on Curaçao and Bonaire — the more you advertise, the more you save.',
      },
    ],
    visitLabel: 'Newspaper',
    visitTitle: 'Visit Amigoe',
    shopNote: 'Offices at Kaya Fraternan di Skèrpènè, Scherpenheuvel. For ads, email advertentie@amigoe.com.',
    lifestyleLabel: 'Weekend',
    lifestyleTitle: 'Read it anywhere',
    lifestyleText:
      'Ñapa, the Saturday supplement, brings longer stories on culture, travel, food, and business. 93% of Amigoe readers read it.',
    lifestyleImg: `${base}magazine-media/amigoe-nieuws-devices.jpg`,
    collectionLabel: 'Editorial · Holidays edition',
    phone: '+599 9 767 2000',
    email: 'advertentie@amigoe.com',
    websiteUrl: 'https://www.amigoe.com',
    websiteLabel: 'amigoe.com',
    address: 'Kaya Fraternan di Skèrpènè z/n, Scherpenheuvel, Willemstad, Curaçao',
    openingHours: 'Mon–Fri 08:00–17:00',
    mapsUrl: 'https://maps.google.com/?q=Amigoe+Kaya+Fraternan+di+Skèrpènè+Scherpenheuvel+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.11339,-68.8804&z=16&output=embed&iwloc=',
  },
  {
    id: 'mammoet-printing',
    name: 'Mammoet Printing',
    area: 'Advertising · Seru Loraweg',
    intro:
      'Mammoet Printing is the Curaçao specialist in large prints and signs — billboards, banners, flags, stickers, shop-front lettering, and vehicle wraps. They handle design, printing, finishing, and delivery, and work with everyone from small start-ups to big brands.',
    tagline: 'Billboards · banners · signs · vehicle lettering',
    logoLabel: 'MP',
    logoColor: '#2e3192',
    logoImg: `${base}magazine-media/logos/mammoet-printing-gold.png?v=20261127logo`,
    highlightImg: `${base}magazine-media/mammoet-printing-billboard.jpg`,
    highlightCaption: 'Billboard made by Mammoet Printing',
    heroImg: `${base}magazine-media/mammoet-printing-shopfront.jpg`,
    heroTitle: 'Make your brand big',
    heroText:
      'From a sticker on a car to a full billboard by the road, Mammoet Printing makes outdoor advertising that stands up to the sun, sea, salt, and wind of the Caribbean.',
    quote: 'Print that lasts in the Caribbean sun.',
    itemsHeading: 'What they make',
    items: [
      {
        img: `${base}magazine-media/mammoet-printing-banner.jpg`,
        tag: 'Banners',
        title: 'Banners and flags',
        text: 'Event banners, backdrops, and flags in every size and shape.',
      },
      {
        img: `${base}magazine-media/mammoet-printing-van.jpg`,
        tag: 'Vehicles',
        title: 'Vehicle lettering',
        text: 'Turn vans and company cars into moving adverts.',
      },
      {
        img: `${base}magazine-media/mammoet-printing-storefront-signs.jpg`,
        tag: 'Shops',
        title: 'Shop-front signs',
        text: 'Window lettering and signs that make a shop easy to spot.',
      },
    ],
    visitLabel: 'Print shop',
    visitTitle: 'Visit Mammoet Printing',
    shopNote: 'Located at Seru Loraweg 110, Willemstad. Open Monday to Friday.',
    lifestyleLabel: 'Signs',
    lifestyleTitle: 'Seen all over the island',
    lifestyleText:
      'Mammoet Printing has in-house experts who help with your design, and can also install your sign for you.',
    lifestyleImg: `${base}magazine-media/mammoet-printing-signboard.jpg`,
    collectionLabel: 'Advertising · Holidays edition',
    phone: '+599 9 465 0607',
    email: 'info@mammoetprinting.com',
    whatsapp: '59994650607',
    websiteUrl: 'https://www.mammoetprinting.com',
    websiteLabel: 'mammoetprinting.com',
    address: 'Seru Loraweg 110, Willemstad, Curaçao',
    openingHours: 'Mon–Thu 08:00–16:30 · Fri 08:00–16:00 · Closed Sat & Sun',
    mapsUrl: 'https://maps.google.com/?q=Mammoet+Printing+Seru+Loraweg+110+Willemstad+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1127,-68.8895&z=16&output=embed&iwloc=',
  },
  {
    id: 'bo-printer',
    name: 'Bo Printer',
    area: 'Print · Groot Davelaar',
    intro:
      'Bo Printer is a professional printing company in Curaçao, with offset printing for big runs and digital printing for smaller ones. Magazines, brochures, catalogues, flyers, posters, calendars, and more — they also print in large format, and serve Aruba and Bonaire too.',
    tagline: 'Offset · digital · magazines · brochures',
    logoLabel: 'BO',
    logoColor: '#e4572e',
    logoImg: `${base}magazine-media/logos/bo-printer-gold.png?v=20261127logo`,
    highlightImg: `${base}magazine-media/bo-printer-poster.jpg`,
    highlightCaption: 'Posters printed by Bo Printer',
    heroImg: `${base}magazine-media/bo-printer-magazine.jpg`,
    heroTitle: 'We print all colours of the Caribbean',
    heroText:
      'Bo Printer mixes traditional craft with modern print technology — from a short digital run to a large offset job. Their team helps from the first design to the finished product.',
    quote: 'We print all colours of the Caribbean.',
    itemsHeading: 'Print options',
    items: [
      {
        img: `${base}magazine-media/bo-printer-brochure.jpg`,
        tag: 'Brochures',
        title: 'Brochures and folders',
        text: 'Folded brochures and presentation folders for your business.',
      },
      {
        img: `${base}magazine-media/bo-printer-flyer.jpg`,
        tag: 'Flyers',
        title: 'Flyers',
        text: 'Quick, bright flyers for events, shops, and promotions.',
      },
      {
        img: `${base}magazine-media/bo-printer-catalog.jpg`,
        tag: 'Catalogues',
        title: 'Catalogues',
        text: 'Full-colour catalogues and magazines, offset or digital.',
      },
    ],
    visitLabel: 'Printer',
    visitTitle: 'Visit Bo Printer',
    shopNote: 'Located at Groot Davelaar 145–147, Willemstad. Open Monday to Friday.',
    lifestyleLabel: 'Calendars',
    lifestyleTitle: 'Print worth keeping',
    lifestyleText:
      'Wall calendars, posters, notebooks, and greeting cards — made to hand out, hang up, and keep.',
    lifestyleImg: `${base}magazine-media/bo-printer-calendar.jpg`,
    collectionLabel: 'Print · Holidays edition',
    phone: '+599 9 737 8088',
    whatsapp: '59995644504',
    websiteUrl: 'https://boprinter.com/en/',
    websiteLabel: 'boprinter.com',
    address: 'Groot Davelaar 145–147, Willemstad, Curaçao',
    openingHours: 'Mon–Fri 08:00–12:00 & 13:00–17:00',
    mapsUrl: 'https://maps.google.com/?q=Bo+Printer+Groot+Davelaar+145+Willemstad+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1210,-68.9055&z=16&output=embed&iwloc=',
  },
]

export function getMagazinePartner(id: string | undefined) {
  if (!id) return undefined
  return magazinePartners.find((p) => p.id === id)
}
