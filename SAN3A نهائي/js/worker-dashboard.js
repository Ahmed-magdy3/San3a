/* worker-dashboard.js */

// Mock data for service requests
const MOCK_REQUESTS = [
  {
    id: 1,
    clientName: "أحمد محمد",
    service: "صيانة كهربائية",
    time: "اليوم - 2:30 مساءً",
    location: "شارع الملك فهد، الرياض",
    description: "إصلاح مشكلة في الإضاءة الرئيسية للمنزل",
    status: "pending"
  },
  {
    id: 2,
    clientName: "فاطمة علي",
    service: "سباكة",
    time: "غداً - 10:00 صباحاً",
    location: "حي النخيل، جدة",
    description: "تسريب في أنابيب المطبخ يحتاج إلى إصلاح عاجل",
    status: "pending"
  },
  {
    id: 3,
    clientName: "خالد السعيد",
    service: "نجارة",
    time: "اليوم - 5:00 مساءً",
    location: "العليا، الرياض",
    description: "تركيب خزانة جديدة في غرفة النوم",
    status: "pending"
  }
];

// Mock data for reviews
const MOCK_REVIEWS = [
  {
    id: 1,
    clientName: "سارة أحمد",
    rating: 5,
    comment: "عمل ممتاز ودقة في المواعيد. أنصح بالتعامل معه",
    date: "منذ يومين"
  },
  {
    id: 2,
    clientName: "محمد الخالدي",
    rating: 5,
    comment: "محترف جداً وسريع في إنجاز العمل",
    date: "منذ أسبوع"
  },
  {
    id: 3,
    clientName: "نورة السالم",
    rating: 4,
    comment: "جيد جداً، لكن تأخر قليلاً عن الموعد",
    date: "منذ أسبوعين"
  },
  {
    id: 4,
    clientName: "عبدالله محمود",
    rating: 5,
    comment: "ممتاز في التعامل والعمل نظيف جداً",
    date: "منذ شهر"
  }
];

// Terms and conditions
const TERMS = [
  {
    title: "1. المسؤوليات العامة",
    content: "يلتزم العامل بتقديم الخدمات بأعلى مستوى من الجودة والاحترافية. يجب الحفاظ على المواعيد المحددة وإبلاغ العميل في حالة أي تأخير متوقع."
  },
  {
    title: "2. معايير الجودة",
    content: "يجب على العامل التأكد من أن جميع الأعمال المنجزة تتوافق مع معايير الجودة المطلوبة وأن يستخدم مواد وأدوات مناسبة للعمل."
  },
  {
    title: "3. السلوك المهني",
    content: "الالتزام بالسلوك المهني واللائق أثناء التعامل مع العملاء. احترام خصوصية العملاء وممتلكاتهم في جميع الأوقات."
  },
  {
    title: "4. التسعير والدفع",
    content: "يجب أن تكون الأسعار واضحة ومعلنة مسبقاً. لا يجوز تغيير السعر المتفق عليه دون موافقة العميل. يتم الدفع من خلال المنصة فقط."
  },
  {
    title: "5. الإلغاء وإعادة الجدولة",
    content: "في حالة الحاجة إلى إلغاء أو إعادة جدولة موعد، يجب إبلاغ العميل قبل 24 ساعة على الأقل. الإلغاء المتكرر قد يؤدي إلى تعليق الحساب."
  },
  {
    title: "6. التأمين والسلامة",
    content: "العامل مسؤول عن اتخاذ جميع احتياطات السلامة اللازمة أثناء العمل. يجب الإبلاغ عن أي حوادث أو أضرار فوراً."
  },
  {
    title: "7. التقييمات والمراجعات",
    content: "التقييمات تساعد في بناء سمعتك على المنصة. نشجع جميع العمال على تقديم خدمة متميزة للحصول على تقييمات إيجابية."
  },
  {
    title: "8. سياسة الخصوصية",
    content: "جميع المعلومات الشخصية للعملاء سرية ويجب عدم مشاركتها مع أي طرف ثالث. استخدام المعلومات لأغراض غير مصرح بها ممنوع تماماً."
  },
  {
    title: "9. العقوبات والإيقاف",
    content: "مخالفة هذه الشروط قد تؤدي إلى فرض عقوبات تشمل تعليق الحساب أو إنهاء العضوية بشكل نهائي."
  },
  {
    title: "10. تحديث الشروط",
    content: "تحتفظ المنصة بالحق في تحديث هذه الشروط في أي وقت. سيتم إخطار العاملين بأي تغييرات جوهرية."
  }
];

// Notifications
const NOTIFICATIONS = [
  { id: 1, text: "طلب جديد من أحمد محمد - صيانة كهربائية", time: "منذ 5 دقائق", unread: true },
  { id: 2, text: "تم تقييمك من سارة أحمد - 5 نجوم", time: "منذ ساعة", unread: true },
  { id: 3, text: "طلب جديد من فاطمة علي - سباكة", time: "منذ 3 ساعات", unread: true }
];

let currentTab = 'requests';
let requests = [...MOCK_REQUESTS];
let termsAccepted = false;

// Current worker data (from storage or default)
let currentWorker = {
  name: 'أحمد الخالدي',
  avatar: 'أ.خ',
  profession: 'عامل فني',
  verified: true
};

