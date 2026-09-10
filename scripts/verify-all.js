const fs = require('fs');
const path = require('path');

const shops = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/shops.json'), 'utf8'));

console.log(`========================================`);
console.log(`Total Studios in Directory: ${shops.length}`);
console.log(`========================================`);

shops.forEach((s, idx) => {
  console.log(`${idx + 1}. ${s.featured ? '⭐ [FEATURED] ' : '   '}${s.name}`);
  console.log(`   Slug: /shops/${s.slug}`);
  console.log(`   Rating: ${s.rating} ★ (${s.totalWebReviews} Web Reviews)`);
  console.log(`   Address: ${s.address}`);
  console.log(`   Styles: ${s.styles.join(', ')}`);
  console.log(`   Curated Reviews: ${s.reviews ? s.reviews.length : 0}`);
  console.log(`   Consensus: ${s.consensus ? s.consensus.theGood.length : 0} Good, ${s.consensus ? s.consensus.theBad.length : 0} Bad`);
  console.log('----------------------------------------');
});
