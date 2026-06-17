/* ============================================================
   SAN3A — admin.js (Admin Dashboard)
   ============================================================ */

// ── Data ────────────────────────────────────────────────────
const ADMIN_DATA = {
  currentRole: 'super_admin',
  currency: 'EGP'
};

const ADMIN_ROLES = {
  super_admin:      { label: 'مدير عام',          color: 'badge-purple', permissions: ['all'] },
  booking_manager:  { label: 'مشرف الحجوزات',    color: 'badge-blue',   permissions: ['view_bookings','edit_bookings','view_workers','view_users'] },
  finance_manager:  { label: 'مشرف المالية',      color: 'badge-green',  permissions: ['view_finance','view_bookings','export_reports'] },
  worker_manager:   { label: 'مشرف العمال',       color: 'badge-orange', permissions: ['view_workers','edit_workers','approve_workers','view_bookings'] }
};

const PERMISSION_MATRIX = {
  'عرض لوحة التحكم':       { super_admin: true,  booking_manager: true,  finance_manager: true,  worker_manager: true  },
  'إدارة الحجوزات':        { super_admin: true,  booking_manager: true,  finance_manager: false, worker_manager: false },
  'إدارة العمال':          { super_admin: true,  booking_manager: false, finance_manager: false, worker_manager: true  },
  'الموافقة على العمال':   { super_admin: true,  booking_manager: false, finance_manager: false, worker_manager: true  },
  'إدارة العملاء':         { super_admin: true,  booking_manager: true,  finance_manager: false, worker_manager: false },
  'التقارير المالية':       { super_admin: true,  booking_manager: false, finance_manager: true,  worker_manager: false },
  'تصدير التقارير':        { super_admin: true,  booking_manager: false, finance_manager: true,  worker_manager: false },
  'إدارة الأدوار':         { super_admin: true,  booking_manager: false, finance_manager: false, worker_manager: false },
  'إعدادات النظام':        { super_admin: true,  booking_manager: false, finance_manager: false, worker_manager: false },
  'حظر / تفعيل مستخدم':   { super_admin: true,  booking_manager: true,  finance_manager: false, worker_manager: false }
};

const PERM_LABELS = {
  view_bookings: 'عرض الحجوزات', edit_bookings: 'تعديل الحجوزات',
  view_workers: 'عرض العمال', view_users: 'عرض العملاء',
  view_finance: 'التقارير المالية', export_reports: 'تصدير التقارير',
  edit_workers: 'تعديل العمال', approve_workers: 'قبول العمال'
};

const DEPOSIT_EGP = {
  cleaning:    { total: 80,  platform: 30, worker: 50  },
  plumbing:    { total: 100, platform: 40, worker: 60  },
  electricity: { total: 120, platform: 50, worker: 70  },
  carpentry:   { total: 140, platform: 60, worker: 80  },
  appliances:  { total: 150, platform: 65, worker: 85  },
  painting:    { total: 120, platform: 50, worker: 70  },
  moving:      { total: 200, platform: 90, worker: 110 }
};

const SERVICE_LABELS = {
  cleaning: 'تنظيف', plumbing: 'سباكة', electricity: 'كهرباء',
  carpentry: 'نجارة', appliances: 'أجهزة', painting: 'دهان', moving: 'نقل'
};

const MOCK_BOOKINGS = [
  { id:'BK-001', customer:'أحمد محمد', worker:'خالد إبراهيم', service:'cleaning', status:'مكتمل', date:'2024-04-10', hours:2, hourlyRate:200, depositTotal:80, depositPlatform:30, depositWorker:50 },
  { id:'BK-002', customer:'فاطمة علي', worker:'حسن عبد الله', service:'plumbing', status:'قيد التنفيذ', date:'2024-04-12', hours:1.5, hourlyRate:250, depositTotal:100, depositPlatform:40, depositWorker:60 },
  { id:'BK-003', customer:'محمد عبدالله', worker:'سامي أحمد', service:'electricity', status:'مجدول', date:'2024-04-15', hours:0, hourlyRate:300, depositTotal:120, depositPlatform:50, depositWorker:70 },
  { id:'BK-004', customer:'نورة السالم', worker:'جمال حسن', service:'carpentry', status:'مكتمل', date:'2024-04-08', hours:3, hourlyRate:280, depositTotal:140, depositPlatform:60, depositWorker:80 },
  { id:'BK-005', customer:'يوسف خالد', worker:'رامي عبدالله', service:'appliances', status:'ملغي', date:'2024-04-09', hours:0, hourlyRate:220, depositTotal:150, depositPlatform:65, depositWorker:85 },
  { id:'BK-006', customer:'سارة أحمد', worker:'بلال خالد', service:'moving', status:'مكتمل', date:'2024-04-07', hours:4, hourlyRate:200, depositTotal:200, depositPlatform:90, depositWorker:110 },
  { id:'BK-007', customer:'عمر حسين', worker:'زياد سامي', service:'painting', status:'مجدول', date:'2024-04-18', hours:0, hourlyRate:200, depositTotal:120, depositPlatform:50, depositWorker:70 }
];

