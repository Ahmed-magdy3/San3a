/* ============================================================
   how-it-works.js — صفحة كيف يعمل — صنعة SAN3A
   Vanilla JS — لا يعتمد على أي مكتبة
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================================
     أيقونات SVG مُعرّفة مركزياً
     ========================================================== */
  var IC = {
    user:    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    map:     '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    search:  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    cal:     '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    card:    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
    check:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    star:    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    clock:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    wallet:  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>',
    shield:  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    msg:     '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    arrowL:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>'
  };

  /* ==========================================================
     بيانات الخطوات — جاهزة للاستبدال بـ fetch('/api/steps')
     ========================================================== */
  var DATA = {
    user: [
      { n:1, t:"إنشاء حساب أو تسجيل الدخول",   d:"ابدأ بإنشاء حساب جديد أو تسجيل الدخول إلى حسابك الحالي. اختر دورك كـ 'مستخدم' للحصول على الخدمات.", ic:"user", dt:["املأ البيانات الأساسية (الاسم، البريد الإلكتروني، كلمة المرور)","اختر 'مستخدم' من قائمة الأدوار","يمكنك أيضاً استخدام حساب موجود لتسجيل الدخول"] },
      { n:2, t:"اختر الدولة والخدمة",            d:"حدد البلد الذي تريد الحصول على الخدمة فيه، ثم اختر نوع الخدمة المطلوبة من بين 7 خدمات متاحة.", ic:"map", dt:["الدول المتاحة: مصر 🇪🇬 - السعودية 🇸🇦 - الإمارات 🇦🇪","الخدمات: تنظيف المنازل، السباكة، الكهرباء، النجارة، إصلاح الأجهزة، الدهان، نقل الأثاث","العملة تتغير تلقائياً حسب البلد المختار"] },
      { n:3, t:"تصفح العمال واختر الأنسب",       d:"شاهد قائمة العمال المتاحين مع تقييماتهم وخبراتهم. اختر العامل الذي يناسب احتياجاتك.", ic:"search", dt:["شاهد تقييم كل عامل من 5 نجوم","اطلع على عدد الخدمات المكتملة","تحقق من سنوات الخبرة والمهارات","اضغط على 'عرض الملف الشخصي' لمزيد من التفاصيل"] },
      { n:4, t:"حدد التاريخ والوقت",             d:"اختر التاريخ والوقت المناسبين لتنفيذ الخدمة، مع تحديد الموقع وإضافة أي ملاحظات خاصة.", ic:"cal", dt:["اختر التاريخ من التقويم","حدد الوقت المفضل للزيارة","أضف عنوان الموقع بالتفصيل","يمكنك إضافة ملاحظات إضافية للعامل"] },
      { n:5, t:"دفع جدية الحجز",                 d:"ادفع جدية الحجز لتأكيد الموعد. باقي المبلغ يُدفع بعد إتمام الخدمة حسب الساعات الفعلية.", ic:"card", dt:["نظام الدفع بجدية الحجز: ادفع جدية الحجز الآن","تشمل رسوم المنصة + ضمان للعامل","الباقي يحسب حسب الساعات الفعلية بعد الانتهاء","جميع المعاملات آمنة ومشفرة"] },
      { n:6, t:"تأكيد الحجز",                    d:"بعد دفع جدية الحجز، سيتم تأكيد حجزك وإرسال تفاصيل الموعد لك وللعامل.", ic:"check", dt:["ستصلك رسالة تأكيد فورية","يمكنك متابعة حالة الحجز من لوحة التحكم","العامل سيتواصل معك قبل الموعد","يمكنك إلغاء الحجز قبل 24 ساعة"] },
      { n:7, t:"تنفيذ الخدمة",                   d:"سيصل العامل في الموعد المحدد لتنفيذ الخدمة بكفاءة واحترافية عالية.", ic:"clock", dt:["العامل سيصل في الموعد المحدد","يمكنك التواصل مع العامل عبر الدردشة","متابعة تقدم العمل خطوة بخطوة","الحصول على خدمة محترفة مضمونة"] },
      { n:8, t:"الدفع النهائي",                  d:"بعد إتمام الخدمة بنجاح، ادفع المبلغ المتبقي حسب الساعات الفعلية التي استغرقها العمل.", ic:"wallet", dt:["المبلغ يحسب بناءً على الساعات الفعلية","راجع تفاصيل الخدمة المقدمة","الدفع آمن ومشفر بالكامل","يمكنك استخدام نفس طريقة الدفع السابقة"] },
      { n:9, t:"تقييم الخدمة",                   d:"بعد دفع المبلغ الكامل، قيّم الخدمة والعامل من خلال 8 أسئلة تفصيلية.", ic:"star", dt:["8 أسئلة شاملة تغطي جميع جوانب الخدمة","تقييم الجودة، الالتزام بالمواعيد، النظافة، والاحترافية","تقييمك يساعد العمال الآخرين ويحسن الخدمة","يمكنك إضافة تعليق مكتوب اختياري"] }
    ],
    worker: [
      { n:1, t:"التسجيل كعامل",                  d:"أنشئ حساباً جديداً واختر دورك كـ 'عامل' لتقديم خدماتك المحترفة.", ic:"user", dt:["املأ معلوماتك الشخصية بالكامل","اختر 'عامل' من قائمة الأدوار","قدم معلومات الاتصال الصحيحة","ارفع صورة شخصية احترافية"] },
      { n:2, t:"إنشاء الملف الشخصي",              d:"أكمل ملفك الشخصي بإضافة خبراتك، مهاراتك، والخدمات التي تقدمها.", ic:"msg", dt:["اختر الدولة التي تعمل بها","حدد نوع الخدمة التي تتقنها","أضف سنوات خبرتك في المجال","اكتب وصفاً تفصيلياً عن خدماتك","حدد سعر الساعة للخدمة"] },
      { n:3, t:"انتظار الموافقة",                 d:"سيتم مراجعة ملفك الشخصي من قبل الإدارة للتحقق من البيانات والموافقة عليها.", ic:"clock", dt:["فترة المراجعة عادةً لا تتجاوز 24-48 ساعة","ستصلك رسالة بريد إلكتروني عند الموافقة","قد يُطلب منك تقديم مستندات إضافية","بعد الموافقة، سيظهر ملفك للعملاء"] },
      { n:4, t:"استقبال طلبات الحجز",             d:"بعد الموافقة على حسابك، ستبدأ في استقبال طلبات الحجز من العملاء.", ic:"cal", dt:["ستصلك إشعارات فورية عند كل حجز جديد","شاهد تفاصيل الحجز كاملة","راجع الموقع والوقت والخدمة المطلوبة","يمكنك قبول أو رفض الحجز"] },
      { n:5, t:"تنفيذ الخدمة",                    d:"توجه إلى موقع العميل في الوقت المحدد وقدم خدمتك بكفاءة واحترافية.", ic:"check", dt:["تأكد من الوصول في الموعد المحدد","استخدم أدوات احترافية ومعدات مناسبة","تواصل مع العميل بأدب واحترافية","أتم العمل حسب المواصفات المطلوبة"] },
      { n:6, t:"استلام الدفعة",                   d:"بعد إتمام الخدمة، سيدفع العميل المبلغ المتبقي وستحصل على أجرك كاملاً.", ic:"wallet", dt:["العميل دفع جدية الحجز عند التأكيد","بعد إتمام الخدمة، سيدفع المبلغ المتبقي","ستحصل على المبلغ في حسابك خلال 3-5 أيام عمل","يمكنك متابعة أرباحك من لوحة التحكم"] },
      { n:7, t:"بناء السمعة",                     d:"احصل على تقييمات إيجابية من العملاء لتحسين ترتيبك وزيادة فرص الحصول على مزيد من العمل.", ic:"star", dt:["التقييمات الجيدة تزيد من ظهورك في نتائج البحث","كل تقييم يحتوي على 8 أسئلة تفصيلية","حافظ على تقييم عالٍ لجذب المزيد من العملاء","رد على التقييمات بطريقة احترافية"] },
      { n:8, t:"لوحة التحكم",                     d:"تابع جميع حجوزاتك، أرباحك، وتقييماتك من لوحة تحكم شاملة.", ic:"shield", dt:["شاهد إحصائيات أدائك الشهرية","تابع الحجوزات القادمة والمكتملة","راجع إجمالي أرباحك","اطلع على متوسط تقييماتك","قم بتحديث معلومات ملفك الشخصي"] }
    ],
    admin: [
      { n:1, t:"تسجيل الدخول كمسؤول",            d:"استخدم بيانات الدخول الخاصة بك للوصول إلى لوحة تحكم المسؤول الشاملة.", ic:"shield", dt:["اختر 'إداري' عند تسجيل الدخول","أدخل بيانات اعتماد المسؤول","الوصول إلى لوحة تحكم متقدمة","صلاحيات كاملة لإدارة المنصة"] },
      { n:2, t:"مراجعة طلبات العمال",            d:"راجع طلبات التسجيل الجديدة من العمال وقم بالموافقة عليها أو رفضها.", ic:"user", dt:["شاهد قائمة العمال المنتظرين للموافقة","راجع ملفاتهم الشخصية بالتفصيل","تحقق من بيانات الاتصال والخبرات","وافق أو ارفض بناءً على المعايير المحددة","أرسل ملاحظات للعمال المرفوضين"] },
      { n:3, t:"متابعة جميع الحجوزات",            d:"اطلع على جميع الحجوزات في المنصة، سواء قيد التنفيذ أو المكتملة أو الملغاة.", ic:"cal", dt:["شاهد إحصائيات الحجوزات اليومية والشهرية","راجع تفاصيل كل حجز","تتبع حالة الحجوزات (منتظرة، قيد التنفيذ، مكتملة)","حل أي نزاعات بين العملاء والعمال"] },
      { n:4, t:"إدارة المستخدمين",                d:"راقب جميع المستخدمين (عملاء وعمال) مع إمكانية تعليق أو حذف الحسابات عند الحاجة.", ic:"msg", dt:["عرض قائمة شاملة بجميع المستخدمين","البحث والتصفية حسب النوع والدولة","تعليق الحسابات المخالفة","حذف الحسابات الوهمية أو المسيئة","إرسال إشعارات للمستخدمين"] },
      { n:5, t:"مراقبة المدفوعات",                d:"تتبع جميع المعاملات المالية والمدفوعات بين العملاء والعمال.", ic:"wallet", dt:["شاهد إجمالي الإيرادات اليومية والشهرية","راقب مدفوعات جدية الحجز","تتبع المدفوعات النهائية","حل مشاكل المدفوعات الفاشلة","إصدار تقارير مالية شاملة"] },
      { n:6, t:"مراجعة التقييمات",                d:"اطلع على جميع التقييمات والمراجعات للتأكد من جودة الخدمات المقدمة.", ic:"star", dt:["عرض جميع التقييمات من 8 أسئلة","تحليل متوسطات التقييمات","رصد التقييمات السلبية والتحقيق فيها","حذف التقييمات المسيئة أو غير الحقيقية","تشجيع العمال ذوي التقييمات العالية"] },
      { n:7, t:"إدارة الخدمات والأسعار",          d:"أضف خدمات جديدة أو عدّل الأسعار حسب السوق والطلب.", ic:"card", dt:["إضافة أنواع خدمات جديدة","تعديل أسعار الخدمات الحالية","إنشاء عروض وتخفيضات","تحديث العملات حسب الدول","إدارة فئات الخدمات"] },
      { n:8, t:"التقارير والإحصائيات",            d:"احصل على تقارير شاملة عن أداء المنصة، الإيرادات، والمستخدمين.", ic:"check", dt:["تقارير الإيرادات الشهرية والسنوية","إحصائيات نمو المستخدمين","معدلات إتمام الخدمات","متوسط التقييمات العامة","أكثر الخدمات طلباً","أفضل العمال أداءً"] }
    ]
  };

  var roleTitles = { user: 'خطوات العميل', worker: 'خطوات العامل', admin: 'خطوات المسؤول' };

  /* ==========================================================
     حالة التطبيق
     ========================================================== */
  var role = 'user';
  var step = 0;

  /* ==========================================================
     1. الوضع الليلي
     ========================================================== */
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    var mIcon = document.getElementById('icon-moon');
    var sIcon = document.getElementById('icon-sun');
    if (!btn) return;

    // تطبيق المحفوظ
    var saved = localStorage.getItem('san3a-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
      document.body.classList.add('dark');
      if (mIcon) mIcon.style.display = 'none';
      if (sIcon) sIcon.style.display = 'block';
    }

    btn.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      var dk = document.body.classList.contains('dark');
      localStorage.setItem('san3a-theme', dk ? 'dark' : 'light');
      if (mIcon) mIcon.style.display = dk ? 'none' : 'block';
      if (sIcon) sIcon.style.display = dk ? 'block' : 'none';
    });
  }

  /* ==========================================================
     2. تبويبات الأدوار
     ========================================================== */
  function initTabs() {
    var tabs = document.querySelectorAll('.hiw-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var r = tab.getAttribute('data-role');
        if (!r) return;
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        role = r;
        step = 0;
        renderSidebar();
        renderStep();
        renderDots();
      });
    });
  }

  /* ==========================================================
     3. الشريط الجانبي
     ========================================================== */
  function renderSidebar() {
    var title = document.getElementById('sidebar-title');
    var list = document.getElementById('steps-list');
    if (!title || !list) return;

    var steps = DATA[role];
    title.textContent = roleTitles[role];

    var h = '';
    steps.forEach(function (s, i) {
      h += '<button class="hiw-step-item' + (i === step ? ' active' : '') + '" data-i="' + i + '">';
      h += '  <div class="hiw-step-num">' + s.n + '</div>';
      h += '  <span class="hiw-step-text">' + s.t + '</span>';
      h += '</button>';
    });
    list.innerHTML = h;

    // ربط الأحداث
    list.querySelectorAll('.hiw-step-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        step = parseInt(btn.getAttribute('data-i'));
        if (isNaN(step)) return;
        renderStep();
        renderDots();
        syncSidebar();
      });
    });
  }

  function syncSidebar() {
    var items = document.querySelectorAll('.hiw-step-item');
    items.forEach(function (el, i) {
      if (i === step) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  /* ==========================================================
     4. تفاصيل الخطوة
     ========================================================== */
  function renderStep() {
    var steps = DATA[role];
    if (!steps || !steps[step]) return;
    var s = steps[step];

    // أيقونة
    var iconEl = document.getElementById('step-icon');
    if (iconEl) iconEl.innerHTML = IC[s.ic] || IC.check;

    // أرقام
    var numEl = document.getElementById('step-num');
    var totEl = document.getElementById('step-total');
    if (numEl) numEl.textContent = s.n;
    if (totEl) totEl.textContent = steps.length;

    // نصوص
    var titleEl = document.getElementById('step-title');
    var descEl = document.getElementById('step-desc');
    if (titleEl) titleEl.textContent = s.t;
    if (descEl) descEl.textContent = s.d;

    // تفاصيل
    var listEl = document.getElementById('details-list');
    if (listEl) {
      var dh = '';
      s.dt.forEach(function (item) {
        dh += '<li>' + IC.arrowL + '<span>' + item + '</span></li>';
      });
      listEl.innerHTML = dh;
    }

    // أزرار التنقل
    var prev = document.getElementById('prev-btn');
    var next = document.getElementById('next-btn');
    if (prev) prev.disabled = (step === 0);
    if (next) next.disabled = (step === steps.length - 1);

    // تحديث الشريط الجانبي
    syncSidebar();

    // تأثير ظهور
    var card = document.getElementById('detail-card');
    if (card) {
      card.style.animation = 'none';
      void card.offsetHeight;
      card.style.animation = 'cardFadeIn .3s ease';
    }
  }

  /* ==========================================================
     5. نقاط التنقل
     ========================================================== */
  function renderDots() {
    var wrap = document.getElementById('dots-wrap');
    if (!wrap) return;

    var steps = DATA[role];
    var h = '';
    steps.forEach(function (_, i) {
      h += '<div class="hiw-dot' + (i === step ? ' active' : '') + '" data-d="' + i + '"></div>';
    });
    wrap.innerHTML = h;

    wrap.querySelectorAll('.hiw-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        step = parseInt(dot.getAttribute('data-d'));
        if (isNaN(step)) return;
        renderStep();
        renderDots();
      });
    });
  }

  /* ==========================================================
     6. أزرار سابق/تالي
     ========================================================== */
  function initNav() {
    var prev = document.getElementById('prev-btn');
    var next = document.getElementById('next-btn');

    if (prev) {
      prev.addEventListener('click', function () {
        if (step > 0) { step--; renderStep(); renderDots(); }
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        var steps = DATA[role];
        if (steps && step < steps.length - 1) { step++; renderStep(); renderDots(); }
      });
    }
  }

  /* ==========================================================
     7. لوحة المفاتيح
     ========================================================== */
  function initKeys() {
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      var steps = DATA[role];
      if (!steps) return;
      if (e.key === 'ArrowRight' && step > 0) { e.preventDefault(); step--; renderStep(); renderDots(); }
      if (e.key === 'ArrowLeft' && step < steps.length - 1) { e.preventDefault(); step++; renderStep(); renderDots(); }
    });
  }

  /* ==========================================================
     8. رسوم الظهور عند التمرير
     ========================================================== */
  function initReveal() {
    var els = document.querySelectorAll('.hiw-feat-card, .hiw-country, .hiw-info-card, .hiw-cta-inner');
    if (!els.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0)';
          obs.unobserve(en.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -30px 0px' });

    els.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      obs.observe(el);
    });
  }

  /* ==========================================================
     التهيئة
     ========================================================== */
  function init() {
    initTheme();
    initTabs();
    renderSidebar();
    renderStep();
    renderDots();
    initNav();
    initKeys();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();