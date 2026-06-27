/* ============================================================
   BUILD TICKER
   ============================================================ */
const TICKER_EVENTS = [
  { type: 'pass', text: '✓  Build #312 — passed in 2m 14s' },
  { type: 'pass', text: '✓  Deployed api-gateway v2.4.1 → production' },
  { type: 'pass', text: '✓  PR merged: refactor/auth-middleware' },
  { type: 'run',  text: '›  Test suite running — 87% complete' },
  { type: 'pass', text: '✓  Lighthouse: 98 perf · 100 a11y · 97 SEO' },
  { type: 'pass', text: '✓  DB migration completed — 0 errors' },
  { type: 'pass', text: '✓  PR #441 approved: add-oauth-flow' },
  { type: 'run',  text: '›  Deploying client-portal v1.8.0' },
  { type: 'pass', text: '✓  Security scan — 0 vulnerabilities found' },
  { type: 'info', text: '·  All systems operational' },
  { type: 'pass', text: '✓  Build #313 — passed in 1m 58s' },
  { type: 'pass', text: '✓  SSL certificate renewed — valid 90 days' },
];

function initTicker() {
  const feed = document.getElementById('tickerFeed');
  if (!feed) return;

  let index = 0;
  const maxVisible = 6;

  function addItem() {
    const event = TICKER_EVENTS[index % TICKER_EVENTS.length];
    index++;

    const li = document.createElement('li');
    li.className = `ticker__item ticker__item--${event.type}`;
    li.textContent = event.text;
    feed.appendChild(li);

    while (feed.children.length > maxVisible) {
      feed.removeChild(feed.firstChild);
    }
  }

  for (let i = 0; i < 5; i++) addItem();
  setInterval(addItem, 2400);
}

/* ============================================================
   NAV HAMBURGER
   ============================================================ */
function initNav() {
  const btn = document.getElementById('menuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('is-open', !open);
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
    });
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
    }
  });
}

/* ============================================================
   FORM VALIDATION & SUBMISSION (formsubmit.co — no account needed)
   First submission triggers a one-time confirmation email to activate.
   ============================================================ */
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/f610609363075fbb7468df0eaaefa1b2';

function initForm() {
  const form = document.getElementById('enquiry-form');
  const submitBtn = document.getElementById('submit-btn');
  const success = document.getElementById('form-success');
  const errorBanner = document.getElementById('form-error');
  if (!form) return;

  function setError(input, msg) {
    const id = input.getAttribute('aria-describedby');
    const errEl = id ? document.getElementById(id) : null;
    input.classList.toggle('is-invalid', !!msg);
    if (errEl) errEl.textContent = msg || '';
  }

  function validateField(field) {
    const val = field.value.trim();
    if (field.required && !val) {
      setError(field, 'This field is required.');
      return false;
    }
    if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setError(field, 'Please enter a valid email address.');
      return false;
    }
    setError(field, '');
    return true;
  }

  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('[required]')];
    const allValid = fields.every(f => validateField(f));
    if (!allValid) {
      fields.find(f => f.classList.contains('is-invalid'))?.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    if (errorBanner) errorBanner.hidden = true;

    try {
      const payload = {
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        phone: form.querySelector('#phone').value.trim(),
        service: form.querySelector('#service').value,
        message: form.querySelector('#message').value.trim(),
      };

      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success === 'true') {
        form.hidden = true;
        if (success) success.hidden = false;
        if ('speechSynthesis' in window) {
          const msg = new SpeechSynthesisUtterance('Thanks! We will be in touch within one business day.');
          msg.lang = 'en-US';
          msg.rate = 0.95;
          speechSynthesis.speak(msg);
        }
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      if (errorBanner) errorBanner.hidden = false;
    }
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  if (!window.IntersectionObserver) return;

  const targets = document.querySelectorAll('.card, .testimonial, .contact__form-wrap');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  targets.forEach((el, i) => {
    el.classList.add('will-reveal');
    el.style.transitionDelay = `${i * 0.055}s`;
    observer.observe(el);
  });
}

/* ============================================================
   WHATSAPP WIDGET
   ============================================================ */
function initWhatsApp() {
  const widget   = document.getElementById('waWidget');
  const fab      = document.getElementById('waFab');
  const popup    = document.getElementById('waPopup');
  const closeBtn = document.getElementById('waClose');
  if (!widget || !fab || !popup) return;

  function open() {
    popup.hidden = false;
    popup.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    widget.classList.add('is-open');
  }

  function close() {
    popup.hidden = true;
    popup.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    widget.classList.remove('is-open');
  }

  fab.addEventListener('click', () => {
    widget.classList.contains('is-open') ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) close();
  });

  document.addEventListener('click', e => {
    if (widget.classList.contains('is-open') && !widget.contains(e.target)) close();
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTicker();
  initNav();
  initForm();
  initReveal();
  initWhatsApp();
});
