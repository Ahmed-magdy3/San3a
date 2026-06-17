/* profile.js */

// Demo bookings data
const DEMO_BOOKINGS = [
  {
    id: 'b1',
    service: 'تنظيف المنزل',
    worker: 'أحمد محمد السيد',
    date: '2024-01-15',
    time: '10:00',
    price: 350,
    status: 'completed',
    rating: 4,
    currency: 'ج.م'
  },
  {
    id: 'b2',
    service: 'السباكة',
    worker: 'محمد عبد الله حسن',
    date: '2024-01-10',
    time: '14:00',
    price: 420,
    status: 'completed',
    rating: 4,
    currency: 'ج.م'
  },
  {
    id: 'b3',
    service: 'الكهرباء',
    worker: 'خالد إبراهيم علي',
    date: '2024-01-08',
    time: '09:00',
    price: 0,
    status: 'cancelled',
    rating: 0,
    currency: 'ج.م'
  },
  {
    id: 'b4',
    service: 'النجارة',
    worker: 'عمر حسام الدين',
    date: '2024-01-20',
    time: '11:00',
    price: 720,
    status: 'scheduled',
    rating: 0,
    currency: 'ج.م'
  },
  {
    id: 'b5',
    service: 'تنظيف المنزل',
    worker: 'يوسف أحمد',
    date: '2024-01-25',
    time: '14:00',
    price: 400,
    status: 'pending_payment',
    depositPaid: 80,
    remaining: 320,
    rating: 0,
    currency: 'ج.م'
  }
];

const STATUS_CONFIG = {
  completed: { label: 'مكتمل', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: 'check' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: 'x' },
  scheduled: { label: 'محدول', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: 'clock' },
  pending_payment: { label: 'بانتظار الدفع', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: 'clock' }
};

let isEditMode = false;

document.addEventListener('DOMContentLoaded', () => {
  // Load saved profile if exists
  const savedProfile = SAN3A.storage.get('profile');
  if (savedProfile) {
    document.getElementById('full-name').value = savedProfile.name || 'محمد أحمد عبد الله';
    document.getElementById('phone').value = savedProfile.phone || '+20 123 456 7890';
    document.getElementById('email').value = savedProfile.email || 'mohammed.ahmed@email.com';
    document.getElementById('city').value = savedProfile.city || 'القاهرة';
    document.getElementById('address').value = savedProfile.address || 'مدينة نصر، الحي الثامن';
    updateAvatar(savedProfile.name || 'محمد أحمد عبد الله');
  }

  // Render bookings
  renderBookings();

  // Load saved toggles
  const settings = SAN3A.storage.get('settings') || {};
  if (settings.notifications !== undefined) document.getElementById('notif-toggle').checked = settings.notifications;
  if (settings.sms !== undefined) document.getElementById('sms-toggle').checked = settings.sms;
  if (settings.offers !== undefined) document.getElementById('offers-toggle').checked = settings.offers;

  // Save toggles on change
  ['notif-toggle', 'sms-toggle', 'offers-toggle'].forEach(id => {
    document.getElementById(id).addEventListener('change', saveSettings);
  });

  // Personal form submit
  document.getElementById('personal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const profile = {
      name: document.getElementById('full-name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      city: document.getElementById('city').value,
      address: document.getElementById('address').value
    };
    SAN3A.storage.set('profile', profile);
    updateAvatar(profile.name);
    toggleEditMode();
    SAN3A.toast('تم حفظ التغييرات بنجاح!', 'success');
  });
});

function updateAvatar(name) {
  const parts = name.trim().split(' ');
  const avatar = parts.length >= 2 ? parts[0][0] + '.' + parts[1][0] : parts[0][0] + '.';
  document.getElementById('profile-avatar').textContent = avatar;
  document.getElementById('profile-name').textContent = name;
}

function switchTab(tabName) {
  // Hide all panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  // Show selected panel
  document.getElementById('panel-' + tabName).classList.remove('hidden');

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-white', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white', 'shadow-sm');
    btn.classList.add('text-gray-500', 'dark:text-gray-400');
  });
  const activeBtn = document.getElementById('tab-' + tabName);
  activeBtn.classList.remove('text-gray-500', 'dark:text-gray-400');
  activeBtn.classList.add('bg-white', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white', 'shadow-sm');
}

function toggleEditMode() {
  isEditMode = !isEditMode;
  const inputs = document.querySelectorAll('.profile-input');
  const saveActions = document.getElementById('save-actions');
  const editBtnText = document.getElementById('edit-btn-text');

  inputs.forEach(input => {
    input.disabled = !isEditMode;
    if (isEditMode) {
      input.classList.add('ring-2', 'ring-blue-500', 'border-blue-500');
    } else {
      input.classList.remove('ring-2', 'ring-blue-500', 'border-blue-500');
    }
  });

  saveActions.classList.toggle('hidden', !isEditMode);
  editBtnText.textContent = isEditMode ? 'إلغاء' : 'تعديل';
}

