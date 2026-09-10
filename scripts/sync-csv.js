const fs = require('fs');
const path = require('path');

const shopsPath = path.join(__dirname, '../data/shops.json');
const csvPath = path.join(__dirname, '../data/real_reviews_database.csv');

const shops = JSON.parse(fs.readFileSync(shopsPath, 'utf8'));

const headers = ['shop_name', 'slug', 'author', 'platform', 'rating', 'review_type', 'is_one_star_callout', 'complaint_category', 'date', 'text'];
const rows = [headers.join(',')];

shops.forEach(shop => {
  shop.reviews.forEach(r => {
    const isOneStar = Number(r.rating) === 1 || !!r.isOneStarCallout;
    const reviewType = Number(r.rating) >= 4 ? 'Positive' : 'Critical';
    const category = r.complaintTopic || (isOneStar ? 'Critical Service Issue' : '');
    const date = r.date || '2026-06-01';
    
    // CSV escape function
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    rows.push([
      escapeCsv(shop.name),
      escapeCsv(shop.slug),
      escapeCsv(r.author),
      escapeCsv(r.platform),
      r.rating,
      escapeCsv(reviewType),
      isOneStar ? 'TRUE' : 'FALSE',
      escapeCsv(category),
      escapeCsv(date),
      escapeCsv(r.text)
    ].join(','));
  });
});

fs.writeFileSync(csvPath, rows.join('\n'), 'utf8');
console.log(`Successfully synced ${rows.length - 1} reviews to ${csvPath}!`);