document.addEventListener('DOMContentLoaded', () => {
  // Try to get worker data from storage
  const storedUser = SAN3A.storage.get('user');
  if (storedUser && storedUser.type === 'عامل') {
    currentWorker.name = storedUser.name || currentWorker.name;
  }

  // Render initial content
  renderRequests();
  renderTerms();
  renderReviews();
  renderNotifications();

  // Check URL params for tab
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');
  if (tab && ['requests', 'terms', 'ratings'].includes(tab)) {
    switchTab(tab);
  }
});

function switchTab(tab) {
  currentTab = tab;

  // Update tab buttons
  const tabs = ['requests', 'terms', 'ratings'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    if (t === tab) {
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-600');
    } else {
      btn.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.add('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-600');
    }
  });

  // Show/hide content
  tabs.forEach(t => {
    const content = document.getElementById(`content-${t}`);
    if (t === tab) {
      content.classList.remove('hidden');
    } else {
      content.classList.add('hidden');
    }
  });
}

function renderRequests() {
  const container = document.getElementById('requests-list');
  const noRequests = document.getElementById('no-requests');
  const badge = document.getElementById('requests-badge');
  const notifBadge = document.getElementById('notif-badge');

  // Update badge counts
  badge.textContent = requests.length;
  badge.style.display = requests.length > 0 ? 'flex' : 'none';
  notifBadge.textContent = requests.length;
  notifBadge.style.display = requests.length > 0 ? 'flex' : 'none';

  if (requests.length === 0) {
    container.innerHTML = '';
    noRequests.classList.remove('hidden');
    return;
  }

  noRequests.classList.add('hidden');
  container.innerHTML = requests.map(req => `
    <div class="request-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span class="text-gray-700 dark:text-gray-300 font-bold text-lg">${req.clientName.charAt(0)}</span>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">${req.clientName}</h4>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                ${req.service}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
            <span>${req.time}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>${req.location}</span>
          </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-4">
          <p class="text-sm text-gray-700 dark:text-gray-300">${req.description}</p>
        </div>

        <div class="flex gap-3 action-buttons">
          <button onclick="acceptRequest(${req.id})" class="accept-btn flex-1 py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold flex items-center justify-center gap-2 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            قبول الطلب
          </button>
          <button onclick="rejectRequest(${req.id})" class="reject-btn flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            رفض الطلب
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function acceptRequest(id) {
  const req = requests.find(r => r.id === id);
  if (req) {
    SAN3A.toast(`تم قبول طلب ${req.clientName}`, 'success');
    // In real app: send API request to update status
    // For now, remove from list (mock)
    requests = requests.filter(r => r.id !== id);
    renderRequests();

    // Store accepted request info for client side
    SAN3A.storage.set('lastAcceptedRequest', {
      clientName: req.clientName,
      service: req.service,
      status: 'accepted',
      time: new Date().toISOString()
    });
  }
}

function rejectRequest(id) {
  const req = requests.find(r => r.id === id);
  if (req) {
    SAN3A.toast(`تم رفض طلب ${req.clientName}`, 'info');
    // In real app: send API request to update status
    requests = requests.filter(r => r.id !== id);
    renderRequests();

    // Store rejected request info for client side
    SAN3A.storage.set('lastRejectedRequest', {
      clientName: req.clientName,
      service: req.service,
      status: 'rejected',
      time: new Date().toISOString()
    });
  }
}

function renderTerms() {
  const container = document.getElementById('terms-list');
  container.innerHTML = TERMS.map((term, index) => `
    <div class="${index > 0 ? 'pt-6 border-t border-gray-100 dark:border-gray-700' : ''}">
      <h4 class="font-bold text-blue-800 dark:text-blue-400 mb-2">${term.title}</h4>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">${term.content}</p>
    </div>
  `).join('');
}

function toggleTerms() {
  const checkbox = document.getElementById('terms-checkbox');
  termsAccepted = checkbox.checked;

  if (termsAccepted) {
    SAN3A.toast('تم الموافقة على الشروط والأحكام', 'success');
    SAN3A.storage.set('termsAccepted', true);
  } else {
    SAN3A.storage.set('termsAccepted', false);
  }
}

function renderReviews() {
  const avgRating = MOCK_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / MOCK_REVIEWS.length;

  // Update average rating card
  document.getElementById('avg-rating').textContent = avgRating.toFixed(1);
  document.getElementById('avg-text').textContent = `متوسط التقييم من ${MOCK_REVIEWS.length} مراجعة`;
  document.getElementById('avg-stars').innerHTML = renderStars(Math.round(avgRating));

  // Render reviews list
  const container = document.getElementById('reviews-list');
  container.innerHTML = MOCK_REVIEWS.map(review => `
    <div class="review-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
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

function showHelp() {
  SAN3A.toast('للمساعدة، تواصل مع فريق الدعم على support@san3a.com', 'info', 5000);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNotifications();
  }
});

// Check for stored terms acceptance
const storedTerms = SAN3A.storage.get('termsAccepted');
if (storedTerms) {
  termsAccepted = true;
  const checkbox = document.getElementById('terms-checkbox');
  if (checkbox) checkbox.checked = true;
}