/* ============================================================
   SAN3A — booking.js
   صفحة تأكيد الحجز
   ============================================================ */

(function() {
  'use strict';

  // ── Worker Data (mock - in real app, fetch by workerId) ──
  const WORKER = {
    id: 'c1',
    name: 'أحمد محمد السيد',
    profession: 'عامل تنظيف',
    rating: 4.9,
    reviews: 127
  };

  // ── Weekly Schedule ──
  const SCHEDULE = {
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

  const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  // ── State ──
  let selectedDay = "السبت";
  let selectedDate = "";
  let selectedTime = "";

  // ── DOM Elements ──
  const els = {
    dateInput: document.getElementById('date-input'),
    timeSelect: document.getElementById('time-select'),
    timeHint: document.getElementById('time-hint'),
    daysTabs: document.getElementById('days-tabs'),
    slotsGrid: document.getElementById('slots-grid'),
    summaryDayRow: document.getElementById('summary-date-row'),
    summaryTimeRow: document.getElementById('summary-time-row'),
    summaryDay: document.getElementById('summary-day'),
    summaryTime: document.getElementById('summary-time'),
    form: document.getElementById('booking-form')
  };

  // ── Helpers ──
  function getDayNameFromDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return DAY_NAMES[d.getDay()];
  }

  function getAvailableTimes(dayName) {
    const schedule = SCHEDULE[dayName];
    if (!schedule) return [];
    return schedule.filter(s => s.status === "متاح").map(s => s.time);
  }

  function updateTimeSelect() {
    const dayName = getDayNameFromDate(selectedDate);
    const times = dayName ? getAvailableTimes(dayName) : [];

    els.timeSelect.innerHTML = '';

    if (!selectedDate) {
      els.timeSelect.disabled = true;
      const opt = document.createElement('option');
      opt.value = "";
      opt.textContent = "اختر التاريخ أولاً";
      els.timeSelect.appendChild(opt);
      els.timeHint.textContent = "";
      return;
    }

    els.timeSelect.disabled = false;

    if (times.length === 0) {
      const opt = document.createElement('option');
      opt.value = "";
      opt.textContent = "لا توجد أوقات متاحة";
      els.timeSelect.appendChild(opt);
      els.timeHint.textContent = "لا توجد أوقات متاحة لهذا اليوم";
    } else {
      const defaultOpt = document.createElement('option');
      defaultOpt.value = "";
      defaultOpt.textContent = "اختر الوقت";
      els.timeSelect.appendChild(defaultOpt);

      times.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        els.timeSelect.appendChild(opt);
      });

      els.timeHint.textContent = "عدد الأوقات المتاحة: " + times.length;
    }
  }

  function updateSummary() {
    if (selectedDate) {
      const dayName = getDayNameFromDate(selectedDate);
      els.summaryDay.textContent = dayName || "";
      els.summaryDayRow.classList.remove('hidden');
    } else {
      els.summaryDayRow.classList.add('hidden');
    }

    if (selectedTime) {
      els.summaryTime.textContent = selectedTime;
      els.summaryTimeRow.classList.remove('hidden');
    } else {
      els.summaryTimeRow.classList.add('hidden');
    }
  }

  // ── Render ──
  function renderDaysTabs() {
    els.daysTabs.innerHTML = '';
    Object.keys(SCHEDULE).forEach(day => {
      const btn = document.createElement('button');
      btn.className = 'day-tab' + (day === selectedDay ? ' active' : '');
      btn.textContent = day;
      btn.addEventListener('click', () => {
        selectedDay = day;
        renderDaysTabs();
        renderSlots();
      });
      els.daysTabs.appendChild(btn);
    });
  }

  function renderSlots() {
    const schedule = SCHEDULE[selectedDay];
    if (!schedule) return;

    els.slotsGrid.innerHTML = schedule.map(slot => {
      const isAvailable = slot.status === "متاح";
      return `
        <div class="slot-card ${isAvailable ? 'available' : 'busy'}">
          <div class="slot-header">
            <div class="slot-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${slot.time}
            </div>
            ${isAvailable
              ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
              : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
            }
          </div>
          <div class="slot-status ${isAvailable ? 'available' : 'busy'}">
            ${isAvailable ? 'متاح للحجز' : 'محجوز'}
          </div>
        </div>
      `;
    }).join('');
  }

  // ── Event Handlers ──
  els.dateInput.addEventListener('change', function() {
    selectedDate = this.value;
    selectedTime = "";
    els.timeSelect.value = "";
    updateTimeSelect();
    updateSummary();
  });

  els.timeSelect.addEventListener('change', function() {
    selectedTime = this.value;
    updateSummary();
  });

  els.form.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
      date: selectedDate,
      time: selectedTime,
      address: document.getElementById('address-input').value,
      description: document.getElementById('description-input').value,
      urgency: document.getElementById('urgency-select').value,
      worker: WORKER
    };

    // Save to localStorage
    SAN3A.storage.set('booking', formData);

    // Navigate to payment
    window.location.href = 'payment.html';
  });

  // ── Init ──
  function init() {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    els.dateInput.min = today;

    // Update sidebar with worker info
    document.getElementById('summary-name').textContent = WORKER.name;
    document.getElementById('summary-role').textContent = WORKER.profession;
    document.getElementById('summary-rating').textContent = '⭐ ' + WORKER.rating + ' (' + WORKER.reviews + ' تقييم)';

    renderDaysTabs();
    renderSlots();
    updateTimeSelect();

    // Init Lucide icons
    if (window.lucide) lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();