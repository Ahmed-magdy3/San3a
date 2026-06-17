/* rating.js */

// Rating Questions Data (embedded directly — no separate file needed)
const RATING_OPTIONS = [
  { label: 'جيد جداً', value: 5 },
  { label: 'جيد', value: 4 },
  { label: 'لا أعلم', value: 3 },
  { label: 'سيء', value: 2 },
  { label: 'سيء جداً', value: 1 }
];

const RATING_QUESTIONS = [
  { id: 1, question: 'هل كانت الخدمة مرضية لك؟' },
  { id: 2, question: 'هل كان العامل على قد المهمة؟' },
  { id: 3, question: 'هل كان الوقت المستغرق لإنجاز الخدمة مناسبًا؟' },
  { id: 4, question: 'هل كان أسلوب تعامل العامل مناسب؟' },
  { id: 5, question: 'هل سعر الخدمة مناسب لأداء العامل؟' },
  { id: 6, question: 'مدى التزام العامل بالمواعيد المتفق عليها؟' },
  { id: 7, question: 'مدى التزام العامل بمعايير السلامة أثناء العمل؟' },
  { id: 8, question: 'كيف كان مستوى استعداد العامل للخدمة؟ (مثال: تجهيز المعدات المطلوبة)' }
];

const RATING_LABELS = {
  1: 'سيء جداً',
  2: 'سيء',
  3: 'متوسط',
  4: 'جيد',
  5: 'ممتاز'
};

const OPTION_STYLES = {
  5: 'option-selected-excellent',
  4: 'option-selected-good',
  3: 'option-selected-neutral',
  2: 'option-selected-bad',
  1: 'option-selected-verybad'
};

// State
let questionAnswers = {};
let finalRating = 0;
let hoverRating = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Load booking data for summary
  const booking = SAN3A.storage.get('booking') || {};
  const finalPayment = SAN3A.storage.get('finalPayment') || {};

  if (booking.workerName) document.getElementById('summary-worker').textContent = booking.workerName;
  if (booking.serviceName) document.getElementById('summary-service').textContent = booking.serviceName;
  if (booking.date && booking.time) {
    document.getElementById('summary-date').textContent = booking.date + ' — ' + booking.time;
  }

  // Render questions
  renderQuestions();

  // Render stars
  renderStars();

  // Update progress
  updateProgress();
});

function renderQuestions() {
  const container = document.getElementById('questions-container');

  container.innerHTML = RATING_QUESTIONS.map((q, index) => {
    return `
      <div class="question-card bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-100 dark:border-gray-700 p-5" data-question-id="${q.id}">
        <h5 class="font-bold text-gray-900 dark:text-white mb-4 text-right">
          ${index + 1}. ${q.question}
          <span class="text-red-500 mr-1">*</span>
        </h5>
        <div class="space-y-2">
          ${RATING_OPTIONS.map(opt => `
            <label class="option-row flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all ${getOptionClass(q.id, opt.value)}" onclick="selectOption(${q.id}, ${opt.value})">
              <input type="radio" name="q${q.id}" value="${opt.value}" ${questionAnswers[q.id] === opt.value ? 'checked' : ''} class="w-5 h-5 text-blue-600 accent-blue-600 shrink-0" onchange="selectOption(${q.id}, ${opt.value})">
              <span class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 text-right">${opt.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function getOptionClass(questionId, value) {
  if (questionAnswers[questionId] !== value) return '';
  return OPTION_STYLES[value] || '';
}

function selectOption(questionId, value) {
  questionAnswers[questionId] = value;
  renderQuestions();
  updateProgress();

  // Visual feedback
  const card = document.querySelector(`[data-question-id="${questionId}"]`);
  if (card) {
    card.style.borderColor = value >= 4 ? '#16a34a' : value === 3 ? '#6b7280' : '#dc2626';
    setTimeout(() => {
      card.style.borderColor = '';
    }, 300);
  }
}

function renderStars() {
  const container = document.getElementById('star-container');

  container.innerHTML = [1, 2, 3, 4, 5].map(star => `
    <button type="button" 
      class="star-btn w-12 h-12 flex items-center justify-center rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-all ${(hoverRating || finalRating) >= star ? 'active' : 'inactive'}" 
      onmouseenter="setHoverRating(${star})" 
      onmouseleave="clearHoverRating()" 
      onclick="setFinalRating(${star})"
      aria-label="${RATING_LABELS[star]}"
    >
      <svg class="w-10 h-10" fill="${(hoverRating || finalRating) >= star ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    </button>
  `).join('');

  updateRatingLabel();
}

function setHoverRating(star) {
  hoverRating = star;
  renderStars();
}

function clearHoverRating() {
  hoverRating = 0;
  renderStars();
}

function setFinalRating(star) {
  finalRating = star;
  renderStars();
  updateProgress();

  // Animation feedback
  const label = document.getElementById('rating-label');
  label.style.transform = 'scale(1.1)';
  setTimeout(() => label.style.transform = 'scale(1)', 200);
}

function updateRatingLabel() {
  const label = document.getElementById('rating-label');
  const active = hoverRating || finalRating;
  if (active > 0) {
    label.textContent = RATING_LABELS[active];
    label.style.color = active >= 4 ? '#16a34a' : active === 3 ? '#6b7280' : '#dc2626';
  } else {
    label.textContent = '';
  }
}

function updateProgress() {
  const answered = Object.keys(questionAnswers).length;
  const total = RATING_QUESTIONS.length;

  document.getElementById('answered-count').textContent = answered;
  document.getElementById('total-count').textContent = total;

  const finalCheck = document.getElementById('final-check');
  if (finalRating > 0) {
    finalCheck.classList.remove('hidden');
  } else {
    finalCheck.classList.add('hidden');
  }

  // Button is always enabled - no validation needed
}

function submitRating() {
  // Collect data (optional — no validation required)
  const review = document.getElementById('review-text').value.trim();
  const ratingData = {
    questions: questionAnswers,
    finalRating: finalRating,
    review: review,
    submittedAt: new Date().toISOString(),
    bookingId: SAN3A.storage.get('booking')?.id || 'demo'
  };

  // Save rating to storage
  SAN3A.storage.set('rating', ratingData);

  // Update booking status
  const booking = SAN3A.storage.get('booking') || {};
  booking.rating = finalRating || 5;
  booking.status = 'rated';
  SAN3A.storage.set('booking', booking);

  // Show success overlay
  const overlay = document.getElementById('success-overlay');
  overlay.classList.remove('hidden');

  // Redirect to index.html (first page) after 2 seconds
  setTimeout(() => {
    window.location.href = 'profile.html';
  }, 2000);
}