/* login.js */

// Current state
let currentTab = 'login';
let loginUserType = 'مستخدم';
let signupUserType = 'مستخدم';
let selectedCountry = 'مصر';

// Rating questions (same as in rating.html)
const RATING_QUESTIONS = [
  'هل كانت الخدمة مرضية لك؟',
  'هل كان العامل على قد المهمة؟',
  'هل كان الوقت المستغرق لإنجاز الخدمة مناسبًا؟',
  'هل كان أسلوب تعامل العامل مناسب؟',
  'هل سعر الخدمة مناسب لأداء العامل؟',
  'مدى التزام العامل بالمواعيد المتفق عليها؟',
  'مدى التزام العامل بمعايير السلامة أثناء العمل؟',
  'كيف كان مستوى استعداد العامل للخدمة؟ (مثال: تجهيز المعدات المطلوبة)'
];

const RATING_OPTIONS = [
  { label: 'جيد جداً', value: 5 },
  { label: 'جيد', value: 4 },
  { label: 'لا أعلم', value: 3 },
  { label: 'سيء', value: 2 },
  { label: 'سيء جداً', value: 1 }
];

document.addEventListener('DOMContentLoaded', () => {
  // Check URL params for tab preference
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');
  if (tab === 'signup') {
    switchTab('signup');
  }

  // Initialize user type buttons
  updateUserTypeButtons('login', 'مستخدم');
  updateUserTypeButtons('signup', 'مستخدم');

  // Initialize country buttons
  updateCountryButtons('مصر');
});

function switchTab(tab) {
  currentTab = tab;
  const loginForm = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const loginTab = document.getElementById('tab-login');
  const signupTab = document.getElementById('tab-signup');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginTab.classList.add('bg-blue-600', 'text-white', 'shadow-md');
    loginTab.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-600');
    signupTab.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
    signupTab.classList.add('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-600');
  } else {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    signupTab.classList.add('bg-blue-600', 'text-white', 'shadow-md');
    signupTab.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-600');
    loginTab.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
    loginTab.classList.add('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-600');
  }
}

function setUserType(form, type) {
  if (form === 'login') {
    loginUserType = type;
    updateUserTypeButtons('login', type);
  } else {
    signupUserType = type;
    updateUserTypeButtons('signup', type);

    // Show/hide worker rating info box
    const workerInfo = document.getElementById('worker-rating-info');
    if (type === 'عامل') {
      workerInfo.classList.remove('hidden');
    } else {
      workerInfo.classList.add('hidden');
    }
  }
}

function updateUserTypeButtons(form, activeType) {
  const buttons = document.querySelectorAll(`.user-type-btn-${form}`);
  buttons.forEach(btn => {
    const btnType = btn.getAttribute('data-type');
    if (btnType === activeType) {
      btn.classList.add('border-blue-600', 'bg-blue-600', 'text-white');
      btn.classList.remove('border-gray-200', 'dark:border-gray-600', 'bg-white', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:border-blue-400');
    } else {
      btn.classList.remove('border-blue-600', 'bg-blue-600', 'text-white');
      btn.classList.add('border-gray-200', 'dark:border-gray-600', 'bg-white', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:border-blue-400');
    }
  });
}

function setCountry(country) {
  selectedCountry = country;
  updateCountryButtons(country);

  // Store country in SAN3A storage
  SAN3A.storage.set('country', country);

  // Show toast
  const currency = SAN3A.currency.get(country);
  SAN3A.toast(`تم اختيار ${country} - العملة: ${currency.name}`, 'success');
}

function updateCountryButtons(activeCountry) {
  const buttons = document.querySelectorAll('.country-btn');
  buttons.forEach(btn => {
    const btnCountry = btn.getAttribute('data-country');
    if (btnCountry === activeCountry) {
      btn.classList.add('border-blue-600', 'bg-blue-600', 'text-white');
      btn.classList.remove('border-gray-200', 'dark:border-gray-600', 'bg-white', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:border-blue-400');
      // Update currency text color
      const currencySpan = btn.querySelector('span:last-child');
      if (currencySpan) currencySpan.classList.remove('text-gray-500');
      if (currencySpan) currencySpan.classList.add('text-blue-100');
    } else {
      btn.classList.remove('border-blue-600', 'bg-blue-600', 'text-white');
      btn.classList.add('border-gray-200', 'dark:border-gray-600', 'bg-white', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:border-blue-400');
      const currencySpan = btn.querySelector('span:last-child');
      if (currencySpan) currencySpan.classList.remove('text-blue-100');
      if (currencySpan) currencySpan.classList.add('text-gray-500');
    }
  });
}

function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Store user info
  SAN3A.storage.set('user', {
    email: email,
    type: loginUserType,
    country: selectedCountry,
    isLoggedIn: true
  });

  SAN3A.toast(`تم تسجيل الدخول بنجاح كـ ${loginUserType}`, 'success');

  // Navigate based on user type
  setTimeout(() => {
    if (loginUserType === 'عامل') {
      SAN3A.navigate('worker-dashboard');
    } else if (loginUserType === 'إداري') {
      SAN3A.navigate('admin');
    } else {
      SAN3A.navigate('profile');
    }
  }, 1500);
}

function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const phone = document.getElementById('signup-phone').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  // Validation
  if (password !== confirm) {
    SAN3A.toast('كلمة المرور وتأكيدها غير متطابقين', 'error');
    return;
  }

  if (password.length < 6) {
    SAN3A.toast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
    return;
  }

  // Store user info
  SAN3A.storage.set('user', {
    name: name,
    email: email,
    phone: phone,
    type: signupUserType,
    country: selectedCountry,
    isLoggedIn: true
  });

  SAN3A.toast(`تم إنشاء الحساب بنجاح كـ ${signupUserType}`, 'success');

  // Navigate based on user type
  setTimeout(() => {
    if (signupUserType === 'عامل') {
      SAN3A.navigate('worker-pending');
    } else if (signupUserType === 'إداري') {
      SAN3A.navigate('admin');
    } else {
      SAN3A.navigate('profile');
    }
  }, 1500);
}

function showRatingQuestions() {
  const modal = document.getElementById('rating-modal');
  const list = document.getElementById('rating-questions-list');

  list.innerHTML = RATING_QUESTIONS.map((question, index) => `
    <div class="question-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
      <h4 class="font-bold text-gray-900 dark:text-white mb-3">${index + 1}. ${question}</h4>
      <div class="space-y-2">
        ${RATING_OPTIONS.map(opt => `
          <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="w-4 h-4 border-2 border-gray-300 dark:border-gray-500 rounded-full"></div>
            <span>${opt.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeRatingQuestions() {
  const modal = document.getElementById('rating-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function socialLogin(provider) {
  SAN3A.toast(`جاري تسجيل الدخول بـ ${provider}...`, 'info');

  // Mock social login
  setTimeout(() => {
    SAN3A.storage.set('user', {
      type: 'مستخدم',
      country: selectedCountry,
      isLoggedIn: true,
      provider: provider
    });
    SAN3A.toast(`تم تسجيل الدخول بـ ${provider} بنجاح`, 'success');
    setTimeout(() => SAN3A.navigate('profile'), 1000);
  }, 2000);
}

function goBack() {
  window.location.href = 'index.html';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeRatingQuestions();
  }
});