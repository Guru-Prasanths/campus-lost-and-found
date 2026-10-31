// Campus Lost & Found Client Application for GitHub Pages
// Manages 70 seeded items, filters, ownership verification quiz, claims, and local storage persistence.

(function () {
    'use strict';

    // Application State
    let itemsData = [];
    const claimsKey = 'campus_lost_found_claims_v1';
    const verifiedQuizKey = 'campus_verified_quizzes_v1';
    const customItemsKey = 'campus_custom_items_v1';

    let verifiedItemIds = new Set();
    let currentFilter = {
        type: '',
        category: '',
        keyword: '',
        location: '',
        sort: 'newest'
    };

    // Initialize application
    function init() {
        // Load verified quiz sessions from sessionStorage
        try {
            const savedVerified = sessionStorage.getItem(verifiedQuizKey);
            if (savedVerified) {
                verifiedItemIds = new Set(JSON.parse(savedVerified));
            }
        } catch (e) {
            console.warn('Session storage inaccessible:', e);
        }

        // Combine base data with any locally reported items
        const rawItems = (typeof window !== 'undefined' && window.CAMPUS_ITEMS) || (typeof CAMPUS_ITEMS !== 'undefined' ? CAMPUS_ITEMS : []);
        itemsData = Array.isArray(rawItems) ? [...rawItems] : [];
        try {
            const customItems = localStorage.getItem(customItemsKey);
            if (customItems) {
                const parsed = JSON.parse(customItems);
                itemsData = [...parsed, ...itemsData];
            }
        } catch (e) {
            console.warn('Local storage custom items inaccessible:', e);
        }

        // Set default date in report modal to today
        const reportDateInput = document.getElementById('reportDate');
        if (reportDateInput) {
            reportDateInput.value = new Date().toISOString().split('T')[0];
        }

        updateStats();
        updateClaimsBadge();
        applyFilters();

        // Keyboard escape to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDetailModal();
                closeReportModal();
                closeClaimsModal();
            }
        });
    }

    // Get icon class for item categories
    function getCategoryIcon(cat) {
        switch (cat) {
            case 'ELECTRONICS': return 'fas fa-laptop';
            case 'ID_CARDS': return 'fas fa-id-card';
            case 'WALLETS_MONEY': return 'fas fa-wallet';
            case 'BOOKS_NOTES': return 'fas fa-book';
            case 'KEYS': return 'fas fa-key';
            case 'BAGS': return 'fas fa-shopping-bag';
            case 'BOTTLES': return 'fas fa-wine-bottle';
            case 'WATCHES': return 'fas fa-stopwatch';
            case 'SPECTACLES': return 'fas fa-glasses';
            case 'STATIONERY': return 'fas fa-pencil-ruler';
            default: return 'fas fa-box';
        }
    }

    // Format date string
    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const date = new Date(parts[0], parts[1] - 1, parts[2]);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
        } catch (e) {}
        return dateStr;
    }

    // Update top statistics counters
    function updateStats() {
        const lostCount = itemsData.filter(i => i.type === 'LOST').length;
        const foundCount = itemsData.filter(i => i.type === 'FOUND').length;
        const totalCount = itemsData.length;

        const statLost = document.getElementById('statLostCount');
        const statFound = document.getElementById('statFoundCount');
        const navTotal = document.getElementById('navCountTotal');
        const totalItemsEl = document.getElementById('totalItemsCount');

        if (statLost) statLost.textContent = lostCount;
        if (statFound) statFound.textContent = foundCount;
        if (navTotal) navTotal.textContent = totalCount;
        if (totalItemsEl) totalItemsEl.textContent = totalCount;
    }

    // Load claims from localStorage
    function getClaims() {
        try {
            const claims = localStorage.getItem(claimsKey);
            return claims ? JSON.parse(claims) : [];
        } catch (e) {
            return [];
        }
    }

    // Save claims to localStorage
    function saveClaim(claim) {
        try {
            const claims = getClaims();
            claims.unshift(claim);
            localStorage.setItem(claimsKey, JSON.stringify(claims));
            updateClaimsBadge();
            return true;
        } catch (e) {
            console.error('Error saving claim:', e);
            return false;
        }
    }

    // Check if user has already claimed an item
    function hasUserClaimed(itemId) {
        const claims = getClaims();
        return claims.some(c => c.itemId === itemId);
    }

    // Update claim count badge in navbar
    function updateClaimsBadge() {
        const claims = getClaims();
        const badge = document.getElementById('myClaimsBadge');
        if (badge) {
            if (claims.length > 0) {
                badge.style.display = 'inline-block';
                badge.textContent = claims.length;
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // Toast notification helper
    function showToast(message) {
        const toast = document.getElementById('toastNotification');
        const msg = document.getElementById('toastMessage');
        if (toast && msg) {
            msg.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3500);
        }
    }

    // Filter items based on current selection
    function applyFilters() {
        const keywordInput = document.getElementById('filterKeyword');
        const categorySelect = document.getElementById('filterCategory');
        const locationInput = document.getElementById('filterLocation');
        const sortSelect = document.getElementById('filterSort');

        const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
        const category = categorySelect ? categorySelect.value : '';
        const location = locationInput ? locationInput.value.trim().toLowerCase() : '';
        const sort = sortSelect ? sortSelect.value : 'newest';

        // Check selected type radio
        const typeRadios = document.getElementsByName('itemType');
        let selectedType = '';
        for (const radio of typeRadios) {
            if (radio.checked) {
                selectedType = radio.value;
                break;
            }
        }

        currentFilter = {
            type: selectedType,
            category: category,
            keyword: keyword,
            location: location,
            sort: sort
        };

        // Update active class on type toggle buttons
        const optAll = document.getElementById('typeOptAll');
        const optLost = document.getElementById('typeOptLost');
        const optFound = document.getElementById('typeOptFound');
        if (optAll) optAll.classList.toggle('active', selectedType === '');
        if (optLost) optLost.classList.toggle('active', selectedType === 'LOST');
        if (optFound) optFound.classList.toggle('active', selectedType === 'FOUND');

        // Update hero tab button active state
        const heroAll = document.getElementById('heroTabAll');
        const heroLost = document.getElementById('heroTabLost');
        const heroFound = document.getElementById('heroTabFound');
        if (heroAll) heroAll.classList.toggle('active', selectedType === '');
        if (heroLost) heroLost.classList.toggle('active', selectedType === 'LOST');
        if (heroFound) heroFound.classList.toggle('active', selectedType === 'FOUND');

        renderItems();
    }

    // Reset all filters to default
    function resetFilters() {
        const keywordInput = document.getElementById('filterKeyword');
        const categorySelect = document.getElementById('filterCategory');
        const locationInput = document.getElementById('filterLocation');
        const sortSelect = document.getElementById('filterSort');

        if (keywordInput) keywordInput.value = '';
        if (categorySelect) categorySelect.value = '';
        if (locationInput) locationInput.value = '';
        if (sortSelect) sortSelect.value = 'newest';

        const typeRadios = document.getElementsByName('itemType');
        for (const radio of typeRadios) {
            radio.checked = (radio.value === '');
        }

        applyFilters();
    }

    // Filter by type directly from nav or hero tabs
    function filterByType(type) {
        const typeRadios = document.getElementsByName('itemType');
        for (const radio of typeRadios) {
            radio.checked = (radio.value === type);
        }
        applyFilters();

        // Smooth scroll to items grid
        const grid = document.getElementById('itemsGrid');
        if (grid) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Render item cards
    function renderItems() {
        let filtered = itemsData.filter(item => {
            if (currentFilter.type && item.type !== currentFilter.type) return false;
            if (currentFilter.category && item.category !== currentFilter.category) return false;
            if (currentFilter.location && !item.location.toLowerCase().includes(currentFilter.location)) return false;
            if (currentFilter.keyword) {
                const kw = currentFilter.keyword;
                const matchName = item.name && item.name.toLowerCase().includes(kw);
                const matchDesc = item.description && item.description.toLowerCase().includes(kw);
                const matchLoc = item.location && item.location.toLowerCase().includes(kw);
                if (!matchName && !matchDesc && !matchLoc) return false;
            }
            return true;
        });

        // Sort items
        filtered.sort((a, b) => {
            if (currentFilter.sort === 'newest') {
                return (b.date || '').localeCompare(a.date || '') || (b.id - a.id);
            } else if (currentFilter.sort === 'oldest') {
                return (a.date || '').localeCompare(b.date || '') || (a.id - b.id);
            } else if (currentFilter.sort === 'name') {
                return (a.name || '').localeCompare(b.name || '');
            }
            return 0;
        });

        const grid = document.getElementById('itemsGrid');
        const emptyState = document.getElementById('emptyState');
        const visibleCountEl = document.getElementById('visibleItemsCount');

        if (visibleCountEl) visibleCountEl.textContent = filtered.length;

        if (filtered.length === 0) {
            if (grid) grid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (grid) grid.style.display = 'grid';

        let html = '';
        filtered.forEach(item => {
            const isLost = item.type === 'LOST';
            const badgeClass = isLost ? 'badge-lost' : 'badge-found';
            const badgeIcon = isLost ? 'fa-exclamation-circle' : 'fa-box-open';
            const catIcon = getCategoryIcon(item.category);
            const formattedDate = formatDate(item.date);
            const hasClaimed = hasUserClaimed(item.id);

            const imageMarkup = item.image
                ? `<img src="images/items/${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'item-card-placeholder\\'><i class=\\'${catIcon}\\'></i></div>';">`
                : `<div class="item-card-placeholder"><i class="${catIcon}"></i></div>`;

            html += `
            <div class="item-card" onclick="openDetailModal(${item.id})">
                <div class="item-card-badge ${badgeClass}">
                    <i class="fas ${badgeIcon}"></i>
                    <span>${item.type}</span>
                </div>
                ${item.isDemo ? `<div class="item-demo-badge"><i class="fas fa-flask"></i> Seeded Demo</div>` : ''}
                ${hasClaimed ? `<div class="item-status-badge status-claimed" style="background:#0284c7; color:#fff;">CLAIM SUBMITTED</div>` : (item.status && item.status !== 'ACTIVE' ? `<div class="item-status-badge status-${item.status.toLowerCase()}">${item.status}</div>` : '')}
                
                <div class="item-card-image">
                    ${imageMarkup}
                </div>

                <div class="item-card-body">
                    <div class="item-category-tag">${escapeHtml(item.categoryDisplay || item.category)}</div>
                    <h3 class="item-name">${escapeHtml(item.name)}</h3>
                    <p class="item-desc">${escapeHtml(truncate(item.description, 85))}</p>
                    
                    <div class="item-meta">
                        <span class="item-meta-tag">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${escapeHtml(item.location)}</span>
                        </span>
                        <span class="item-meta-tag">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${formattedDate}</span>
                        </span>
                    </div>

                    <div class="item-card-footer">
                        <button class="btn btn-view-item" onclick="event.stopPropagation(); openDetailModal(${item.id});">
                            ${item.type === 'FOUND' ? '<i class="fas fa-shield-alt"></i> Verify &amp; Claim' : 'View Details'} <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>`;
        });

        if (grid) grid.innerHTML = html;
    }

    // Open detail modal with quiz for found items
    function openDetailModal(itemId) {
        const item = itemsData.find(i => i.id === itemId);
        if (!item) return;

        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('detailModalBody');
        if (!modal || !modalBody) return;

        const isLost = item.type === 'LOST';
        const badgeClass = isLost ? 'badge-lost' : 'badge-found';
        const badgeIcon = isLost ? 'fa-exclamation-circle' : 'fa-box-open';
        const catIcon = getCategoryIcon(item.category);
        const formattedDate = formatDate(item.date);
        const isVerified = verifiedItemIds.has(item.id);
        const hasClaimed = hasUserClaimed(item.id);

        const imageMarkup = item.image
            ? `<img src="images/items/${item.image}" alt="${escapeHtml(item.name)}" class="detail-image" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'detail-image-placeholder\\'><i class=\\'${catIcon}\\'></i><span>No Image Available</span></div>';">`
            : `<div class="detail-image-placeholder"><i class="${catIcon}"></i><span>No Image Available</span></div>`;

        // Render Quiz HTML if FOUND item
        let quizHtml = '';
        if (!isLost && Array.isArray(item.quiz) && item.quiz.length > 0) {
            quizHtml = `
            <div class="sidebar-quiz" id="quizSection_${item.id}" style="${isVerified ? 'display:none;' : ''}">
                <div class="sidebar-quiz-header">
                    <i class="fas fa-shield-alt"></i>
                    <h3>Ownership Verification Quiz</h3>
                </div>
                <p class="quiz-instruction">
                    <i class="fas fa-info-circle"></i> To prevent false claims, answer these <strong>${item.quiz.length} questions</strong> regarding identifiable physical characteristics of this found item before claiming.
                </p>
                <div id="quizFeedback_${item.id}" class="quiz-feedback"></div>

                <form id="quizForm_${item.id}" onsubmit="handleQuizSubmit(event, ${item.id})">
                    ${item.quiz.map((q, idx) => `
                        <div class="quiz-question-box" style="margin-bottom: 16px;">
                            <div class="quiz-q-title" style="font-weight: 600; margin-bottom: 8px; color: #1e293b;">
                                <strong>${idx + 1}.</strong> ${escapeHtml(q.q)}
                            </div>
                            <div class="quiz-options-list">
                                ${q.options.map((opt, optIdx) => `
                                    <label class="quiz-option-label" onclick="highlightRadio(this)">
                                        <input type="radio" name="quiz_q_${idx}" value="${optIdx}" required>
                                        <span>${escapeHtml(opt)}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}

                    <button type="submit" class="btn btn-primary btn-full" style="margin-top: 14px;">
                        <i class="fas fa-check-double"></i> Submit Answers &amp; Unlock Claim
                    </button>
                </form>
            </div>

            <!-- Quiz Verified Notice -->
            <div class="quiz-verified-card" id="quizVerifiedCard_${item.id}" style="${isVerified ? 'display:block;' : 'display:none;'}">
                <div class="quiz-verified-header" style="display: flex; align-items: center; gap: 8px; color: #166534; font-weight: 700; margin-bottom: 6px;">
                    <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                    <span>Ownership Pre-Check Verified</span>
                </div>
                <p class="quiz-verified-text" style="color: #15803d; font-size: 0.92rem; margin: 0;">
                    You correctly answered the physical identification quiz. Complete the claim form below to arrange recovery with campus security.
                </p>
            </div>`;
        }

        // Render Claim Form HTML
        let claimFormHtml = '';
        if (hasClaimed) {
            claimFormHtml = `
            <div class="sidebar-card sidebar-claimed" style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:12px; padding:20px; text-align:center;">
                <div style="font-size:2rem; color:#0284c7; margin-bottom:10px;"><i class="fas fa-check-circle"></i></div>
                <h3 style="font-size:1.1rem; color:#0369a1; margin-bottom:8px;">Claim Submitted</h3>
                <p style="font-size:0.88rem; color:#0c4a6e; margin-bottom:14px;">Your ownership claim is registered and under review by campus security.</p>
                <button onclick="closeDetailModal(); openClaimsModal();" class="btn btn-outline btn-full">View My Claims</button>
            </div>`;
        } else {
            const showFormInitially = isLost || isVerified;
            claimFormHtml = `
            <div class="sidebar-card" id="claimFormSection_${item.id}" style="${showFormInitially ? 'display:block;' : 'display:none;'}">
                <div class="sidebar-card-header" style="margin-bottom: 12px;">
                    <i class="fas fa-clipboard-check text-primary"></i>
                    <h3 style="font-size: 1.15rem; margin: 0;">${isLost ? 'Found This Belonging?' : 'Submit Ownership Claim'}</h3>
                </div>
                <p class="sidebar-card-desc" style="font-size: 0.88rem; color: #64748b; margin-bottom: 14px;">
                    ${isLost
                        ? 'If you have found this item or have information, submit your details so the reporting student can get in touch.'
                        : 'Provide your official student details to complete your claim and schedule handover at the campus security desk.'}
                </p>

                <form id="claimSubmitForm_${item.id}" onsubmit="handleClaimSubmit(event, ${item.id})">
                    <div class="form-group" style="margin-bottom: 12px;">
                        <label class="form-label required" style="font-size: 0.85rem; font-weight: 600;">Full Name</label>
                        <input type="text" id="claimantName_${item.id}" class="form-control" required placeholder="e.g. Rahul Verma">
                    </div>
                    <div class="form-group" style="margin-bottom: 12px;">
                        <label class="form-label required" style="font-size: 0.85rem; font-weight: 600;">Student Roll / College ID</label>
                        <input type="text" id="claimantId_${item.id}" class="form-control" required placeholder="e.g. CS202488">
                    </div>
                    <div class="form-group" style="margin-bottom: 12px;">
                        <label class="form-label required" style="font-size: 0.85rem; font-weight: 600;">Contact Phone / Email</label>
                        <input type="text" id="claimantContact_${item.id}" class="form-control" required placeholder="e.g. 9876543210 or student@campus.edu">
                    </div>
                    <div class="form-group" style="margin-bottom: 16px;">
                        <label class="form-label required" style="font-size: 0.85rem; font-weight: 600;">Proof of Ownership / Specific Details</label>
                        <textarea id="claimantProof_${item.id}" class="form-control" rows="3" required minlength="10" placeholder="Describe unique identifying marks, contents, lock screen photo, or purchase proof..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">
                        <i class="fas fa-paper-plane"></i> Submit Official Claim
                    </button>
                </form>
            </div>`;
        }

        modalBody.innerHTML = `
        <div class="detail-grid" style="display:grid; grid-template-columns: 1.15fr 1fr; gap: 24px;">
            <!-- LEFT: Item Info -->
            <div class="detail-main">
                <div class="detail-card" style="box-shadow:none; border:none; padding:0;">
                    <div class="detail-image-wrap" style="position:relative; border-radius:12px; overflow:hidden; margin-bottom:16px;">
                        ${imageMarkup}
                        <div class="detail-type-badge ${badgeClass}" style="position:absolute; top:12px; left:12px;">
                            <i class="fas ${badgeIcon}"></i>
                            <span>${item.type}</span>
                        </div>
                    </div>

                    ${item.isDemo ? `
                    <div class="demo-banner" style="background:#eff6ff; border:1px solid #bfdbfe; color:#1e40af; padding:10px 14px; border-radius:8px; font-size:0.85rem; display:flex; align-items:center; gap:8px; margin-bottom:16px;">
                        <i class="fas fa-flask"></i>
                        <span><strong>Demonstration / Seeded Record:</strong> This entry is sample campus data provided for testing and system illustration purposes.</span>
                    </div>` : ''}

                    <div class="detail-header-row" style="margin-bottom:16px;">
                        <div>
                            <span class="detail-category" style="color:#2563eb; font-size:0.85rem; font-weight:600; text-transform:uppercase;">${escapeHtml(item.categoryDisplay || item.category)}</span>
                            <h2 class="detail-title" style="font-size:1.45rem; font-weight:700; color:#1e293b; margin:4px 0 0;">${escapeHtml(item.name)}</h2>
                        </div>
                    </div>

                    <div class="detail-meta-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; background:#f8fafc; padding:14px; border-radius:10px; margin-bottom:18px;">
                        <div class="detail-meta-item" style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-map-marker-alt text-primary"></i>
                            <div>
                                <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase;">${isLost ? 'Lost Location' : 'Found Location'}</div>
                                <div style="font-size:0.88rem; font-weight:600; color:#1e293b;">${escapeHtml(item.location)}</div>
                            </div>
                        </div>
                        <div class="detail-meta-item" style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-calendar-alt text-primary"></i>
                            <div>
                                <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase;">Date Reported</div>
                                <div style="font-size:0.88rem; font-weight:600; color:#1e293b;">${formattedDate}</div>
                            </div>
                        </div>
                        <div class="detail-meta-item" style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-user text-primary"></i>
                            <div>
                                <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase;">Reported By</div>
                                <div style="font-size:0.88rem; font-weight:600; color:#1e293b;">${escapeHtml(item.reportedBy || 'Campus Security')}</div>
                            </div>
                        </div>
                        <div class="detail-meta-item" style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-hashtag text-primary"></i>
                            <div>
                                <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase;">Item ID</div>
                                <div style="font-size:0.88rem; font-weight:600; color:#1e293b;">#${item.id}</div>
                            </div>
                        </div>
                    </div>

                    <div class="detail-description">
                        <h4 style="font-size:0.95rem; font-weight:700; color:#334155; margin-bottom:6px;">Description</h4>
                        <p style="color:#475569; font-size:0.92rem; line-height:1.55; margin:0;">${escapeHtml(item.description)}</p>
                    </div>
                </div>
            </div>

            <!-- RIGHT: Quiz & Claim Sidebar -->
            <aside class="detail-sidebar" style="background:#ffffff; border-left:1px solid #e2e8f0; padding-left:20px;">
                ${quizHtml}
                ${claimFormHtml}
            </aside>
        </div>`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDetailModal() {
        const modal = document.getElementById('detailModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Radio option styling helper
    window.highlightRadio = function (labelEl) {
        const parent = labelEl.closest('.quiz-options-list');
        if (parent) {
            parent.querySelectorAll('.quiz-option-label').forEach(lbl => lbl.classList.remove('selected'));
            labelEl.classList.add('selected');
        }
    };

    // Quiz Submission Handler
    window.handleQuizSubmit = function (event, itemId) {
        event.preventDefault();
        const item = itemsData.find(i => i.id === itemId);
        if (!item || !Array.isArray(item.quiz)) return;

        let totalQuestions = item.quiz.length;
        let correctAnswers = 0;
        let allAnswered = true;

        item.quiz.forEach((q, idx) => {
            const selected = document.querySelector(`input[name="quiz_q_${idx}"]:checked`);
            if (!selected) {
                allAnswered = false;
            } else if (parseInt(selected.value, 10) === q.correct) {
                correctAnswers++;
            }
        });

        const feedbackEl = document.getElementById(`quizFeedback_${itemId}`);
        if (!allAnswered) {
            if (feedbackEl) {
                feedbackEl.className = 'quiz-feedback error show';
                feedbackEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please answer all questions before submitting.';
            }
            return;
        }

        // Passing criteria: at least 75% correct
        const passingScore = Math.ceil(totalQuestions * 0.75);
        if (correctAnswers >= passingScore) {
            // Success
            verifiedItemIds.add(itemId);
            try {
                sessionStorage.setItem(verifiedQuizKey, JSON.stringify(Array.from(verifiedItemIds)));
            } catch (e) {}

            if (feedbackEl) {
                feedbackEl.className = 'quiz-feedback success show';
                feedbackEl.innerHTML = `<i class="fas fa-check-circle"></i> Verification Successful! You scored <strong>${correctAnswers}/${totalQuestions}</strong>. Ownership verified.`;
            }

            // Hide quiz after short delay and reveal claim form
            setTimeout(() => {
                const quizSection = document.getElementById(`quizSection_${itemId}`);
                const quizVerifiedCard = document.getElementById(`quizVerifiedCard_${itemId}`);
                const claimSection = document.getElementById(`claimFormSection_${itemId}`);
                if (quizSection) quizSection.style.display = 'none';
                if (quizVerifiedCard) quizVerifiedCard.style.display = 'block';
                if (claimSection) {
                    claimSection.style.display = 'block';
                    claimSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 600);
        } else {
            // Failed
            if (feedbackEl) {
                feedbackEl.className = 'quiz-feedback error show';
                feedbackEl.innerHTML = `<i class="fas fa-times-circle"></i> Verification Failed. You answered <strong>${correctAnswers} of ${totalQuestions}</strong> correctly (minimum ${passingScore} required). Please re-read item details and try again.`;
            }
        }
    };

    // Claim Submission Handler
    window.handleClaimSubmit = function (event, itemId) {
        event.preventDefault();
        const item = itemsData.find(i => i.id === itemId);
        if (!item) return;

        const nameEl = document.getElementById(`claimantName_${itemId}`);
        const idEl = document.getElementById(`claimantId_${itemId}`);
        const contactEl = document.getElementById(`claimantContact_${itemId}`);
        const proofEl = document.getElementById(`claimantProof_${itemId}`);

        const claim = {
            id: 'CLM-' + Date.now().toString().slice(-6),
            itemId: item.id,
            itemName: item.name,
            itemType: item.type,
            category: item.categoryDisplay || item.category,
            claimantName: nameEl ? nameEl.value.trim() : 'Anonymous',
            collegeId: idEl ? idEl.value.trim() : '',
            contact: contactEl ? contactEl.value.trim() : '',
            proof: proofEl ? proofEl.value.trim() : '',
            status: 'PENDING',
            submittedAt: new Date().toISOString()
        };

        saveClaim(claim);
        showToast('Claim submitted successfully! Check "My Claims" in the navbar.');
        closeDetailModal();
        renderItems();
    };

    // Report Item Modal handlers
    window.openReportModal = function (type) {
        const modal = document.getElementById('reportModal');
        const typeInput = document.getElementById('reportType');
        const titleEl = document.getElementById('reportModalTitle');

        if (typeInput) typeInput.value = type || 'LOST';
        if (titleEl) {
            titleEl.textContent = (type === 'FOUND') ? 'Report Found Belonging' : 'Report Lost Belonging';
        }

        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeReportModal = function () {
        const modal = document.getElementById('reportModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.handleReportSubmit = function (event) {
        event.preventDefault();
        const type = document.getElementById('reportType').value || 'LOST';
        const name = document.getElementById('reportName').value.trim();
        const category = document.getElementById('reportCategory').value;
        const location = document.getElementById('reportLocation').value.trim();
        const date = document.getElementById('reportDate').value;
        const desc = document.getElementById('reportDesc').value.trim();
        const contact = document.getElementById('reportContact').value.trim();

        const newItem = {
            id: Date.now(),
            name: name,
            category: category,
            categoryDisplay: category.replace(/_/g, ' '),
            type: type,
            location: location,
            date: date,
            image: '',
            status: 'ACTIVE',
            isDemo: false,
            reportedBy: contact,
            description: desc
        };

        // If it's a found item, generate standard identification questions
        if (type === 'FOUND') {
            newItem.quiz = [
                {
                    q: `What is the primary color or casing of this ${name}?`,
                    options: ['Standard college black/grey', 'Bright red or blue', 'Transparent / patterned', 'Custom branded skin'],
                    correct: 0
                },
                {
                    q: `In which campus area was this item discovered?`,
                    options: [location, 'Campus Security Gate', 'Main Library 1st Floor', 'Sports Complex'],
                    correct: 0
                },
                {
                    q: `What is the approximate size or physical state?`,
                    options: ['Standard size with normal wear', 'Compact mini version', 'Brand new in original retail packaging', 'Heavily weathered'],
                    correct: 0
                }
            ];
        }

        itemsData.unshift(newItem);

        // Save to custom items in localStorage
        try {
            const customItems = JSON.parse(localStorage.getItem(customItemsKey) || '[]');
            customItems.unshift(newItem);
            localStorage.setItem(customItemsKey, JSON.stringify(customItems));
        } catch (e) {
            console.error('Error saving custom item:', e);
        }

        updateStats();
        applyFilters();
        closeReportModal();
        showToast(`${type === 'LOST' ? 'Lost' : 'Found'} report submitted to campus registry!`);
        document.getElementById('reportForm').reset();
    };

    // My Claims Modal handlers
    window.openClaimsModal = function () {
        const modal = document.getElementById('claimsModal');
        const container = document.getElementById('claimsListContainer');
        if (!modal || !container) return;

        const claims = getClaims();
        if (claims.length === 0) {
            container.innerHTML = `
            <div class="claim-card-empty">
                <i class="fas fa-clipboard-list" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 12px; display: block;"></i>
                <h4 style="color: #475569; margin-bottom: 6px;">No Submitted Claims Yet</h4>
                <p style="font-size: 0.9rem; color: #94a3b8;">When you submit an ownership claim after passing an item quiz, it will be listed here.</p>
            </div>`;
        } else {
            container.innerHTML = claims.map(c => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px;">
                    <div>
                        <span style="font-size: 0.75rem; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 9999px; font-weight: 700;">${c.id}</span>
                        <h4 style="font-size: 1.1rem; color: #1e293b; margin: 4px 0 0;">${escapeHtml(c.itemName)}</h4>
                    </div>
                    <span style="background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase;">
                        ${c.status}
                    </span>
                </div>
                <div style="font-size: 0.85rem; color: #64748b; line-height: 1.6;">
                    <div><strong>Claimant:</strong> ${escapeHtml(c.claimantName)} (${escapeHtml(c.collegeId)})</div>
                    <div><strong>Contact:</strong> ${escapeHtml(c.contact)}</div>
                    <div><strong>Proof Details:</strong> ${escapeHtml(c.proof)}</div>
                    <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 6px;">Submitted: ${new Date(c.submittedAt).toLocaleString()}</div>
                </div>
            </div>
            `).join('');
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeClaimsModal = function () {
        const modal = document.getElementById('claimsModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Helper functions
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
        if (!str) return '';
        return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
    }

    // Expose globals for HTML onclick attributes
    window.filterByType = filterByType;
    window.applyFilters = applyFilters;
    window.resetFilters = resetFilters;
    window.openDetailModal = openDetailModal;
    window.closeDetailModal = closeDetailModal;

    // Start on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
