/* ============================================================
   worker-pending.js — صفحة انتظار قبول العامل — SAN3A
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================================
     1. الوضع الليلي (يتوافق مع باقي صفحات الموقع)
     ========================================================== */
  function initDarkMode() {
    var saved = localStorage.getItem('san3a-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
      document.body.classList.add('dark');
    }
  }

  /* ==========================================================
     2. زر تسجيل الخروج
     ========================================================== */
  function initLogout() {
    var btn = document.getElementById('logout-btn');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();

      // تأكيد قبل تسجيل الخروج
      var confirmed = confirm('هل أنت متأكد من تسجيل الخروج؟');
      if (!confirmed) return;

      // === ربط مع Java Back-end ===
      // fetch('/api/auth/logout', { method: 'POST' })
      //   .then(function() { window.location.href = 'login.html'; })

      // محاكاة مؤقتة
      localStorage.removeItem('san3a-user');
      localStorage.removeItem('san3a-token');
      window.location.href = 'login.html';
    });
  }

  /* ==========================================================
     3. زر الدعم الفني
     ========================================================== */
  function initSupport() {
    var btn = document.getElementById('support-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      // فتح بريد التواصل أو صفحة الدعم
      window.location.href = 'mailto:support@san3a.com?subject=استفسار عن حالة الحساب';
    });
  }

  /* ==========================================================
     4. فحص حالة الحساب بشكل دوري (Polling)
     يتحقق كل 30 ثانية إذا تم قبول العامل
     ========================================================== */
  function initStatusPolling() {
    // فحص كل 30 ثانية
    var POLL_INTERVAL = 30000;

    setInterval(function () {
      checkAccountStatus();
    }, POLL_INTERVAL);

    // فحص أولي بعد 5 ثوانٍ
    setTimeout(checkAccountStatus, 5000);
  }

  function checkAccountStatus() {
    // === ربط مع Java Back-end ===
    // fetch('/api/worker/status', {
    //   headers: { 'Authorization': 'Bearer ' + localStorage.getItem('san3a-token') }
    // })
    //   .then(function(res) { return res.json(); })
    //   .then(function(data) {
    //     if (data.status === 'approved') {
    //       window.location.href = 'worker-dashboard.html';
    //     } else if (data.status === 'rejected') {
    //       showRejectionMessage(data.reason);
    //     }
    //   })
    //   .catch(function() { /* خطأ صامت */ });

    // محاكاة: لا شيء يحدث حالياً لأن الـ API غير متصل
  }

  /* ==========================================================
     5. عرض رسالة الرفض (في حال رفض الإدارة الحساب)
     ========================================================== */
  function showRejectionMessage(reason) {
    var card = document.querySelector('.wp-card');
    if (!card) return;

    card.innerHTML =
      '<div class="wp-icon-wrap">' +
      '  <div class="wp-icon-circle" style="background:rgba(220,38,38,.1);color:#dc2626;animation:none;">' +
      '    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' +
      '  </div>' +
      '</div>' +
      '<h2 class="wp-title" style="color:#dc2626;">تم رفض الطلب</h2>' +
      '<p class="wp-subtitle">نأسف، لم يتم قبول طلبك في هذه المرة</p>' +
      '<div class="wp-info-box" style="background:rgba(220,38,38,.08);border-color:#dc2626;">' +
      '  <p class="wp-info-text">السبب: ' + (reason || 'لم يتم تحديد سبب') + '</p>' +
      '  <p class="wp-info-text">يمكنك التواصل مع الدعم الفني لمزيد من التفاصيل أو إعادة التسجيل.</p>' +
      '</div>' +
      '<div class="wp-help-btns" style="margin-top:24px;">' +
      '  <a href="login.html" class="wp-btn wp-btn-support">العودة لتسجيل الدخول</a>' +
      '</div>';

    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = 'cardUp .5s cubic-bezier(.16,1,.3,1) both';
  }

  /* ==========================================================
     6. تأثير ظهور تدريجي للخطوات
     ========================================================== */
  function initStepAnimation() {
    var steps = document.querySelectorAll('.wp-step');
    steps.forEach(function (step, index) {
      step.style.opacity = '0';
      step.style.transform = 'translateY(16px)';
      step.style.transition = 'opacity .5s ease, transform .5s ease';
      step.style.transitionDelay = (index * 0.15 + 0.3) + 's';

      setTimeout(function () {
        step.style.opacity = '';
        step.style.transform = '';
      }, 100);
    });
  }

  /* ==========================================================
     التهيئة
     ========================================================== */
  function init() {
    initDarkMode();
    initLogout();
    initSupport();
    initStatusPolling();
    initStepAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();