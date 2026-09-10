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
  
  // Scorecard & Platform Elements
  const scorecardScore = document.getElementById('scorecard-score');
  const scorecardStars = document.getElementById('scorecard-stars');
  const scorecardTotalLabel = document.getElementById('scorecard-total-label');
  const scorecardPlatformsMount = document.getElementById('scorecard-platforms-mount');
  
  const posColCounter = document.getElementById('pos-col-counter');
  const positiveReviewsContainer = document.getElementById('positive-reviews-container');

  const critColCounter = document.getElementById('crit-col-counter');
  const criticalReviewsContainer = document.getElementById('critical-reviews-container');
  const criticalAdvisoryBanner = document.getElementById('critical-advisory-banner');

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
    // Sort critical reviews so 1-star reviews always appear prominently at the top
    const criticalReviews = reviews
      .filter(r => Number(r.rating) <= 3)
      .sort((a, b) => {
        const a1 = (Number(a.rating) === 1 || a.isOneStarCallout) ? -1 : 0;
        const b1 = (Number(b.rating) === 1 || b.isOneStarCallout) ? -1 : 0;
        if (a1 !== b1) return a1 - b1;
        return Number(a.rating) - Number(b.rating);
      });

    const posCount = positiveReviews.length;
    const critCount = criticalReviews.length;
    const oneStarCount = criticalReviews.filter(r => Number(r.rating) === 1 || !!r.isOneStarCallout).length;

    // Scorecard UI (Truthful aggregate web numbers, no sample percentages)
    scorecardScore.textContent = formattedRating;
    scorecardStars.textContent = getStarsString(Number(shop.rating || 0));
    scorecardTotalLabel.textContent = `Based on ${webTotal} customer reviews across Google, Yelp, and Facebook`;

    posColCounter.textContent = `(${posCount})`;
    critColCounter.textContent = `(${critCount})`;

    // Render Multi-Platform Breakdown in Scorecard
    renderScorecardPlatforms(shop);

    // Toggle 1-Star Client Advisory Banner
    if (criticalAdvisoryBanner) {
      if (oneStarCount > 0) {
        criticalAdvisoryBanner.style.display = 'flex';
      } else {
        criticalAdvisoryBanner.style.display = 'none';
      }
    }

    // Render Review Cards
    renderReviewCards(positiveReviews, positiveReviewsContainer, 'positive');
    renderReviewCards(criticalReviews, criticalReviewsContainer, 'critical');

    // 6. Live vs Curated Tab Switching (Option C)
    setupReviewTabs(shop);

    // 7. Render Studio Vibe Check & Atmosphere
    renderVibeCheck(shop);

    // 8. Render Resident Artists & Booking Status
    renderArtists(shop);

    // 9. Render Before You Book Client Advisory
    renderBeforeYouBook(shop);

    // 10. Setup Studio Claim Modal
    setupClaimModal(shop);
  }

  function renderScorecardPlatforms(shop) {
    if (!scorecardPlatformsMount) return;

    const sources = shop.aggregateSources || {};
    const platformKeys = Object.keys(sources);

    if (platformKeys.length === 0) {
      scorecardPlatformsMount.innerHTML = `<p class="text-muted">No external platforms linked yet.</p>`;
      return;
    }

    const platformIcons = {
      google: '🗺️',
      yelp: '🔴',
      facebook: '👍',
      reddit: '💬'
    };

    scorecardPlatformsMount.innerHTML = platformKeys.map(key => {
      const src = sources[key];
      const icon = platformIcons[key] || '⭐';
      const rating = Number(src.rating || 0).toFixed(1);
      const count = Number(src.count || 0).toLocaleString();
      return `
        <div class="platform-metric-card platform-metric-${key}">
          <div class="platform-metric-header">
            <span class="platform-metric-icon">${icon}</span>
            <span class="platform-metric-name">${escapeHtml(src.name)}</span>
          </div>
          <div class="platform-metric-body">
            <span class="platform-metric-score">${rating} ★</span>
            <span class="platform-metric-count">${count} verified reviews</span>
          </div>
        </div>
      `;
    }).join('');
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
      const ratingNum = Number(r.rating || 5);
      const starsStr = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
      const isOneStar = ratingNum === 1 || !!r.isOneStarCallout;

      const oneStarClass = isOneStar ? 'review-card-1star' : '';
      const avatarClass = isOneStar ? 'avatar-1star' : '';
      const starsClass = isOneStar ? 'stars-1star' : '';

      const oneStarBadge = isOneStar ? `
        <div class="card-1star-callout-badge">
          <span class="badge-icon">🚨</span>
          <span class="badge-text">1-Star Critical Callout</span>
        </div>
      ` : '';

      const complaintTopicHtml = (isOneStar && r.complaintTopic) ? `
        <div class="review-complaint-topic">
          <span class="topic-label">Core Complaint:</span>
          <span class="topic-tag">${escapeHtml(r.complaintTopic)}</span>
        </div>
      ` : '';

      return `
        <article class="review-card card-${type} ${oneStarClass}">
          ${oneStarBadge}
          <header class="review-card-header">
            <div class="review-author-wrap">
              <span class="review-avatar ${avatarClass}">${escapeHtml(r.author ? r.author.charAt(0).toUpperCase() : 'C')}</span>
              <div>
                <strong class="review-author">${escapeHtml(r.author || 'Anonymous Client')}</strong>
                <span class="review-date">${escapeHtml(r.date || 'Recent')}</span>
              </div>
            </div>
            <span class="platform-badge platform-${platform}">${escapeHtml(platformLabel)}</span>
          </header>

          <div class="review-stars-row" title="${r.rating} Stars">
            <span class="${starsClass}">${starsStr}</span>
            ${isOneStar ? '<span class="stars-label-1star">(1.0 Critical)</span>' : ''}
          </div>

          ${complaintTopicHtml}

          <div class="review-text">
            <p>"${escapeHtml(r.text || '')}"</p>
          </div>
        </article>
      `;
    }).join('');
  }

  function setupReviewTabs(shop) {
    const tabCurated = document.getElementById('tab-btn-curated');
    const tabLive = document.getElementById('tab-btn-live');
    const viewCurated = document.getElementById('view-curated-reviews');
    const viewLive = document.getElementById('view-live-reviews');
    const liveGoogleBtn = document.getElementById('live-google-maps-btn');
    const liveReviewsGrid = document.getElementById('live-dynamic-reviews-grid');

    if (!tabCurated || !tabLive || !viewCurated || !viewLive) return;

    if (liveGoogleBtn && shop.name) {
      const gQuery = encodeURIComponent(`${shop.name}, Colorado Springs, CO`);
      liveGoogleBtn.href = `https://www.google.com/maps/search/?api=1&query=${gQuery}`;
    }

    tabCurated.addEventListener('click', () => {
      tabCurated.classList.add('active');
      tabLive.classList.remove('active');
      viewCurated.style.display = 'block';
      viewLive.style.display = 'none';
    });

    tabLive.addEventListener('click', () => {
      tabLive.classList.add('active');
      tabCurated.classList.remove('active');
      viewCurated.style.display = 'none';
      viewLive.style.display = 'block';

      renderLiveStream(shop, liveReviewsGrid);
    });
  }

  function renderLiveStream(shop, container) {
    if (!container) return;

    const reviews = Array.isArray(shop.reviews) ? shop.reviews : [];
    const googleReviews = reviews.filter(r => (r.platform || '').toLowerCase() === 'google');
    const displayReviews = googleReviews.length > 0 ? googleReviews : reviews;

    container.innerHTML = displayReviews.map(r => {
      const starsStr = '★'.repeat(Number(r.rating || 5)) + '☆'.repeat(5 - Number(r.rating || 5));
      return `
        <article class="live-stream-card">
          <div class="live-stream-header">
            <div class="live-user-meta">
              <span class="live-avatar-badge">${escapeHtml(r.author ? r.author.charAt(0).toUpperCase() : 'G')}</span>
              <div>
                <strong>${escapeHtml(r.author || 'Google User')}</strong>
                <span class="live-verified-tag">✔ Verified Google Maps Review</span>
              </div>
            </div>
            <span class="live-stream-date">${escapeHtml(r.date || 'Recent')}</span>
          </div>
          <div class="live-stream-stars">${starsStr}</div>
          <div class="live-stream-body">
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
      case 'reddit': return 'Reddit Community';
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

  function renderVibeCheck(shop) {
    const mount = document.getElementById('vibe-content-mount');
    if (!mount) return;
    const vibe = shop.vibe;
    if (!vibe) {
      const section = document.getElementById('vibe-section');
      if (section) section.style.display = 'none';
      return;
    }

    const score = Number(vibe.intimidationScore || 0);
    const meterPct = Math.min(100, Math.max(8, score * 10));
    let meterColor = '#10b981'; // green
    if (score >= 3 && score <= 4) meterColor = '#f59e0b'; // amber
    if (score >= 5) meterColor = '#ef4444'; // red

    mount.innerHTML = `
      <div class="vibe-overview-header">
        <div class="vibe-badge-lg vibe-${vibe.tag}">
          ${escapeHtml(vibe.label)}
        </div>
        <p class="vibe-editorial-summary">${escapeHtml(vibe.summary)}</p>
      </div>

      <div class="vibe-matrix-grid">
        <div class="vibe-matrix-card">
          <div class="vibe-attr-header">
            <span class="vibe-attr-icon">🧘</span>
            <strong>Intimidation &amp; Ego Level</strong>
          </div>
          <div class="vibe-meter-wrap">
            <div class="vibe-meter-bar">
              <div class="vibe-meter-fill" style="width: ${meterPct}%; background-color: ${meterColor};"></div>
            </div>
            <span class="vibe-meter-label">${escapeHtml(vibe.intimidationLabel)}</span>
          </div>
        </div>

        <div class="vibe-matrix-card">
          <div class="vibe-attr-header">
            <span class="vibe-attr-icon">🔊</span>
            <strong>Acoustics &amp; Noise Level</strong>
          </div>
          <div class="vibe-attr-value">
            <span class="vibe-pill">${escapeHtml(vibe.noiseLevel)}</span>
          </div>
        </div>

        <div class="vibe-matrix-card">
          <div class="vibe-attr-header">
            <span class="vibe-attr-icon">🏛️</span>
            <strong>Studio Layout &amp; Station Setup</strong>
          </div>
          <p class="vibe-attr-text">${escapeHtml(vibe.layout)}</p>
        </div>

        <div class="vibe-matrix-card">
          <div class="vibe-attr-header">
            <span class="vibe-attr-icon">🎶</span>
            <strong>Music &amp; Shop Culture</strong>
          </div>
          <p class="vibe-attr-text">${escapeHtml(vibe.musicAndCulture)}</p>
        </div>
      </div>
    `;
  }

  function renderArtists(shop) {
    const mount = document.getElementById('artists-grid-mount');
    if (!mount) return;
    const artists = shop.artists || [];
    if (artists.length === 0) {
      mount.innerHTML = '<p class="text-muted">Resident artist roster currently undergoing annual verification.</p>';
      return;
    }
    const statusLabels = {
      open: '🟢 Books Open',
      waitlist: '🟡 Waitlist',
      closed: '🔴 Books Closed'
    };
    mount.innerHTML = artists.map(a => {
      const statusClass = `status-${a.bookingStatus || 'open'}`;
      const statusText = a.bookingStatus === 'waitlist' 
        ? `🟡 Waitlist (${a.waitlistTime || '1–2 Mos'})` 
        : (statusLabels[a.bookingStatus] || '🟢 Books Open');
      const cleanHandle = a.handle ? a.handle.replace('@', '') : '';
      const igUrl = cleanHandle ? `https://instagram.com/${cleanHandle}` : '#';

      return `
        <div class="artist-profile-card">
          <div class="artist-card-top">
            <div class="artist-avatar">${escapeHtml(a.name.charAt(0).toUpperCase())}</div>
            <div class="artist-main-info">
              <h4 class="artist-name">${escapeHtml(a.name)}</h4>
              <span class="artist-role">${escapeHtml(a.role || 'Resident Artist')}</span>
            </div>
          </div>
          <div class="artist-card-status">
            <span class="booking-status-badge ${statusClass}">${statusText}</span>
          </div>
          <div class="artist-card-action">
            ${a.handle ? `<a href="${igUrl}" target="_blank" rel="noopener noreferrer" class="artist-ig-link">📸 ${escapeHtml(a.handle)} ↗</a>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderBeforeYouBook(shop) {
    const mount = document.getElementById('before-you-book-mount');
    if (!mount) return;
    const advisories = shop.beforeYouBook || [];
    if (advisories.length === 0) {
      mount.innerHTML = '<p class="text-muted">No specific booking advisories recorded for this studio.</p>';
      return;
    }
    const typeIcons = { warning: '⚠️', tip: '💡', parking: '🚗' };
    mount.innerHTML = advisories.map(adv => {
      const icon = typeIcons[adv.type] || '📌';
      return `
        <div class="advisory-card advisory-${adv.type || 'tip'}">
          <div class="advisory-header">
            <span class="advisory-icon">${icon}</span>
            <strong class="advisory-title">${escapeHtml(adv.title)}</strong>
          </div>
          <p class="advisory-body">${escapeHtml(adv.text)}</p>
        </div>
      `;
    }).join('');
  }

  function setupClaimModal(shop) {
    const claimBtn = document.getElementById('claim-profile-btn');
    const modal = document.getElementById('claim-modal');
    const closeBtn = document.getElementById('claim-modal-close');
    const form = document.getElementById('claim-profile-form');
    const successMsg = document.getElementById('claim-success-msg');
    const shopIdInput = document.getElementById('claim-shop-id');
    const subtitle = document.getElementById('claim-modal-subtitle');

    if (!claimBtn || !modal) return;
    if (shopIdInput) shopIdInput.value = shop.id || '';
    if (subtitle && shop.name) {
      subtitle.textContent = `Submit verified updates or roster additions for ${shop.name} to our editorial review board.`;
    }

    claimBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
    if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
        setTimeout(() => {
          modal.style.display = 'none';
          form.reset();
          form.style.display = 'block';
          if (successMsg) successMsg.style.display = 'none';
        }, 3000);
      });
    }
  }

  initShopPage();
});
