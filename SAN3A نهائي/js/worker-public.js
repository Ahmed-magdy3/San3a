/* worker-public.js */

// Weekly schedule data
const WEEKLY_SCHEDULE = {
  "السبت": [
    { time: "08:00 - 09:00", status: "متاح", id: 1 },
    { time: "09:00 - 10:00", status: "متاح", id: 2 },
    { time: "10:00 - 11:00", status: "مشغول", client: "سارة أحمد", id: 3 },
    { time: "11:00 - 12:00", status: "متاح", id: 4 },
    { time: "12:00 - 13:00", status: "متاح", id: 5 },
    { time: "13:00 - 14:00", status: "متاح", id: 6 },
    { time: "14:00 - 15:00", status: "مشغول", client: "محمد علي", id: 7 },
    { time: "15:00 - 16:00", status: "متاح", id: 8 },
    { time: "16:00 - 17:00", status: "متاح", id: 9 },
    { time: "17:00 - 18:00", status: "متاح", id: 10 },
    { time: "18:00 - 19:00", status: "متاح", id: 11 },
    { time: "19:00 - 20:00", status: "مشغول", client: "خالد أحمد", id: 12 },
  ],
  "الأحد": [
    { time: "08:00 - 09:00", status: "متاح", id: 13 },
    { time: "09:00 - 10:00", status: "مشغول", client: "فاطمة حسن", id: 14 },
    { time: "10:00 - 11:00", status: "متاح", id: 15 },
    { time: "11:00 - 12:00", status: "متاح", id: 16 },
    { time: "12:00 - 13:00", status: "متاح", id: 17 },
    { time: "13:00 - 14:00", status: "متاح", id: 18 },
    { time: "14:00 - 15:00", status: "متاح", id: 19 },
    { time: "15:00 - 16:00", status: "مشغول", client: "عمر سعيد", id: 20 },
    { time: "16:00 - 17:00", status: "متاح", id: 21 },
    { time: "17:00 - 18:00", status: "متاح", id: 22 },
    { time: "18:00 - 19:00", status: "متاح", id: 23 },
    { time: "19:00 - 20:00", status: "مشغول", client: "خالد إبراهيم", id: 24 },
  ],
  "الاثنين": [
    { time: "08:00 - 09:00", status: "مشغول", client: "نورة السالم", id: 25 },
    { time: "09:00 - 10:00", status: "متاح", id: 26 },
    { time: "10:00 - 11:00", status: "متاح", id: 27 },
    { time: "11:00 - 12:00", status: "متاح", id: 28 },
    { time: "12:00 - 13:00", status: "مشغول", client: "أحمد ناصر", id: 29 },
    { time: "13:00 - 14:00", status: "متاح", id: 30 },
    { time: "14:00 - 15:00", status: "متاح", id: 31 },
    { time: "15:00 - 16:00", status: "مشغول", client: "عبدالله محمود", id: 32 },
    { time: "16:00 - 17:00", status: "متاح", id: 33 },
    { time: "17:00 - 18:00", status: "متاح", id: 34 },
    { time: "18:00 - 19:00", status: "متاح", id: 35 },
    { time: "19:00 - 20:00", status: "متاح", id: 36 },
  ],
  "الثلاثاء": [
    { time: "08:00 - 09:00", status: "متاح", id: 37 },
    { time: "09:00 - 10:00", status: "متاح", id: 38 },
    { time: "10:00 - 11:00", status: "مشغول", client: "مريم خالد", id: 39 },
    { time: "11:00 - 12:00", status: "متاح", id: 40 },
    { time: "12:00 - 13:00", status: "متاح", id: 41 },
    { time: "13:00 - 14:00", status: "متاح", id: 42 },
    { time: "14:00 - 15:00", status: "متاح", id: 43 },
    { time: "15:00 - 16:00", status: "متاح", id: 44 },
    { time: "16:00 - 17:00", status: "مشغول", client: "ياسر حسام", id: 45 },
    { time: "17:00 - 18:00", status: "متاح", id: 46 },
    { time: "18:00 - 19:00", status: "متاح", id: 47 },
    { time: "19:00 - 20:00", status: "متاح", id: 48 },
  ],
  "الأربعاء": [
    { time: "08:00 - 09:00", status: "متاح", id: 49 },
    { time: "09:00 - 10:00", status: "متاح", id: 50 },
    { time: "10:00 - 11:00", status: "مشغول", client: "ليلى أحمد", id: 51 },
    { time: "11:00 - 12:00", status: "متاح", id: 52 },
    { time: "12:00 - 13:00", status: "مشغول", client: "طارق فيصل", id: 53 },
    { time: "13:00 - 14:00", status: "متاح", id: 54 },
    { time: "14:00 - 15:00", status: "متاح", id: 55 },
    { time: "15:00 - 16:00", status: "متاح", id: 56 },
    { time: "16:00 - 17:00", status: "متاح", id: 57 },
    { time: "17:00 - 18:00", status: "متاح", id: 58 },
    { time: "18:00 - 19:00", status: "مشغول", client: "سلمى حسين", id: 59 },
    { time: "19:00 - 20:00", status: "متاح", id: 60 },
  ],
  "الخميس": [
    { time: "08:00 - 09:00", status: "مشغول", client: "رانيا سعيد", id: 61 },
    { time: "09:00 - 10:00", status: "متاح", id: 62 },
    { time: "10:00 - 11:00", status: "متاح", id: 63 },
    { time: "11:00 - 12:00", status: "متاح", id: 64 },
    { time: "12:00 - 13:00", status: "متاح", id: 65 },
    { time: "13:00 - 14:00", status: "مشغول", client: "يوسف علي", id: 66 },
    { time: "14:00 - 15:00", status: "متاح", id: 67 },
    { time: "15:00 - 16:00", status: "متاح", id: 68 },
    { time: "16:00 - 17:00", status: "متاح", id: 69 },
    { time: "17:00 - 18:00", status: "متاح", id: 70 },
    { time: "18:00 - 19:00", status: "متاح", id: 71 },
    { time: "19:00 - 20:00", status: "مشغول", client: "حسن كريم", id: 72 },
  ],
  "الجمعة": [
    { time: "12:00 - 13:00", status: "متاح", id: 73 },
    { time: "13:00 - 14:00", status: "متاح", id: 74 },
    { time: "14:00 - 15:00", status: "متاح", id: 75 },
    { time: "15:00 - 16:00", status: "مشغول", client: "منى عادل", id: 76 },
    { time: "16:00 - 17:00", status: "متاح", id: 77 },
    { time: "17:00 - 18:00", status: "متاح", id: 78 },
    { time: "18:00 - 19:00", status: "متاح", id: 79 },
    { time: "19:00 - 20:00", status: "مشغول", client: "بدر فهد", id: 80 },
  ],
};

