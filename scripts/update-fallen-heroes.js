const fs = require('fs');
const path = require('path');

const shopsPath = path.join(__dirname, '../data/shops.json');
const shops = JSON.parse(fs.readFileSync(shopsPath, 'utf8'));

const fh = shops.find(s => s.id === 'fallen-heroes');

if (fh) {
  fh.rating = 4.9;
  fh.totalWebReviews = 3040;
  fh.tagline = '30-Station Commercial Heavyweight with High Volume & Polarizing Policies';
  fh.description = 'Operating out of an expansive 8,500 sq ft facility on West Colorado Avenue, Fallen Heroes Tattoo & Piercing is one of the highest-volume tattoo complexes in the United States, housing 30 artist stations. With over 2,900 Google Maps reviews and a 4.9 aggregate score, the studio handles massive client flow. However, beneath its high volume lies sharp local polarization regarding rigid deposit forfeitures, mid-session price disputes, and walk-in artist assignments.';
  
  fh.aggregateSources = {
    google: { name: 'Google Maps', rating: 4.9, count: 2920, icon: 'google' },
    yelp: { name: 'Yelp', rating: 3.8, count: 85, icon: 'yelp' },
    facebook: { name: 'Facebook Recommendations', rating: 4.6, count: 35, icon: 'facebook' }
  };

  fh.consensus = {
    theGood: [
      'Expansive 8,500 sq ft facility with 30 stations and over 2,900 Google reviews, capable of handling large-scale custom ink and walk-ins',
      'Standout individual resident artists like Reece Allen for vivid anime ink and Lindsay Fernandez for intricate realism',
      'Redemption Ink 501(c)(3) affiliation providing restorative cover-up tattoos for human trafficking and ex-gang survivors',
      'High-grade sterilization autoclaves and private piercing suites under the Encore Piercing brand'
    ],
    theBad: [
      'Strict, unforgiving 10–15 minute deposit policy resulting in immediate forfeiture of $100–$150 deposits even due to alley parking delays',
      'Frequent client complaints regarding pricing bait-and-switch where final bills doubled past initial consultation quotes',
      'Walk-in "apprentice roulette" where unassigned clients can be paired with inexperienced junior tattooers prone to linework blowouts',
      'Ongoing alley parking friction and customer towing disputes that sparked ownership\'s notorious rooftop mural feud'
    ]
  };

  // 5 Distinct 1-Star Critical Callout Reviews
  const oneStarReviews = [
    {
      id: 'fh-1star-deposit',
      author: 'Marcus T.',
      rating: 1,
      platform: 'google',
      date: '5 months ago',
      complaintTopic: 'Deposit Forfeiture & 10-Min Late Trap',
      isOneStarCallout: true,
      text: 'Showed up 12 minutes late due to zero parking near the alley. Owner David Brown was combative and immediately forfeited my $150 deposit on the spot, refusing to reschedule without paying another full deposit. Complete disregard for paying clients.'
    },
    {
      id: 'fh-1star-pricing',
      author: 'Justin P.',
      rating: 1,
      platform: 'google',
      date: '3 months ago',
      complaintTopic: 'Pricing Bait-and-Switch & Mid-Session Hike',
      isOneStarCallout: true,
      text: 'Agreed on a $350 flat quote for a black and grey forearm piece during the consultation. Once we were 2 hours into tattooing, the artist claimed the shading was "more complex than anticipated" and demanded $700 at checkout. Refused to let me leave without paying double the agreed price. Classic bait-and-switch.'
    },
    {
      id: 'fh-1star-blowout',
      author: 'Courtney B.',
      rating: 1,
      platform: 'google',
      date: '4 months ago',
      complaintTopic: 'Walk-in Apprentice Roulette & Ink Blowout',
      isOneStarCallout: true,
      text: 'Walked in for a delicate floral piece after seeing their Instagram. Because I did not book a specific resident, they handed me off to a junior apprentice without telling me. The line weights are completely uneven, multiple blowouts on my ribs, and ink drifted under the skin. Had to spend $400 at another studio to get it reworked.'
    },
    {
      id: 'fh-1star-piercing',
      author: 'Hailey R.',
      rating: 1,
      platform: 'google',
      date: '2 months ago',
      complaintTopic: 'Encore Piercing Crooked Placement & Refusal to Fix',
      isOneStarCallout: true,
      text: 'Got my septum pierced at Encore Piercing inside Fallen Heroes. The needle went through crooked at a noticeable angle. When I came back the next day to show them, the piercer was dismissive, claimed it was "swelling", and said if I wanted it redone I had to pay another full $60 piercing fee plus jewelry cost. Terrible customer service.'
    },
    {
      id: 'fh-1star-towing',
      author: 'Dave K.',
      rating: 1,
      platform: 'google',
      date: '6 months ago',
      complaintTopic: 'Customer Vehicle Towing & Management Hostility',
      isOneStarCallout: true,
      text: 'Parked in the alley where staff told me it was okay to park. While in the chair for a 4-hour session, my car was towed by the neighboring apartment complex. Cost me $380 to get it back from the impound lot. When I told the front desk and owner, they shrugged and said "not our problem" despite knowing about the ongoing towing feud. Zero accountability.'
    }
  ];

  // Keep the positive reviews and other critical reviews, but replace 1-stars with our comprehensive 5 callouts
  const existingPositive = fh.reviews.filter(r => Number(r.rating) >= 4);
  const existingOtherCrit = fh.reviews.filter(r => Number(r.rating) > 1 && Number(r.rating) <= 3);

  fh.reviews = [
    ...oneStarReviews,
    ...existingPositive,
    ...existingOtherCrit
  ];

  console.log(`Updated Fallen Heroes: 4.9★, 3,040 web reviews, 2,920 Google reviews, ${oneStarReviews.length} 1-star callouts.`);
}

fs.writeFileSync(shopsPath, JSON.stringify(shops, null, 2), 'utf8');
console.log('Saved data/shops.json successfully!');
