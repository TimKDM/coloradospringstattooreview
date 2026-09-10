/**
 * Colorado Springs Tattoo Review - Shop Detail Script
 * Loads shop data by URL slug, calculates review distribution, and renders side-by-side reviews.
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  // DOM Elements
  const pageTitle = document.getElementById('page-title');
  const pageMetaDesc = document.getElementById('page-meta-desc');
  const breadcrumbShopName = document.getElementById('breadcrumb-shop-name');
  
  const shopHero = document.getElementById('shop-hero');
  const shopTitle = document.getElementById('shop-title');
  const shopTagline = document.getElementById('shop-tagline');
  const shopRating = document.getElementById('shop-rating');
  const shopReviewsCountBadge = document.getElementById('shop-reviews-count-badge');
  const shopPrice = document.getElementById('shop-price');
  const shopLocationSnippet = document.getElementById('shop-location-snippet');
  
  const shopDescription = document.getElementById('shop-description');
  const shopStylesList = document.getElementById('shop-styles-list');
  
  // Scorecard Elements
  const scorecardScore = document.getElementById('scorecard-score');
  const scorecardStars = document.getElementById('scorecard-stars');
  const scorecardTotalLabel = document.getElementById('scorecard-total-label');
  
  const posCountText = document.getElementById('pos-count-text');
  const posBarFill = document.getElementById('pos-bar-fill');
  const posBarPct = document.getElementById('pos-bar-pct');
  const posColCounter = document.getElementById('pos-col-counter');
  const positiveReviewsContainer = document.getElementById('positive-reviews-container');

  const critCountText = document.getElementById('crit-count-text');
  const critBarFill = document.getElementById('crit-bar-fill');
  const critBarPct = document.getElementById('crit-bar-pct');
  const critColCounter = document.getElementById('crit-col-counter');
  const criticalReviewsContainer = document.getElementById('critical-reviews-container');

  // Sidebar Elements
  const sidebarAddress = document.getElementById('sidebar-address');
  const sidebarMapLink = document.getElementById('sidebar-map-link');
  const sidebarPhone = document.getElementById('sidebar-phone');
  const sidebarWebsite = document.getElementById('sidebar-website');
  const sidebarHours = document.getElementById('sidebar-hours');
  const sidebarCtaBtn = document.getElementById('sidebar-cta-btn');

  const notFoundSection = document.getElementById('not-found-section');
  const shopMainGrid = document.querySelector('.shop-detail-section');

  async function initShopPage() {
    if (!slug) {
      showNotFound();
      return;
    }

    try {
      const res = await fetch('data/shops.json');
      if (!res.ok) throw new Error('Failed to fetch data/shops.json');
      const shops = await res.json();
      
      const shop = shops.find(s => (s.slug === slug || s.id === slug));
      if (!shop) {
        showNotFound();
        return;
      }

      renderShop(shop);
    } catch (err) {
      console.error('Error loading shop data:', err);
      showNotFound();
    }
  }

  function renderShop(shop) {
    // 1. Meta & Header
    const formattedRating = Number(shop.rating || 0).toFixed(1);
    const reviews = Array.isArray(shop.reviews) ? shop.reviews : [];
    const totalReviews = reviews.length;

    pageTitle.textContent = `${shop.name} Reviews & Rating Breakdown | Colorado Springs Tattoo Review`;
    if (pageMetaDesc) {
      pageMetaDesc.setAttribute('content', `Read honest customer reviews for ${shop.name} in Colorado Springs. Overall rating: ${formattedRating}/5 with ${totalReviews} verified reviews.`);
    }
    breadcrumbShopName.textContent = shop.name;

    // 2. Hero Section
    shopTitle.textContent = shop.name;
    shopTagline.textContent = shop.tagline || '';
    shopRating.textContent = formattedRating;
    const webTotal = shop.totalWebReviews || totalReviews;
    shopReviewsCountBadge.textContent = `(${webTotal} Total Web Reviews)`;
    shopPrice.textContent = shop.priceRange || '$$$';

    if (shop.address) {
      const parts = shop.address.split(',');
      shopLocationSnippet.textContent = `📍 ${parts[0].trim()}, Colorado Springs`;
    }

    if (shop.heroImage && shopHero) {
      shopHero.style.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.9)), url('${shop.heroImage}')`;
      shopHero.style.backgroundSize = 'cover';
      shopHero.style.backgroundPosition = 'center';
    }

    // Render Multi-Platform Source Chips
    const platformSourcesBar = document.getElementById('platform-sources-bar');
    if (platformSourcesBar && shop.aggregateSources) {
      const chipsHtml = Object.entries(shop.aggregateSources).map(([key, src]) => {
        return `
          <div class="platform-source-chip chip-${key}">
            <span class="chip-platform-name">${escapeHtml(src.name)}</span>
            <span class="chip-rating">★ ${Number(src.rating).toFixed(1)}</span>
            <span class="chip-count">(${src.count} reviews)</span>
          </div>
        `;
      }).join('');

      platformSourcesBar.innerHTML = `
        <span class="sources-label">Aggregated Across the Web:</span>
        <div class="sources-chips-list">${chipsHtml}</div>
      `;
    }

    // 3. About Section
    shopDescription.textContent = shop.description || 'No description available for this studio.';
    
    if (Array.isArray(shop.styles) && shop.styles.length > 0) {
      shopStylesList.innerHTML = shop.styles
        .map(style => `<span class="style-pill">${escapeHtml(style)}</span>`)
        .join('');
    } else {
      shopStylesList.innerHTML = '<span class="text-muted">Styles not specified</span>';
    }

    // Render The Good & The Bad Consensus
    const consensusGoodList = document.getElementById('consensus-good-list');
    const consensusBadList = document.getElementById('consensus-bad-list');
    const consensusSection = document.getElementById('consensus-section');

    if (shop.consensus) {
      if (consensusGoodList && Array.isArray(shop.consensus.theGood)) {
        consensusGoodList.innerHTML = shop.consensus.theGood.map(item => `
          <li class="consensus-item item-good">
            <span class="bullet-icon">✔</span>
            <span>${escapeHtml(item)}</span>
          </li>
        `).join('');
      }

      if (consensusBadList && Array.isArray(shop.consensus.theBad)) {
        consensusBadList.innerHTML = shop.consensus.theBad.map(item => `
          <li class="consensus-item item-bad">
            <span class="bullet-icon">⚠</span>
            <span>${escapeHtml(item)}</span>
          </li>
        `).join('');
      }
    } else if (consensusSection) {
      consensusSection.style.display = 'none';
    }

    // 4. Sidebar Section
    if (shop.address) {
      sidebarAddress.textContent = shop.address;
      sidebarMapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.address)}`;
    }
    
    if (shop.phone) {
      sidebarPhone.textContent = shop.phone;
      sidebarPhone.href = `tel:${shop.phone.replace(/[^0-9]/g, '')}`;
    } else {
      sidebarPhone.textContent = 'Contact via Website';
      sidebarPhone.removeAttribute('href');
    }

    if (shop.website) {
      sidebarWebsite.href = shop.website;
      sidebarWebsite.textContent = shop.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
      sidebarCtaBtn.href = shop.website;
    } else {
      sidebarWebsite.textContent = 'Website not listed';
      sidebarCtaBtn.style.display = 'none';
    }

    if (shop.hours) {
      sidebarHours.innerHTML = escapeHtml(shop.hours).replace(/\n/g, '<br>');
    } else {
      sidebarHours.textContent = 'Call studio for hours';
    }

    // 5. Calculate Reviews Breakdown
    const positiveReviews = reviews.filter(r => Number(r.rating) >= 4);
    const criticalReviews = reviews.filter(r => Number(r.rating) <= 3);

    const posCount = positiveReviews.length;
    const critCount = criticalReviews.length;

    const posPct = totalReviews > 0 ? Math.round((posCount / totalReviews) * 100) : 0;
    const critPct = totalReviews > 0 ? Math.round((critCount / totalReviews) * 100) : 0;

    // Scorecard UI
    scorecardScore.textContent = formattedRating;
    scorecardStars.textContent = getStarsString(Number(shop.rating || 0));
    scorecardTotalLabel.textContent = `Based on ${webTotal} customer reviews aggregated across Google, Yelp, and Facebook`;

    posCountText.textContent = `${posCount} sampled review${posCount === 1 ? '' : 's'}`;
    posBarPct.textContent = `${posPct}%`;
    posBarFill.style.width = `${posPct}%`;
    posColCounter.textContent = `(${posCount})`;

    critCountText.textContent = `${critCount} sampled review${critCount === 1 ? '' : 's'}`;
    critBarPct.textContent = `${critPct}%`;
    critBarFill.style.width = `${critPct}%`;
    critColCounter.textContent = `(${critCount})`;

    // Render Review Cards
    renderReviewCards(positiveReviews, positiveReviewsContainer, 'positive');
    renderReviewCards(criticalReviews, criticalReviewsContainer, 'critical');
  }

  function renderReviewCards(reviewsList, container, type) {
    if (!container) return;

    if (!reviewsList || reviewsList.length === 0) {
      container.innerHTML = `
        <div class="empty-reviews-state">
          <p>No ${type} reviews recorded yet.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = reviewsList.map(r => {
      const platform = (r.platform || 'direct').toLowerCase();
      const platformLabel = formatPlatform(platform);
      const starsStr = '★'.repeat(Number(r.rating || 5)) + '☆'.repeat(5 - Number(r.rating || 5));

      return `
        <article class="review-card card-${type}">
          <header class="review-card-header">
            <div class="review-author-wrap">
              <span class="review-avatar">${escapeHtml(r.author ? r.author.charAt(0).toUpperCase() : 'C')}</span>
              <div>
                <strong class="review-author">${escapeHtml(r.author || 'Anonymous Client')}</strong>
                <span class="review-date">${escapeHtml(r.date || 'Recent')}</span>
              </div>
            </div>
            <span class="platform-badge platform-${platform}">${escapeHtml(platformLabel)}</span>
          </header>

          <div class="review-stars-row" title="${r.rating} Stars">
            ${starsStr}
          </div>

          <div class="review-text">
            <p>"${escapeHtml(r.text || '')}"</p>
          </div>
        </article>
      `;
    }).join('');
  }

  function showNotFound() {
    if (notFoundSection) notFoundSection.style.display = 'block';
    if (shopHero) shopHero.style.display = 'none';
    if (shopMainGrid) shopMainGrid.style.display = 'none';
  }

  function getStarsString(rating) {
    const full = Math.round(rating);
    return '★'.repeat(Math.min(5, full)) + '☆'.repeat(Math.max(0, 5 - full));
  }

  function formatPlatform(platform) {
    switch (platform) {
      case 'google': return 'Google Review';
      case 'yelp': return 'Yelp Review';
      case 'facebook': return 'Facebook';
      case 'direct': return 'Direct Client';
      default: return 'Verified Review';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  initShopPage();
});
