const fs = require('fs');
const path = require('path');

const shopsPath = path.join(__dirname, '..', 'data', 'shops.json');
const shops = JSON.parse(fs.readFileSync(shopsPath, 'utf8'));

// 1. Enrich Artists & Studio Types
const artistDataMap = {
  'riot-tattoo': {
    studioType: 'Boutique Independent Collective',
    featured: false,
    intimidationScore: 2,
    intimidationLabel: 'Boutique Custom (2/10) • Appointment-Only Mezzanine',
    artists: [
      {
        id: 'paes-164',
        name: 'Paes 164',
        handle: '@paes164',
        role: 'Co-Founder & Master Neo-Traditionalist',
        specialties: ['Neo-Traditional', 'Custom Color', 'Freehand Stenciling'],
        bookingStatus: 'waitlist',
        waitlistTime: '2–3 Months',
        bioSnippet: 'Legendary Colorado Springs muralist and tattoo master renowned for vibrant freehand flow, organic anatomical fitting, and rich color saturation.',
        avatarInitials: 'P1'
      },
      {
        id: 'darin-newhouse',
        name: 'Darin Newhouse',
        handle: '@darin_newhouse_tattoos',
        role: 'Co-Founder & Dark Realism Specialist',
        specialties: ['Dark Realism', 'Black & Grey', 'Surrealism'],
        bookingStatus: 'waitlist',
        waitlistTime: '1–2 Months',
        bioSnippet: 'Veteran tattooer specializing in convention-grade black and grey realism, gothic anatomical textures, and micro-contrast shading.',
        avatarInitials: 'DN'
      },
      {
        id: 'elena-ramos',
        name: 'Elena Ramos',
        handle: '@elena_ink_cos',
        role: 'Resident Fine Line & Botanical Specialist',
        specialties: ['Fine Line', 'Botanicals', 'Micro-Script'],
        bookingStatus: 'open',
        waitlistTime: '2–3 Weeks',
        bioSnippet: 'Patience-focused botanical artist crafting razor-thin floras, single-needle script, and anatomical rib/sternum placements.',
        avatarInitials: 'ER'
      }
    ]
  },
  'pens-and-needles': {
    studioType: 'Commercial Retail Franchise',
    featured: false,
    intimidationScore: 4,
    intimidationLabel: 'Commercial Retail (4/10) • Sales-Oriented',
    artists: [
      {
        id: 'mark-certified',
        name: 'Mark',
        handle: '@mark_certified_cos',
        role: 'Resident Black & Grey Specialist',
        specialties: ['Black & Grey', 'Realism', 'Script'],
        bookingStatus: 'open',
        waitlistTime: '1–2 Weeks',
        bioSnippet: 'Technical tattooer delivering clean gradients, portrait work, and dependable black and grey execution.',
        avatarInitials: 'MK'
      },
      {
        id: 'elena-piercing',
        name: 'Elena P.',
        handle: '@elena_piercing_certified',
        role: 'Certified Body Piercing Specialist',
        specialties: ['Precision Piercing', 'Fine Jewelry', 'Anatomy Assessment'],
        bookingStatus: 'open',
        waitlistTime: 'Walk-ins Welcome',
        bioSnippet: 'Dedicated piercer strictly utilizing single-use sterile hollow needles and implant-grade titanium body jewelry.',
        avatarInitials: 'EP'
      }
    ]
  },
  'self-inflicted': {
    studioType: 'Historic Independent Street Shop',
    featured: false,
    intimidationScore: 3,
    intimidationLabel: 'Street Shop Camaraderie (3/10) • Welcoming & Gritty',
    artists: [
      {
        id: 'aaron-moore',
        name: 'Aaron Moore',
        handle: '@aaronmooretattoo',
        role: 'Resident Master & #1 Cover-Up Specialist',
        specialties: ['Cover-Ups', 'American Traditional', 'Japanese'],
        bookingStatus: 'waitlist',
        waitlistTime: '3–4 Months',
        bioSnippet: 'Widely recognized across Colorado Springs as the city\'s premier cover-up wizard, transforming dated ink into bold, timeless masterpieces.',
        avatarInitials: 'AM'
      },
      {
        id: 'vicki-westside',
        name: 'Vicki',
        handle: '@vicki_westside_ink',
        role: 'Resident Fine Line & Botanical Specialist',
        specialties: ['Fine Line', 'Dainty Florals', 'Illustrative'],
        bookingStatus: 'open',
        waitlistTime: '2–3 Weeks',
        bioSnippet: 'Known for a gentle hand, razor-thin lines that heal crisp without blowouts, and delicate botanical designs.',
        avatarInitials: 'VK'
      },
      {
        id: 'melek-tastekin',
        name: 'Melek Tastekin',
        handle: '@melektastekin_art',
        role: 'Custom Illustrative & Blackwork',
        specialties: ['Illustrative', 'Blackwork', 'Woodcut'],
        bookingStatus: 'open',
        waitlistTime: '3–4 Weeks',
        bioSnippet: 'Distinctive dark woodcut and narrative illustrative artist known for dense black packing and mythic storytelling.',
        avatarInitials: 'MT'
      }
    ]
  },
  'fallen-heroes': {
    studioType: 'High-Volume Commercial Complex',
    featured: false,
    intimidationScore: 5,
    intimidationLabel: 'Commercial Complex (5/10) • High-Volume Pace',
    artists: [
      {
        id: 'reece-allen',
        name: 'Reece Allen',
        handle: '@reeceallentattoos',
        role: 'Senior Anime & Gaming Color Specialist',
        specialties: ['Anime', 'Gaming Pop-Culture', 'Vibrant Color'],
        bookingStatus: 'waitlist',
        waitlistTime: '1–2 Months',
        bioSnippet: 'Celebrated nationally on Reddit and Instagram for flawless anime character fidelity, saturated colors, and razor-sharp outlines.',
        avatarInitials: 'RA'
      },
      {
        id: 'lindsay-fernandez',
        name: 'Lindsay Fernandez',
        handle: '@ln_fernandez',
        role: 'Large-Scale Illustrative & Backpieces',
        specialties: ['Illustrative Realism', 'Backpieces', 'Dark Art'],
        bookingStatus: 'waitlist',
        waitlistTime: '2–3 Months',
        bioSnippet: 'Specializes in multi-session backpieces, anatomical flow, high-contrast black and grey dark art, and high-end large scale.',
        avatarInitials: 'LF'
      },
      {
        id: 'aj-cullen',
        name: 'AJ Cullen',
        handle: '@ajcullentattoo',
        role: 'Color Realism & Pop Culture',
        specialties: ['Color Realism', 'Portraits', 'Wildlife'],
        bookingStatus: 'open',
        waitlistTime: '2–3 Weeks',
        bioSnippet: 'Skilled color realist delivering photographic wildlife and vibrant pop culture with patient needle craft.',
        avatarInitials: 'AJ'
      },
      {
        id: 'iso-tattoos',
        name: 'Iso',
        handle: '@iso_tattoos_cos',
        role: 'Cover-Up & Restorative Ink Specialist',
        specialties: ['Cover-Ups', 'Black & Grey', 'Script'],
        bookingStatus: 'open',
        waitlistTime: '1–2 Weeks',
        bioSnippet: 'Patient craftsman delivering restorative cover-ups and smooth black-and-grey shading that breathes new life into troubled ink.',
        avatarInitials: 'IS'
      }
    ]
  },
  'rose-of-the-west': {
    studioType: 'Boutique Independent Collective',
    featured: false,
    intimidationScore: 1,
    intimidationLabel: 'Inclusive Sanctuary (1/10) • Zero Gatekeeping',
    artists: [
      {
        id: 'lauren-rose',
        name: 'Lauren',
        handle: '@roseofthewest_lauren',
        role: 'Founder & Traditional Tattoo Master',
        specialties: ['American Traditional', 'Bold Color', 'Classic Flash'],
        bookingStatus: 'open',
        waitlistTime: '1–2 Weeks',
        bioSnippet: 'The Springs\' gold standard for American Traditional, packing timeless pigment and iconic heavy black outlines built to outlast decades.',
        avatarInitials: 'LR'
      },
      {
        id: 'benton-tattoos',
        name: 'Benton',
        handle: '@bentontattoos',
        role: 'Senior Traditional & Bold Color Specialist',
        specialties: ['American Traditional', 'Japanese Traditional', 'Custom Flash'],
        bookingStatus: 'open',
        waitlistTime: 'Walk-ins Available',
        bioSnippet: 'Veteran traditionalist with deep roots in classic painted flash, clean walk-in execution, and respectful heritage etiquette.',
        avatarInitials: 'BN'
      }
    ]
  },
  'timeless-body-art': {
    studioType: 'Boutique Independent Collective',
    featured: false,
    intimidationScore: 2,
    intimidationLabel: 'Focused Studio (2/10) • Calm & Methodical',
    artists: [
      {
        id: 'ryan-timeless',
        name: 'Ryan',
        handle: '@ryan_timelessbodyart',
        role: 'Co-Owner & Award-Winning Portrait Realism',
        specialties: ['Photorealistic Portraits', 'Black & Grey', 'Memorial Ink'],
        bookingStatus: 'waitlist',
        waitlistTime: '1–2 Months',
        bioSnippet: 'Festival-award winner renowned for capturing emotional human expressions and wildlife with breathtaking photographic accuracy.',
        avatarInitials: 'RY'
      },
      {
        id: 'sean-timeless',
        name: 'Sean',
        handle: '@sean_bodyart_cos',
        role: 'Color Realism & Dark Surrealism Specialist',
        specialties: ['Color Realism', 'Dark Surrealism', 'Cover-Ups'],
        bookingStatus: 'open',
        waitlistTime: '3–4 Weeks',
        bioSnippet: 'Painterly tattooer crafting deep atmospheric contrast, surrealist dreamscapes, and saturated color blending.',
        avatarInitials: 'SN'
      }
    ]
  },
  'tattoo-demon': {
    studioType: 'Heritage Independent Street Shop',
    featured: false,
    intimidationScore: 3,
    intimidationLabel: 'Classic Street Shop (3/10) • Authentic No-BS',
    artists: [
      {
        id: 'dave-wulff',
        name: 'Dave Wulff',
        handle: '@davewulfftattoo',
        role: 'Founder & Tejon Street Legend',
        specialties: ['Traditional Americana', 'Biker Heritage', 'Wall Flash'],
        bookingStatus: 'open',
        waitlistTime: 'Walk-Ins Welcome',
        bioSnippet: 'Over two decades of unfiltered craftsmanship on Tejon Street with heavy black lines that age like iron and zero corporate fluff.',
        avatarInitials: 'DW'
      },
      {
        id: 'manny-demon',
        name: 'Manny C.',
        handle: '@manny_demon_ink',
        role: 'Classic American Traditional & Flash',
        specialties: ['Flash Art', 'Panthers & Daggers', 'Bold Color'],
        bookingStatus: 'open',
        waitlistTime: 'Same-Day Openings',
        bioSnippet: 'Rapid, razor-sharp traditional execution for spontaneous walk-ins, heritage flash collectors, and bold color devotees.',
        avatarInitials: 'MC'
      }
    ]
  }
};

shops.forEach(shop => {
  const meta = artistDataMap[shop.id];
  if (!meta) return;

  shop.studioType = meta.studioType;
  shop.featured = meta.featured;
  if (shop.vibe) {
    shop.vibe.intimidationScore = meta.intimidationScore;
    shop.vibe.intimidationLabel = meta.intimidationLabel;
  }

  // Attach enriched artists with shop linkage
  shop.artists = meta.artists.map(a => ({
    ...a,
    shopId: shop.id,
    shopName: shop.name,
    shopSlug: shop.slug || shop.id,
    isIndie: meta.studioType.includes('Independent')
  }));
});

fs.writeFileSync(shopsPath, JSON.stringify(shops, null, 2), 'utf8');
console.log('Successfully enriched shops.json with artist metadata & un-biased studio classifications.');
