/* SAN3A — Booking Page Script */
(function() {
  'use strict';

  // ===== SERVICE DATA =====
  const serviceData = {
    'electricity': { name: 'الكهرباء', deposit: 120, workerFee: 70, siteFee: 50 },
    'plumbing': { name: 'السباكة', deposit: 100, workerFee: 60, siteFee: 40 },
    'cleaning': { name: 'تنظيف المنازل', deposit: 80, workerFee: 50, siteFee: 30 },
    'painting': { name: 'الدهان والديكور', deposit: 120, workerFee: 70, siteFee: 50 },
    'appliances': { name: 'إصلاح الأجهزة المنزلية', deposit: 150, workerFee: 90, siteFee: 60 },
    'carpentry': { name: 'النجارة', deposit: 140, workerFee: 80, siteFee: 60 },
    'moving': { name: 'نقل الأثاث', deposit: 200, workerFee: 110, siteFee: 90, needsVehicle: true }
  };

  // ===== GET SERVICE FROM URL =====
  function getServiceFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('service') || 'cleaning';
  }

  // ===== UPDATE PAGE BASED ON SERVICE =====
  function initPage() {
    const serviceId = getServiceFromUrl();
    const data = serviceData[serviceId];

    if (!data) return;

    // Update service name
    document.getElementById('service-name').textContent = 'خدمة: ' + data.name;

    // Update deposit banner
    document.getElementById('deposit-amount').textContent = 'جدية الحجز: ' + data.deposit + ' جنيه';
    document.getElementById('worker-guarantee').textContent = data.workerFee + ' جنيه';
    document.getElementById('site-fee').textContent = data.siteFee + ' جنيه';

    // Show vehicle section for moving service
    if (data.needsVehicle) {
      document.getElementById('vehicle-section').classList.remove('hidden');
    }

    // Save to localStorage
    SAN3A.storage.set('current-service', { id: serviceId, ...data });
  }

  // ===== VEHICLE SELECTION =====
  let vehicleNeeded = false;
  let vehicleType = '';

  document.getElementById('vehicle-no')?.addEventListener('click', function() {
    vehicleNeeded = false;
    vehicleType = '';
    updateVehicleSelection();
    document.getElementById('vehicle-type-section').classList.add('hidden');
  });

  document.getElementById('vehicle-yes')?.addEventListener('click', function() {
    vehicleNeeded = true;
    updateVehicleSelection();
    document.getElementById('vehicle-type-section').classList.remove('hidden');
  });

  function updateVehicleSelection() {
    document.getElementById('vehicle-no').classList.toggle('selected', !vehicleNeeded);
    document.getElementById('vehicle-yes').classList.toggle('selected', vehicleNeeded);
  }

  document.getElementById('vehicle-type')?.addEventListener('change', function() {
    vehicleType = this.value;
  });

  // ===== FORM SUBMISSION =====
  window.handleSubmit = function() {
    const fullAddress = document.getElementById('fullAddress').value.trim();
    const street = document.getElementById('street').value.trim();
    const building = document.getElementById('building').value.trim();
    const unit = document.getElementById('unit').value.trim();
    const city = document.getElementById('city').value;
    const description = document.getElementById('description').value.trim();

    // Validation
    if (!fullAddress) {
      SAN3A.toast('يرجى إدخال عنوان موقع الخدمة', 'error');
      document.getElementById('fullAddress').focus();
      return;
    }

    if (!street) {
      SAN3A.toast('يرجى إدخال اسم الشارع', 'error');
      document.getElementById('street').focus();
      return;
    }

    if (!building) {
      SAN3A.toast('يرجى إدخال اسم العمارة / المبنى', 'error');
      document.getElementById('building').focus();
      return;
    }

    if (!city) {
      SAN3A.toast('يرجى اختيار المدينة', 'error');
      document.getElementById('city').focus();
      return;
    }

    // Check vehicle for moving service
    const serviceId = getServiceFromUrl();
    if (serviceData[serviceId]?.needsVehicle && vehicleNeeded && !vehicleType) {
      SAN3A.toast('يرجى اختيار نوع المركبة', 'error');
      return;
    }

    // Save booking data
    const bookingData = {
      service: serviceId,
      fullAddress,
      street,
      building,
      unit,
      city,
      description,
      vehicleNeeded,
      vehicleType,
      step: 2,
      timestamp: new Date().toISOString()
    };

    SAN3A.storage.set('booking', bookingData);
    SAN3A.toast('تم حفظ البيانات بنجاح!', 'success');

    // Navigate to worker selection
    setTimeout(() => {
      window.location.href = 'worker-details.html';
    }, 800);
  };

  // ===== PRE-FILL FORM IF DATA EXISTS =====
  function prefillForm() {
    const existing = SAN3A.storage.get('booking');
    if (!existing) return;

    if (existing.fullAddress) document.getElementById('fullAddress').value = existing.fullAddress;
    if (existing.street) document.getElementById('street').value = existing.street;
    if (existing.building) document.getElementById('building').value = existing.building;
    if (existing.unit) document.getElementById('unit').value = existing.unit;
    if (existing.city) document.getElementById('city').value = existing.city;
    if (existing.description) document.getElementById('description').value = existing.description;

    if (existing.vehicleNeeded !== undefined) {
      vehicleNeeded = existing.vehicleNeeded;
      updateVehicleSelection();
      if (vehicleNeeded) {
        document.getElementById('vehicle-type-section').classList.remove('hidden');
        if (existing.vehicleType) {
          document.getElementById('vehicle-type').value = existing.vehicleType;
          vehicleType = existing.vehicleType;
        }
      }
    }
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function() {
    initPage();
    prefillForm();
  });

})();