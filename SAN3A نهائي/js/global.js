const SAN3A = {
  theme: {
    init() {
      const saved = localStorage.getItem('san3a-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
      this.updateIcons();
    },
    toggle() {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('san3a-theme', isDark ? 'dark' : 'light');
      this.updateIcons();
    },
    updateIcons() {
      const isDark = document.documentElement.classList.contains('dark');
      document.querySelectorAll('#moon-icon').forEach(el => el.classList.toggle('hidden', isDark));
      document.querySelectorAll('#sun-icon').forEach(el => el.classList.toggle('hidden', !isDark));
    }
  },

  storage: {
    set(key, value) { localStorage.setItem('san3a-' + key, JSON.stringify(value)); },
    get(key) { const data = localStorage.getItem('san3a-' + key); return data ? JSON.parse(data) : null; },
    remove(key) { localStorage.removeItem('san3a-' + key); }
  },

  toast(message, type = 'info', duration = 3000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.className = `toast toast-${type}`;
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 300); }, duration);
  },

  navigate(page) { window.location.href = page + '.html'; },
  goBack() { window.history.back(); },

  currency: {
    map: {
      'مصر': { code: 'EGP', symbol: 'ج.م', name: 'جنيه مصري' },
      'السعودية': { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي' },
      'الإمارات': { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي' }
    },
    get(country) { return this.map[country] || this.map['مصر']; },
    format(amount, country) { return amount + ' ' + this.get(country).symbol; }
  },

  /* ===== CHATBOT WIDGET (Standalone - No Backend) ===== */
  chatbot: {
    isOpen: false,
    isMinimized: false,
    isTyping: false,
    messages: [],

    getTime() {
      return new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    },

    getBotResponse(input) {
      const text = input.toLowerCase();
      const responses = {
        default: "شكراً لتواصلك مع صنّاع! كيف يمكنني مساعدتك؟",
        greeting: "أهلاً وسهلاً! 👋 أنا مساعد صنّاع الذكي. يمكنني مساعدتك في الحجز، الأسعار، أو أي استفسار.",
        booking: "لحجز خدمة، اختر الخدمة التي تريدها من صفحة الخدمات ثم اختر عاملاً مناسباً. هل تحتاج مساعدة في خطوة معينة؟",
        price: "أسعارنا تبدأ من 80 جنيه جدية للتنظيف، و100 للسباكة، و120 للكهرباء. السعر النهائي يعتمد على عدد الساعات وسعر العامل/ساعة.",
        payment: "نقبل الدفع الإلكتروني وبطاقات الائتمان. مبلغ الجدية يُدفع عند الحجز، والمبلغ المتبقي بعد انتهاء الخدمة.",
        worker: "عمالنا معتمدون ومدرّبون. كل عامل لديه تقييمات من عملاء سابقين يمكنك الاطلاع عليها.",
        cancel: "يمكنك إلغاء الحجز قبل 24 ساعة من الموعد. رسوم المنصة غير مستردة، لكن ضمان العامل يُعاد إليك.",
        contact: "يمكنك التواصل معنا على البريد: support@san3a.com أو عبر هذا الشات مباشرة.",
      };
      if (text.match(/أهلا|سلام|مرحبا|هاي|hello|hi/)) return responses.greeting;
      if (text.match(/حجز|احجز|أحجز|booking/)) return responses.booking;
      if (text.match(/سعر|تكلفة|كام|بكام|price/)) return responses.price;
      if (text.match(/دفع|فلوس|payment|pay/)) return responses.payment;
      if (text.match(/عامل|فني|worker/)) return responses.worker;
      if (text.match(/إلغاء|الغاء|cancel/)) return responses.cancel;
      if (text.match(/تواصل|تليفون|واتس|اتصل|contact/)) return responses.contact;
      return responses.default;
    },

    init() {
      if (document.getElementById('san3a-chatbot')) return;

      // Load from localStorage
      const saved = localStorage.getItem('san3a-chat-messages');
      if (saved) {
        try { this.messages = JSON.parse(saved); }
        catch (e) { this.messages = []; }
      }

      if (!this.messages.length) {
        this.messages = [
          { id: 1, text: "أهلاً! 👋 أنا مساعد صنّاع. كيف يمكنني مساعدتك اليوم؟", sender: "bot", time: this.getTime() }
        ];
      }

      this.createHTML();
      this.bindEvents();
      this.renderMessages();
    },

    saveMessages() {
      localStorage.setItem('san3a-chat-messages', JSON.stringify(this.messages));
    },

    createHTML() {
      const container = document.createElement('div');
      container.id = 'san3a-chatbot';
      container.dir = 'rtl';

      const svgBot = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
      const svgUser = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
      const svgSend = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a.5.5 0 0 1 .023.023z"/><path d="m13.5 10.5 4 4"/></svg>`;
      const svgClose = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
      const svgMinimize = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
      const svgMessage = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
      const svgTrash = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;

      container.innerHTML = `
        <div class="chat-window" id="chat-window">
          <div class="chat-header">
            <div class="chat-header-info">
              <div class="chat-avatar bot-avatar">${svgBot}</div>
              <div>
                <p class="chat-title">مساعد صنّاع</p>
                <div class="chat-status">
                  <span class="status-dot"></span>
                  <span>متاح الآن</span>
                </div>
              </div>
            </div>
            <div class="chat-header-actions">
              <button class="chat-header-btn" id="chat-clear" title="مسح المحادثة">${svgTrash}</button>
              <button class="chat-header-btn" id="chat-minimize" title="تصغير">${svgMinimize}</button>
              <button class="chat-header-btn" id="chat-close" title="إغلاق">${svgClose}</button>
            </div>
          </div>
          <div class="chat-messages" id="chat-messages"></div>
          <div class="chat-quick-replies" id="chat-quick-replies">
            <button data-reply="الأسعار">الأسعار</button>
            <button data-reply="طريقة الحجز">طريقة الحجز</button>
            <button data-reply="طرق الدفع">طرق الدفع</button>
            <button data-reply="تواصل معنا">تواصل معنا</button>
          </div>
          <div class="chat-input-area">
            <button class="chat-send-btn" id="chat-send" disabled>${svgSend}</button>
            <input type="text" id="chat-input" placeholder="اكتب رسالتك..." autocomplete="off">
          </div>
        </div>
        <button class="chat-fab" id="chat-fab">
          <span class="chat-pulse" id="chat-pulse"></span>
          <span id="fab-icon-open">${svgMessage}</span>
          <span id="fab-icon-close" style="display:none">${svgClose}</span>
          <span class="chat-badge" id="chat-badge">1</span>
        </button>
      `;

      document.body.appendChild(container);
    },

    bindEvents() {
      const fab = document.getElementById('chat-fab');
      const closeBtn = document.getElementById('chat-close');
      const minimizeBtn = document.getElementById('chat-minimize');
      const clearBtn = document.getElementById('chat-clear');
      const sendBtn = document.getElementById('chat-send');
      const input = document.getElementById('chat-input');
      const quickReplies = document.getElementById('chat-quick-replies');

      fab.addEventListener('click', () => this.toggle());
      closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.close(); });
      minimizeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.minimize(); });
      clearBtn.addEventListener('click', (e) => { e.stopPropagation(); this.clearHistory(); });
      sendBtn.addEventListener('click', () => this.sendMessage());

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });

      input.addEventListener('input', () => {
        sendBtn.disabled = !input.value.trim();
      });

      quickReplies.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          const reply = e.target.dataset.reply;
          input.value = reply;
          sendBtn.disabled = false;
          this.sendMessage();
        }
      });
    },

    toggle() {
      this.isOpen = !this.isOpen;
      const container = document.getElementById('san3a-chatbot');
      const fabOpen = document.getElementById('fab-icon-open');
      const fabClose = document.getElementById('fab-icon-close');
      const pulse = document.getElementById('chat-pulse');
      const badge = document.getElementById('chat-badge');

      if (this.isOpen) {
        container.classList.add('open');
        this.isMinimized = false;
        container.classList.remove('minimized');
        fabOpen.style.display = 'none';
        fabClose.style.display = 'flex';
        pulse.style.display = 'none';
        badge.style.display = 'none';
        this.scrollToBottom();
        setTimeout(() => document.getElementById('chat-input').focus(), 300);
      } else {
        container.classList.remove('open');
        fabOpen.style.display = 'flex';
        fabClose.style.display = 'none';
      }
    },

    close() {
      this.isOpen = false;
      const container = document.getElementById('san3a-chatbot');
      const fabOpen = document.getElementById('fab-icon-open');
      const fabClose = document.getElementById('fab-icon-close');
      container.classList.remove('open');
      fabOpen.style.display = 'flex';
      fabClose.style.display = 'none';
    },

    minimize() {
      this.isMinimized = !this.isMinimized;
      const container = document.getElementById('san3a-chatbot');
      if (this.isMinimized) {
        container.classList.add('minimized');
      } else {
        container.classList.remove('minimized');
        this.scrollToBottom();
        setTimeout(() => document.getElementById('chat-input').focus(), 300);
      }
    },

    clearHistory() {
      if (!confirm('هل تريد مسح سجل المحادثة؟')) return;
      this.messages = [
        { id: Date.now(), text: "أهلاً! 👋 أنا مساعد صنعة. كيف يمكنني مساعدتك اليوم؟", sender: "bot", time: this.getTime() }
      ];
      this.saveMessages();
      this.renderMessages();
    },

    sendMessage() {
      const input = document.getElementById('chat-input');
      const text = input.value.trim();
      if (!text) return;

      const userMsg = {
        id: Date.now(),
        text,
        sender: 'user',
        time: this.getTime()
      };

      this.messages.push(userMsg);
      this.saveMessages();
      input.value = '';
      document.getElementById('chat-send').disabled = true;
      this.renderMessages();
      this.scrollToBottom();

      this.isTyping = true;
      this.renderTyping();
      this.scrollToBottom();

      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          text: this.getBotResponse(text),
          sender: 'bot',
          time: this.getTime()
        };
        this.messages.push(botMsg);
        this.saveMessages();
        this.isTyping = false;
        this.renderMessages();
        this.scrollToBottom();
      }, 900);
    },

    renderMessages() {
      const container = document.getElementById('chat-messages');
      const svgBot = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
      const svgUser = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

      container.innerHTML = this.messages.map(msg => `
        <div class="chat-message ${msg.sender}">
          <div class="chat-avatar ${msg.sender === 'bot' ? 'bot-avatar' : 'user-avatar'}">
            ${msg.sender === 'bot' ? svgBot : svgUser}
          </div>
          <div style="display:flex;flex-direction:column;${msg.sender === 'user' ? 'align-items:flex-end' : 'align-items:flex-start'}">
            <div class="chat-bubble">${this.escapeHtml(msg.text)}</div>
            <span class="chat-time">${msg.time}</span>
          </div>
        </div>
      `).join('');

      if (this.isTyping) {
        this.renderTyping();
      }
    },

    renderTyping() {
      const container = document.getElementById('chat-messages');
      const svgBot = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

      const typingHTML = `
        <div class="chat-typing">
          <div class="chat-avatar bot-avatar">${svgBot}</div>
          <div class="typing-bubble">
            <div class="typing-dots">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>
      `;

      const existing = container.querySelector('.chat-typing');
      if (existing) existing.remove();
      container.insertAdjacentHTML('beforeend', typingHTML);
    },

    scrollToBottom() {
      const container = document.getElementById('chat-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SAN3A.theme.init();
  SAN3A.chatbot.init();
  document.querySelectorAll('#theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => SAN3A.theme.toggle());
  });
});