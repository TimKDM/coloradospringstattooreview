/**
 * Colorado Springs Tattoo Review - Homepage Application Script
 * Handles fetching shops from data/shops.json, live search, and style filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
  const shopsGrid = document.getElementById('shops-grid');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const filtersContainer = document.getElementById('filters-container');
  const opFiltersContainer = document.getElementById('op-filters-container');
  const resultsCount = document.getElementById('results-count');
  const noResultsMsg = document.getElementById('no-results-msg');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  let allShops = [];
  let currentStyle = 'all';
  let currentOp = 'all';
  let searchTerm = '';

  // 1. Fetch shops data
  async function loadShops() {
    try {
      const res = await fetch('data/shops.json');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      allShops = await res.json();
      renderShops();
      setupMatchQuiz();
    } catch (err) {
      console.error('Failed to load shops:', err);
      shopsGrid.innerHTML = `
        <div class="error-state">
          <p>⚠️ Unable to load tattoo studios right now. Please check back shortly.</p>
        </div>
      `;
    }
  }

  // 2. Filter and Render Shops
  function renderShops() {
    const filtered = allShops.filter(shop => {
      // Style filter
      const matchesStyle = (currentStyle === 'all') || 
        (Array.isArray(shop.styles) && shop.styles.some(s => s.toLowerCase() === currentStyle.toLowerCase()));

      // Operational filter
      const matchesOp = (currentOp === 'all') ||
        (currentOp === 'walkIns' && shop.operational && shop.operational.walkIns === true) ||
        (currentOp === 'appointmentOnly' && shop.operational && shop.operational.walkIns === false) ||
        (currentOp === 'piercing' && shop.operational && shop.operational.piercing === true) ||
        (currentOp === 'coverUps' && shop.operational && shop.operational.coverUps === true);

      // Search term filter
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        shop.name.toLowerCase().includes(term) ||
        (shop.address && shop.address.toLowerCase().includes(term)) ||
        (shop.description && shop.description.toLowerCase().includes(term)) ||
        (Array.isArray(shop.styles) && shop.styles.some(s => s.toLowerCase().includes(term)));

      return matchesStyle && matchesOp && matchesSearch;
    });

    // Update results counter
    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} of ${allShops.length} Studios`;
    }

    // Handle empty state
    if (filtered.length === 0) {
      shopsGrid.innerHTML = '';
      if (noResultsMsg) noResultsMsg.style.display = 'block';
      return;
    }

    if (noResultsMsg) noResultsMsg.style.display = 'none';

    // Generate HTML cards
    shopsGrid.innerHTML = filtered.map(shop => {
      const rating = Number(shop.rating || 0).toFixed(1);
      const reviewsCount = shop.totalWebReviews || (Array.isArray(shop.reviews) ? shop.reviews.length : 0);
      const stylesList = Array.isArray(shop.styles) ? shop.styles.slice(0, 3) : [];
      const shopUrl = `shop.html?slug=${encodeURIComponent(shop.slug || shop.id)}`;

      // Operational pills
      const opPills = [];
      if (shop.operational) {
        if (shop.operational.walkIns) {
          opPills.push('<span class="op-card-pill op-walkin">🚶 Walk-Ins</span>');
        } else {
          opPills.push('<span class="op-card-pill op-appt">📅 Appt Only</span>');
        }
        if (shop.operational.piercing) {
          opPills.push('<span class="op-card-pill op-pierce">💎 Piercing</span>');
        }
        if (shop.operational.coverUps) {
          opPills.push('<span class="op-card-pill op-cover">🔄 Cover-Ups</span>');
        }
      }

      return `
        <article class="shop-card ${shop.featured ? 'shop-card-featured' : ''}">
          <div class="card-body">
            <header class="card-header">
              <div class="card-meta-top">
                <div class="card-rating">
                  <span class="star-icon">★</span>
                  <span class="rating-num">${rating}</span>
                  <span class="reviews-count">(${reviewsCount} web reviews)</span>
                </div>
                ${shop.priceRange ? `<span class="card-price">${escapeHtml(shop.priceRange)}</span>` : ''}
              </div>
              <h3 class="card-title">
                <a href="${shopUrl}">${escapeHtml(shop.name)}</a>
              </h3>
              ${shop.tagline ? `<p class="card-tagline">${escapeHtml(shop.tagline)}</p>` : ''}
              ${shop.aggregateSources ? `
                <div class="card-sources-micro">
                  <span>Google ★${shop.aggregateSources.google ? shop.aggregateSources.google.rating : '4.9'}</span>
                  <span class="micro-sep">•</span>
                  <span>Yelp ★${shop.aggregateSources.yelp ? shop.aggregateSources.yelp.rating : '4.8'}</span>
                  <span class="micro-sep">•</span>
                  <span>Facebook ★${shop.aggregateSources.facebook ? shop.aggregateSources.facebook.rating : '5.0'}</span>
                </div>
              ` : ''}
            </header>

            ${opPills.length > 0 ? `
              <div class="card-op-pills">
                ${opPills.join('')}
              </div>
            ` : ''}

            ${stylesList.length > 0 ? `
              <div class="card-styles">
                ${stylesList.map(s => `<span class="card-style-pill">${escapeHtml(s)}</span>`).join('')}
              </div>
            ` : ''}

            <div class="card-excerpt">
              <p>${escapeHtml(truncate(shop.description || '', 140))}</p>
            </div>

            ${shop.address ? `
              <div class="card-location">
                <span class="loc-icon">📍</span>
                <span>${escapeHtml(shop.address)}</span>
              </div>
            ` : ''}

            <div class="card-footer-action">
              <a href="${shopUrl}" class="action-btn">
                Read Full Review <span>➔</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // 3. Search Events
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchTerm.length > 0 ? 'inline-flex' : 'none';
      }
      renderShops();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchTerm = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        renderShops();
      }
    });
  }

  // 4. Style Pills Event Delegation
  if (filtersContainer) {
    filtersContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.style-badge');
      if (!btn) return;

      filtersContainer.querySelectorAll('.style-badge').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentStyle = btn.dataset.style || 'all';
      renderShops();
    });
  }

  // 5. Operational Filter Event Delegation
  if (opFiltersContainer) {
    opFiltersContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.op-badge');
      if (!btn) return;

      opFiltersContainer.querySelectorAll('.op-badge').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentOp = btn.dataset.op || 'all';
      renderShops();
    });
  }

  // 6. Reset Filters
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      searchTerm = '';
      currentStyle = 'all';
      currentOp = 'all';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      if (filtersContainer) {
        filtersContainer.querySelectorAll('.style-badge').forEach(b => {
          b.classList.toggle('active', b.dataset.style === 'all');
        });
      }
      if (opFiltersContainer) {
        opFiltersContainer.querySelectorAll('.op-badge').forEach(b => {
          b.classList.toggle('active', b.dataset.op === 'all');
        });
      }
      renderShops();
    });
  }

  // 7. Interactive 30-Second Match Quiz
  function setupMatchQuiz() {
    const openBtn = document.getElementById('open-quiz-btn');
    const modal = document.getElementById('quiz-modal');
    const closeBtn = document.getElementById('quiz-modal-close');
    if (!openBtn || !modal) return;

    const answers = {
      style: '',
      timing: '',
      budget: '',
      name: '',
      email: ''
    };

    const step1 = document.getElementById('quiz-step-1');
    const step2 = document.getElementById('quiz-step-2');
    const step3 = document.getElementById('quiz-step-3');
    const step4 = document.getElementById('quiz-step-4');
    const resultBox = document.getElementById('quiz-result');
    const leadForm = document.getElementById('quiz-lead-form');

    function resetQuiz() {
      answers.style = '';
      answers.timing = '';
      answers.budget = '';
      answers.name = '';
      answers.email = '';
      if (step1) step1.style.display = 'block';
      if (step2) step2.style.display = 'none';
      if (step3) step3.style.display = 'none';
      if (step4) step4.style.display = 'none';
      if (resultBox) {
        resultBox.style.display = 'none';
        resultBox.innerHTML = '';
      }
      if (leadForm) leadForm.reset();
    }

    openBtn.addEventListener('click', () => {
      resetQuiz();
      modal.style.display = 'flex';
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    // Step 1 option clicks
    if (step1) {
      step1.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option-btn');
        if (!btn) return;
        answers.style = btn.dataset.val;
        step1.style.display = 'none';
        if (step2) step2.style.display = 'block';
      });
    }

    // Step 2 option clicks
    if (step2) {
      step2.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option-btn');
        if (!btn) return;
        answers.timing = btn.dataset.val;
        step2.style.display = 'none';
        if (step3) step3.style.display = 'block';
      });
    }

    // Step 3 option clicks
    if (step3) {
      step3.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option-btn');
        if (!btn) return;
        answers.budget = btn.dataset.val;
        step3.style.display = 'none';
        if (step4) step4.style.display = 'block';
      });
    }

    // Step 4: Lead Form submit & Match Logic
    if (leadForm) {
      leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        answers.name = document.getElementById('quiz-name').value.trim();
        answers.email = document.getElementById('quiz-email').value.trim();

        step4.style.display = 'none';

        // Evaluate Best Match
        let matchedSlug = 'riot-tattoo';
        let matchReason = '';
        let artistMatch = '';

        if (answers.style === 'piercing') {
          matchedSlug = 'fallen-heroes';
          artistMatch = 'Professional Piercing Team';
          matchReason = 'Largest verified jewelry counter and certified piercers in Colorado Springs.';
        } else if (answers.timing === 'walkin' && answers.style === 'traditional') {
          matchedSlug = 'rose-of-the-west';
          artistMatch = 'Eric or Justin';
          matchReason = 'Downtown street shop walk-in accessibility combined with flawless American traditional flash.';
        } else if (answers.timing === 'walkin') {
          matchedSlug = 'self-inflicted';
          artistMatch = 'Westside Resident Staff';
          matchReason = 'Welcoming street-shop culture with daily open walk-in chairs and no elitist attitude.';
        } else if (answers.style === 'traditional') {
          matchedSlug = 'rose-of-the-west';
          artistMatch = 'Eric or Justin';
          matchReason = 'Unrivaled bold line saturation and iconic Americana tattooing.';
        } else if (answers.style === 'coverup') {
          matchedSlug = 'riot-tattoo';
          artistMatch = 'Paes 164 & Darin Newhouse';
          matchReason = 'Master-grade blast-overs and anatomical cover-up composition with 5.0 ★ client satisfaction.';
        } else {
          // Default / Realism / High Custom / Willing to wait
          matchedSlug = 'riot-tattoo';
          artistMatch = 'Paes 164 & Darin Newhouse';
          matchReason = 'Rated #1 studio in Colorado Springs. Pure 5.0 ★ consensus with zero deposit disputes.';
        }

        const matchedShop = allShops.find(s => (s.slug === matchedSlug || s.id === matchedSlug)) || allShops[0];

        if (resultBox && matchedShop) {
          resultBox.innerHTML = `
            <div class="modal-header">
              <span class="modal-icon">🎯</span>
              <div class="match-badge">Top Verified Match for ${escapeHtml(answers.name)}</div>
              <h3>${escapeHtml(matchedShop.name)}</h3>
              <div class="match-rating">★ ${Number(matchedShop.rating).toFixed(1)} (${matchedShop.totalWebReviews || 0} web reviews)</div>
            </div>
            <div class="match-card-body">
              <div class="match-highlight-box">
                <strong>Recommended Resident Artists:</strong> ${artistMatch}
              </div>
              <p class="match-reason-text"><strong>Why This Shop Fits You:</strong> ${matchReason}</p>
              <div class="match-policy-chips">
                <span>📍 ${escapeHtml(matchedShop.address || 'Colorado Springs')}</span>
                <span>${matchedShop.operational && matchedShop.operational.walkIns ? '🚶 Walk-Ins Welcome' : '📅 Strict Appointment'}</span>
                <span>💰 ${escapeHtml(matchedShop.priceRange || '$$$')}</span>
              </div>
              <div class="match-action-row">
                <a href="shop.html?slug=${matchedShop.slug || matchedShop.id}" class="btn btn-primary btn-block">
                  View Full Studio Profile &amp; Reviews ➔
                </a>
                <button type="button" class="btn btn-secondary btn-block" id="quiz-restart-btn">Take Quiz Again</button>
              </div>
            </div>
          `;
          resultBox.style.display = 'block';

          const restartBtn = document.getElementById('quiz-restart-btn');
          if (restartBtn) {
            restartBtn.addEventListener('click', resetQuiz);
          }
        }
      });
    }
  }

  // Utilities
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function truncate(str, maxLen) {
    if (!str || str.length <= maxLen) return str;
    return str.substring(0, maxLen).trim() + '...';
  }

  // Initialize
  loadShops();
});
