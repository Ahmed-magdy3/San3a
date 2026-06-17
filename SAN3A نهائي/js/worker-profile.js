/* worker-profile.js */

// Mock worker data
const WORKER_DATA = {
  name: "أحمد الخالدي",
  profession: "فني كهربائي",
  email: "ahmed.alkhalidi@email.com",
  phone: "+966 50 123 4567",
  yearsOfExperience: 8,
  city: "الرياض، المملكة العربية السعودية",
  rating: 4.8,
  totalReviews: 124,
  completedJobs: 156,
  joinDate: "يناير 2020",
  avatar: "أ.خ"
};

// Mock bookings data
const MOCK_BOOKINGS = [
  {
    id: 1,
    clientName: "سارة أحمد",
    service: "صيانة كهربائية",
    date: "2024-01-15",
    time: "2:30 مساءً",
    status: "مقبول",
    location: "شارع الملك فهد، الرياض",
    earnings: 450
  },
  {
    id: 2,
    clientName: "محمد علي",
    service: "تركيب إضاءة",
    date: "2024-01-16",
    time: "10:00 صباحاً",
    status: "قيد الانتظار",
    location: "حي النخيل، جدة",
    earnings: 320
  },
  {
    id: 3,
    clientName: "فاطمة السالم",
    service: "فحص كهربائي شامل",
    date: "2024-01-14",
    time: "4:00 مساءً",
    status: "مكتمل",
    location: "العليا، الرياض",
    earnings: 280
  },
  {
    id: 4,
    clientName: "عبدالله محمود",
    service: "إصلاح لوحة كهربائية",
    date: "2024-01-13",
    time: "11:00 صباحاً",
    status: "ملغي",
    location: "الخبر، الشرقية",
    earnings: 0
  }
];

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: 1,
    clientName: "سارة أحمد",
    rating: 5,
    comment: "عمل ممتاز ودقة في المواعيد. أنصح بالتعامل معه بشدة",
    date: "منذ يومين"
  },
  {
    id: 2,
    clientName: "محمد الخالدي",
    rating: 5,
    comment: "محترف جداً وسريع في إنجاز العمل. شكراً لك",
    date: "منذ أسبوع"
  },
  {
    id: 3,
    clientName: "نورة السالم",
    rating: 4,
    comment: "جيد جداً، لكن تأخر قليلاً عن الموعد المحدد",
    date: "منذ أسبوعين"
  },
  {
    id: 4,
    clientName: "عبدالله محمود",
    rating: 5,
    comment: "ممتاز في التعامل والعمل نظيف جداً. سأتعامل معه مرة أخرى",
    date: "منذ شهر"
  },
  {
    id: 5,
    clientName: "خالد العتيبي",
    rating: 5,
    comment: "سريع ومحترف. أسعاره معقولة جداً",
    date: "منذ شهرين"
  }
];

// Earnings data by service
const EARNINGS_BY_SERVICE = [
  { service: "صيانة كهربائية", amount: 5200, count: 18, color: "blue" },
  { service: "تركيب إضاءة", amount: 3800, count: 12, color: "green" },
  { service: "فحص كهربائي شامل", amount: 2800, count: 10, color: "purple" },
  { service: "إصلاح لوحة كهربائية", amount: 1900, count: 7, color: "yellow" },
  { service: "تمديدات كهربائية", amount: 4750, count: 15, color: "pink" }
];

// Notifications
const NOTIFICATIONS = [
  { id: 1, text: "طلب جديد من سارة أحمد - صيانة كهربائية", time: "منذ 5 دقائق", unread: true },
  { id: 2, text: "تم تقييمك من محمد الخالدي - 5 نجوم", time: "منذ ساعة", unread: true },
  { id: 3, text: "تم إكمال طلب فاطمة السالم بنجاح", time: "منذ 3 ساعات", unread: true }
];

let currentWorker = { ...WORKER_DATA };