const DAYS_ORDER = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

const REVIEWS = [
  { id: 1, clientName: "سارة أحمد", rating: 5, comment: "عمل ممتاز ودقة في المواعيد. أنصح بالتعامل معه بشدة", date: "منذ يومين" },
  { id: 2, clientName: "محمد الخالدي", rating: 5, comment: "محترف جداً وسريع في إنجاز العمل. شكراً لك", date: "منذ أسبوع" },
  { id: 3, clientName: "نورة السالم", rating: 4, comment: "جيد جداً، لكن تأخر قليلاً عن الموعد المحدد", date: "منذ أسبوعين" },
  { id: 4, clientName: "عبدالله محمود", rating: 5, comment: "ممتاز في التعامل والعمل نظيف جداً. سأتعامل معه مرة أخرى", date: "منذ شهر" },
];

let selectedDay = "السبت";
let currentWorker = null;

document.addEventListener('DOMContentLoaded', () => {
  // Get worker from URL params or storage
  const urlParams = new URLSearchParams(window.location.search);
  const workerId = urlParams.get('id');
  const serviceId = urlParams.get('service');

  // Try to get worker data from storage first
  const storedWorker = SAN3A.storage.get('selectedWorker');

  if (storedWorker && storedWorker.id === workerId) {
    currentWorker = storedWorker;
  } else {
    // Find worker from WORKERS data
    currentWorker = findWorker(workerId, serviceId);
  }

  if (currentWorker) {
    renderWorkerInfo();
  }

  // Render schedule
  renderDaysTabs();
  renderTimeSlots();

  // Render reviews
  renderReviews();
});

function findWorker(workerId, serviceId) {
  // Search in all service categories
  for (const service in WORKERS) {
    const worker = WORKERS[service].find(w => w.id === workerId);
    if (worker) {
      return {
        ...worker,
        service: service,
        profession: PROFESSIONS[service] || 'عامل',
        serviceName: SERVICE_TITLES[service] || 'خدمة'
      };
    }
  }
  // Return default demo worker if not found
  return {
    id: workerId || 'c1',
    name: 'أحمد محمد السيد',
    profession: 'عامل تنظيف',
    exp: 8,
    rate: 4.9,
    rev: 127,
    loc: 'القاهرة، مصر',
    av: 'أ.م',
    specs: ['تنظيف شامل', 'تعقيم', 'تلميع', 'نوافذ'],
    ver: true,
    resp: '15 دقيقة',
    hr: 150,
    jobs: 156,
    bio: 'عامل تنظيف محترف مع خبرة 8 سنوات في تنظيف المنازل والمكاتب. ملتزم بتقديم خدمة عالية الجودة ودقة في المواعيد.',
    phone: '+20 100 123 4567',
    country: 'مصر'
  };
}