const MOCK_WORKERS = [
  { id:'W-001', name:'خالد إبراهيم', profession:'عامل تنظيف', hourlyRate:200, rating:5.0, completedJobs:203, status:'نشط', verified:true, earnings:28400, depositEarned:10150 },
  { id:'W-002', name:'حسن عبد الله', profession:'سبّاك', hourlyRate:250, rating:5.0, completedJobs:289, status:'نشط', verified:true, earnings:42300, depositEarned:17340 },
  { id:'W-003', name:'سامي أحمد', profession:'كهربائي', hourlyRate:300, rating:5.0, completedJobs:312, status:'نشط', verified:true, earnings:56600, depositEarned:21840 },
  { id:'W-004', name:'جمال حسن', profession:'نجّار', hourlyRate:280, rating:5.0, completedJobs:267, status:'نشط', verified:true, earnings:45200, depositEarned:21360 },
  { id:'W-005', name:'فهد القحطاني', profession:'عامل دهان', hourlyRate:130, rating:3.9, completedJobs:0, status:'في انتظار الموافقة', verified:false, earnings:0, depositEarned:0 },
  { id:'W-006', name:'ماجد العتيبي', profession:'فني أجهزة', hourlyRate:120, rating:3.9, completedJobs:45, status:'معلق', verified:true, earnings:7200, depositEarned:3825 }
];

const MOCK_USERS = [
  { id:'U-001', name:'أحمد محمد السعيد', email:'ahmed.m@email.com', bookings:12, totalSpent:4800, status:'نشط', joinDate:'2024-01-15' },
  { id:'U-002', name:'فاطمة علي الخالدي', email:'fatima.a@email.com', bookings:7, totalSpent:2800, status:'نشط', joinDate:'2024-02-10' },
  { id:'U-003', name:'محمد عبدالله', email:'mohammed.a@email.com', bookings:3, totalSpent:900, status:'محظور', joinDate:'2024-01-20' },
  { id:'U-004', name:'نورة السالم', email:'noura.s@email.com', bookings:5, totalSpent:1900, status:'نشط', joinDate:'2024-03-05' }
];

const MOCK_ADMINS = [
  { id:'A-001', name:'مدير النظام', email:'admin@san3a.com', role:'super_admin', lastLogin:'منذ 5 دقائق', active:true },
  { id:'A-002', name:'سلمى إبراهيم', email:'salma@san3a.com', role:'booking_manager', lastLogin:'منذ ساعة', active:true },
  { id:'A-003', name:'كريم العتيبي', email:'kareem@san3a.com', role:'finance_manager', lastLogin:'منذ 3 ساعات', active:true },
  { id:'A-004', name:'هند المطيري', email:'hend@san3a.com', role:'worker_manager', lastLogin:'اليوم', active:true }
];

const MONTHLY_REVENUE = [
  { month:'يناير',  bookings:45,  platformFees:1890, workerGuarantees:3150, finalPayments:12400 },
  { month:'فبراير', bookings:52,  platformFees:2184, workerGuarantees:3640, finalPayments:14300 },
  { month:'مارس',   bookings:68,  platformFees:2856, workerGuarantees:4760, finalPayments:18700 },
  { month:'أبريل',  bookings:71,  platformFees:2982, workerGuarantees:4970, finalPayments:19600 },
  { month:'مايو',   bookings:85,  platformFees:3570, workerGuarantees:5950, finalPayments:23400 },
  { month:'يونيو',  bookings:92,  platformFees:3864, workerGuarantees:6440, finalPayments:25300 }
];

const SERVICE_REVENUE = [
  { name:'تنظيف', value:35, color:'#3b82f6' },
  { name:'سباكة', value:22, color:'#10b981' },
  { name:'كهرباء', value:18, color:'#f59e0b' },
  { name:'نجارة', value:10, color:'#ef4444' },
  { name:'أجهزة', value:8,  color:'#8b5cf6' },
  { name:'دهان', value:4,  color:'#ec4899' },
  { name:'نقل', value:3,   color:'#6366f1' }
];

const PENDING_ACTIONS = [
  { type:'عامل جديد بانتظار الموافقة', name:'فهد القحطاني', urgency:'عاجل', color:'orange' },
  { type:'نزاع في حجز', name:'BK-003', urgency:'مراجعة', color:'red' },
  { type:'تقييم منخفض', name:'عمر حسام (3.5)', urgency:'متابعة', color:'yellow' }
];

const ACTIVITIES = [
  { action:'حجز جديد BK-007', user:'عمر حسين', time:'منذ 10 دقائق', color:'blue' },
  { action:'عامل طلب انضمام', user:'فهد القحطاني', time:'منذ 30 دقيقة', color:'orange' },
  { action:'دفع مكتمل', user:'سارة أحمد', time:'منذ ساعة', color:'green' },
  { action:'تقييم 5 نجوم', user:'نورة السالم', time:'منذ ساعتين', color:'yellow' }
];

// ── State ───────────────────────────────────────────────────
let currentSection = 'dashboard';
let searchQuery = '';

// ── Helpers ─────────────────────────────────────────────────
const formatCurrency = (amount) => `${amount.toLocaleString()} ج.م`;
const calcFinalBill = (b) => b.status === 'مكتمل' ? b.hours * b.hourlyRate : null;
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

