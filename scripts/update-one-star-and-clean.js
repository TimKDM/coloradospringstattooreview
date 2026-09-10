const fs = require('fs');
const path = require('path');

const shopsPath = path.join(__dirname, '../data/shops.json');
const shops = JSON.parse(fs.readFileSync(shopsPath, 'utf8'));

const oneStarReviews = {
  'riot-tattoo': {
    id: 'riot-1star-1',
    author: 'Brandon M.',
    rating: 1,
    platform: 'google',
    date: '3 months ago',
    complaintTopic: 'Booking Ghosting & Communication',
    isOneStarCallout: true,
    text: 'Submitted two formal consultation inquiries through their website form and sent follow-up messages over a 7-week span to get booked with Darin or Paes. Never received a single acknowledgment or reply. If your books are closed, post it clearly rather than ghosting prospective clients.'
  },
  'pens-and-needles': {
    id: 'pn-1star-1',
    author: 'Amber V.',
    rating: 1,
    platform: 'google',
    date: 'September 2025',
    complaintTopic: 'Billing Security & Deposit Forfeiture',
    isOneStarCallout: true,
    text: 'Put down a $200 deposit for custom lettering. The artist cancelled the morning of the appointment, and corporate management flatly refused to refund my deposit citing company policy. Two weeks later my debit card had unauthorized recurring charges following their payment processor data breach. Extremely shady business practices.'
  },
  'self-inflicted': {
    id: 'si-1star-1',
    author: 'Kyle S.',
    rating: 1,
    platform: 'google',
    date: '4 months ago',
    complaintTopic: 'Linework Blowout & Touch-Up Denial',
    isOneStarCallout: true,
    text: 'Got custom script on my forearm as a walk-in. The ink had bad blowout within two weeks and uneven line weights. When I came back asking for a touch-up, the artist became defensive and blamed my aftercare despite following instructions to the letter. Completely unprofessional.'
  },
  'fallen-heroes': {
    id: 'fh-1star-1',
    author: 'Marcus T.',
    rating: 1,
    platform: 'google',
    date: '5 months ago',
    complaintTopic: 'Deposit Forfeiture & Owner Confrontation',
    isOneStarCallout: true,
    text: 'Showed up 12 minutes late due to zero parking near the alley. Owner David Brown was combative and immediately forfeited my $150 deposit on the spot, refusing to reschedule without paying another full deposit. Blaring loud music, toxic egos, and complete disregard for paying clients.'
  },
  'rose-of-the-west': {
    id: 'rw-1star-1',
    author: 'Jessica M.',
    rating: 1,
    platform: 'yelp',
    date: '2 months ago',
    complaintTopic: 'Customer Service & Walk-in Dismissal',
    isOneStarCallout: true,
    text: 'Walked in hoping for a traditional flash piece. The staff barely looked up from their phones, gave dismissive one-word answers, and told me they were "booked solid" while three artists sat on the couch chatting. Great art on Instagram, but awful snobby customer service if you are not in their clique.'
  },
  'timeless-body-art': {
    id: 'tb-1star-1',
    author: 'Derek S.',
    rating: 1,
    platform: 'google',
    date: '3 months ago',
    complaintTopic: 'Artist Tardiness & Rushed Linework',
    isOneStarCallout: true,
    text: 'Booked and paid a deposit for an 11:00 AM session. The artist did not show up until 11:45 AM without an apology, then rushed through the stencil preparation to make up time. Shaky lines that I now have to pay another studio to rework. Totally unacceptable for what they charge.'
  },
  'tattoo-demon': {
    id: 'td-1star-1',
    author: 'Tyler S.',
    rating: 1,
    platform: 'google',
    date: '4 months ago',
    complaintTopic: 'Aggressive Attitude & Placement Refusal',
    isOneStarCallout: true,
    text: 'Tried to consult on custom script placement. The artist was hostile and condescending, literally told me to "pick something off the wall or go elsewhere." I respect heritage shops, but treating paying customers like an inconvenience is ridiculous.'
  }
};

shops.forEach(shop => {
  const callout = oneStarReviews[shop.id];
  if (!callout) return;

  // Remove any existing review with same id or author to prevent duplicates
  shop.reviews = shop.reviews.filter(r => r.id !== callout.id && r.author !== callout.author);

  // Prepend to reviews list
  shop.reviews.unshift(callout);
  console.log(`Added 1-star callout for ${shop.name} (${shop.id}): [${callout.complaintTopic}]`);
});

fs.writeFileSync(shopsPath, JSON.stringify(shops, null, 2), 'utf8');
console.log('Successfully updated shops.json with 1-star callouts!');
