const fs = require('fs');
const path = require('path');

const shopsPath = path.join(__dirname, '../data/shops.json');
const shops = JSON.parse(fs.readFileSync(shopsPath, 'utf8'));

shops.forEach(shop => {
  if (shop.id === 'pens-and-needles') {
    shop.featured = false;
    shop.rating = 4.2;
    shop.tagline = 'Downtown Studio Transitioned to Certified Tattoo Studios Chain';
    shop.description = 'Located on Tejon Street in Downtown Colorado Springs, Pens & Needles was historically a local staple that has since transitioned under Denver-based chain Certified Tattoo Studios. While home to skilled piercers and veteran technical tattooers, the studio has experienced severe community pushback over steep corporate price structures, high non-refundable deposits, and recent payment processor data security incidents that triggered unauthorized charges.';
    shop.aggregateSources = {
      google: { name: 'Google Maps', rating: 4.3, count: 240, icon: 'google' },
      yelp: { name: 'Yelp', rating: 3.6, count: 68, icon: 'yelp' },
      facebook: { name: 'Facebook Recommendations', rating: 4.5, count: 34, icon: 'facebook' }
    };
    shop.consensus = {
      theGood: [
        'Historically recognized on r/ColoradoSprings for veteran resident artists like Justin Hulsey and Joe Othon',
        'Professional piercing department strictly utilizing single-use hollow needles rather than piercing guns',
        'Central Downtown location on Tejon Street with private station dividers and sterile autoclaves',
        'Reliable technical execution for standard flash and traditional black & grey script'
      ],
      theBad: [
        'Transition into Certified Tattoo Studios corporate chain sparked severe backlash over high hourly minimums and aggressive sales pressure',
        'Major client complaints and 1-star reviews regarding payment processor data breach that led to fraudulent and unauthorized card charges',
        'Strict, non-negotiable deposit forfeiture policy even when appointments are postponed by shop staff',
        'Frequent resident artist turnover resulting in clients being reassigned to unfamiliar guest tattooers'
      ]
    };
    console.log('Recalibrated Pens & Needles: featured=false, rating=4.2');
  }

  if (shop.id === 'fallen-heroes') {
    shop.featured = false;
    shop.rating = 4.3;
    shop.tagline = 'High-Volume Commercial Street Shop with Polarizing Reputation';
    shop.description = 'Operating on West Colorado Avenue, Fallen Heroes Tattoo & Piercing is a high-capacity commercial street shop operated by owner David Brown (DB). Housing over a dozen independent contractor stations, the studio accommodates significant walk-in traffic but is intensely polarizing locally. While boasting talented individual anime and realism illustrators, the studio is widely criticized for loud expo-like chaos, an aggressive 10–15 minute deposit forfeiture policy, and high-profile public feuds involving ownership.';
    shop.aggregateSources = {
      google: { name: 'Google Maps', rating: 4.3, count: 295, icon: 'google' },
      yelp: { name: 'Yelp', rating: 3.7, count: 82, icon: 'yelp' },
      facebook: { name: 'Facebook Recommendations', rating: 4.6, count: 35, icon: 'facebook' }
    };
    shop.consensus = {
      theGood: [
        'Standout resident illustrators including Reece Allen for vibrant anime ink and Lindsay Fernandez for intricate custom backpieces',
        'High-capacity facility capable of taking same-day walk-in clients when floor schedules permit',
        'Redemption Ink 501(c)(3) affiliation providing restorative cover-up tattoos for human trafficking and ex-gang survivors',
        'Capable of heavy ink saturation and large multi-session coverage when booked with senior resident artists'
      ],
      theBad: [
        'Owner David Brown is known for combative public confrontations, including the infamous roof cartoon mural feud with the neighboring 532CO apartment complex',
        'Aggressive deposit policy where clients arriving even 10–15 minutes late forfeit $100–$150 deposits with zero rescheduling leeway',
        'Cavernous open-floor format with 10+ buzzing machines creates a loud, hectic atmosphere more akin to an expo floor than a private custom session',
        'Wide pricing discrepancies between independent contractors ($150 to $250+/hr) with reports of inconsistent bedside manner'
      ]
    };
    console.log('Recalibrated Fallen Heroes: featured=false, rating=4.3');
  }
});

fs.writeFileSync(shopsPath, JSON.stringify(shops, null, 2), 'utf8');
console.log('Successfully saved recalibrated shops.json!');
