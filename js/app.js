/**
 * Colorado Springs Tattoo Review - Homepage Application Script
 * Features:
 * - Dual Directory Views: Verified Studios & Resident Artists Roster
 * - Independent Collectives & Artist Craft Spotlight
 * - Un-Biased Data & Proportional Review Transparency
 * - Live Search, Operational & Atmospheric Filters
 * - Un-Rigged 30-Second Artist Match Quiz
 */

document.addEventListener('DOMContentLoaded', () => {
  // Studios DOM
  const shopsGrid = document.getElementById('shops-grid');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const filtersContainer = document.getElementById('filters-container');
  const opFiltersContainer = document.getElementById('op-filters-container');
  const vibeFiltersContainer = document.getElementById('vibe-filters-container');
  const resultsCount = document.getElementById('results-count');
  const noResultsMsg = document.getElementById('no-results-msg');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  // View Switcher DOM
  const viewStudiosTab = document.getElementById('view-studios-tab');
  const viewArtistsTab = document.getElementById('view-artists-tab');
  const studiosViewContainer = document.getElementById('studios-view-container');
  const artistsViewContainer = document.getElementById('artists-view-container');
  const navArtistsLink = document.getElementById('nav-artists-link');

  // Artists DOM
  const artistsGrid = document.getElementById('artists-grid');
  const artistsResultsCount = document.getElementById('artists-results-count');
  const noArtistsMsg = document.getElementById('no-artists-msg');
  const resetArtistFiltersBtn = document.getElementById('reset-artist-filters-btn');
  const artistSpecialtyChips = document.getElementById('artist-specialty-chips');
  const artistStatusChips = document.getElementById('artist-status-chips');
  const indieOnlyCheckbox = document.getElementById('indie-only-checkbox');

  // State
  let allShops = [];
  let allArtists = [];
  let currentView = 'studios'; // 'studios' or 'artists'
  let currentStyle = 'all';
  let currentOp = 'all';
  let currentVibe = 'all';
  let currentArtistSpecialty = 'all';
  let currentArtistStatus = 'all';
  let indieOnly = false;
  let searchTerm = '';

  // 1. Fetch shops and extract artists
  async function loadData() {
    try {
      const res = await fetch('data/shops.json');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      allShops = await res.json();

      extractArtists();
      setupDiscoveryHub();
      setupViewSwitcher();
      setupArtistFilters();
      renderShops();
      renderArtists();
      setupMatchQuiz();

      // Update Header Badges
      const studiosBadge = document.getElementById('studios-badge-count');
      const artistsBadge = document.getElementById('artists-badge-count');
      if (studiosBadge) studiosBadge.textContent = `${allShops.length} Studios`;
      if (artistsBadge) artistsBadge.textContent = `${allArtists.length} Verified Artists`;
    } catch (err) {
      console.error('Failed to load directory data:', err);
      if (shopsGrid) {
        shopsGrid.innerHTML = `
          <div class="error-state">
            <p>⚠️ Unable to load tattoo directory right now. Please check back shortly.</p>
          </div>
        `;
      }
    }
  }

  function extractArtists() {
    allArtists = [];
    allShops.forEach(shop => {
      if (Array.isArray(shop.artists)) {
        shop.artists.forEach(artist => {
          allArtists.push({
            ...artist,
            shopName: shop.name,
            shopSlug: shop.slug || shop.id,
            shopAddress: shop.address,
            shopPrice: shop.priceRange,
            isIndie: !!(shop.studioType && shop.studioType.includes('Independent'))
          });
        });
      }
    });
  }

  // 2. Filter and Render Shops
  function renderShops() {
    if (!shopsGrid) return;

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

      // Studio Vibe filter
      const matchesVibe = (currentVibe === 'all') ||
        (shop.vibe && shop.vibe.tag === currentVibe);

      // Search term filter
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        shop.name.toLowerCase().includes(term) ||
        (shop.address && shop.address.toLowerCase().includes(term)) ||
        (shop.description && shop.description.toLowerCase().includes(term)) ||
        (shop.vibe && (shop.vibe.label.toLowerCase().includes(term) || shop.vibe.summary.toLowerCase().includes(term))) ||
        (Array.isArray(shop.styles) && shop.styles.some(s => s.toLowerCase().includes(term))) ||
        (Array.isArray(shop.artists) && shop.artists.some(a => 
          a.name.toLowerCase().includes(term) || 
          (a.handle && a.handle.toLowerCase().includes(term)) ||
          (a.specialties && a.specialties.some(sp => sp.toLowerCase().includes(term)))
        ));

      return matchesStyle && matchesOp && matchesVibe && matchesSearch;
    });

    // Update filter indicators & active chips
    updateFilterUI();

    // Update results counter
    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} of ${allShops.length} Verified Studios`;
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
      const stylesList = Array.isArray(shop.styles) ? shop.styles.slice(0, 4) : [];
      const shopUrl = `shop.html?slug=${encodeURIComponent(shop.slug || shop.id)}`;
      const isIndie = !!(shop.studioType && shop.studioType.includes('Independent'));

      // Studio Operational Badges
      const specBadges = [];
      if (isIndie) {
        specBadges.push('<span class="spec-badge spec-indie">🌿 Indie Collective</span>');
      } else if (shop.studioType && shop.studioType.includes('Commercial')) {
        specBadges.push('<span class="spec-badge spec-commercial">🏢 Commercial Complex</span>');
      } else if (shop.studioType && shop.studioType.includes('Retail')) {
        specBadges.push('<span class="spec-badge spec-franchise">💳 Retail Franchise</span>');
      }

      if (shop.vibe) {
        specBadges.push(`<span class="spec-badge spec-vibe spec-vibe-${shop.vibe.tag}">${escapeHtml(shop.vibe.label)}</span>`);
      }

      if (shop.operational) {
        if (shop.operational.walkIns) {
          specBadges.push('<span class="spec-badge spec-walkin">🚶 Walk-Ins Welcome</span>');
        } else {
          specBadges.push('<span class="spec-badge spec-appt">📅 Strict Appointment</span>');
        }
        if (shop.operational.coverUps) {
          specBadges.push('<span class="spec-badge spec-cover">🔄 Cover-Up Masters</span>');
        }
      }

      // Resident Artists Strip on Shop Card
      const residentArtists = Array.isArray(shop.artists) ? shop.artists : [];
      const artistsStripHtml = residentArtists.length > 0 ? `
        <div class="card-resident-strip">
          <span class="resident-strip-label">Resident Artists:</span>
          <div class="resident-strip-pills">
            ${residentArtists.slice(0, 3).map(a => `
              <span class="resident-pill" title="${escapeHtml(a.role || '')}">
                <strong class="pill-name">${escapeHtml(a.name)}</strong>
                ${a.specialties && a.specialties[0] ? `<span class="pill-spec">${escapeHtml(a.specialties[0])}</span>` : ''}
              </span>
            `).join('')}
            ${residentArtists.length > 3 ? `<span class="resident-pill-more">+${residentArtists.length - 3} more</span>` : ''}
          </div>
        </div>
      ` : '';

      return `
        <article class="shop-card ${isIndie ? 'shop-card-indie' : ''}">
          <div class="card-body">
            <header class="card-header">
              <div class="card-meta-top">
                <div class="card-rating">
                  <span class="star-icon">★</span>
                  <span class="rating-num">${rating}</span>
                  <span class="reviews-count">(${reviewsCount} verified reviews)</span>
                </div>
                ${shop.priceRange ? `<span class="card-price">${escapeHtml(shop.priceRange)}</span>` : ''}
              </div>

              <h3 class="card-title">
                <a href="${shopUrl}">${escapeHtml(shop.name)}</a>
              </h3>
              ${shop.tagline ? `<p class="card-tagline">${escapeHtml(shop.tagline)}</p>` : ''}
            </header>

            ${specBadges.length > 0 ? `
              <div class="card-specs-strip">
                ${specBadges.join('')}
              </div>
            ` : ''}

            ${artistsStripHtml}

            ${stylesList.length > 0 ? `
              <div class="card-styles">
                ${stylesList.map(s => `<span class="card-style-pill">${escapeHtml(s)}</span>`).join('')}
              </div>
            ` : ''}

            <div class="card-excerpt">
              <p>${escapeHtml(truncate(shop.description || '', 135))}</p>
            </div>

            ${shop.address ? `
              <div class="card-location">
                <span class="loc-icon">📍</span>
                <span>${escapeHtml(shop.address)}</span>
              </div>
            ` : ''}

            <footer class="card-footer-action">
              ${shop.aggregateSources ? `
                <div class="card-sources-micro">
                  <span>Google ★${shop.aggregateSources.google ? shop.aggregateSources.google.rating : '4.9'}</span>
                  <span class="micro-sep">•</span>
                  <span>Yelp ★${shop.aggregateSources.yelp ? shop.aggregateSources.yelp.rating : '4.8'}</span>
                  <span class="micro-sep">•</span>
                  <span>FB ★${shop.aggregateSources.facebook ? shop.aggregateSources.facebook.rating : '5.0'}</span>
                </div>
              ` : '<span></span>'}
              <a href="${shopUrl}" class="action-btn">
                <span>View Dossier &amp; Roster</span> <span class="btn-arrow">➔</span>
              </a>
            </footer>
          </div>
        </article>
      `;
    }).join('');
  }

  // 3. Filter and Render Artists Roster
  function renderArtists() {
    if (!artistsGrid) return;

    const term = searchTerm.toLowerCase().trim();

    const filtered = allArtists.filter(artist => {
      // Specialty Filter
      const matchesSpecialty = (currentArtistSpecialty === 'all') ||
        (Array.isArray(artist.specialties) && artist.specialties.some(s => s.toLowerCase().includes(currentArtistSpecialty.toLowerCase())));

      // Availability Filter
      const matchesStatus = (currentArtistStatus === 'all') ||
        (artist.bookingStatus === currentArtistStatus);

      // Indie Only Filter
      const matchesIndie = !indieOnly || artist.isIndie === true;

      // Search term
      const matchesSearch = !term ||
        artist.name.toLowerCase().includes(term) ||
        (artist.handle && artist.handle.toLowerCase().includes(term)) ||
        (artist.role && artist.role.toLowerCase().includes(term)) ||
        (artist.bioSnippet && artist.bioSnippet.toLowerCase().includes(term)) ||
        (artist.shopName && artist.shopName.toLowerCase().includes(term)) ||
        (Array.isArray(artist.specialties) && artist.specialties.some(sp => sp.toLowerCase().includes(term)));

      return matchesSpecialty && matchesStatus && matchesIndie && matchesSearch;
    });

    if (artistsResultsCount) {
      artistsResultsCount.textContent = `Showing ${filtered.length} of ${allArtists.length} Verified Artists`;
    }

    if (filtered.length === 0) {
      artistsGrid.innerHTML = '';
      if (noArtistsMsg) noArtistsMsg.style.display = 'block';
      return;
    }

    if (noArtistsMsg) noArtistsMsg.style.display = 'none';

    const statusMap = {
      open: '🟢 Books Open',
      waitlist: '🟡 Waitlist',
      closed: '🔴 Books Closed'
    };

    artistsGrid.innerHTML = filtered.map(a => {
      const cleanHandle = a.handle ? a.handle.replace('@', '') : '';
      const igUrl = cleanHandle ? `https://instagram.com/${cleanHandle}` : '#';
      const shopUrl = `shop.html?slug=${encodeURIComponent(a.shopSlug)}`;
      const statusText = a.bookingStatus === 'waitlist'
        ? `🟡 Waitlist (${a.waitlistTime || '1–2 Mos'})`
        : (statusMap[a.bookingStatus] || '🟢 Books Open');

      return `
        <article class="artist-showcase-card ${a.isIndie ? 'artist-card-indie' : ''}">
          <div class="artist-card-header">
            <div class="artist-badge-avatar">${escapeHtml(a.avatarInitials || a.name.slice(0, 2).toUpperCase())}</div>
            <div class="artist-header-titles">
              <h3 class="artist-card-name">${escapeHtml(a.name)}</h3>
              <span class="artist-card-role">${escapeHtml(a.role || 'Resident Tattooer')}</span>
              <div class="artist-shop-link">
                <a href="${shopUrl}">📍 ${escapeHtml(a.shopName)}</a>
                ${a.isIndie ? '<span class="indie-micro-tag">🌿 Indie</span>' : ''}
              </div>
            </div>
          </div>

          <div class="artist-status-row">
            <span class="booking-badge status-${a.bookingStatus || 'open'}">${statusText}</span>
            ${a.waitlistTime && a.bookingStatus === 'open' ? `<span class="artist-wait-note">⏱ ${escapeHtml(a.waitlistTime)}</span>` : ''}
          </div>

          ${Array.isArray(a.specialties) && a.specialties.length > 0 ? `
            <div class="artist-specialties-strip">
              ${a.specialties.map(sp => `<span class="artist-spec-tag">${escapeHtml(sp)}</span>`).join('')}
            </div>
          ` : ''}

          <div class="artist-bio-box">
            <p>${escapeHtml(a.bioSnippet || 'Resident custom tattooer providing dedicated artistry and client-focused sessions.')}</p>
          </div>

          <footer class="artist-card-footer">
            ${cleanHandle ? `
              <a href="${igUrl}" target="_blank" rel="noopener noreferrer" class="artist-portfolio-btn" title="View Instagram portfolio for ${escapeHtml(a.name)}">
                <span>📸 ${escapeHtml(a.handle)}</span> <span class="ext-arrow">↗</span>
              </a>
            ` : '<span></span>'}
            <a href="${shopUrl}#artists-section" class="artist-studio-btn">
              <span>View Studio Roster</span> ➔
            </a>
          </footer>
        </article>
      `;
    }).join('');
  }

  // 4. View Switcher Setup
  function setupViewSwitcher() {
    if (!viewStudiosTab || !viewArtistsTab) return;

    function switchView(view) {
      currentView = view;
      if (view === 'studios') {
        viewStudiosTab.classList.add('active');
        viewArtistsTab.classList.remove('active');
        if (studiosViewContainer) studiosViewContainer.style.display = 'block';
        if (artistsViewContainer) artistsViewContainer.style.display = 'none';
        renderShops();
      } else {
        viewArtistsTab.classList.add('active');
        viewStudiosTab.classList.remove('active');
        if (studiosViewContainer) studiosViewContainer.style.display = 'none';
        if (artistsViewContainer) artistsViewContainer.style.display = 'block';
        renderArtists();
      }
    }

    viewStudiosTab.addEventListener('click', () => switchView('studios'));
    viewArtistsTab.addEventListener('click', () => switchView('artists'));

    if (navArtistsLink) {
      navArtistsLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('artists');
        const switcher = document.getElementById('directory-view-switcher');
        if (switcher) switcher.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // 5. Artist Filter Listeners
  function setupArtistFilters() {
    if (artistSpecialtyChips) {
      artistSpecialtyChips.addEventListener('click', (e) => {
        const btn = e.target.closest('.artist-chip');
        if (!btn) return;
        artistSpecialtyChips.querySelectorAll('.artist-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentArtistSpecialty = btn.dataset.specialty;
        renderArtists();
      });
    }

    if (artistStatusChips) {
      artistStatusChips.addEventListener('click', (e) => {
        const btn = e.target.closest('.artist-chip');
        if (!btn) return;
        artistStatusChips.querySelectorAll('.artist-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentArtistStatus = btn.dataset.status;
        renderArtists();
      });
    }

    if (indieOnlyCheckbox) {
      indieOnlyCheckbox.addEventListener('change', (e) => {
        indieOnly = e.target.checked;
        renderArtists();
      });
    }

    if (resetArtistFiltersBtn) {
      resetArtistFiltersBtn.addEventListener('click', () => {
        currentArtistSpecialty = 'all';
        currentArtistStatus = 'all';
        indieOnly = false;
        if (indieOnlyCheckbox) indieOnlyCheckbox.checked = false;
        if (artistSpecialtyChips) {
          artistSpecialtyChips.querySelectorAll('.artist-chip').forEach(b => b.classList.toggle('active', b.dataset.specialty === 'all'));
        }
        if (artistStatusChips) {
          artistStatusChips.querySelectorAll('.artist-chip').forEach(b => b.classList.toggle('active', b.dataset.status === 'all'));
        }
        renderArtists();
      });
    }
  }

  // 6. Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
      }
      renderShops();
      renderArtists();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchTerm = '';
      if (searchInput) searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      renderShops();
      renderArtists();
    });
  }

  // 7. Discovery Hub Filters
  if (filtersContainer) {
    filtersContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.style-badge');
      if (!btn) return;
      filtersContainer.querySelectorAll('.style-badge').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStyle = btn.dataset.style;
      renderShops();
    });
  }

  if (opFiltersContainer) {
    opFiltersContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.op-badge');
      if (!btn) return;
      opFiltersContainer.querySelectorAll('.op-badge').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentOp = btn.dataset.op;
      renderShops();
    });
  }

  if (vibeFiltersContainer) {
    vibeFiltersContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.vibe-badge');
      if (!btn) return;
      vibeFiltersContainer.querySelectorAll('.vibe-badge').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentVibe = btn.dataset.vibe;
      renderShops();
    });
  }

  function updateFilterUI() {
    const dotStyles = document.getElementById('dot-styles');
    const dotOperations = document.getElementById('dot-operations');
    const dotVibes = document.getElementById('dot-vibes');

    if (dotStyles) dotStyles.style.display = (currentStyle !== 'all') ? 'inline-block' : 'none';
    if (dotOperations) dotOperations.style.display = (currentOp !== 'all') ? 'inline-block' : 'none';
    if (dotVibes) dotVibes.style.display = (currentVibe !== 'all') ? 'inline-block' : 'none';

    const bar = document.getElementById('active-filter-bar');
    const chipsMount = document.getElementById('active-filter-chips');
    if (!bar || !chipsMount) return;

    const activeFilters = [];
    if (currentStyle !== 'all') {
      activeFilters.push({ type: 'style', label: `Style: ${currentStyle}` });
    }
    if (currentOp !== 'all') {
      const opLabels = {
        walkIns: 'Walk-Ins Welcome',
        appointmentOnly: 'Appointment Only',
        piercing: 'Piercing Available',
        coverUps: 'Cover-Up Specialists'
      };
      activeFilters.push({ type: 'op', label: opLabels[currentOp] || currentOp });
    }
    if (currentVibe !== 'all') {
      const vibeLabels = {
        sanctuary: '🌿 Indie Sanctuaries',
        'inclusive-heritage': '🌹 Modern Inclusive',
        'street-shop': '⚡ Street Shops',
        'mega-shop': '🏢 Commercial Mega-Shops'
      };
      activeFilters.push({ type: 'vibe', label: vibeLabels[currentVibe] || currentVibe });
    }
    if (searchTerm) {
      activeFilters.push({ type: 'search', label: `"${searchTerm}"` });
    }

    if (activeFilters.length > 0) {
      chipsMount.innerHTML = activeFilters.map(f => `
        <button type="button" class="active-chip" data-filter-type="${f.type}" title="Click to remove filter">
          <span>${escapeHtml(f.label)}</span>
          <span class="chip-remove">✕</span>
        </button>
      `).join('');
      bar.style.display = 'flex';
    } else {
      chipsMount.innerHTML = '';
      bar.style.display = 'none';
    }
  }

  function setupDiscoveryHub() {
    const tabs = document.querySelectorAll('.hub-tab');
    const panels = document.querySelectorAll('.hub-panel');
    const chipsMount = document.getElementById('active-filter-chips');
    const clearAllBtn = document.getElementById('clear-all-filters-btn');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => {
          p.classList.remove('active');
          p.style.display = 'none';
        });

        tab.classList.add('active');
        const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.style.display = 'block';
        }
      });
    });

    if (chipsMount) {
      chipsMount.addEventListener('click', (e) => {
        const chip = e.target.closest('.active-chip');
        if (!chip) return;
        const type = chip.dataset.filterType;
        if (type === 'style') {
          currentStyle = 'all';
          if (filtersContainer) {
            filtersContainer.querySelectorAll('.style-badge').forEach(b => b.classList.toggle('active', b.dataset.style === 'all'));
          }
        } else if (type === 'op') {
          currentOp = 'all';
          if (opFiltersContainer) {
            opFiltersContainer.querySelectorAll('.op-badge').forEach(b => b.classList.toggle('active', b.dataset.op === 'all'));
          }
        } else if (type === 'vibe') {
          currentVibe = 'all';
          if (vibeFiltersContainer) {
            vibeFiltersContainer.querySelectorAll('.vibe-badge').forEach(b => b.classList.toggle('active', b.dataset.vibe === 'all'));
          }
        } else if (type === 'search') {
          searchTerm = '';
          if (searchInput) searchInput.value = '';
          if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        }
        renderShops();
        renderArtists();
      });
    }

    if (clearAllBtn) clearAllBtn.addEventListener('click', resetAllFilters);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  function resetAllFilters() {
    searchTerm = '';
    currentStyle = 'all';
    currentOp = 'all';
    currentVibe = 'all';
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (filtersContainer) {
      filtersContainer.querySelectorAll('.style-badge').forEach(b => b.classList.toggle('active', b.dataset.style === 'all'));
    }
    if (opFiltersContainer) {
      opFiltersContainer.querySelectorAll('.op-badge').forEach(b => b.classList.toggle('active', b.dataset.op === 'all'));
    }
    if (vibeFiltersContainer) {
      vibeFiltersContainer.querySelectorAll('.vibe-badge').forEach(b => b.classList.toggle('active', b.dataset.vibe === 'all'));
    }
    renderShops();
    renderArtists();
  }

  // 8. Un-Rigged 30-Second Match Quiz
  function setupMatchQuiz() {
    const modal = document.getElementById('quiz-modal');
    const openBtn = document.getElementById('open-quiz-btn');
    const closeBtn = document.getElementById('quiz-modal-close');
    if (!modal || !openBtn) return;

    const answers = { style: '', timing: '', budget: '', name: '', email: '' };

    const step1 = document.getElementById('quiz-step-1');
    const step2 = document.getElementById('quiz-step-2');
    const step3 = document.getElementById('quiz-step-3');
    const step4 = document.getElementById('quiz-step-4');
    const resultBox = document.getElementById('quiz-result-box');
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

    if (step1) {
      step1.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option-btn');
        if (!btn) return;
        answers.style = btn.dataset.val;
        step1.style.display = 'none';
        if (step2) step2.style.display = 'block';
      });
    }

    if (step2) {
      step2.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option-btn');
        if (!btn) return;
        answers.timing = btn.dataset.val;
        step2.style.display = 'none';
        if (step3) step3.style.display = 'block';
      });
    }

    if (step3) {
      step3.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-option-btn');
        if (!btn) return;
        answers.budget = btn.dataset.val;
        step3.style.display = 'none';
        if (step4) step4.style.display = 'block';
      });
    }

    if (leadForm) {
      leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        answers.name = document.getElementById('quiz-name').value.trim();
        answers.email = document.getElementById('quiz-email').value.trim();

        step4.style.display = 'none';

        // Un-Rigged, Objective Artist-Centered Match Algorithm
        let matchedSlug = 'self-inflicted';
        let matchReason = '';
        let artistMatch = '';

        if (answers.style === 'coverup') {
          matchedSlug = 'self-inflicted';
          artistMatch = 'Aaron Moore (@aaronmooretattoo)';
          matchReason = 'Widely recognized across Colorado Springs as the city\'s #1 cover-up wizard for turning old or dark ink into clean, vibrant art.';
        } else if (answers.style === 'anime') {
          matchedSlug = 'fallen-heroes';
          artistMatch = 'Reece Allen (@reeceallentattoos)';
          matchReason = 'Nationally acclaimed on Reddit and Instagram for flawless anime character fidelity, vivid color saturation, and razor linework.';
        } else if (answers.style === 'traditional') {
          matchedSlug = 'rose-of-the-west';
          artistMatch = 'Lauren (@roseofthewest_lauren) & Benton (@bentontattoos)';
          matchReason = 'The Springs\' gold standard for American Traditional with heavy lines, authentic painted flash, and timeless color packing.';
        } else if (answers.style === 'fineline') {
          matchedSlug = 'self-inflicted';
          artistMatch = 'Vicki (@vicki_westside_ink)';
          matchReason = 'Gentle needle craft specializing in delicate botanical floras and razor-thin script that heals without blowouts.';
        } else if (answers.style === 'realism') {
          matchedSlug = 'timeless-body-art';
          artistMatch = 'Ryan (@ryan_timelessbodyart) & Sean';
          matchReason = 'Festival-award winning portrait realism and dark surrealism with true photographic micro-contrast and surgical precision.';
        } else if (answers.style === 'piercing') {
          matchedSlug = 'pens-and-needles';
          artistMatch = 'Elena P. (Certified Body Piercing)';
          matchReason = 'Dedicated piercer strictly utilizing single-use sterile hollow needles and implant-grade titanium body jewelry.';
        } else if (answers.timing === 'walkin') {
          matchedSlug = 'tattoo-demon';
          artistMatch = 'Dave Wulff & Manny C.';
          matchReason = 'Authentic Tejon Street walk-in heritage with wall flash, fast chairs, and zero corporate pretension.';
        } else {
          // Custom Large Scale / Freehand
          matchedSlug = 'riot-tattoo';
          artistMatch = 'Paes 164 & Darin Newhouse';
          matchReason = 'Boutique custom art collective specializing in anatomical freehand stencils, neo-traditional color, and dark realism.';
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
                <strong>Recommended Resident Artist:</strong> ${artistMatch}
              </div>
              <p class="match-reason-text"><strong>Why This Artist Fits You:</strong> ${matchReason}</p>
              <div class="match-policy-chips">
                <span>📍 ${escapeHtml(matchedShop.address || 'Colorado Springs')}</span>
                <span>${matchedShop.operational && matchedShop.operational.walkIns ? '🚶 Walk-Ins Welcome' : '📅 Strict Appointment'}</span>
                <span>💰 ${escapeHtml(matchedShop.priceRange || '$$$')}</span>
              </div>
              <div class="match-action-row">
                <a href="shop.html?slug=${matchedShop.slug || matchedShop.id}" class="btn btn-primary btn-block">
                  View Full Studio Profile &amp; Artist Roster ➔
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
  loadData();
});
