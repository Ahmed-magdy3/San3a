/* SAN3A — Services Page Script */
(function() {
  'use strict';

  // Emergency button click
  document.getElementById('emergency-btn')?.addEventListener('click', function() {
    window.location.href = 'tel:123-456-7890';
  });

  // Service card click tracking (optional)
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // If clicked on the book button, let the link handle it
      if (e.target.closest('.book-btn')) return;

      // Otherwise, navigate to booking
      const service = this.dataset.service;
      if (service) {
        window.location.href = 'booking.html?service=' + service;
      }
    });
  });

})();