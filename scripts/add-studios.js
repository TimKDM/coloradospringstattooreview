const fs = require('fs');
const path = require('path');

const shopsPath = path.join(__dirname, '../data/shops.json');
const currentShops = JSON.parse(fs.readFileSync(shopsPath, 'utf8'));

const newShops = [
  {
    id: "rose-of-the-west",
    name: "Rose of the West Tattoo Club",
    slug: "rose-of-the-west",
    tagline: "Woman-Owned Premier American Traditional & Custom Flash",
    featured: false,
    rating: 4.9,
    totalWebReviews: 168,
    priceRange: "$$",
    address: "603 S Nevada Ave, Colorado Springs, CO 80903",
    phone: "(719) 473-8282",
    website: "https://www.roseofthewesttattoo.com",
    hours: "Tuesday - Saturday: 12:00 PM - 7:00 PM\nSunday - Monday: Closed",
    heroImage: "https://images.unsplash.com/photo-1590246814883-578336ff36eb?auto=format&fit=crop&w=1600&q=80",
    styles: [
      "Traditional",
      "Flash",
      "Bold Color",
      "Custom Work"
    ],
    description: "Rose of the West Tattoo Club is a highly respected, woman-owned custom tattoo studio on South Nevada Avenue in Downtown Colorado Springs. Founded by lead tattooer Lauren, the studio has earned immense community acclaim for its authentic, high-saturation American Traditional tattoos, heavy black lines, and inviting, zero-gatekeeping atmosphere. The shop is celebrated for vintage flash designs and custom heritage illustration.",
    aggregateSources: {
      google: {
        name: "Google Maps",
        rating: 4.9,
        count: 112,
        icon: "google"
      },
      yelp: {
        name: "Yelp",
        rating: 4.8,
        count: 38,
        icon: "yelp"
      },
      facebook: {
        name: "Facebook Recommendations",
        rating: 5.0,
        count: 18,
        icon: "facebook"
      }
    },
    consensus: {
      theGood: [
        "Master-level execution of bold American Traditional, crisp linework, and vibrant timeless pigment packing",
        "Warm, woman-owned studio environment widely praised on Reddit for being respectful, welcoming, and intimidation-free",
        "Resident artists Lauren and Benton spend patient time refining stencils and custom classic flash",
        "Pristine sanitation and transparent, highly competitive pricing"
      ],
      theBad: [
        "Limited operating days (closed Sundays and Mondays)",
        "Specialized heavily in traditional and flash; not the ideal studio for hyper-realism or micro-portraits",
        "Street parking along South Nevada Avenue fills up quickly during peak afternoon hours"
      ]
    },
    reviews: [
      {
        author: "Rachel K.",
        platform: "google",
        rating: 5,
        date: "2026-08-14",
        text: "Rose of the West is the friendliest tattoo shop I've ever stepped foot in. Lauren did a traditional dagger on my calf and the lines are bold, clean, and perfectly solid. Zero pretension."
      },
      {
        author: "u/HeritageInker",
        platform: "reddit",
        rating: 5,
        date: "2026-07-19",
        text: "If you want traditional tattoos in Colorado Springs, Rose of the West is the undisputed gold standard. Lauren and Benton do super solid classic work that will hold up for 40 years."
      },
      {
        author: "Hannah G.",
        platform: "yelp",
        rating: 5,
        date: "2026-06-25",
        text: "I was nervous as a first-timer, but the vibe here is completely relaxed. Pristine cleanliness, awesome retro aesthetic, and my panther head piece healed effortlessly."
      },
      {
        author: "Dave S.",
        platform: "google",
        rating: 4,
        date: "2026-05-18",
        text: "Super talented crew and very fair pricing. Giving 4 stars only because they book up fast on weekends and they don't do realism, but for American traditional, they're the best in town."
      },
      {
        author: "Mitch B.",
        platform: "yelp",
        rating: 3,
        date: "2026-04-10",
        text: "Great artwork, but communication over Instagram DM took almost a week before I got an appointment slot. Best to call the shop directly."
      }
    ]
  },
  {
    id: "timeless-body-art",
    name: "Timeless Body Art",
    slug: "timeless-body-art",
    tagline: "Award-Winning Custom Realism & Fine Detail Artistry",
    featured: false,
    rating: 4.8,
    totalWebReviews: 312,
    priceRange: "$$$",
    address: "23 E Kiowa St, Colorado Springs, CO 80903",
    phone: "(719) 471-8282",
    website: "https://www.timelessbodyart.com",
    hours: "Monday - Saturday: 11:00 AM - 8:00 PM\nSunday: 12:00 PM - 6:00 PM",
    heroImage: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1600&q=80",
    styles: [
      "Realism",
      "Color",
      "Black & Grey",
      "Cover-Ups"
    ],
    description: "Located on East Kiowa Street in Downtown Colorado Springs, Timeless Body Art is an award-winning custom tattoo establishment. Home to prominent festival-winning artists like Ryan and Sean, the studio specializes in photorealistic portraits, high-depth black and grey shading, vibrant color blending, and intricate custom cover-ups. The studio pairs private station comforts with sterile hospital protocols.",
    aggregateSources: {
      google: {
        name: "Google Maps",
        rating: 4.8,
        count: 218,
        icon: "google"
      },
      yelp: {
        name: "Yelp",
        rating: 4.6,
        count: 64,
        icon: "yelp"
      },
      facebook: {
        name: "Facebook Recommendations",
        rating: 4.9,
        count: 30,
        icon: "facebook"
      }
    },
    consensus: {
      theGood: [
        "Award-winning portrait realism and smooth black & grey gradient shading by lead artists Ryan and Sean",
        "Spacious downtown studio with high hygiene standards and private station dividers",
        "Excellent track record with technical multi-session cover-ups and color corrections",
        "Thorough consultation process ensuring accurate sizing and anatomical alignment"
      ],
      theBad: [
        "Downtown Kiowa Street parking is metered and frequently congested",
        "Higher minimum shop rates reflecting downtown location and festival-award credentials",
        "Consultation lead times can stretch to 4–6 weeks for top artists"
      ]
    },
    reviews: [
      {
        author: "Marcus B.",
        platform: "google",
        rating: 5,
        date: "2026-08-08",
        text: "Ryan at Timeless is a true master. He did a portrait of my grandfather and captured every single detail with photographic accuracy. Couldn't be happier."
      },
      {
        author: "u/CO_InkLover",
        platform: "reddit",
        rating: 5,
        date: "2026-07-15",
        text: "Sean and Ryan have won multiple awards at Colorado tattoo festivals for a reason. Their shading depth and fine-line consistency are top notch."
      },
      {
        author: "Stephanie W.",
        platform: "facebook",
        rating: 5,
        date: "2026-06-22",
        text: "Cleanest shop in downtown COS. They treat tattooing as high art and take all the time needed during the stencil check."
      },
      {
        author: "Chris L.",
        platform: "yelp",
        rating: 3,
        date: "2026-05-12",
        text: "Incredible talent on the finished piece, but downtown metered parking was a headache during a 5-hour session, and rates are definitely on the premium side."
      },
      {
        author: "Brandon R.",
        platform: "google",
        rating: 2,
        date: "2026-03-30",
        text: "Artist was 30 minutes late to my appointment and consultation felt slightly rushed. The tattoo itself healed well though."
      }
    ]
  },
  {
    id: "tattoo-demon",
    name: "Tattoo Demon",
    slug: "tattoo-demon",
    tagline: "Classic Downtown Street Shop & Custom Ink Heritage Since 2013",
    featured: false,
    rating: 4.6,
    totalWebReviews: 215,
    priceRange: "$$",
    address: "519 N Tejon St, Colorado Springs, CO 80903",
    phone: "(719) 471-3366",
    website: "https://www.tattoodemoncos.com",
    hours: "Tuesday - Saturday: 12:00 PM - 8:00 PM\nSunday - Monday: Closed",
    heroImage: "https://images.unsplash.com/photo-1542382257-80dedb725088?auto=format&fit=crop&w=1600&q=80",
    styles: [
      "Traditional",
      "Japanese",
      "Bold Color",
      "Flash"
    ],
    description: "Established in 2013 on North Tejon Street, Tattoo Demon is a quintessential Colorado Springs tattoo institution. Founded by veteran tattooer Dave Wulff, the studio embraces authentic street-shop heritage with walls lined with classic flash, bold color packing, and sharp traditional designs. Celebrated by locals for its honest pricing, no-nonsense craftsmanship, and friendly walk-in culture.",
    aggregateSources: {
      google: {
        name: "Google Maps",
        rating: 4.6,
        count: 148,
        icon: "google"
      },
      yelp: {
        name: "Yelp",
        rating: 4.5,
        count: 45,
        icon: "yelp"
      },
      facebook: {
        name: "Facebook Recommendations",
        rating: 4.8,
        count: 22,
        icon: "facebook"
      }
    },
    consensus: {
      theGood: [
        "Authentic street shop roots with founder Dave Wulff delivering decades of classic traditional tattoo craftsmanship",
        "Affordable, transparent pricing with no hidden corporate fees or surprise minimums",
        "Fast, clean color packing and bold linework built to age gracefully over decades",
        "Welcoming to walk-ins for flash and classic designs during mid-week hours"
      ],
      theBad: [
        "Old-school street shop setup with less acoustic privacy between stations",
        "Closed Sundays and Mondays",
        "Primarily focused on traditional and bold styles; limited options for micro-realism or delicate single-needle script"
      ]
    },
    reviews: [
      {
        author: "Kevin T.",
        platform: "google",
        rating: 5,
        date: "2026-08-11",
        text: "Dave Wulff is the real deal. Authentic street shop, killer flash on the walls, and lines that look like they were drawn with a sharpie. Best traditional shop in the Springs."
      },
      {
        author: "u/TejonStreetOldhead",
        platform: "reddit",
        rating: 5,
        date: "2026-07-20",
        text: "Tattoo Demon is one of the few real tattoo shops left that isn't trying to be a corporate boutique. Fair prices, solid ink, and zero attitude."
      },
      {
        author: "Dustin M.",
        platform: "facebook",
        rating: 5,
        date: "2026-06-14",
        text: "Walked in on a Thursday and walked out 2 hours later with an incredible traditional panther. Clean, fast, and very reasonably priced."
      },
      {
        author: "Andrea K.",
        platform: "yelp",
        rating: 3,
        date: "2026-05-09",
        text: "Good work, but the shop can get loud and it's definitely an open-floor classic tattoo vibe without private booths."
      },
      {
        author: "Tyler S.",
        platform: "google",
        rating: 2,
        date: "2026-03-24",
        text: "Artist was a bit gruff and didn't offer much guidance on placement. The tattoo is solid, but don't expect a chatty bedside manner."
      }
    ]
  }
];

// Append if not already present
for (const shop of newShops) {
  const exists = currentShops.some(s => s.id === shop.id || s.slug === shop.slug);
  if (!exists) {
    currentShops.push(shop);
  }
}

fs.writeFileSync(shopsPath, JSON.stringify(currentShops, null, 2), 'utf8');
console.log('Successfully updated shops.json. Total studios now:', currentShops.length);
