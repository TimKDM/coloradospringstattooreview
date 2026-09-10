/**
 * Colorado Springs Tattoo Review - Homepage Application Script
 * Handles fetching shops from data/shops.json, live search, and style filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
  const shopsGrid = document.getElementById('shops-grid');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const filtersContainer = document.getElementById('filters-container');
  const resultsCount = document.getElementById('results-count');
  const noResultsMsg = document.getElementById('no-results-msg');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  let allShops = [];
  let currentStyle = 'all';
  let searchTerm = '';

  // 1. Fetch shops data
  async function loadShops() {
    try {
      const res = await fetch('data/shops.json');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      allShops = await res.json();
      renderShops();
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

      // Search term filter
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        shop.name.toLowerCase().includes(term) ||
        (shop.address && shop.address.toLowerCase().includes(term)) ||
        (shop.description && shop.description.toLowerCase().includes(term)) ||
        (Array.isArray(shop.styles) && shop.styles.some(s => s.toLowerCase().includes(term)));

      return matchesStyle && matchesSearch;
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
      const reviewsCount = Array.isArray(shop.reviews) ? shop.reviews.length : 0;
      const stylesList = Array.isArray(shop.styles) ? shop.styles.slice(0, 3) : [];
      const shopUrl = `shop.html?slug=${encodeURIComponent(shop.slug || shop.id)}`;

      return `
        <article class="shop-card ${shop.featured ? 'shop-card-featured' : ''}">
          <div class="card-body">
            <header class="card-header">
              <div class="card-meta-top">
                <div class="card-rating">
                  <span class="star-icon">★</span>
                  <span class="rating-num">${rating}</span>
                  <span class="reviews-count">(${reviewsCount} reviews)</span>
                </div>
                ${shop.priceRange ? `<span class="card-price">${escapeHtml(shop.priceRange)}</span>` : ''}
              </div>
              <h3 class="card-title">
                <a href="${shopUrl}">${escapeHtml(shop.name)}</a>
              </h3>
              ${shop.tagline ? `<p class="card-tagline">${escapeHtml(shop.tagline)}</p>` : ''}
            </header>

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

  // 5. Reset Filters
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      searchTerm = '';
      currentStyle = 'all';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      if (filtersContainer) {
        filtersContainer.querySelectorAll('.style-badge').forEach(b => {
          b.classList.toggle('active', b.dataset.style === 'all');
        });
      }
      renderShops();
    });
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