function renderWorkerInfo() {
  const w = currentWorker;
  const currency = SAN3A.currency.get(w.country || 'مصر');

  document.getElementById('worker-avatar').textContent = w.av || w.name.split(' ').map(n => n[0]).join('.');
  document.getElementById('worker-name').textContent = w.name;
  document.getElementById('worker-profession').textContent = w.profession;
  document.getElementById('worker-bio').textContent = w.bio || `عامل ${w.profession} محترف مع خبرة ${w.exp} سنوات.`;
  document.getElementById('worker-rating').textContent = w.rate;
  document.getElementById('worker-reviews').textContent = `(${w.rev} تقييم)`;
  document.getElementById('worker-jobs').textContent = w.jobs || Math.round(w.rev * 1.2);
  document.getElementById('worker-exp').textContent = w.exp;
  document.getElementById('worker-location').textContent = w.loc + (w.country ? '، ' + w.country : '');
  document.getElementById('worker-phone').textContent = w.phone || '+20 100 123 4567';
  document.getElementById('worker-rate').textContent = w.hr + ' ' + currency.symbol + '/ساعة';

  // Verified badge
  const badge = document.getElementById('verified-badge');
  if (w.ver) {
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  // Stars
  const starsContainer = document.getElementById('worker-stars');
  starsContainer.innerHTML = renderStars(Math.round(w.rate));

  // Specialties
  const specsContainer = document.getElementById('specialties-list');
  specsContainer.innerHTML = (w.specs || []).map(spec => `
    <span class="specialty-badge inline-flex items-center px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium">
      ${spec}
    </span>
  `).join('');
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      html += '<svg class="w-5 h-5 star-filled" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    } else {
      html += '<svg class="w-5 h-5 star-empty" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    }
  }
  return html;
}

function renderDaysTabs() {
  const container = document.getElementById('days-tabs');
  container.innerHTML = DAYS_ORDER.map(day => `
    <button onclick="selectDay('${day}')" 
      class="day-tab px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${day === selectedDay ? 'active bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
      ${day}
    </button>
  `).join('');
}

function selectDay(day) {
  selectedDay = day;
  renderDaysTabs();
  renderTimeSlots();
}

function renderTimeSlots() {
  const container = document.getElementById('slots-grid');
  const slots = WEEKLY_SCHEDULE[selectedDay] || [];

  container.innerHTML = slots.map(slot => {
    const isAvailable = slot.status === 'متاح';
    return `
      <div class="slot-card p-4 rounded-xl border-2 ${isAvailable ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600' : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600'}">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
            <span class="font-bold text-sm text-gray-900 dark:text-white">${slot.time}</span>
          </div>
          ${isAvailable 
            ? '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
            : '<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
          }
        </div>
        <div class="text-sm">
          ${isAvailable 
            ? '<span class="font-medium text-green-700 dark:text-green-400">متاح للحجز</span>'
            : `<span class="font-medium text-red-700 dark:text-red-400">محجوز</span>`
          }
        </div>
      </div>
    `;
  }).join('');
}

function renderReviews() {
  const container = document.getElementById('reviews-list');
  container.innerHTML = REVIEWS.map(review => `
    <div class="review-card p-4 rounded-xl border border-gray-100 dark:border-gray-700">
      <div class="flex items-start justify-between mb-2">
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white">${review.clientName}</h4>
          <div class="flex items-center gap-1 mt-1">
            ${renderStars(review.rating)}
          </div>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">${review.date}</span>
      </div>
      <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">${review.comment}</p>
    </div>
  `).join('');
}

function bookWorker() {
  if (!currentWorker) return;

  // Store selected worker for booking flow
  SAN3A.storage.set('selectedWorker', currentWorker);

  // Navigate to booking page with worker and service params
  const params = new URLSearchParams();
  params.set('worker', currentWorker.id);
  params.set('service', currentWorker.service || 'cleaning');

  window.location.href = 'booking-confirm.html?' + params.toString();
}

function goBack() {
  // Check if we came from worker-details
  const referrer = document.referrer;
  if (referrer && referrer.includes('worker-details')) {
    window.history.back();
  } else {
    SAN3A.navigate('worker-details');
  }
}