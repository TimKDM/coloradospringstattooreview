/**
 * Colorado Springs Tattoo Review - CSV to JSON Review Importer
 * 
 * Usage:
 *   node scripts/csv-to-json.js <path-to-csv> --shop=<shop-slug> [--platform=yelp|google|direct]
 * 
 * Example:
 *   node scripts/csv-to-json.js ./riot-tattoo-reviews.csv --shop=riot-tattoo --platform=yelp
 */

const fs = require('fs');
const path = require('path');

// Parse CLI Arguments
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage:
  node scripts/csv-to-json.js <csvFilePath> --shop=<shop-slug> [--platform=google|yelp|direct]

Example:
  node scripts/csv-to-json.js ./scraped_reviews.csv --shop=riot-tattoo --platform=yelp
  `);
  process.exit(0);
}

const csvFilePath = args.find(a => !a.startsWith('--'));
const shopArg = args.find(a => a.startsWith('--shop='));
const platformArg = args.find(a => a.startsWith('--platform='));

if (!csvFilePath || !fs.existsSync(csvFilePath)) {
  console.error(`❌ Error: CSV file not found: ${csvFilePath}`);
  process.exit(1);
}

if (!shopArg) {
  console.error(`❌ Error: Missing --shop argument (e.g. --shop=riot-tattoo)`);
  process.exit(1);
}

const targetSlug = shopArg.split('=')[1].trim();
const defaultPlatform = platformArg ? platformArg.split('=')[1].trim().toLowerCase() : 'yelp';

const dataPath = path.join(__dirname, '..', 'data', 'shops.json');
if (!fs.existsSync(dataPath)) {
  console.error(`❌ Error: data/shops.json not found at ${dataPath}`);
  process.exit(1);
}

// 1. Read shops.json
const shops = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const shopIndex = shops.findIndex(s => s.slug === targetSlug || s.id === targetSlug);

if (shopIndex === -1) {
  console.error(`❌ Error: Shop with slug "${targetSlug}" not found in data/shops.json`);
  console.log(`Available shops: ${shops.map(s => s.slug).join(', ')}`);
  process.exit(1);
}

// 2. Parse CSV
function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  // Parse header
  const headers = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  
  // Find column indexes
  const authorIdx = headers.findIndex(h => ['author', 'name', 'reviewer', 'user', 'user_name'].includes(h));
  const ratingIdx = headers.findIndex(h => ['rating', 'stars', 'score', 'star_rating'].includes(h));
  const textIdx = headers.findIndex(h => ['text', 'comment', 'review', 'content', 'review_text', 'body'].includes(h));
  const dateIdx = headers.findIndex(h => ['date', 'time', 'date_posted', 'created_at'].includes(h));
  const platformIdx = headers.findIndex(h => ['platform', 'source'].includes(h));

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const row = splitCSVLine(lines[i]);
    if (row.length === 0) continue;

    const author = authorIdx !== -1 && row[authorIdx] ? row[authorIdx].trim() : 'Anonymous';
    let rating = ratingIdx !== -1 && row[ratingIdx] ? parseFloat(row[ratingIdx]) : 5;
    if (isNaN(rating)) rating = 5;

    const text = textIdx !== -1 && row[textIdx] ? row[textIdx].trim() : '';
    const date = dateIdx !== -1 && row[dateIdx] ? row[dateIdx].trim() : new Date().toISOString().split('T')[0];
    const platform = platformIdx !== -1 && row[platformIdx] ? row[platformIdx].trim().toLowerCase() : defaultPlatform;

    if (text || author !== 'Anonymous') {
      records.push({
        author,
        platform,
        rating: Math.min(5, Math.max(1, Math.round(rating))),
        date,
        text
      });
    }
  }

  return records;
}

// Helper to handle commas inside quotes
function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
  return result;
}

// 3. Process and Merge
const fileContent = fs.readFileSync(csvFilePath, 'utf8');
const importedReviews = parseCSV(fileContent);

if (importedReviews.length === 0) {
  console.log('⚠️ No valid reviews found in the CSV file.');
  process.exit(0);
}

const targetShop = shops[shopIndex];
if (!Array.isArray(targetShop.reviews)) {
  targetShop.reviews = [];
}

// Avoid exact duplicates (same author and text)
let addedCount = 0;
for (const rev of importedReviews) {
  const exists = targetShop.reviews.some(existing => 
    existing.author.toLowerCase() === rev.author.toLowerCase() &&
    existing.text.slice(0, 30).toLowerCase() === rev.text.slice(0, 30).toLowerCase()
  );

  if (!exists) {
    targetShop.reviews.push(rev);
    addedCount++;
  }
}

// Recalculate average rating if not using a multi-platform aggregate score
if (!targetShop.aggregateSources && targetShop.reviews.length > 0) {
  const sum = targetShop.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
  targetShop.rating = parseFloat((sum / targetShop.reviews.length).toFixed(1));
}

// Write back to shops.json
fs.writeFileSync(dataPath, JSON.stringify(shops, null, 2), 'utf8');

console.log(`✅ Success! Imported ${addedCount} new review(s) for "${targetShop.name}".`);
console.log(`📊 Updated overall rating: ${targetShop.rating} ★ (Total reviews: ${targetShop.reviews.length})`);
