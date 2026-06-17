/* final-payment.js */

document.addEventListener('DOMContentLoaded', () => {
  // Load booking data from storage
  const booking = SAN3A.storage.get('booking') || {};
  const payment = SAN3A.storage.get('payment') || {};

  // Determine country/currency
  const country = booking.country || 'مصر';
  const currency = SAN3A.currency.get(country);

  // Update currency badge
  document.getElementById('currency-symbol').textContent = currency.symbol;
  document.getElementById('country-name').textContent = country;

  // Update service info
  if (booking.workerName) document.getElementById('worker-name').textContent = booking.workerName;
  if (booking.serviceName) document.getElementById('service-name').textContent = booking.serviceName + ' — ' + country;
  if (booking.date && booking.time) {
    document.getElementById('service-date').textContent = booking.date + ' — ' + booking.time;
  }

  // Calculate amounts (demo: total 230, deposit 10%, remaining 90%)
  const total = booking.totalPrice || 230;
  const deposit = booking.depositPaid || Math.round(total * 0.1);
  const remaining = total - deposit;

  // Update amounts display
  document.getElementById('total-amount').textContent = total + ' ' + currency.symbol;
  document.getElementById('deposit-paid').textContent = '- ' + deposit + ' ' + currency.symbol;
  document.getElementById('remaining-amount').textContent = remaining + ' ' + currency.symbol;
  document.getElementById('btn-amount').textContent = remaining;
  document.getElementById('btn-currency').textContent = currency.symbol;

  // Payment method switching
  const methodInputs = document.querySelectorAll('input[name="payment-method"]');
  const cardForm = document.getElementById('card-form');
  const paypalInfo = document.getElementById('paypal-info');
  const walletInfo = document.getElementById('wallet-info');
  const payBtn = document.getElementById('pay-btn');
  const btnAmount = document.getElementById('btn-amount');
  const btnCurrency = document.getElementById('btn-currency');

  function updatePaymentView() {
    const selected = document.querySelector('input[name="payment-method"]:checked').value;
    cardForm.classList.toggle('hidden', selected !== 'visa');
    paypalInfo.classList.toggle('hidden', selected !== 'paypal');
    walletInfo.classList.toggle('hidden', selected !== 'wallet');

    if (selected === 'visa') {
      payBtn.querySelector('span:first-child').textContent = 'دفع ' + remaining + ' ' + currency.symbol + ' والمتابعة للتقييم';
    } else if (selected === 'paypal') {
      payBtn.querySelector('span:first-child').textContent = 'المتابعة إلى PayPal';
    } else {
      payBtn.querySelector('span:first-child').textContent = 'المتابعة إلى المحفظة الرقمية';
    }
  }

  methodInputs.forEach(input => {
    input.addEventListener('change', updatePaymentView);
  });

  // Card number formatting (add spaces every 4 digits)
  const cardNumber = document.getElementById('card-number');
  cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    e.target.value = formatted;
  });

  // Expiry date formatting (MM/YY)
  const cardExpiry = document.getElementById('card-expiry');
  cardExpiry.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
  });

  // CVV numbers only
  const cardCvv = document.getElementById('card-cvv');
  cardCvv.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });

  // Form submission
  document.getElementById('payment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const method = document.querySelector('input[name="payment-method"]:checked').value;

    if (method === 'visa') {
      // Validate card fields
      const number = cardNumber.value.replace(/\s/g, '');
      const expiry = cardExpiry.value;
      const cvv = cardCvv.value;
      const name = document.getElementById('card-name').value.trim();

      if (number.length < 16) { SAN3A.toast('يرجى إدخال رقم بطاقة صحيح', 'error'); return; }
      if (!expiry.match(/^\d{2}\/\d{2}$/)) { SAN3A.toast('يرجى إدخال تاريخ انتهاء صحيح', 'error'); return; }
      if (cvv.length < 3) { SAN3A.toast('يرجى إدخال CVV صحيح', 'error'); return; }
      if (!name) { SAN3A.toast('يرجى إدخال اسم حامل البطاقة', 'error'); return; }
    }

    // Simulate payment processing
    const btn = document.getElementById('pay-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> جاري معالجة الدفع...';
    btn.classList.add('opacity-75');

    setTimeout(() => {
      // Store final payment data
      SAN3A.storage.set('finalPayment', {
        method: method,
        amount: remaining,
        currency: currency.code,
        country: country,
        date: new Date().toISOString(),
        status: 'completed'
      });

      // Update booking status
      booking.status = 'completed';
      booking.finalPayment = remaining;
      SAN3A.storage.set('booking', booking);

      // Update the status of the booking inside the bookings history array
      if (booking.bookingId) {
        const bookingsList = SAN3A.storage.get('bookings') || [];
        const updatedList = bookingsList.map(b => {
          if (b.id === booking.bookingId) {
            return { ...b, status: 'completed' };
          }
          return b;
        });
        SAN3A.storage.set('bookings', updatedList);
      }

      SAN3A.toast('تم إتمام الدفع بنجاح! جاري التوجيه للتقييم...', 'success', 2000);

      setTimeout(() => {
        window.location.href = 'rating.html';
      }, 1500);
    }, 2000);
  });

  // Initial view
  updatePaymentView();
});