const statusBadge = (status) => {
  const map = {
    'مكتمل': 'badge-green', 'قيد التنفيذ': 'badge-blue', 'مجدول': 'badge-yellow',
    'ملغي': 'badge-red', 'نشط': 'badge-green', 'معلق': 'badge-yellow',
    'محظور': 'badge-red', 'في انتظار الموافقة': 'badge-orange'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
};

const roleBadge = (role) => {
  const r = ADMIN_ROLES[role];
  return `<span class="badge ${r.color}">${r.label}</span>`;
};

// ── SVG Icons ───────────────────────────────────────────────
const icons = {
  dollar: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  file: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  briefcase: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  trend: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  alert: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  key: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  ban: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  userCheck: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>`,
  chevron: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  lock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.5 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 3.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 7.5 4.5a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.5 9a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  text: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
};

// ── Toast ───────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Sidebar Toggle ──────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('sidebar-overlay').classList.toggle('active');
}

// ── Modal ───────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// ── Section Navigation ────────────────────────────────────
function setSection(section) {
  currentSection = section;
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.section === section);
  });
  renderSection();
}

// ── Search ──────────────────────────────────────────────────
function setSearch(value) {
  searchQuery = value;
  renderSection();
}

// ── Render: Dashboard ─────────────────────────────────────
function renderDashboard() {
  const totalPlatform = MONTHLY_REVENUE.reduce((s, m) => s + m.platformFees, 0);
  const totalGuarantees = MONTHLY_REVENUE.reduce((s, m) => s + m.workerGuarantees, 0);
  const totalBookings = MONTHLY_REVENUE.reduce((s, m) => s + m.bookings, 0);
  const activeWorkers = MOCK_WORKERS.filter(w => w.status === 'نشط').length;
  const pendingWorkers = MOCK_WORKERS.filter(w => w.status === 'في انتظار الموافقة').length;

  // Bar chart data
  const maxVal = Math.max(...MONTHLY_REVENUE.map(m => Math.max(m.platformFees, m.workerGuarantees, m.finalPayments)));
  const barHeight = (val) => Math.round((val / maxVal) * 180);

  // Pie chart (conic gradient)
  let pieGrad = [];
  let cum = 0;
  SERVICE_REVENUE.forEach(s => {
    pieGrad.push(`${s.color} ${cum}% ${cum + s.value}%`);
    cum += s.value;
  });

  return `
    <div class="section-content">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-blue">
          <div class="kpi-icon">${icons.dollar}</div>
          <div class="kpi-label">إيرادات المنصة</div>
          <div class="kpi-value">${formatCurrency(totalPlatform)}</div>
          <div class="kpi-sub">من رسوم جدية الحجز</div>
        </div>
        <div class="kpi-card kpi-green">
          <div class="kpi-icon">${icons.shield}</div>
          <div class="kpi-label">ضمانات العمال</div>
          <div class="kpi-value">${formatCurrency(totalGuarantees)}</div>
          <div class="kpi-sub">محوّلة للعمال</div>
        </div>
        <div class="kpi-card kpi-orange">
          <div class="kpi-icon">${icons.file}</div>
          <div class="kpi-label">إجمالي الحجوزات</div>
          <div class="kpi-value">${totalBookings}</div>
          <div class="kpi-sub">هذا الشهر: 92</div>
        </div>
        <div class="kpi-card kpi-purple">
          <div class="kpi-icon">${icons.briefcase}</div>
          <div class="kpi-label">عمال نشطون</div>
          <div class="kpi-value">${activeWorkers}</div>
          <div class="kpi-sub">في انتظار الموافقة: ${pendingWorkers}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 2fr;gap:20px;margin-bottom:24px;">
        <!-- Pie Chart -->
        <div class="card">
          <div class="card-header">
            <h3>توزيع الخدمات</h3>
          </div>
          <div class="card-body">
            <div style="display:flex;align-items:center;justify-content:center;gap:20px;">
              <div style="width:160px;height:160px;border-radius:50%;background:conic-gradient(${pieGrad.join(',')});position:relative;">
                <div style="position:absolute;inset:30px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;" class="dark-mode-pie-center"></div>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                ${SERVICE_REVENUE.map(s => `
                  <div style="display:flex;align-items:center;gap:6px;font-size:12px;">
                    <div style="width:10px;height:10px;border-radius:2px;background:${s.color};"></div>
                    <span>${s.name} ${s.value}%</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Bar Chart -->
        <div class="card">
          <div class="card-header">
            <h3>${icons.trend} الإيرادات الشهرية (ج.م)</h3>
          </div>
          <div class="card-body">
            <div style="display:flex;align-items:flex-end;justify-content:center;gap:12px;height:220px;padding:0 10px;">
              ${MONTHLY_REVENUE.map(m => `
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;max-width:70px;">
                  <div style="display:flex;align-items:flex-end;gap:2px;width:100%;height:180px;">
                    <div style="flex:1;background:#3b82f6;border-radius:3px 3px 0 0;height:${barHeight(m.platformFees)}px;min-width:6px;transition:height 0.5s;"></div>
                    <div style="flex:1;background:#10b981;border-radius:3px 3px 0 0;height:${barHeight(m.workerGuarantees)}px;min-width:6px;transition:height 0.5s;"></div>
                    <div style="flex:1;background:#8b5cf6;border-radius:3px 3px 0 0;height:${barHeight(m.finalPayments)}px;min-width:6px;transition:height 0.5s;"></div>
                  </div>
                  <span style="font-size:11px;color:#64748b;">${m.month}</span>
                </div>
              `).join('')}
            </div>
            <div class="chart-legend">
              <div class="legend-item"><div class="legend-dot" style="background:#3b82f6;"></div>رسوم المنصة</div>
              <div class="legend-item"><div class="legend-dot" style="background:#10b981;"></div>ضمانات العمال</div>
              <div class="legend-item"><div class="legend-dot" style="background:#8b5cf6;"></div>مدفوعات نهائية</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deposit Reference -->
      <div class="card" style="margin-bottom:24px;border-color:#bfdbfe;background:#eff6ff;">
        <div class="card-header" style="border-color:#bfdbfe;">
          <h3 style="color:#1e3a5f;">${icons.key} مرجع: هيكل جدية الحجز (بالجنيه المصري)</h3>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table class="deposit-table">
              <thead>
                <tr>
                  <th>الخدمة</th>
                  <th style="color:#1d4ed8;">إجمالي الجدية</th>
                  <th style="color:#7c3aed;">رسوم المنصة</th>
                  <th style="color:#059669;">ضمان العامل</th>
                  <th>نسبة المنصة</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(DEPOSIT_EGP).map(([svc, d]) => `
                  <tr>
                    <td style="font-weight:600;">${SERVICE_LABELS[svc]}</td>
                    <td style="font-weight:700;color:#1d4ed8;">${d.total} ج.م</td>
                    <td style="color:#7c3aed;">${d.platform} ج.م</td>
                    <td style="color:#059669;">${d.worker} ج.م</td>
                    <td><span class="badge badge-purple">${Math.round((d.platform/d.total)*100)}%</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <p style="font-size:12px;color:#3b82f6;margin-top:12px;">💡 النسبة تكبر مع الخدمات ذات القيمة الأعلى — نموذج تصاعدي مقصود</p>
        </div>
      </div>

      <!-- Bottom Cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <!-- Pending Actions -->
        <div class="card">
          <div class="card-header">
            <h3>${icons.alert} يحتاج إجراء فوري</h3>
          </div>
          <div class="card-body">
            ${PENDING_ACTIONS.map(item => `
              <div class="pending-item">
                <div>
                  <div class="pending-title">${item.type}</div>
                  <div class="pending-sub">${item.name}</div>
                </div>
                <span class="badge badge-${item.color}">${item.urgency}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="card">
          <div class="card-header">
            <h3>${icons.clock} آخر النشاطات</h3>
          </div>
          <div class="card-body">
            ${ACTIVITIES.map(a => `
              <div class="activity-item">
                <div class="activity-main">
                  <div class="activity-dot ${a.color}"></div>
                  <div>
                    <div class="activity-text">${a.action}</div>
                    <div class="activity-sub">${a.user}</div>
                  </div>
                </div>
                <span class="activity-time">${a.time}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Render: Bookings ──────────────────────────────────────
function renderBookings() {
  const totalDeposit = MOCK_BOOKINGS.reduce((s, b) => s + b.depositTotal, 0);
  const totalPlatform = MOCK_BOOKINGS.reduce((s, b) => s + b.depositPlatform, 0);
  const totalWorker = MOCK_BOOKINGS.reduce((s, b) => s + b.depositWorker, 0);
  const totalFinal = MOCK_BOOKINGS.filter(b => b.status === 'مكتمل').reduce((s, b) => s + b.hours * b.hourlyRate, 0);

  const filtered = MOCK_BOOKINGS.filter(b =>
    !searchQuery ||
    b.id.includes(searchQuery) ||
    b.customer.includes(searchQuery) ||
    b.worker.includes(searchQuery)
  );

  return `
    <div class="section-content">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 class="section-title">إدارة الحجوزات</h2>
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="بحث..." value="${searchQuery}" oninput="setSearch(this.value)">
        </div>
      </div>

      <!-- Finance Summary -->
      <div class="info-grid">
        <div class="info-card info-blue">
          <div class="info-label">إجمالي الجدية المحصلة</div>
          <div class="info-value">${formatCurrency(totalDeposit)}</div>
        </div>
        <div class="info-card info-purple">
          <div class="info-label">رسوم المنصة</div>
          <div class="info-value">${formatCurrency(totalPlatform)}</div>
        </div>
        <div class="info-card info-green">
          <div class="info-label">ضمانات العمال</div>
          <div class="info-value">${formatCurrency(totalWorker)}</div>
        </div>
        <div class="info-card info-orange">
          <div class="info-label">مدفوعات نهائية</div>
          <div class="info-value">${formatCurrency(totalFinal)}</div>
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>رقم الحجز</th>
                  <th>العميل / العامل</th>
                  <th>الخدمة</th>
                  <th style="text-align:center;">الحالة</th>
                  <th style="text-align:center;">الجدية</th>
                  <th style="text-align:center;">م.موقع</th>
                  <th style="text-align:center;">ض.عامل</th>
                  <th style="text-align:center;">الساعات</th>
                  <th style="text-align:center;">الفاتورة</th>
                  <th style="text-align:center;">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(b => {
                  const finalBill = calcFinalBill(b);
                  const remaining = finalBill !== null ? finalBill - b.depositWorker : null;
                  return `
                    <tr>
                      <td style="font-family:monospace;font-size:12px;color:#3b82f6;font-weight:600;">${b.id}</td>
                      <td>
                        <div style="font-weight:600;font-size:13px;">${b.customer}</div>
                        <div style="font-size:11px;color:#94a3b8;">${b.worker}</div>
                      </td>
                      <td style="font-size:13px;">${SERVICE_LABELS[b.service]}</td>
                      <td style="text-align:center;">${statusBadge(b.status)}</td>
                      <td style="text-align:center;font-weight:700;color:#1d4ed8;">${b.depositTotal}</td>
                      <td style="text-align:center;color:#7c3aed;">${b.depositPlatform}</td>
                      <td style="text-align:center;color:#059669;">${b.depositWorker}</td>
                      <td style="text-align:center;font-size:12px;">${b.hours > 0 ? b.hours + 'h × ' + b.hourlyRate : '—'}</td>
                      <td style="text-align:center;">
                        ${finalBill !== null ? `
                          <div style="font-size:13px;">
                            <div style="font-weight:700;">${formatCurrency(finalBill)}</div>
                            <div style="font-size:11px;color:#f97316;">متبقي: ${formatCurrency(remaining)}</div>
                          </div>
                        ` : '—'}
                      </td>
                      <td style="text-align:center;">
                        <button class="action-btn" onclick="showToast('عرض تفاصيل الحجز ${b.id}', 'info')">${icons.eye}</button>
                        <button class="action-btn" onclick="showToast('تغيير حالة الحجز ${b.id}', 'info')">${icons.refresh}</button>
                        <button class="action-btn danger" onclick="showToast('إلغاء الحجز ${b.id}', 'error')">${icons.ban}</button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Render: Workers ───────────────────────────────────────
function renderWorkers() {
  const pendingCount = MOCK_WORKERS.filter(w => w.status === 'في انتظار الموافقة').length;
  const filtered = MOCK_WORKERS.filter(w => !searchQuery || w.name.includes(searchQuery));

  return `
    <div class="section-content">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 class="section-title">إدارة العمال</h2>
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="بحث عن عامل..." value="${searchQuery}" oninput="setSearch(this.value)">
        </div>
      </div>

      ${pendingCount > 0 ? `
        <div class="alert-banner alert-orange" style="margin-bottom:20px;">
          ${icons.alert}
          <span class="alert-text">${pendingCount} عامل بانتظار الموافقة على انضمامه للمنصة</span>
          <button class="btn btn-sm" style="background:#f97316;color:#fff;border:none;" onclick="showToast('جاري مراجعة العمال المعلقين', 'info')">مراجعة الآن</button>
        </div>
      ` : ''}

      <div class="card">
        <div class="card-body p-0">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>العامل</th>
                  <th>المهنة</th>
                  <th style="text-align:center;">سعر/ساعة</th>
                  <th style="text-align:center;">التقييم</th>
                  <th style="text-align:center;">وظائف مكتملة</th>
                  <th style="text-align:center;">الأرباح الكلية</th>
                  <th style="text-align:center;">ضمانات محصّلة</th>
                  <th style="text-align:center;">الحالة</th>
                  <th style="text-align:center;">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(w => `
                  <tr>
                    <td>
                      <div class="table-avatar">
                        <div class="avatar" style="background:#3b82f6;">${getInitials(w.name)}</div>
                        <div class="avatar-info">
                          <div class="name">${w.name}</div>
                          <div class="id">${w.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style="font-size:13px;">${w.profession}</td>
                    <td style="text-align:center;">
                      <span style="font-weight:700;color:#1d4ed8;">${w.hourlyRate}</span>
                      <span style="font-size:11px;color:#94a3b8;"> ج.م/ساعة</span>
                    </td>
                    <td style="text-align:center;">
                      <div style="display:flex;align-items:center;justify-content:center;gap:4px;">
                        ${icons.star}
                        <span style="font-weight:700;font-size:13px;">${w.rating}</span>
                      </div>
                    </td>
                    <td style="text-align:center;font-weight:700;">${w.completedJobs}</td>
                    <td style="text-align:center;color:#059669;font-weight:700;">${formatCurrency(w.earnings)}</td>
                    <td style="text-align:center;color:#7c3aed;">${formatCurrency(w.depositEarned)}</td>
                    <td style="text-align:center;">${statusBadge(w.status)}</td>
                    <td style="text-align:center;">
                      <button class="action-btn" onclick="showToast('عرض بروفايل ${w.name}', 'info')">${icons.eye}</button>
                      ${w.status === 'في انتظار الموافقة' ? `<button class="action-btn success" onclick="approveWorker('${w.id}')">${icons.userCheck}</button>` : ''}
                      <button class="action-btn" onclick="showToast('تعديل بيانات ${w.name}', 'info')">${icons.edit}</button>
                      <button class="action-btn warning" onclick="suspendWorker('${w.id}')">${icons.refresh}</button>
                      <button class="action-btn danger" onclick="banWorker('${w.id}')">${icons.ban}</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Render: Users ─────────────────────────────────────────
function renderUsers() {
  const filtered = MOCK_USERS.filter(u =>
    !searchQuery || u.name.includes(searchQuery) || u.email.includes(searchQuery)
  );

  return `
    <div class="section-content">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 class="section-title">إدارة العملاء</h2>
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="بحث عن عميل..." value="${searchQuery}" oninput="setSearch(this.value)">
        </div>
      </div>

      <div class="card">
        <div class="card-body p-0">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>العميل</th>
                  <th>البريد</th>
                  <th style="text-align:center;">الحجوزات</th>
                  <th style="text-align:center;">إجمالي الإنفاق</th>
                  <th style="text-align:center;">تاريخ الانضمام</th>
                  <th style="text-align:center;">الحالة</th>
                  <th style="text-align:center;">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(u => `
                  <tr>
                    <td>
                      <div class="table-avatar">
                        <div class="avatar" style="background:#94a3b8;">${getInitials(u.name)}</div>
                        <div class="avatar-info">
                          <div class="name">${u.name}</div>
                          <div class="id">${u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style="font-size:13px;color:#64748b;">${u.email}</td>
                    <td style="text-align:center;font-weight:700;">${u.bookings}</td>
                    <td style="text-align:center;color:#059669;font-weight:700;">${formatCurrency(u.totalSpent)}</td>
                    <td style="text-align:center;font-size:12px;color:#94a3b8;">${u.joinDate}</td>
                    <td style="text-align:center;">${statusBadge(u.status)}</td>
                    <td style="text-align:center;">
                      <button class="action-btn" onclick="showToast('عرض تفاصيل ${u.name}', 'info')">${icons.eye}</button>
                      <button class="action-btn" onclick="showToast('تعديل بيانات ${u.name}', 'info')">${icons.edit}</button>
                      <button class="action-btn ${u.status === 'محظور' ? 'success' : 'danger'}" onclick="toggleUserBan('${u.id}')">
                        ${u.status === 'محظور' ? icons.userCheck : icons.ban}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Render: Finance ───────────────────────────────────────
function renderFinance() {
  const totalPlatform = MONTHLY_REVENUE.reduce((s, m) => s + m.platformFees, 0);
  const totalGuarantees = MONTHLY_REVENUE.reduce((s, m) => s + m.workerGuarantees, 0);
  const totalFinal = MONTHLY_REVENUE.reduce((s, m) => s + m.finalPayments, 0);

  // Line chart points
  const maxVal = Math.max(...MONTHLY_REVENUE.map(m => Math.max(m.platformFees, m.workerGuarantees, m.finalPayments)));
  const chartH = 220;
  const points = (key) => MONTHLY_REVENUE.map((m, i) => {
    const x = (i / (MONTHLY_REVENUE.length - 1)) * 100;
    const y = chartH - ((m[key] / maxVal) * (chartH - 20));
    return `${x},${y}`;
  }).join(' ');

  return `
    <div class="section-content">
      <h2 class="section-title">التقارير المالية</h2>

      <!-- Summary Cards -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
        <div class="card" style="border-color:#ddd6fe;">
          <div class="card-body">
            <div style="font-size:12px;color:#7c3aed;margin-bottom:4px;">إجمالي إيرادات المنصة</div>
            <div style="font-size:28px;font-weight:800;color:#6d28d9;margin-bottom:4px;">${formatCurrency(totalPlatform)}</div>
            <div style="font-size:12px;color:#94a3b8;">من رسوم جدية الحجز (تصاعدية)</div>
          </div>
        </div>
        <div class="card" style="border-color:#a7f3d0;">
          <div class="card-body">
            <div style="font-size:12px;color:#059669;margin-bottom:4px;">ضمانات العمال المحوّلة</div>
            <div style="font-size:28px;font-weight:800;color:#047857;margin-bottom:4px;">${formatCurrency(totalGuarantees)}</div>
            <div style="font-size:12px;color:#94a3b8;">مضمونة للعامل بغض النظر</div>
          </div>
        </div>
        <div class="card" style="border-color:#bfdbfe;">
          <div class="card-body">
            <div style="font-size:12px;color:#2563eb;margin-bottom:4px;">إجمالي المدفوعات النهائية</div>
            <div style="font-size:28px;font-weight:800;color:#1d4ed8;margin-bottom:4px;">${formatCurrency(totalFinal)}</div>
            <div style="font-size:12px;color:#94a3b8;">بعد خصم الضمانات المدفوعة</div>
          </div>
        </div>
      </div>

      <!-- Line Chart -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <h3>التفصيل الشهري للإيرادات</h3>
        </div>
        <div class="card-body">
          <div style="position:relative;height:260px;">
            <svg width="100%" height="100%" viewBox="0 0 100 ${chartH + 30}" preserveAspectRatio="none">
              <!-- Grid lines -->
              ${[0, 1, 2, 3, 4].map(i => {
                const y = 20 + (i * (chartH - 20) / 4);
                return `<line x1="0" y1="${y}" x2="100" y2="${y}" stroke="#e2e8f0" stroke-width="0.3" stroke-dasharray="2,2"/>`;
              }).join('')}
              <!-- Lines -->
              <polyline points="${points('platformFees')}" fill="none" stroke="#8b5cf6" stroke-width="1.5"/>
              <polyline points="${points('workerGuarantees')}" fill="none" stroke="#10b981" stroke-width="1.5"/>
              <polyline points="${points('finalPayments')}" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
              <!-- Dots -->
              ${MONTHLY_REVENUE.map((m, i) => {
                const x = (i / (MONTHLY_REVENUE.length - 1)) * 100;
                return ['platformFees','workerGuarantees','finalPayments'].map((key, ci) => {
                  const colors = ['#8b5cf6','#10b981','#3b82f6'];
                  const y = chartH - ((m[key] / maxVal) * (chartH - 20));
                  return `<circle cx="${x}" cy="${y}" r="1.5" fill="${colors[ci]}"/>`;
                }).join('');
              }).join('')}
              <!-- X labels -->
              ${MONTHLY_REVENUE.map((m, i) => {
                const x = (i / (MONTHLY_REVENUE.length - 1)) * 100;
                return `<text x="${x}" y="${chartH + 18}" text-anchor="middle" font-size="3" fill="#64748b">${m.month}</text>`;
              }).join('')}
            </svg>
          </div>
          <div class="chart-legend">
            <div class="legend-item"><div class="legend-dot" style="background:#8b5cf6;"></div>رسوم المنصة</div>
            <div class="legend-item"><div class="legend-dot" style="background:#10b981;"></div>ضمانات العمال</div>
            <div class="legend-item"><div class="legend-dot" style="background:#3b82f6;"></div>مدفوعات نهائية</div>
          </div>
        </div>
      </div>

      <!-- Deposit Model Explainer -->
      <div class="card" style="border-color:#a7f3d0;background:#ecfdf5;">
        <div class="card-header" style="border-color:#a7f3d0;">
          <h3 style="color:#065f46;">${icons.dollar} آلية حساب الأرباح لكل حجز</h3>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
            <div>
              <h4 style="font-size:14px;font-weight:700;color:#065f46;margin-bottom:8px;">حساب الموقع من كل حجز:</h4>
              <div style="background:#fff;border-radius:10px;padding:16px;font-size:13px;color:#065f46;line-height:1.8;">
                <p>📥 المنصة تحصل: <strong>رسوم المنصة من الجدية</strong></p>
                <p>📊 مثال (تنظيف): <strong>30 ج.م</strong> فوراً عند الحجز</p>
                <p>📈 كلما كانت الخدمة أعلى قيمة، زادت نسبة المنصة</p>
              </div>
            </div>
            <div>
              <h4 style="font-size:14px;font-weight:700;color:#065f46;margin-bottom:8px;">حساب العامل من كل حجز:</h4>
              <div style="background:#fff;border-radius:10px;padding:16px;font-size:13px;color:#065f46;line-height:1.8;">
                <p>💰 يحصل على: <strong>ضمان الجدية</strong> + <strong>المبلغ المتبقي</strong></p>
                <p>📊 مثال: عامل سعره 200 ج.م/ساعة، عمل 2 ساعة</p>
                <p>= ضمان 50 ج.م + متبقي 350 ج.م = <strong>400 ج.م إجمالي</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Render: Roles ─────────────────────────────────────────
function renderRoles() {
  return `
    <div class="section-content">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 class="section-title">إدارة الأدوار والصلاحيات</h2>
        <button class="btn btn-primary" onclick="openModal('add-admin-modal')">
          ${icons.userCheck} إضافة مدير جديد
        </button>
      </div>

      <!-- Role Cards -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
        ${Object.entries(ADMIN_ROLES).map(([key, role]) => `
          <div class="role-card">
            <div class="role-badge">
              <span class="badge ${role.color}">${role.label}</span>
            </div>
            <ul class="role-perms">
              ${role.permissions.includes('all')
                ? '<li>${icons.check} <span style="color:#7c3aed;font-weight:600;">✅ صلاحيات كاملة</span></li>'
                : role.permissions.map(p => `<li>${icons.check} ${PERM_LABELS[p] || p}</li>`).join('')
              }
            </ul>
          </div>
        `).join('')}
      </div>

      <!-- Permission Matrix -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">
          <h3>${icons.lock} مصفوفة الصلاحيات</h3>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table class="data-table matrix-table">
              <thead>
                <tr>
                  <th>الصلاحية</th>
                  ${Object.entries(ADMIN_ROLES).map(([k, r]) => `
                    <th><span class="badge ${r.color}">${r.label}</span></th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                ${Object.entries(PERMISSION_MATRIX).map(([perm, roles]) => `
                  <tr>
                    <td style="font-weight:600;">${perm}</td>
                    ${Object.keys(ADMIN_ROLES).map(role => `
                      <td>
                        ${roles[role]
                          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
                          : '<span class="perm-x">—</span>'
                        }
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Admin Accounts -->
      <div class="card">
        <div class="card-header">
          <h3>حسابات الإداريين الحالية</h3>
        </div>
        <div class="card-body p-0">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>المدير</th>
                  <th>البريد</th>
                  <th style="text-align:center;">الدور</th>
                  <th style="text-align:center;">آخر تسجيل دخول</th>
                  <th style="text-align:center;">الحالة</th>
                  <th style="text-align:center;">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${MOCK_ADMINS.map(admin => `
                  <tr>
                    <td style="font-weight:600;">${admin.name}</td>
                    <td style="font-size:13px;color:#64748b;">${admin.email}</td>
                    <td style="text-align:center;">${roleBadge(admin.role)}</td>
                    <td style="text-align:center;font-size:13px;color:#94a3b8;">${admin.lastLogin}</td>
                    <td style="text-align:center;">
                      <span class="badge ${admin.active !== false ? 'badge-green' : 'badge-red'}">
                        ${admin.active !== false ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td style="text-align:center;">
                      <button class="action-btn" onclick="showToast('تعديل بيانات ${admin.name}', 'info')">${icons.edit}</button>
                      ${admin.id !== 'A-001' ? `
                        <button class="action-btn ${admin.active !== false ? 'danger' : 'success'}" onclick="toggleAdminStatus('${admin.id}')">
                          ${admin.active !== false ? icons.ban : icons.userCheck}
                        </button>
                      ` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Render: Settings ──────────────────────────────────────
function renderSettings() {
  const settingsItems = [
    { title:'إعدادات جدية الحجز', desc:'تعديل مبالغ الجدية ونسبة المنصة لكل خدمة', icon:'dollar', action:'تعديل الأسعار', modal:'edit-prices-modal' },
    { title:'إشعارات النظام', desc:'إدارة رسائل البريد والإشعارات الفورية', icon:'bell', action:'الإعدادات' },
    { title:'النسخ الاحتياطي', desc:'جدولة النسخ الاحتياطي للبيانات', icon:'refresh', action:'جدولة' },
    { title:'الأمان', desc:'إدارة كلمات المرور وتسجيل الدخول الثنائي', icon:'lock', action:'الأمان' },
    { title:'التقارير المجدولة', desc:'جدولة إرسال التقارير تلقائياً للمدير', icon:'text', action:'إعداد الجدول' }
  ];

  return `
    <div class="section-content">
      <h2 class="section-title">إعدادات النظام</h2>
      <div style="max-width:700px;">
        ${settingsItems.map(item => `
          <div class="settings-card">
            <div style="display:flex;align-items:center;gap:16px;">
              <div class="settings-icon">${icons[item.icon]}</div>
              <div class="settings-info">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
              </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="${item.modal ? `openModal('${item.modal}')` : `showToast('قريباً: ${item.title}', 'info')`}">
              ${item.action}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── Action Functions ──────────────────────────────────────
function approveWorker(id) {
  const worker = MOCK_WORKERS.find(w => w.id === id);
  if (worker) {
    worker.status = 'نشط';
    worker.verified = true;
    showToast('تم قبول العامل ' + worker.name, 'success');
    renderSection();
  }
}

function suspendWorker(id) {
  const worker = MOCK_WORKERS.find(w => w.id === id);
  if (worker) {
    worker.status = worker.status === 'معلق' ? 'نشط' : 'معلق';
    showToast('تم ' + (worker.status === 'معلق' ? 'تعليق' : 'تفعيل') + ' العامل ' + worker.name, 'info');
    renderSection();
  }
}

function banWorker(id) {
  const worker = MOCK_WORKERS.find(w => w.id === id);
  if (worker) {
    worker.status = 'محظور';
    showToast('تم حظر العامل ' + worker.name, 'error');
    renderSection();
  }
}

function toggleUserBan(id) {
  const user = MOCK_USERS.find(u => u.id === id);
  if (user) {
    user.status = user.status === 'محظور' ? 'نشط' : 'محظور';
    showToast('تم ' + (user.status === 'محظور' ? 'حظر' : 'تفعيل') + ' العميل ' + user.name, user.status === 'محظور' ? 'error' : 'success');
    renderSection();
  }
}

function toggleAdminStatus(id) {
  const admin = MOCK_ADMINS.find(a => a.id === id);
  if (admin) {
    admin.active = admin.active === false ? true : false;
    showToast('تم ' + (admin.active !== false ? 'تفعيل' : 'تعطيل') + ' حساب ' + admin.name, admin.active !== false ? 'success' : 'error');
    renderSection();
  }
}

function addNewAdmin() {
  const name = document.getElementById('new-admin-name').value;
  const email = document.getElementById('new-admin-email').value;
  const role = document.getElementById('new-admin-role').value;
  const password = document.getElementById('new-admin-password').value;

  if (!name || !email || !password) {
    showToast('يرجى ملء جميع الحقول', 'error');
    return;
  }

  const newAdmin = {
    id: 'A-' + String(MOCK_ADMINS.length + 1).padStart(3, '0'),
    name, email, role,
    lastLogin: 'لم يسبق له',
    active: true
  };

  MOCK_ADMINS.push(newAdmin);
  showToast('تم إضافة المدير ' + name + ' بنجاح', 'success');
  closeModal('add-admin-modal');

  document.getElementById('new-admin-name').value = '';
  document.getElementById('new-admin-email').value = '';
  document.getElementById('new-admin-password').value = '';

  renderSection();
}

function savePrices() {
  Object.keys(DEPOSIT_EGP).forEach(svc => {
    const total = parseInt(document.getElementById('price-' + svc + '-total').value);
    const platform = parseInt(document.getElementById('price-' + svc + '-platform').value);
    const worker = parseInt(document.getElementById('price-' + svc + '-worker').value);
    if (!isNaN(total)) DEPOSIT_EGP[svc].total = total;
    if (!isNaN(platform)) DEPOSIT_EGP[svc].platform = platform;
    if (!isNaN(worker)) DEPOSIT_EGP[svc].worker = worker;
  });
  showToast('تم حفظ التعديلات بنجاح', 'success');
  closeModal('edit-prices-modal');
  renderSection();
}

// ── Main Render ───────────────────────────────────────────
function renderSection() {
  const content = document.getElementById('admin-content');
  switch (currentSection) {
    case 'dashboard': content.innerHTML = renderDashboard(); break;
    case 'bookings':  content.innerHTML = renderBookings(); break;
    case 'workers':   content.innerHTML = renderWorkers(); break;
    case 'users':     content.innerHTML = renderUsers(); break;
    case 'finance':   content.innerHTML = renderFinance(); break;
    case 'roles':     content.innerHTML = renderRoles(); break;
    case 'settings':  content.innerHTML = renderSettings(); break;
    default:          content.innerHTML = renderDashboard();
  }

  // Fix dark mode pie chart center
  if (document.documentElement.classList.contains('dark')) {
    const pieCenter = document.querySelector('.dark-mode-pie-center');
    if (pieCenter) pieCenter.style.background = '#1e293b';
  }
}

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const role = ADMIN_ROLES[ADMIN_DATA.currentRole];
  document.getElementById('admin-role-badge').textContent = role.label;
  document.getElementById('header-role').textContent = role.label;

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => setSection(item.dataset.section));
  });

  document.getElementById('global-search').addEventListener('input', (e) => {
    setSearch(e.target.value);
  });

  // Populate prices modal
  const pricesGrid = document.getElementById('prices-grid');
  if (pricesGrid) {
    pricesGrid.innerHTML = Object.entries(DEPOSIT_EGP).map(([svc, d]) => `
      <div class="price-item">
        <h4>${SERVICE_LABELS[svc]}</h4>
        <div class="price-row">
          <label>إجمالي الجدية</label>
          <input type="number" id="price-${svc}-total" value="${d.total}">
        </div>
        <div class="price-row">
          <label>رسوم المنصة</label>
          <input type="number" id="price-${svc}-platform" value="${d.platform}">
        </div>
        <div class="price-row">
          <label>ضمان العامل</label>
          <input type="number" id="price-${svc}-worker" value="${d.worker}">
        </div>
      </div>
    `).join('');
  }

  renderSection();
});