function renderBookings() {
  const container = document.getElementById('bookings-list');
  const bookings = SAN3A.storage.get('bookings') || DEMO_BOOKINGS;

  if (!bookings.length) {
    container.innerHTML = '<div class="text-center py-10 text-gray-500 dark:text-gray-400">لا توجد حجوزات حالياً</div>';
    return;
  }

  container.innerHTML = bookings.map(booking => {
    const status = STATUS_CONFIG[booking.status];
    const stars = booking.rating ? renderStars(booking.rating) : '';

    let actions = '';
    if (booking.status === 'scheduled') {
      actions = `
        <div class="flex gap-2 mt-3">
          <button onclick="cancelBooking('${booking.id}')" class="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">إلغاء الحجز</button>
          <button onclick="SAN3A.toast('سيتم فتح نافذة تعديل الموعد', 'info')" class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">تعديل الموعد</button>
        </div>
      `;
    } else if (booking.status === 'pending_payment') {
      actions = `
        <div class="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-amber-700 dark:text-amber-400">التكلفة:</span>
            <span class="font-bold text-amber-800 dark:text-amber-300">${booking.price} ${booking.currency}</span>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-amber-700 dark:text-amber-400">تم دفع الحجز:</span>
            <span class="font-bold text-amber-800 dark:text-amber-300">${booking.depositPaid} ${booking.currency}</span>
          </div>
          <div class="flex justify-between text-sm mb-3">
            <span class="text-amber-700 dark:text-amber-400">المبلغ المتبقي:</span>
            <span class="font-bold text-amber-800 dark:text-amber-300">${booking.remaining} ${booking.currency}</span>
          </div>
          <button onclick="payRemaining('${booking.id}')" class="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            دفع المبلغ المتبقي
          </button>
        </div>
      `;
    }

    return `
      <div class="p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all bg-white dark:bg-gray-800/50">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white text-lg">${booking.service}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">${booking.worker}</p>
          </div>
          <span class="status-badge ${status.color}">
            ${status.icon === 'check' ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : 
              status.icon === 'x' ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>' : 
              '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>'}
            ${status.label}
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${booking.date}
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
            ${booking.time}
          </div>
          ${booking.price > 0 ? `<div class="flex items-center gap-1.5"><span class="font-medium text-gray-700 dark:text-gray-300">التكلفة:</span> <span class="font-bold text-gray-900 dark:text-white">${booking.price} ${booking.currency}</span></div>` : ''}
        </div>
        ${booking.rating ? `<div class="flex items-center gap-2 mb-2"><span class="text-sm text-gray-500 dark:text-gray-400">تقييمك:</span><div class="star-rating">${stars}</div></div>` : ''}
        ${actions}
      </div>
    `;
  }).join('');
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      html += '<svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    } else {
      html += '<svg class="w-5 h-5 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    }
  }
  return html;
}

function payRemaining(bookingId) {
  const bookings = SAN3A.storage.get('bookings') || DEMO_BOOKINGS;
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;

  // Store booking data for final payment page
  SAN3A.storage.set('booking', {
    workerName: booking.worker,
    serviceName: booking.service,
    date: booking.date,
    time: booking.time,
    country: localStorage.getItem('san3a-country') || 'مصر',
    totalPrice: booking.price,
    depositPaid: booking.depositPaid,
    remaining: booking.remaining,
    bookingId: booking.id
  });

  SAN3A.navigate('final-payment');
}

function cancelBooking(bookingId) {
  if (!confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) return;

  let bookings = SAN3A.storage.get('bookings') || DEMO_BOOKINGS;
  bookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b);
  SAN3A.storage.set('bookings', bookings);
  renderBookings();
  SAN3A.toast('تم إلغاء الحجز بنجاح', 'success');
}

function saveSettings() {
  const settings = {
    notifications: document.getElementById('notif-toggle').checked,
    sms: document.getElementById('sms-toggle').checked,
    offers: document.getElementById('offers-toggle').checked
  };
  SAN3A.storage.set('settings', settings);
}

function deleteAccount() {
  if (!confirm('هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.')) return;
  if (!confirm('تأكيد نهائي: سيتم حذف جميع بياناتك وبيانات حجوزاتك. متأكد؟')) return;

  // Clear all san3a data
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('san3a-')) localStorage.removeItem(key);
  });

  SAN3A.toast('تم حذف الحساب بنجاح', 'success');
  setTimeout(() => {
    SAN3A.navigate('index');
  }, 1500);
}