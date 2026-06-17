/* ============================================================
   SAN3A — worker-details.js
   صفحة اختيار العامل (Workers List)
   ============================================================ */

(function() {
  'use strict';

  // ── Configuration ─────────────────────────────────────────
  const CURRENCY_SYMBOLS = { EGP: 'ج.م', SAR: 'ر.س', AED: 'د.إ' };
  const CURRENCY_MAX_PRICE = { EGP: 500, SAR: 200, AED: 200 };

  // Deposit structure: total = platform + worker
  const DEPOSIT_STRUCTURE = {
    cleaning:    { EGP: { total: 80,  platform: 30, worker: 50  }, SAR: { total: 30, platform: 11, worker: 19 }, AED: { total: 25, platform: 10, worker: 15 } },
    plumbing:    { EGP: { total: 100, platform: 40, worker: 60  }, SAR: { total: 40, platform: 15, worker: 25 }, AED: { total: 35, platform: 14, worker: 21 } },
    electricity: { EGP: { total: 120, platform: 50, worker: 70  }, SAR: { total: 45, platform: 18, worker: 27 }, AED: { total: 38, platform: 16, worker: 22 } },
    carpentry:   { EGP: { total: 140, platform: 60, worker: 80  }, SAR: { total: 55, platform: 23, worker: 32 }, AED: { total: 45, platform: 19, worker: 26 } },
    appliances:  { EGP: { total: 150, platform: 65, worker: 85  }, SAR: { total: 60, platform: 25, worker: 35 }, AED: { total: 50, platform: 21, worker: 29 } },
    painting:    { EGP: { total: 120, platform: 50, worker: 70  }, SAR: { total: 45, platform: 18, worker: 27 }, AED: { total: 38, platform: 16, worker: 22 } },
    moving:      { EGP: { total: 200, platform: 90, worker: 110 }, SAR: { total: 75, platform: 32, worker: 43 }, AED: { total: 60, platform: 26, worker: 34 } },
  };

  // Service metadata
  const SERVICE_TITLES = {
    cleaning: 'تنظيف المنازل', plumbing: 'السباكة', electricity: 'الكهرباء',
    carpentry: 'النجارة', appliances: 'إصلاح الأجهزة المنزلية',
    painting: 'الدهان والديكور', moving: 'نقل الأثاث'
  };

  const PROFESSIONS = {
    cleaning: 'عامل تنظيف', plumbing: 'سبّاك', electricity: 'كهربائي',
    carpentry: 'نجّار', appliances: 'فني أجهزة', painting: 'عامل دهان', moving: 'عامل نقل'
  };

  // Convert base EGP hourly rate to display currency
  function toDisplay(egp, currency) {
    if (currency === 'SAR') return Math.round(egp / 8.3 / 5) * 5;
    if (currency === 'AED') return Math.round(egp / 8.4 / 5) * 5;
    return egp;
  }

  // ── Worker Data ───────────────────────────────────────────
  const ALL_WORKERS = {
    cleaning: [
      { id:'c1', name:'أحمد محمد السيد',  experience:8,  rating:4.9, reviews:127, location:'القاهرة',      avatar:'أ.م', specialties:['تنظيف شامل','تعقيم','تلميع'],         isVerified:true,  responseTime:'15 دقيقة', hourlyRateEGP:150 },
      { id:'c2', name:'محمد علي حسن',     experience:5,  rating:4.3, reviews:78,  location:'الجيزة',       avatar:'م.ع', specialties:['تنظيف سريع','نوافذ','سجاد'],          isVerified:true,  responseTime:'20 دقيقة', hourlyRateEGP:100 },
      { id:'c3', name:'خالد إبراهيم',     experience:12, rating:5.0, reviews:203, location:'الإسكندرية',   avatar:'خ.إ', specialties:['تنظيف فلل','مكاتب','شركات'],          isVerified:true,  responseTime:'10 دقائق', hourlyRateEGP:200 },
      { id:'c4', name:'عمر حسام',         experience:3,  rating:3.8, reviews:34,  location:'المنصورة',     avatar:'ع.ح', specialties:['تنظيف منازل','أسعار اقتصادية'],       isVerified:false, responseTime:'30 دقيقة', hourlyRateEGP:80  },
      { id:'c5', name:'يوسف أحمد',        experience:10, rating:4.7, reviews:156, location:'طنطا',         avatar:'ي.أ', specialties:['تنظيف احترافي','معدات حديثة'],         isVerified:true,  responseTime:'12 دقيقة', hourlyRateEGP:180 },
      { id:'c6', name:'سعيد محمود',       experience:4,  rating:3.5, reviews:28,  location:'الزقازيق',     avatar:'س.م', specialties:['تنظيف أساسي','مرونة في المواعيد'],    isVerified:false, responseTime:'35 دقيقة', hourlyRateEGP:70  },
    ],
    plumbing: [
      { id:'p1', name:'حسن عبد الله',    experience:15, rating:5.0, reviews:289, location:'الرياض',        avatar:'ح.ع', specialties:['إصلاح تسريبات','تركيب سخانات','صيانة شاملة'], isVerified:true,  responseTime:'10 دقائق', hourlyRateEGP:250 },
      { id:'p2', name:'طارق فيصل',       experience:7,  rating:4.6, reviews:112, location:'جدة',           avatar:'ط.ف', specialties:['سباكة منزلية','طوارئ 24/7'],               isVerified:true,  responseTime:'15 دقيقة', hourlyRateEGP:180 },
      { id:'p3', name:'ماجد سعود',       experience:4,  rating:3.9, reviews:45,  location:'الدمام',        avatar:'م.س', specialties:['إصلاح حنفيات','أسعار معقولة'],             isVerified:false, responseTime:'25 دقيقة', hourlyRateEGP:120 },
      { id:'p4', name:'عادل كمال',       experience:10, rating:4.8, reviews:178, location:'مكة',           avatar:'ع.ك', specialties:['سباكة متقدمة','ضمان شامل'],                isVerified:true,  responseTime:'12 دقيقة', hourlyRateEGP:220 },
      { id:'p5', name:'نبيل حسين',       experience:3,  rating:3.4, reviews:22,  location:'الخبر',         avatar:'ن.ح', specialties:['سباكة بسيطة','أسعار منخفضة'],              isVerified:false, responseTime:'40 دقيقة', hourlyRateEGP:90  },
      { id:'p6', name:'وليد محمد',       experience:12, rating:4.9, reviews:234, location:'المدينة المنورة',avatar:'و.م', specialties:['خبير سباكة','مشاريع كبيرة'],               isVerified:true,  responseTime:'8 دقائق',  hourlyRateEGP:280 },
    ],
    electricity: [
      { id:'e1', name:'سامي أحمد',  experience:14, rating:5.0, reviews:312, location:'دبي',         avatar:'س.أ', specialties:['كهرباء منزلية','تركيب ثريات','صيانة كاملة'], isVerified:true,  responseTime:'10 دقائق', hourlyRateEGP:300 },
      { id:'e2', name:'فهد خالد',   experience:6,  rating:4.4, reviews:89,  location:'أبوظبي',      avatar:'ف.خ', specialties:['إصلاح أعطال','تمديدات كهربائية'],            isVerified:true,  responseTime:'18 دقيقة', hourlyRateEGP:180 },
      { id:'e3', name:'راشد سالم',  experience:4,  rating:3.7, reviews:38,  location:'الشارقة',     avatar:'ر.س', specialties:['كهرباء أساسية','توفير في السعر'],             isVerified:false, responseTime:'30 دقيقة', hourlyRateEGP:130 },
      { id:'e4', name:'باسم عماد',  experience:11, rating:4.8, reviews:198, location:'عجمان',       avatar:'ب.ع', specialties:['كهرباء صناعية','لوحات توزيع'],               isVerified:true,  responseTime:'12 دقيقة', hourlyRateEGP:260 },
      { id:'e5', name:'مازن يوسف', experience:3,  rating:3.3, reviews:19,  location:'رأس الخيمة', avatar:'م.ي', specialties:['أعمال بسيطة','سعر مناسب'],                   isVerified:false, responseTime:'45 دقيقة', hourlyRateEGP:100 },
      { id:'e6', name:'عصام جمال', experience:16, rating:5.0, reviews:402, location:'الفجيرة',     avatar:'ع.ج', specialties:['خبير كهرباء','أنظمة ذكية'],                   isVerified:true,  responseTime:'8 دقائق',  hourlyRateEGP:350 },
    ],
    carpentry: [
      { id:'ca1', name:'جمال حسن',    experience:18, rating:5.0, reviews:267, location:'القاهرة',    avatar:'ج.ح',  specialties:['نجارة فاخرة','تفصيل أثاث','ديكورات خشبية'], isVerified:true,  responseTime:'10 دقائق', hourlyRateEGP:280 },
      { id:'ca2', name:'إبراهيم علي', experience:8,  rating:4.5, reviews:98,  location:'الجيزة',     avatar:'إ.ع', specialties:['تصليح أثاث','دواليب'],                       isVerified:true,  responseTime:'20 دقيقة', hourlyRateEGP:160 },
      { id:'ca3', name:'كريم وائل',   experience:5,  rating:3.9, reviews:42,  location:'الإسكندرية',avatar:'ك.و', specialties:['نجارة عادية','أسعار معقولة'],                 isVerified:false, responseTime:'28 دقيقة', hourlyRateEGP:110 },
      { id:'ca4', name:'هاني سمير',   experience:13, rating:4.9, reviews:189, location:'المنصورة',   avatar:'هـ.س',specialties:['نجارة متقدمة','مطابخ','غرف نوم'],            isVerified:true,  responseTime:'12 دقيقة', hourlyRateEGP:240 },
      { id:'ca5', name:'شريف محمود',  experience:4,  rating:3.6, reviews:31,  location:'طنطا',       avatar:'ش.م', specialties:['أعمال بسيطة','صيانة أثاث'],                  isVerified:false, responseTime:'35 دقيقة', hourlyRateEGP:95  },
      { id:'ca6', name:'فادي أحمد',   experience:20, rating:5.0, reviews:356, location:'الزقازيق',   avatar:'ف.أ', specialties:['نجارة فنية','تصميمات خاصة','خبرة عالية'],    isVerified:true,  responseTime:'8 دقائق',  hourlyRateEGP:320 },
    ],
    appliances: [
      { id:'ap1', name:'رامي عبد الله', experience:12, rating:4.9, reviews:223, location:'الرياض',  avatar:'ر.ع', specialties:['ثلاجات','غسالات','مكيفات'],              isVerified:true,  responseTime:'15 دقيقة', hourlyRateEGP:220 },
      { id:'ap2', name:'صلاح الدين',    experience:7,  rating:4.3, reviews:87,  location:'جدة',     avatar:'ص.د', specialties:['أجهزة منزلية','صيانة سريعة'],            isVerified:true,  responseTime:'20 دقيقة', hourlyRateEGP:160 },
      { id:'ap3', name:'ياسر حسن',      experience:4,  rating:3.8, reviews:39,  location:'الدمام',  avatar:'ي.ح', specialties:['إصلاحات بسيطة','أسعار مناسبة'],          isVerified:false, responseTime:'32 دقيقة', hourlyRateEGP:110 },
      { id:'ap4', name:'عثمان فيصل',    experience:15, rating:5.0, reviews:278, location:'مكة',     avatar:'ع.ف', specialties:['خبير أجهزة','جميع الأنواع','ضمان شامل'], isVerified:true,  responseTime:'10 دقيقة', hourlyRateEGP:280 },
      { id:'ap5', name:'هشام علي',      experience:3,  rating:3.5, reviews:24,  location:'الخبر',   avatar:'هـ.ع',specialties:['صيانة عامة','سعر منخفض'],               isVerified:false, responseTime:'40 دقيقة', hourlyRateEGP:100 },
      { id:'ap6', name:'مصطفى جمال',    experience:10, rating:4.7, reviews:167, location:'المدينة المنورة', avatar:'م.ج', specialties:['أجهزة حديثة','تقنية متقدمة'], isVerified:true, responseTime:'12 دقيقة', hourlyRateEGP:200 },
    ],
    painting: [
      { id:'pa1', name:'زياد سامي',  experience:14, rating:4.8, reviews:198, location:'دبي',         avatar:'ز.س', specialties:['دهانات فاخرة','ديكورات','ورق حائط'], isVerified:true,  responseTime:'12 دقيقة', hourlyRateEGP:200 },
      { id:'pa2', name:'عماد حسين',  experience:6,  rating:4.2, reviews:76,  location:'أبوظبي',      avatar:'ع.ح', specialties:['دهان عادي','ألوان متنوعة'],           isVerified:true,  responseTime:'22 دقيقة', hourlyRateEGP:150 },
      { id:'pa3', name:'ناصر وليد',  experience:4,  rating:3.7, reviews:35,  location:'الشارقة',     avatar:'ن.و', specialties:['دهان بسيط','أسعار اقتصادية'],         isVerified:false, responseTime:'30 دقيقة', hourlyRateEGP:110 },
      { id:'pa4', name:'أسامة كريم', experience:16, rating:5.0, reviews:289, location:'عجمان',       avatar:'أ.ك', specialties:['دهان احترافي','تشطيبات راقية'],        isVerified:true,  responseTime:'10 دقيقة', hourlyRateEGP:280 },
      { id:'pa5', name:'علاء محمد',  experience:5,  rating:3.9, reviews:44,  location:'رأس الخيمة', avatar:'ع.م', specialties:['دهان منازل','سرعة في العمل'],          isVerified:false, responseTime:'28 دقيقة', hourlyRateEGP:130 },
      { id:'pa6', name:'إيهاب فادي', experience:11, rating:4.6, reviews:156, location:'الفجيرة',     avatar:'إ.ف', specialties:['دهان متقدم','ديكور داخلي'],            isVerified:true,  responseTime:'15 دقيقة', hourlyRateEGP:210 },
    ],
    moving: [
      { id:'m1', name:'بلال خالد',  experience:10, rating:4.7, reviews:142, location:'القاهرة',    avatar:'ب.خ', specialties:['نقل آمن','تغليف احترافي','فك وتركيب'], isVerified:true,  responseTime:'18 دقيقة', hourlyRateEGP:200 },
      { id:'m2', name:'سيف الدين',  experience:6,  rating:4.1, reviews:67,  location:'الجيزة',     avatar:'س.د', specialties:['نقل عفش','شاحنات متنوعة'],              isVerified:true,  responseTime:'25 دقيقة', hourlyRateEGP:150 },
      { id:'m3', name:'جابر محمود', experience:4,  rating:3.6, reviews:32,  location:'الإسكندرية', avatar:'ج.م', specialties:['نقل عادي','أسعار معقولة'],              isVerified:false, responseTime:'35 دقيقة', hourlyRateEGP:100 },
      { id:'m4', name:'تامر سعيد',  experience:13, rating:4.9, reviews:201, location:'المنصورة',   avatar:'ت.س', specialties:['نقل متخصص','عفش فاخر','ضمان كامل'],    isVerified:true,  responseTime:'12 دقيقة', hourlyRateEGP:250 },
      { id:'m5', name:'رضا أحمد',   experience:3,  rating:3.4, reviews:21,  location:'طنطا',       avatar:'ر.أ', specialties:['نقل بسيط','سعر منخفض'],                isVerified:false, responseTime:'42 دقيقة', hourlyRateEGP:85  },
      { id:'m6', name:'حازم وليد',  experience:15, rating:5.0, reviews:289, location:'الزقازيق',   avatar:'ح.و', specialties:['نقل دولي','خبرة عالية','تأمين شامل'], isVerified:true,  responseTime:'10 دقائق', hourlyRateEGP:300 },
    ],
  };

  // ── State ─────────────────────────────────────────────────
  let state = {
    serviceId: 'cleaning',
    currency: 'EGP',
    country: 'مصر',
    priceRange: [0, 500],
    experienceRange: [0, 20],
    minRating: 3,
    showFilters: false,
    jobDetails: null,
    workers: [],
    filteredWorkers: []
  };

  // ── DOM Elements ──────────────────────────────────────────
  const els = {};

  function cacheElements() {
    els.backBtn = document.getElementById('back-btn');
    els.backLabel = document.getElementById('back-label');
    els.themeToggle = document.getElementById('theme-toggle');
    els.profileBtn = document.getElementById('profile-btn');
    els.serviceTitle = document.getElementById('service-title');
    els.workersCount = document.getElementById('workers-count');
    els.mobileFilterToggle = document.getElementById('mobile-filter-toggle');
    els.filterToggleText = document.getElementById('filter-toggle-text');
    els.depositTotal = document.getElementById('deposit-total');
    els.depositSymbol = document.getElementById('deposit-symbol');
    els.depositPlatform = document.getElementById('deposit-platform');
    els.depositWorker = document.getElementById('deposit-worker');
    els.locationChip = document.getElementById('location-chip');
    els.locationText = document.getElementById('location-text');
    els.countryBadge = document.getElementById('country-badge');
    els.countryText = document.getElementById('country-text');
    els.currencyText = document.getElementById('currency-text');
    els.filtersSection = document.getElementById('filters-section');
    els.resetFilters = document.getElementById('reset-filters');
    els.priceMin = document.getElementById('price-min');
    els.priceMax = document.getElementById('price-max');
    els.priceFill = document.getElementById('price-fill');
    els.priceRangeLabel = document.getElementById('price-range-label');
    els.expMin = document.getElementById('exp-min');
    els.expMax = document.getElementById('exp-max');
    els.expFill = document.getElementById('exp-fill');
    els.expRangeLabel = document.getElementById('exp-range-label');
    els.ratingButtons = document.getElementById('rating-buttons');
    els.workersList = document.getElementById('workers-list');
    els.emptyState = document.getElementById('empty-state');
    els.loadMoreWrap = document.getElementById('load-more-wrap');
    els.emptyReset = document.getElementById('empty-reset');
    els.currencyLabels = document.querySelectorAll('.currency-label');
  }

  // ── Helpers ───────────────────────────────────────────────
  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function loadState() {
    // Service ID from URL
    state.serviceId = getParam('service') || 'cleaning';

    // Currency & Country from global storage
    const savedCountry = SAN3A.storage.get('country');
    const savedCurrency = SAN3A.storage.get('currency');
    state.country = savedCountry || 'مصر';
    state.currency = savedCurrency || SAN3A.currency.get(state.country).code;

    // Job details from storage (saved by booking.html)
    state.jobDetails = SAN3A.storage.get('jobDetails') || {};

    // Max price for currency
    const maxPrice = CURRENCY_MAX_PRICE[state.currency] || 500;
    state.priceRange = [0, maxPrice];
  }

  function getDeposit() {
    return DEPOSIT_STRUCTURE[state.serviceId]?.[state.currency] || DEPOSIT_STRUCTURE.cleaning.EGP;
  }

  function getWorkers() {
    const raw = ALL_WORKERS[state.serviceId] || ALL_WORKERS.cleaning;
    return raw.map(w => ({
      ...w,
      profession: PROFESSIONS[state.serviceId] || 'عامل',
      hourlyRate: toDisplay(w.hourlyRateEGP, state.currency)
    }));
  }

  function filterWorkers() {
    state.filteredWorkers = state.workers.filter(w =>
      w.hourlyRate >= state.priceRange[0] &&
      w.hourlyRate <= state.priceRange[1] &&
      w.experience >= state.experienceRange[0] &&
      w.experience <= state.experienceRange[1] &&
      w.rating >= state.minRating
    );
  }

  // ── Render ────────────────────────────────────────────────
  function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += '<i data-lucide="star" class="star-filled"></i>';
      } else {
        html += '<i data-lucide="star" class="star-empty"></i>';
      }
    }
    return html;
  }

  function renderSpecialties(specialties) {
    return specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('');
  }

  function renderWorkers() {
    if (state.filteredWorkers.length === 0) {
      els.workersList.classList.add('hidden');
      els.emptyState.classList.remove('hidden');
      els.loadMoreWrap.classList.add('hidden');
      return;
    }

    els.workersList.classList.remove('hidden');
    els.emptyState.classList.add('hidden');
    els.loadMoreWrap.classList.remove('hidden');

    const sym = CURRENCY_SYMBOLS[state.currency];

    els.workersList.innerHTML = state.filteredWorkers.map(w => `
      <article class="worker-card">
        <div class="worker-card-inner">
          <div class="worker-avatar">${w.avatar}</div>
          <div class="worker-info">
            <div class="worker-header">
              <div>
                <div class="worker-name-row">
                  <h3 class="worker-name">${w.name}</h3>
                  ${w.isVerified ? `<span class="badge-verified"><i data-lucide="shield-check" class="icon-xs"></i> موثق</span>` : ''}
                </div>
                <p class="worker-profession">${w.profession}</p>
              </div>
              <div class="price-box">
                <p class="price-label">السعر / ساعة</p>
                <p class="price-value">${w.hourlyRate}</p>
                <p class="price-currency">${sym}</p>
              </div>
            </div>

            <div class="worker-meta">
              <div class="meta-item">
                <i data-lucide="clock" class="meta-icon"></i>
                <span>${w.experience} سنوات خبرة</span>
              </div>
              <div class="meta-item">
                <i data-lucide="star" class="meta-icon" style="color:var(--yellow-500);fill:var(--yellow-500)"></i>
                <span class="meta-bold">${w.rating}</span>
                <span class="meta-muted">(${w.reviews} تقييم)</span>
              </div>
              <div class="meta-item">
                <i data-lucide="map-pin" class="meta-icon"></i>
                <span>${w.location}</span>
              </div>
              <div class="meta-item">
                <i data-lucide="phone" class="meta-icon"></i>
                <span>يرد خلال ${w.responseTime}</span>
              </div>
            </div>

            <div class="stars-display">
              ${renderStars(w.rating)}
            </div>

            <div class="specialties-list">
              ${renderSpecialties(w.specialties)}
            </div>

            <div class="card-actions">
              <button class="btn-outline-blue-sm" onclick="SAN3A.navigate('worker-profile', '${w.id}')">
                عرض البروفايل
              </button>
              <button class="btn-primary-sm" onclick="bookWorker('${w.id}')">
                احجز الآن
              </button>
            </div>
          </div>
        </div>
      </article>
    `).join('');

    // Re-init Lucide icons for new content
    if (window.lucide) lucide.createIcons();
  }

  function updateHeader() {
    const title = SERVICE_TITLES[state.serviceId] || 'خدمات منزلية';
    els.serviceTitle.textContent = `عمال ${title}`;
    els.workersCount.textContent = state.filteredWorkers.length;

    // Deposit info
    const deposit = getDeposit();
    const sym = CURRENCY_SYMBOLS[state.currency];
    els.depositTotal.textContent = deposit.total;
    els.depositSymbol.textContent = sym;
    els.depositPlatform.textContent = deposit.platform;
    els.depositWorker.textContent = deposit.worker;

    // Location chip
    const jd = state.jobDetails;
    if (jd && jd.street) {
      els.locationChip.classList.remove('hidden');
      els.locationText.textContent = `${jd.street}، ${jd.building || ''}، ${jd.unit || ''}`;
    } else {
      els.locationChip.classList.add('hidden');
    }

    // Country badge
    els.countryText.textContent = state.country;
    els.currencyText.textContent = sym;

    // Back button
    els.backLabel.textContent = 'تعديل التفاصيل';
  }

  function updateFiltersUI() {
    const maxPrice = CURRENCY_MAX_PRICE[state.currency] || 500;
    const step = state.currency === 'EGP' ? 10 : 5;

    // Update price slider attrs
    els.priceMin.max = maxPrice;
    els.priceMax.max = maxPrice;
    els.priceMin.step = step;
    els.priceMax.step = step;
    els.priceMin.value = state.priceRange[0];
    els.priceMax.value = state.priceRange[1];
    els.priceRangeLabel.textContent = `${state.priceRange[0]} - ${state.priceRange[1]}`;

    // Price fill
    const pricePercent1 = (state.priceRange[0] / maxPrice) * 100;
    const pricePercent2 = (state.priceRange[1] / maxPrice) * 100;
    els.priceFill.style.left = pricePercent1 + '%';
    els.priceFill.style.width = (pricePercent2 - pricePercent1) + '%';

    // Experience
    els.expMin.value = state.experienceRange[0];
    els.expMax.value = state.experienceRange[1];
    els.expRangeLabel.textContent = `${state.experienceRange[0]} - ${state.experienceRange[1]}`;

    const expPercent1 = (state.experienceRange[0] / 20) * 100;
    const expPercent2 = (state.experienceRange[1] / 20) * 100;
    els.expFill.style.left = expPercent1 + '%';
    els.expFill.style.width = (expPercent2 - expPercent1) + '%';

    // Rating buttons
    document.querySelectorAll('.rating-btn').forEach(btn => {
      const r = parseFloat(btn.dataset.rating);
      btn.classList.toggle('active', r === state.minRating);
    });

    // Currency labels
    els.currencyLabels.forEach(el => el.textContent = CURRENCY_SYMBOLS[state.currency]);
  }

  // ── Event Handlers ────────────────────────────────────────
  function handlePriceChange() {
    let min = parseInt(els.priceMin.value);
    let max = parseInt(els.priceMax.value);

    if (min > max) {
      const temp = min; min = max; max = temp;
    }

    state.priceRange = [min, max];
    updateFiltersUI();
    filterWorkers();
    renderWorkers();
    updateHeader();
  }

  function handleExpChange() {
    let min = parseInt(els.expMin.value);
    let max = parseInt(els.expMax.value);

    if (min > max) {
      const temp = min; min = max; max = temp;
    }

    state.experienceRange = [min, max];
    updateFiltersUI();
    filterWorkers();
    renderWorkers();
    updateHeader();
  }

  function handleRatingClick(rating) {
    state.minRating = rating;
    updateFiltersUI();
    filterWorkers();
    renderWorkers();
    updateHeader();
  }

  function resetFilters() {
    const maxPrice = CURRENCY_MAX_PRICE[state.currency] || 500;
    state.priceRange = [0, maxPrice];
    state.experienceRange = [0, 20];
    state.minRating = 3;
    updateFiltersUI();
    filterWorkers();
    renderWorkers();
    updateHeader();
  }

  function toggleMobileFilters() {
    state.showFilters = !state.showFilters;
    els.filtersSection.classList.toggle('collapsed', !state.showFilters);
    els.filterToggleText.textContent = state.showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر';
  }

  // ── Navigation ──────────────────────────────────────────
  window.bookWorker = function(workerId) {
    SAN3A.storage.set('selectedWorker', workerId);
    SAN3A.storage.set('bookingService', state.serviceId);
    // Navigate to booking-confirm.html (booking confirmation page)
    window.location.href = 'booking-confirm.html';
  };

  // ── Init ────────────────────────────────────────────────
  function init() {
    cacheElements();
    loadState();

    // Load workers
    state.workers = getWorkers();
    filterWorkers();

    // Initial render
    updateHeader();
    updateFiltersUI();
    renderWorkers();

    // Event listeners
    els.backBtn.addEventListener('click', () => window.history.back());
    els.profileBtn.addEventListener('click', () => SAN3A.navigate('profile'));
    els.resetFilters.addEventListener('click', resetFilters);
    els.emptyReset.addEventListener('click', resetFilters);
    els.mobileFilterToggle.addEventListener('click', toggleMobileFilters);

    // Price sliders
    els.priceMin.addEventListener('input', handlePriceChange);
    els.priceMax.addEventListener('input', handlePriceChange);

    // Experience sliders
    els.expMin.addEventListener('input', handleExpChange);
    els.expMax.addEventListener('input', handleExpChange);

    // Rating buttons
    document.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRatingClick(parseFloat(btn.dataset.rating)));
    });

    // Mobile: collapse filters by default
    if (window.innerWidth < 1024) {
      state.showFilters = false;
      els.filtersSection.classList.add('collapsed');
    }

    // Init Lucide icons
    if (window.lucide) lucide.createIcons();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();