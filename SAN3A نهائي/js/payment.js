/* ============================================================
   SAN3A — payment.js
   صفحة دفع جدية الحجز
   ============================================================ */

(function() {
  'use strict';

  // ── DATA ──
  const DEPOSITS = {
    cleaning:    { EGP: { total: 80,  platform: 30, worker: 50  }, SAR: { total: 30, platform: 11, worker: 19 }, AED: { total: 25, platform: 10, worker: 15 } },
    plumbing:    { EGP: { total: 100, platform: 40, worker: 60  }, SAR: { total: 40, platform: 15, worker: 25 }, AED: { total: 35, platform: 14, worker: 21 } },
    electricity: { EGP: { total: 120, platform: 50, worker: 70  }, SAR: { total: 45, platform: 18, worker: 27 }, AED: { total: 38, platform: 16, worker: 22 } },
    carpentry:   { EGP: { total: 140, platform: 60, worker: 80  }, SAR: { total: 55, platform: 23, worker: 32 }, AED: { total: 45, platform: 19, worker: 26 } },
    appliances:  { EGP: { total: 150, platform: 65, worker: 85  }, SAR: { total: 60, platform: 25, worker: 35 }, AED: { total: 50, platform: 21, worker: 29 } },
    painting:    { EGP: { total: 120, platform: 50, worker: 70  }, SAR: { total: 45, platform: 18, worker: 27 }, AED: { total: 38, platform: 16, worker: 22 } },
    moving:      { EGP: { total: 200, platform: 90, worker: 110 }, SAR: { total: 75, platform: 32, worker: 43 }, AED: { total: 60, platform: 26, worker: 34 } },
  };

  const CURRENCY_MAP = {
    'مصر': { code: 'EGP', symbol: 'جنيه', symShort: 'ج.م' },
    'السعودية': { code: 'SAR', symbol: 'ريال', symShort: 'ر.س' },
    'الإمارات': { code: 'AED', symbol: 'درهم', symShort: 'د.إ' }
  };

  const SERVICE_TITLES = {
    cleaning: 'تنظيف المنازل', plumbing: 'السباكة', electricity: 'الكهرباء',
    carpentry: 'النجارة', appliances: 'إصلاح الأجهزة المنزلية',
    painting: 'الدهان والديكور', moving: 'نقل الأثاث'
  };

  const PROFESSIONS = {
    cleaning: 'عامل تنظيف', plumbing: 'سبّاك', electricity: 'كهربائي',
    carpentry: 'نجّار', appliances: 'فني أجهزة', painting: 'عامل دهان', moving: 'عامل نقل'
  };

  // ── Get Booking Data ──
  function getBookingData() {
    let data = null;
    if (typeof SAN3A !== 'undefined' && SAN3A.storage) {
      data = SAN3A.storage.get('booking');
    }
    if (!data) {
      const raw = localStorage.getItem('san3a-booking');
      if (raw) data = JSON.parse(raw);
    }
    return data;
  }

  function getCurrency() {
    const country = localStorage.getItem('san3a-country') || 'مصر';
    return CURRENCY_MAP[country] || CURRENCY_MAP['مصر'];
  }

  function formatDate(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('ar-EG', options);
  }

  function getDayName(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    const days = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    return days[d.getDay()];
  }

  // ── State ──
  let currentMethod = 'visa';
  let bookingData = null;
  let currency = null;
  let deposit = null;

  // ── DOM ──
  const els = {
    depositTotal: document.getElementById('deposit-total'),
    barWorker: document.getElementById('bar-worker'),
    barPlatform: document.getElementById('bar-platform'),
    workerPct: document.getElementById('worker-pct'),
    platformPct: document.getElementById('platform-pct'),
    workerAmount: document.getElementById('worker-amount'),
    platformAmount: document.getElementById('platform-amount'),
    noteTotal: document.getElementById('note-total'),
    noteWorker: document.getElementById('note-worker'),
    heroCountry: document.getElementById('hero-country'),
    heroService: document.getElementById('hero-service'),
    summaryService: document.getElementById('summary-service'),
    summaryWorker: document.getElementById('summary-worker'),
    summaryAppointment: document.getElementById('summary-appointment'),
    summaryCountry: document.getElementById('summary-country'),
    sidebarTotal: document.getElementById('sidebar-total'),
    sidebarWorker: document.getElementById('sidebar-worker'),
    sidebarPlatform: document.getElementById('sidebar-platform'),
    sidebarNoteWorker: document.getElementById('sidebar-note-worker'),
    btnPayText: document.getElementById('btn-pay-text'),
    cardForm: document.getElementById('card-form'),
    paypalMsg: document.getElementById('paypal-msg'),
    walletMsg: document.getElementById('wallet-msg'),
    btnPay: document.getElementById('btn-pay')
  };

  // ── Render Deposit Info ──
  function renderDepositInfo() {
    if (!bookingData || !deposit || !currency) return;

    const platformPct = Math.round((deposit.platform / deposit.total) * 100);
    const workerPct = 100 - platformPct;

    // Hero
    if (els.heroCountry) els.heroCountry.textContent = currency.code === 'EGP' ? 'مصر · جنيه' : (currency.code === 'SAR' ? 'السعودية · ريال' : 'الإمارات · درهم');
    if (els.heroService) els.heroService.textContent = 'خدمة: ' + (SERVICE_TITLES[bookingData.serviceId] || 'خدمة منزلية');

    // Deposit Breakdown
    if (els.depositTotal) els.depositTotal.textContent = deposit.total + ' ' + currency.symbol;
    if (els.barWorker) els.barWorker.style.width = workerPct + '%';
    if (els.barPlatform) els.barPlatform.style.width = platformPct + '%';
    if (els.workerPct) els.workerPct.textContent = workerPct + '%';
    if (els.platformPct) els.platformPct.textContent = platformPct + '%';
    if (els.workerAmount) els.workerAmount.textContent = deposit.worker + ' ' + currency.symbol;
    if (els.platformAmount) els.platformAmount.textContent = deposit.platform + ' ' + currency.symbol;
    if (els.noteTotal) els.noteTotal.textContent = deposit.total + ' ' + currency.symbol;
    if (els.noteWorker) els.noteWorker.textContent = deposit.worker + ' ' + currency.symbol;

    // Sidebar
    if (els.summaryService) els.summaryService.textContent = SERVICE_TITLES[bookingData.serviceId] || 'خدمة منزلية';
    if (els.summaryWorker) els.summaryWorker.textContent = bookingData.worker ? bookingData.worker.name : '--';
    if (els.summaryAppointment) {
      const dayName = getDayName(bookingData.date);
      els.summaryAppointment.textContent = dayName + ' — ' + (bookingData.time || '--');
    }
    if (els.summaryCountry) els.summaryCountry.textContent = localStorage.getItem('san3a-country') || 'مصر';
    if (els.sidebarTotal) els.sidebarTotal.textContent = deposit.total + ' ' + currency.symbol;
    if (els.sidebarWorker) els.sidebarWorker.textContent = '↳ عامل: ' + deposit.worker + ' ' + currency.symbol;
    if (els.sidebarPlatform) els.sidebarPlatform.textContent = 'موقع: ' + deposit.platform + ' ' + currency.symbol;
    if (els.sidebarNoteWorker) els.sidebarNoteWorker.textContent = deposit.worker + ' ' + currency.symbol;

    // Button
    if (els.btnPayText) els.btnPayText.textContent = 'دفع جدية الحجز ' + deposit.total + ' ' + currency.symbol;

    // Title
    document.title = 'صنعة - دفع جدية الحجز | ' + (SERVICE_TITLES[bookingData.serviceId] || '');
  }

  // ── Payment Method Switch ──
  function switchMethod(method) {
    currentMethod = method;

    // Update visual active state
    document.querySelectorAll('.method-row').forEach(row => {
      row.classList.toggle('active', row.dataset.method === method);
    });

    // Show/hide forms
    if (els.cardForm) els.cardForm.classList.toggle('hidden', method !== 'visa');
    if (els.paypalMsg) els.paypalMsg.classList.toggle('hidden', method !== 'paypal');
    if (els.walletMsg) els.walletMsg.classList.toggle('hidden', method !== 'wallet');

    // Update button text
    if (els.btnPayText) {
      if (method === 'visa') {
        els.btnPayText.textContent = 'دفع جدية الحجز ' + deposit.total + ' ' + currency.symbol;
      } else if (method === 'paypal') {
        els.btnPayText.textContent = 'المتابعة إلى PayPal';
      } else {
        els.btnPayText.textContent = 'المتابعة إلى المحفظة';
      }
    }
  }

  // ── Card Number Formatting ──
  function formatCardNumber(value) {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
  }

  function formatExpiry(value) {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4);
    return v;
  }

  // ── Handle Payment ──
  window.handlePayment = function() {
    if (!bookingData) {
      alert('لا يوجد حجز! ارجع لصفحة الحجز.');
      return;
    }

    if (currentMethod === 'visa') {
      const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
      const expiry = document.getElementById('card-expiry').value;
      const cvv = document.getElementById('card-cvv').value;
      const cardName = document.getElementById('card-name').value;

      if (!cardNumber || cardNumber.length < 16) {
        alert('أدخل رقم البطاقة صحيح');
        return;
      }
      if (!expiry || expiry.length < 5) {
        alert('أدخل تاريخ الانتهاء');
        return;
      }
      if (!cvv || cvv.length < 3) {
        alert('أدخل CVV');
        return;
      }
      if (!cardName) {
        alert('أدخل اسم حامل البطاقة');
        return;
      }
    }

    // Save payment data
    const paymentData = {
      method: currentMethod,
      deposit: deposit,
      currency: currency,
      paidAt: new Date().toISOString(),
      status: 'paid'
    };

    if (typeof SAN3A !== 'undefined' && SAN3A.storage) {
      SAN3A.storage.set('payment', paymentData);
    } else {
      localStorage.setItem('san3a-payment', JSON.stringify(paymentData));
    }

    // Add new booking to general bookings list in localStorage
    const demoBookings = [
      { id: 'b1', service: 'تنظيف المنزل', worker: 'أحمد محمد السيد', date: '2024-01-15', time: '10:00', price: 350, status: 'completed', rating: 4, currency: 'ج.م' },
      { id: 'b2', service: 'السباكة', worker: 'محمد عبد الله حسن', date: '2024-01-10', time: '14:00', price: 420, status: 'completed', rating: 4, currency: 'ج.م' },
      { id: 'b3', service: 'الكهرباء', worker: 'خالد إبراهيم علي', date: '2024-01-08', time: '09:00', price: 0, status: 'cancelled', rating: 0, currency: 'ج.م' },
      { id: 'b4', service: 'النجارة', worker: 'عمر حسام الدين', date: '2024-01-20', time: '11:00', price: 720, status: 'scheduled', rating: 0, currency: 'ج.م' },
      { id: 'b5', service: 'تنظيف المنزل', worker: 'يوسف أحمد', date: '2024-01-25', time: '14:00', price: 400, status: 'pending_payment', depositPaid: 80, remaining: 320, rating: 0, currency: 'ج.م' }
    ];

    let storedBookings = [];
    try {
      const rawBookings = localStorage.getItem('san3a-bookings');
      storedBookings = rawBookings ? JSON.parse(rawBookings) : demoBookings;
    } catch(e) {
      storedBookings = demoBookings;
    }

    let workerObj = null;
    try {
      workerObj = JSON.parse(localStorage.getItem('san3a-selectedWorkerObj'));
    } catch(e) {}

    const hourlyRate = workerObj ? (workerObj.price || workerObj.hr || 150) : 150;
    const estimatedHours = 4; // demo duration
    const totalPrice = hourlyRate * estimatedHours;
    const depositAmount = deposit.total;
    const remainingAmount = totalPrice - depositAmount;

    const newBooking = {
      id: 'b_' + Date.now(),
      service: SERVICE_TITLES[bookingData.serviceId] || 'خدمة منزلية',
      worker: workerObj ? workerObj.name : 'أحمد محمد السيد',
      date: bookingData.date || new Date().toISOString().split('T')[0],
      time: bookingData.time || '10:00',
      price: totalPrice,
      status: 'pending_payment',
      depositPaid: depositAmount,
      remaining: remainingAmount,
      rating: 0,
      currency: currency.symShort || 'ج.م'
    };

    storedBookings.push(newBooking);
    localStorage.setItem('san3a-bookings', JSON.stringify(storedBookings));

    // Show success and navigate
    alert('تم تأكيد الحجز ودفع جدية الحجز (' + deposit.total + ' ' + currency.symbol + ') بنجاح! سيتم التواصل معك قريباً.');
    window.location.href = 'profile.html';
  };

  // ── Event Listeners ──
  function setupEvents() {
    // Payment method radio buttons
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
      radio.addEventListener('change', function() {
        switchMethod(this.value);
      });
    });

    // Card formatting
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
      cardNumber.addEventListener('input', function() {
        this.value = formatCardNumber(this.value);
      });
    }

    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
      cardExpiry.addEventListener('input', function() {
        this.value = formatExpiry(this.value);
      });
    }

    const cardCvv = document.getElementById('card-cvv');
    if (cardCvv) {
      cardCvv.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 4);
      });
    }
  }

  // ── Init ──
  function init() {
    bookingData = getBookingData();
    currency = getCurrency();

    if (!bookingData) {
      // No booking data
      document.body.innerHTML = '<div style="padding:60px;text-align:center;font-size:18px">لا يوجد حجز حالياً. <a href="services.html" style="color:#2563eb">تصفح الخدمات</a></div>';
      return;
    }

    const serviceId = bookingData.serviceId || 'cleaning';
    deposit = DEPOSITS[serviceId] ? DEPOSITS[serviceId][currency.code] : null;
    if (!deposit) {
      deposit = DEPOSITS.cleaning[currency.code];
    }

    renderDepositInfo();
    setupEvents();

    if (window.lucide) lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();