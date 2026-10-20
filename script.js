/* =====================================================
   script.js — Arif Repair Services
   ===================================================== */

/* ── Services Data ───────────────────────────────── */
const SERVICES = {
  ac: [
    { name: 'General Service (Dry Clean)', desc: 'Filter cleaning, coil check & performance tuning.', icon: 'fa-wind' },
    { name: 'Jet Wash / Deep Clean', desc: 'High-pressure jet cleaning of indoor & outdoor unit.', icon: 'fa-shower' },
    { name: 'Gas Refill (R22 / R32 / R410A)', desc: 'Top up refrigerant gas for optimal cooling efficiency.', icon: 'fa-thermometer-half' },
    { name: 'PCB Repair / Replacement', desc: 'Diagnose and fix PCB / circuit board faults.', icon: 'fa-microchip' },
    { name: 'Split AC Installation', desc: 'Professional installation with copper pipe fitting.', icon: 'fa-tools' },
    { name: 'Window AC Installation', desc: 'Window unit fitting with all accessories included.', icon: 'fa-tools' },
    { name: 'AC Uninstallation', desc: 'Safe removal with gas recovery.', icon: 'fa-minus-circle' },
    { name: 'Compressor Replacement', desc: 'Original OEM compressor replacement with warranty.', icon: 'fa-cog' },
    { name: 'Annual Maintenance (AMC)', desc: 'Yearly plan with 2 services + priority 24/7 support.', icon: 'fa-calendar-check' },
  ],
  washing: [
    { name: 'General Service & Cleaning', desc: 'Drum clean, drain check & complete performance tuning.', icon: 'fa-soap' },
    { name: 'Drum / Tub Cleaning', desc: 'Deep drum cleaning to remove odour and mineral buildup.', icon: 'fa-undo' },
    { name: 'Inlet Valve Replacement', desc: 'Replace faulty water inlet solenoid valves.', icon: 'fa-faucet' },
    { name: 'Spin Motor Repair', desc: 'Fix spin issues — slow spin, no spin or vibration.', icon: 'fa-cog' },
    { name: 'Drum Bearing Replacement', desc: 'Eliminate loud grinding noises during wash cycles.', icon: 'fa-circle' },
    { name: 'PCB / Control Board Repair', desc: 'Fix error codes, display faults & control panel issues.', icon: 'fa-microchip' },
    { name: 'Main Motor Repair', desc: 'Diagnose and repair drive motor issues thoroughly.', icon: 'fa-bolt' },
    { name: 'Door Gasket / Seal Replacement', desc: 'Stop water leakage from the door boot seal.', icon: 'fa-shield-alt' },
  ],
  refrigerator: [
    { name: 'General Service & Cleaning', desc: 'Condenser cleaning, thermostat check & full defrost.', icon: 'fa-snowflake' },
    { name: 'Gas Refill (R134a / R600a)', desc: 'Recharge refrigerant for proper cooling restoration.', icon: 'fa-thermometer-half' },
    { name: 'Thermostat Replacement', desc: 'Fix temperature control and over-cooling issues.', icon: 'fa-temperature-low' },
    { name: 'Door Gasket Replacement', desc: 'Seal replacement to prevent cold air leakage.', icon: 'fa-shield-alt' },
    { name: 'PCB / Control Board Repair', desc: 'Repair digital controls, inverter board & display.', icon: 'fa-microchip' },
    { name: 'Compressor Replacement', desc: 'Original compressor replacement with 6-month warranty.', icon: 'fa-cog' },
    { name: 'Defrost Heater Repair', desc: 'Fix frost buildup and auto defrost failures.', icon: 'fa-fire' },
    { name: 'Cooling Coil Repair', desc: 'Repair evaporator coil leaks and blockage issues.', icon: 'fa-wind' },
  ],
};

/* ── DOMContentLoaded ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* Hamburger menu */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      icon.classList.toggle('fa-bars', !open);
      icon.classList.toggle('fa-times', open);
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
      }
    });
  }

  /* Active nav link highlight */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* Services tabs */
  initTabs();

  /* Booking form */
  initBookingForm();

  /* Confirmation page */
  initConfirmationPage();

});

/* ── Tab System (Services Page) ─────────────────── */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;
  const activateTab = (id) => {
    const btn = [...tabBtns].find(b => b.dataset.tab === id) || tabBtns[0];
    tabBtns.forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === btn.dataset.tab));
  };
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });
  activateTab(window.location.hash.slice(1));
}

