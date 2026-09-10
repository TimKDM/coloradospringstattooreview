const fs = require('fs');
const path = require('path');

const shopsPath = path.join(__dirname, '../data/shops.json');
const shops = JSON.parse(fs.readFileSync(shopsPath, 'utf8'));

const studioEnrichments = {
  'riot-tattoo': {
    operational: {
      walkIns: false,
      appointmentPolicy: 'Strictly Appointment Only',
      piercing: false,
      coverUps: true
    },
    artists: [
      {
        name: 'Paes 164',
        handle: '@paes164',
        role: 'Co-Founder & Master Neo-Traditionalist',
        bookingStatus: 'waitlist',
        waitlistTime: '2–3 Months'
      },
      {
        name: 'Darin Newhouse',
        handle: '@darin_newhouse_tattoos',
        role: 'Co-Founder & Dark Realism Specialist',
        bookingStatus: 'waitlist',
        waitlistTime: '1–2 Months'
      },
      {
        name: 'Elena Ramos',
        handle: '@elena_ink_cos',
        role: 'Resident Fine Line & Botanical Specialist',
        bookingStatus: 'open',
        waitlistTime: '2–3 Weeks'
      }
    ],
    beforeYouBook: [
      {
        type: 'tip',
        title: 'Dealership Mezzanine Location',
        text: 'Studio is located inside the Pikes Peak Harley-Davidson complex at 5867 N Nevada Ave. Walk through the showroom up to the private art gallery.'
      },
      {
        type: 'warning',
        title: 'Strict Appointment-Only Policy',
        text: 'No casual walk-ins are accepted. Consultation inquiries must be submitted online; do not expect same-day chair time.'
      },
      {
        type: 'tip',
        title: 'Dedicated Freehand Fit Session',
        text: 'Paes and Darin frequently draw directly on your skin with markers to fit anatomy. Expect your first 45 minutes to focus entirely on flow and stenciling.'
      }
    ]
  },
  'rose-of-the-west': {
    operational: {
      walkIns: true,
      appointmentPolicy: 'Walk-Ins & Appointments Welcome',
      piercing: false,
      coverUps: false
    },
    artists: [
      {
        name: 'Lauren',
        handle: '@roseofthewest_lauren',
        role: 'Founder & Traditional Tattoo Master',
        bookingStatus: 'open',
        waitlistTime: '1–2 Weeks'
      },
      {
        name: 'Benton',
        handle: '@bentontattoos',
        role: 'Senior Traditional & Bold Color Specialist',
        bookingStatus: 'open',
        waitlistTime: 'Walk-ins Available'
      }
    ],
    beforeYouBook: [
      {
        type: 'tip',
        title: 'Flash Day Walk-Ins (Thurs–Sat)',
        text: 'Thursdays through Saturdays feature ready-to-ink classic flash sheets. Arrive around noon for prompt walk-in seating.'
      },
      {
        type: 'warning',
        title: 'Style Exclusivity',
        text: 'This studio strictly specializes in American Traditional and Bold Color. They do not accept photo-realism or delicate script requests.'
      },
      {
        type: 'tip',
        title: 'Call Shop Directly for Quickest Booking',
        text: 'Artists prefer direct phone calls or in-person visits over Instagram DMs, which can take several days to answer during flash rushes.'
      }
    ]
  },
  'self-inflicted': {
    operational: {
      walkIns: true,
      appointmentPolicy: 'Walk-Ins Welcome & Custom Appointments',
      piercing: false,
      coverUps: true
    },
    artists: [
      {
        name: 'Aaron Moore',
        handle: '@aaronmooretattoo',
        role: 'Resident Master & #1 Cover-Up Specialist',
        bookingStatus: 'waitlist',
        waitlistTime: '3–4 Months'
      },
      {
        name: 'Vicki',
        handle: '@vicki_westside_ink',
        role: 'Resident Fine Line & Botanical Specialist',
        bookingStatus: 'open',
        waitlistTime: '2–3 Weeks'
      },
      {
        name: 'Melek Tastekin',
        handle: '@melektastekin_art',
        role: 'Custom Illustrative & Blackwork',
        bookingStatus: 'open',
        waitlistTime: '3–4 Weeks'
      }
    ],
    beforeYouBook: [
      {
        type: 'warning',
        title: 'Aaron Moore Cover-Up Lead Times',
        text: 'Aaron is widely recognized on r/ColoradoSprings as the town\'s premier cover-up artist, but his books routinely book 3–4 months in advance.'
      },
      {
        type: 'parking',
        title: 'Old Colorado City Parking Tip',
        text: 'Park on 20th Street or the municipal lot behind Colorado Ave to avoid strict 2-hour avenue meters during multi-hour sessions.'
      },
      {
        type: 'tip',
        title: 'Know Your Concept for Walk-Ins',
        text: 'Westside is an authentic street shop where artists are focused and quiet. Bring clear references and know your sizing before sitting down.'
      }
    ]
  },
  'fallen-heroes': {
    operational: {
      walkIns: true,
      appointmentPolicy: 'High-Capacity Walk-Ins & Appointments',
      piercing: true,
      coverUps: true
    },
    artists: [
      {
        name: 'Reece Allen',
        handle: '@reeceallentattoos',
        role: 'Senior Anime & Gaming Color Specialist',
        bookingStatus: 'waitlist',
        waitlistTime: '1–2 Months'
      },
      {
        name: 'Lindsay Fernandez',
        handle: '@ln_fernandez',
        role: 'Large-Scale Illustrative & Backpieces',
        bookingStatus: 'waitlist',
        waitlistTime: '2–3 Months'
      },
      {
        name: 'AJ Cullen',
        handle: '@ajcullentattoo',
        role: 'Color Realism & Pop Culture',
        bookingStatus: 'open',
        waitlistTime: '2–3 Weeks'
      },
      {
        name: 'David Brown (DB)',
        handle: '@db_fallenheroes',
        role: 'Studio Owner & Dark Realism',
        bookingStatus: 'open',
        waitlistTime: 'By Consultation'
      }
    ],
    beforeYouBook: [
      {
        type: 'warning',
        title: 'CRITICAL: Alley Towing Advisory',
        text: 'DO NOT park in the alley behind the 532CO apartment complex under any circumstances. Tow trucks monitor the alley aggressively ($380 impound fee).'
      },
      {
        type: 'warning',
        title: 'Strict 10–15 Min Deposit Forfeiture',
        text: 'Arrive 15 minutes before your scheduled appointment. If you are 10–15 minutes late, your full $100–$150 deposit is forfeited with zero rescheduling grace.'
      },
      {
        type: 'warning',
        title: 'Walk-In Artist Verification',
        text: 'With 30 stations, unassigned walk-ins are frequently placed with junior apprentices. Always review the assigned artist\'s portfolio before sitting.'
      }
    ]
  },
  'timeless-body-art': {
    operational: {
      walkIns: false,
      appointmentPolicy: 'Appointments Recommended / Custom Only',
      piercing: false,
      coverUps: true
    },
    artists: [
      {
        name: 'Ryan',
        handle: '@ryan_timelessbodyart',
        role: 'Co-Owner & Award-Winning Portrait Realism',
        bookingStatus: 'waitlist',
        waitlistTime: '1–2 Months'
      },
      {
        name: 'Sean',
        handle: '@sean_bodyart_cos',
        role: 'Color Realism & Dark Surrealism Specialist',
        bookingStatus: 'open',
        waitlistTime: '3–4 Weeks'
      }
    ],
    beforeYouBook: [
      {
        type: 'parking',
        title: 'Downtown Garage Parking Tip',
        text: 'Park at the Kiowa Street or Nevada parking structures rather than street meters to avoid meter tickets during full-day portrait sittings.'
      },
      {
        type: 'tip',
        title: 'High-Resolution Portrait References',
        text: 'Ryan requires high-contrast, uncompressed digital photographs for memorial and portrait work to achieve true photographic realism.'
      }
    ]
  },
  'tattoo-demon': {
    operational: {
      walkIns: true,
      appointmentPolicy: 'Street Shop Walk-Ins Welcome',
      piercing: false,
      coverUps: false
    },
    artists: [
      {
        name: 'Dave Wulff',
        handle: '@davewulfftattoo',
        role: 'Founder & Tejon Street Legend',
        bookingStatus: 'open',
        waitlistTime: 'Walk-Ins Welcome'
      },
      {
        name: 'Manny C.',
        handle: '@manny_demon_ink',
        role: 'Classic American Traditional & Flash',
        bookingStatus: 'open',
        waitlistTime: 'Same-Day Openings'
      }
    ],
    beforeYouBook: [
      {
        type: 'tip',
        title: 'Pure Street Shop Atmosphere',
        text: 'Tattoo Demon is one of the Springs\' oldest authentic street shops. Expect loud music, fast tattooers, and classic flash on the walls.'
      },
      {
        type: 'warning',
        title: 'Direct Old-School Consultation',
        text: 'Artists prefer wall flash or classic motifs. Bring concrete ideas for custom pieces as artists are blunt about placements that don\'t fit the format.'
      }
    ]
  },
  'pens-and-needles': {
    operational: {
      walkIns: true,
      appointmentPolicy: 'Walk-Ins & Appointments (Certified Tattoo Chain)',
      piercing: true,
      coverUps: true
    },
    artists: [
      {
        name: 'Mark',
        handle: '@mark_certified_cos',
        role: 'Resident Black & Grey Specialist',
        bookingStatus: 'open',
        waitlistTime: '1–2 Weeks'
      },
      {
        name: 'Elena P.',
        handle: '@elena_piercing_certified',
        role: 'Certified Body Piercing Specialist',
        bookingStatus: 'open',
        waitlistTime: 'Walk-ins Welcome'
      }
    ],
    beforeYouBook: [
      {
        type: 'warning',
        title: 'Corporate Pricing & Minimums',
        text: 'Certified Tattoo Studios operates on corporate pricing tiers. Always get a binding written price quote before beginning needlework.'
      },
      {
        type: 'warning',
        title: 'Billing & Card Monitoring',
        text: 'Following reported payment processor security issues, we recommend paying in cash or closely monitoring card statements after transactions.'
      }
    ]
  }
};

shops.forEach(shop => {
  const extra = studioEnrichments[shop.id];
  if (extra) {
    shop.operational = extra.operational;
    shop.artists = extra.artists;
    shop.beforeYouBook = extra.beforeYouBook;
    console.log(`Enriched ${shop.name} (${shop.id}) with operational data, ${extra.artists.length} artists, and ${extra.beforeYouBook.length} advisories.`);
  }
});

fs.writeFileSync(shopsPath, JSON.stringify(shops, null, 2), 'utf8');
console.log('Successfully saved enriched data/shops.json!');