document.addEventListener('DOMContentLoaded', () => {
  // Load worker data from storage if available
  const storedUser = SAN3A.storage.get('user');
  if (storedUser && storedUser.type === 'عامل') {
    currentWorker.name = storedUser.name || currentWorker.name;
    currentWorker.email = storedUser.email || currentWorker.email;
    currentWorker.phone = storedUser.phone || currentWorker.phone;
  }

  renderProfile();
  renderBookings();
  renderReviews();
  renderEarnings();
  renderNotifications();
});

function renderProfile() {
  document.getElementById('worker-avatar').textContent = currentWorker.avatar;
  document.getElementById('worker-name').textContent = currentWorker.name;
  document.getElementById('worker-profession').textContent = currentWorker.profession;
  document.getElementById('worker-rating').textContent = currentWorker.rating;
  document.getElementById('worker-reviews').textContent = `(${currentWorker.totalReviews} تقييم)`;
  document.getElementById('worker-jobs').textContent = currentWorker.completedJobs;
  document.getElementById('join-date').textContent = currentWorker.joinDate;

  // Stars
  document.getElementById('worker-stars').innerHTML = renderStars(Math.round(currentWorker.rating));

  // Info cards
  document.getElementById('info-name').textContent = currentWorker.name;
  document.getElementById('info-email').textContent = currentWorker.email;
  document.getElementById('info-phone').textContent = currentWorker.phone;
  document.getElementById('info-profession').textContent = currentWorker.profession;
  document.getElementById('info-exp').textContent = currentWorker.yearsOfExperience + ' سنوات';
  document.getElementById('info-city').textContent = currentWorker.city;
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

function getStatusConfig(status) {
  const configs = {
    'مقبول': { class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800', icon: 'check' },
    'قيد الانتظار': { class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800', icon: 'clock' },
    'مكتمل': { class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800', icon: 'check' },
    'ملغي': { class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800', icon: 'x' }
  };
  return configs[status] || configs['قيد الانتظار'];
}

function getStatusIcon(icon) {
  const icons = {
    check: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>',
    clock: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>',
    x: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
  };
  return icons[icon] || icons.clock;
}

function renderBookings() {
  const container = document.getElementById('bookings-list');
  container.innerHTML = MOCK_BOOKINGS.map(booking => {
    const status = getStatusConfig(booking.status);
    return `
      <div class="booking-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span class="text-gray-700 dark:text-gray-300 font-bold">${booking.clientName.charAt(0)}</span>
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">${booking.clientName}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">${booking.service}</p>
            </div>
          </div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.class}">
            ${getStatusIcon(status.icon)}
            ${booking.status}
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${booking.date} - ${booking.time}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>${booking.location}</span>
          </div>
        </div>
        ${booking.earnings > 0 ? `
          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p class="text-sm text-green-600 dark:text-green-400 font-medium">الدخل: ${booking.earnings} ر.س</p>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderReviews() {
  // Stars in header
  document.getElementById('reviews-stars').innerHTML = renderStars(Math.round(currentWorker.rating));

  const container = document.getElementById('reviews-list');
  container.innerHTML = MOCK_REVIEWS.map(review => `
    <div class="review-card p-4 rounded-xl border border-gray-100 dark:border-gray-700">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <span class="text-blue-700 dark:text-blue-400 font-bold">${review.clientName.charAt(0)}</span>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white">${review.clientName}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">${review.date}</p>
          </div>
        </div>
        <div class="flex gap-0.5">
          ${renderStars(review.rating)}
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
        <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">${review.comment}</p>
      </div>
    </div>
  `).join('');
}

function renderEarnings() {
  const totalEarnings = EARNINGS_BY_SERVICE.reduce((acc, s) => acc + s.amount, 0);
  const totalServices = EARNINGS_BY_SERVICE.reduce((acc, s) => acc + s.count, 0);
  const avgEarnings = Math.round(totalEarnings / totalServices);
  const topService = EARNINGS_BY_SERVICE.reduce((max, s) => s.amount > max.amount ? s : max);

  // Update stats
  document.getElementById('total-earnings').textContent = totalEarnings.toLocaleString() + ' ر.س';
  document.getElementById('avg-earnings').textContent = avgEarnings.toLocaleString() + ' ر.س';
  document.getElementById('top-service').textContent = topService.service;
  document.getElementById('top-service-amount').textContent = topService.amount.toLocaleString() + ' ر.س';

  // Render chart bars
  const maxAmount = Math.max(...EARNINGS_BY_SERVICE.map(s => s.amount));
  const container = document.getElementById('earnings-chart');

  container.innerHTML = EARNINGS_BY_SERVICE.map(item => {
    const percentage = (item.amount / maxAmount) * 100;
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500',
      pink: 'bg-pink-500'
    };
    const barColor = colorClasses[item.color] || 'bg-blue-500';

    return `
      <div class="flex items-center gap-3">
        <div class="w-32 sm:w-40 text-right shrink-0">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">${item.service}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">${item.count} خدمة</p>
        </div>
        <div class="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <div class="earnings-bar h-full ${barColor} rounded-lg flex items-center justify-end px-2" style="width: ${percentage}%">
            <span class="text-xs text-white font-bold">${item.amount.toLocaleString()} ر.س</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateEarnings() {
  const period = document.getElementById('earnings-period').value;
  // In real app: fetch earnings based on period from API
  // For now: just show toast
  const periodText = {
    'all': 'الكل',
    'month': 'هذا الشهر',
    'year': 'هذا العام'
  };
  SAN3A.toast(`تم تحديث التحليل: ${periodText[period]}`, 'success');
}

function openEditModal() {
  const modal = document.getElementById('edit-modal');

  // Fill form with current data
  document.getElementById('edit-name').value = currentWorker.name;
  document.getElementById('edit-profession').value = currentWorker.profession;
  document.getElementById('edit-email').value = currentWorker.email;
  document.getElementById('edit-phone').value = currentWorker.phone;
  document.getElementById('edit-city').value = currentWorker.city;
  document.getElementById('edit-exp-display').textContent = currentWorker.yearsOfExperience + ' سنوات';

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  const modal = document.getElementById('edit-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function saveProfile() {
  const name = document.getElementById('edit-name').value;
  const profession = document.getElementById('edit-profession').value;
  const email = document.getElementById('edit-email').value;
  const phone = document.getElementById('edit-phone').value;
  const city = document.getElementById('edit-city').value;

  // Update current worker
  currentWorker.name = name;
  currentWorker.profession = profession;
  currentWorker.email = email;
  currentWorker.phone = phone;
  currentWorker.city = city;

  // Save to storage
  const user = SAN3A.storage.get('user') || {};
  user.name = name;
  user.email = email;
  user.phone = phone;
  SAN3A.storage.set('user', user);

  // Re-render
  renderProfile();
  closeEditModal();
  SAN3A.toast('تم حفظ التغييرات بنجاح', 'success');
}

function showNotifications() {
  const modal = document.getElementById('notifications-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Mark all as read
  NOTIFICATIONS.forEach(n => n.unread = false);
  renderNotifications();

  // Hide badge
  document.getElementById('notif-badge').style.display = 'none';
}

function closeNotifications() {
  const modal = document.getElementById('notifications-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderNotifications() {
  const container = document.getElementById('notifications-list');
  if (NOTIFICATIONS.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">لا توجد إشعارات جديدة</p>
      </div>
    `;
    return;
  }

  container.innerHTML = NOTIFICATIONS.map(notif => `
    <div class="notif-item p-3 rounded-xl ${notif.unread ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700/50'} flex items-start gap-3">
      <div class="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0 ${notif.unread ? '' : 'hidden'}"></div>
      <div class="flex-1">
        <p class="text-sm text-gray-700 dark:text-gray-300">${notif.text}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${notif.time}</p>
      </div>
    </div>
  `).join('');
}

function toggleSettings() {
  const dropdown = document.getElementById('settings-dropdown');
  dropdown.classList.toggle('hidden');
}

function logout() {
  SAN3A.storage.remove('user');
  SAN3A.toast('تم تسجيل الخروج بنجاح', 'success');
  setTimeout(() => SAN3A.navigate('login'), 1500);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('settings-dropdown');
  const settingsBtn = document.querySelector('[onclick="toggleSettings()"]');
  if (!dropdown.contains(e.target) && e.target !== settingsBtn && !settingsBtn.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeEditModal();
    closeNotifications();
  }
});