/* ── Booking Form Logic ──────────────────────────── */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  let step = 1;
  let bd   = {};   /* booking data */

  /* Read URL pre-selections (from services page links) */
  const params      = new URLSearchParams(window.location.search);
  const preAppliance = params.get('appliance');   /* ac | washing | refrigerator */
  const preService   = params.get('service');

  /* ── Appliance selection ── */
  const picks = document.querySelectorAll('.appliance-pick');
  picks.forEach(card => {
    card.addEventListener('click', () => {
      picks.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bd.applianceKey = card.dataset.appliance;
      bd.appliance    = card.querySelector('.appliance-name').textContent;
      bd.service = '';
      fillServiceDropdown(bd.applianceKey, preService);
    });
  });

  /* Pre-select from URL */
  if (preAppliance) {
    const preCard = document.querySelector(`.appliance-pick[data-appliance="${preAppliance}"]`);
    if (preCard) preCard.click();
  }

  function fillServiceDropdown(key, pre) {
    const sel   = document.getElementById('serviceSelect');
    const group = document.getElementById('serviceSelectGroup');
    sel.innerHTML = '<option value="">— Choose a Service —</option>';
    (SERVICES[key] || []).forEach(s => {
      const opt = document.createElement('option');
      opt.value       = s.name;
      opt.textContent = s.name;
      sel.appendChild(opt);
    });
    group.classList.remove('hidden');
    if (pre) {
      const clean = value => value.toLowerCase().replace(/\b(ac|wm|fridge|refrigerator)\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
      const wanted = clean(pre);
      const match = [...sel.options].slice(1).find(opt => wanted.every(word => clean(opt.value).includes(word)));
      if (match) sel.value = match.value;
      bd.service = sel.value;
    }
  }

  document.getElementById('serviceSelect').addEventListener('change', function () {
    bd.service = this.value;
  });

  /* ── Same-phone checkbox ── */
  const samePhone    = document.getElementById('samePhone');
  const waGroup      = document.getElementById('whatsappGroup');
  samePhone && samePhone.addEventListener('change', () => {
    waGroup.classList.toggle('hidden', samePhone.checked);
  });

  /* ── Date limits: tomorrow → +7 days ── */
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const formatLocalDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const minDate = new Date(); minDate.setHours(0, 0, 0, 0); minDate.setDate(minDate.getDate() + 1);
    const maxDate = new Date(minDate); maxDate.setDate(maxDate.getDate() + 6);
    dateInput.min = formatLocalDate(minDate);
    dateInput.max = formatLocalDate(maxDate);
  }

  /* ── Next / Back buttons ── */
  document.querySelectorAll('.btn-next-form').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(step)) { gatherStep(step); goTo(step + 1); }
    });
  });
  document.querySelectorAll('.btn-back-form').forEach(btn => {
    btn.addEventListener('click', () => goTo(step - 1));
  });

  /* ── Step navigation ── */
  function goTo(target) {
    const currentEl = q(`.form-step[data-step="${step}"]`);
    const targetEl  = q(`.form-step[data-step="${target}"]`);
    const currentDot= q(`.step-ind[data-step="${step}"]`);
    const targetDot = q(`.step-ind[data-step="${target}"]`);

    currentEl.classList.remove('active');
    currentDot.classList.remove('active');
    if (target > step) currentDot.classList.add('completed');
    else currentDot.classList.remove('completed');

    step = target;
    targetEl.classList.add('active');
    targetDot.classList.add('active');

    if (step === 3) populateSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Validation ── */
  function validateStep(s) {
    if (s === 1) {
      if (!bd.applianceKey) { alert('Please select an appliance type.'); return false; }
      if (!bd.service)       { alert('Please select a service.'); return false; }
    }
    if (s === 2) {
      const n = val('custName'), p = val('custPhone'), a = val('custAddress');
      const d = val('bookDate'), t = val('bookTime');
      if (!n || !p || !a || !d || !t) { alert('Please fill in all required fields.'); return false; }
      if (!/^[6-9]\d{9}$/.test(p))    { alert('Enter a valid 10-digit Indian mobile number.'); return false; }
      if (d < dateInput.min || d > dateInput.max) { alert('Choose a date from tomorrow through the next 7 days.'); return false; }
      if (!document.getElementById('samePhone').checked && !/^[6-9]\d{9}$/.test(val('custWhatsapp'))) {
        alert('Enter a valid 10-digit Indian WhatsApp number.'); return false;
      }
    }
    return true;
  }

  /* ── Gather step data ── */
  function gatherStep(s) {
    if (s === 2) {
      bd.name     = val('custName');
      bd.phone    = val('custPhone');
      bd.whatsapp = samePhone.checked ? bd.phone : (val('custWhatsapp') || bd.phone);
      bd.address  = val('custAddress');
      bd.date     = val('bookDate');
      bd.time     = document.getElementById('bookTime').options[document.getElementById('bookTime').selectedIndex]?.text || '';
      bd.issue    = val('custIssue');
    }
  }

  /* ── Populate summary on step 3 ── */
  function populateSummary() {
    if (!bd.bookingId) bd.bookingId = 'ARF' + Date.now().toString().slice(-6);
    setText('sum-name',      bd.name);
    setText('sum-phone',     bd.phone);
    setText('sum-appliance', bd.appliance);
    setText('sum-service',   bd.service);
    setText('sum-date',      bd.date);
    setText('sum-time',      bd.time);
    setText('sum-address',   bd.address);
    setText('sum-issue',     bd.issue || '—');
    const qr = document.getElementById('upiQrCode');
    if (qr) {
      const params = new URLSearchParams({ pa: '9666543655@ybl', pn: 'Arif Repair Services', am: '149.00', cu: 'INR', tn: `Booking ${bd.bookingId}`, tr: bd.bookingId });
      const upiUri = `upi://pay?${params.toString()}`;
      qr.onerror = () => { qr.classList.add('hidden'); setText('upiQrStatus', 'QR could not load. Enter the UPI ID and amount above manually.'); };
      qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(upiUri)}`;
    }
  }

  /* ── Send booking request ── */
  const confirmBtn = document.getElementById('sendBookingBtn');
  confirmBtn && confirmBtn.addEventListener('click', () => {
    if (!bd.name) { alert('Please complete all steps first.'); return; }
    if (!document.getElementById('advancePaidCheck').checked) { alert('Please pay the ₹149 advance and confirm the checkbox to continue.'); return; }
    bd.advanceReported = true;
    sessionStorage.setItem('arifBooking', JSON.stringify(bd));
    const waWindow = window.open(buildBusinessWALink(bd), '_blank');
    if (!waWindow) {
      window.location.href = buildBusinessWALink(bd);
      return;
    }
    waWindow.opener = null;
    window.location.href = 'confirmation.html';
  });
}

/* ── Build WhatsApp message (Business) ──────────── */
function buildBusinessWALink(d) {
  const msg =
`🔧 *NEW BOOKING — Arif Repair Services*

📋 Booking ID : ${d.bookingId}
👤 Customer   : ${d.name}
📞 Phone      : ${d.phone}
📱 WhatsApp   : ${d.whatsapp}
📍 Address    : ${d.address}
🛠️ Appliance  : ${d.appliance}
🔧 Service    : ${d.service}
📅 Date       : ${d.date}
⏰ Slot       : ${d.time}
${d.issue ? `💬 Issue      : ${d.issue}` : ''}
💳 Advance    : Customer reports ₹149 paid; please verify receipt manually.

Please contact the customer to confirm the visit. ✅`;
  return `https://wa.me/919848732678?text=${encodeURIComponent(msg)}`;
}

/* ── Confirmation Page ───────────────────────────── */
function initConfirmationPage() {
  if (!document.getElementById('confirmationPage')) return;
  const raw = sessionStorage.getItem('arifBooking');
  const showMissing = () => {
    document.querySelector('#confirmationPage .conf-header h2').textContent = 'No booking request found';
    document.querySelector('#confirmationPage .conf-header p').textContent = 'Start a booking to send your service request to Arif Repair Services.';
    document.getElementById('bookingDetails').classList.add('hidden');
    document.getElementById('bookingMissing').classList.remove('hidden');
  };
  if (!raw) {
    showMissing();
    return;
  }
  let d;
  try { d = JSON.parse(raw); } catch { sessionStorage.removeItem('arifBooking'); showMissing(); return; }

  document.querySelector('#confirmationPage .conf-header h2').textContent = 'Booking request prepared';
  document.querySelector('#confirmationPage .conf-header p').textContent = 'Your request details are ready. Send the WhatsApp message to contact Arif Repair Services; the team will confirm your appointment and payment receipt.';
  setText('conf-bookingId', d.bookingId || '—');
  setText('conf-name',      d.name      || '—');
  setText('conf-appliance', d.appliance || '—');
  setText('conf-service',   d.service   || '—');
  setText('conf-date',      d.date      || '—');
  setText('conf-time',      d.time      || '—');
  setText('conf-address',   d.address   || '—');

  /* Customer WhatsApp self-message */
  const waBtn = document.getElementById('customerWaBtn');
  if (waBtn) {
    const phone = (d.whatsapp || d.phone || '').replace(/\D/g, '');
    const msg =
`📨 *Booking Request — Arif Repair Services*

Hi ${d.name}! Your booking request has been prepared.

📋 Booking ID : ${d.bookingId}
🛠️ Appliance  : ${d.appliance}
🔧 Service    : ${d.service}
📅 Date       : ${d.date}
⏰ Slot       : ${d.time}
📍 Address    : ${d.address}
💳 Advance    : ₹149 reported paid; receipt pending confirmation.
Our team will contact you to confirm availability and any applicable charges.
📞 Arif Repair: 98487 32678`;
    /* Message yourself: wa.me with own number works on WhatsApp */
    const dest = phone.length >= 10 ? `91${phone.slice(-10)}` : '919848732678';
    waBtn.href = `https://wa.me/${dest}?text=${encodeURIComponent(msg)}`;
  }
}

/* ── Helpers ─────────────────────────────────────── */
function q(sel)       { return document.querySelector(sel); }
function val(id)      { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function setText(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
