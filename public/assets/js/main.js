/* =========================================================================
   1614 Hubert Street — site behaviour
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     ANALYTICS CONFIGURATION
     ---------------------------------------------------------------------
     The GA4 ID below was supplied in the build intake for this property.
     CONFIRM it belongs to a GA4 property created for 1614 Hubert Street —
     never run a listing on another listing's measurement ID, because the
     two data sets cannot be separated afterwards.

     Google Ads and Meta are inactive until IDs are added:

       googleAds  'AW-XXXXXXXXX'
       adsLabels  { cta_showing: 'AW-XXXXXXXXX/xxxxxxxxxxxxxxxx', ... }
       metaPixel  'XXXXXXXXXXXXXXX'

     Conversions fire on real visitor actions only — never on page load.
  --------------------------------------------------------------------- */
  var ANALYTICS = {
    ga4: 'G-QGLE2JPPNS',
    googleAds: '',
    adsLabels: {},
    metaPixel: ''
  };

  window.dataLayer = window.dataLayer || [];

  function loadAnalytics() {
    var ids = [ANALYTICS.ga4, ANALYTICS.googleAds].filter(Boolean);
    if (ids.length) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ids[0]);
      document.head.appendChild(s);
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      ids.forEach(function (id) { window.gtag('config', id); });
    }
    if (ANALYTICS.metaPixel) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', ANALYTICS.metaPixel);
      window.fbq('track', 'PageView');
    }
  }
  loadAnalytics();

  function track(name, params) {
    var data = Object.assign({ event: name, property: '1614-hubert-st', mls: '21366713' }, params || {});
    window.dataLayer.push(data);
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, data);
      var label = ANALYTICS.adsLabels[name];
      if (label) window.gtag('event', 'conversion', { send_to: label });
    }
    if (typeof window.fbq === 'function') window.fbq('trackCustom', name, data);
  }
  window.msgTrack = track;

  /* Any element carrying data-track fires on activation. */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.getAttribute('data-track'), { location: el.getAttribute('data-loc') || 'page' });
  });

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ------------------------------ Year ------------------------------ */
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ------------------------------ Nav ------------------------------- */
  var nav = $('#nav'), toggle = $('#navToggle'), drawer = $('#drawer');

  function setDrawer(open) {
    if (!drawer || !toggle || !nav) return;
    drawer.hidden = !open;
    nav.setAttribute('data-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle) toggle.addEventListener('click', function () { setDrawer(drawer.hidden); });
  if (drawer) drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && !drawer.hidden) { setDrawer(false); toggle.focus(); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1040) setDrawer(false); });

  /* Scroll-spy */
  var navLinks = $$('.nav__links a');
  var spyTargets = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if (spyTargets.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spyTargets.forEach(function (t) { spy.observe(t); });
  }

  /* ------------------------------ Reveal ----------------------------- */
  function reveal(sel) {
    var els = $$(sel);
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var d = Math.min(i * 70, 280);
        setTimeout(function () { en.target.classList.add('is-in'); }, d);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------- Highlights ---------------------------- */
  var HIGHLIGHTS = [
    ['A 1920 cottage, fully renovated', 'Craftsman-style trim, warm wood doors and herringbone-patterned floors carry the age of the house. The kitchen and the bath are new work.'],
    ['Turnkey, and furnished', 'The home is offered fully furnished, so a second-home or investment buyer can take it as it stands. What conveys is set out in the contract.'],
    ['A kitchen built to use every inch', 'A large island, abundant cabinetry, stainless appliances, an apron-front sink and brass hardware — open to the living room.'],
    ['A bath worth the square footage', 'Glass-enclosed walk-in shower with a built-in bench, subway tile, graphic black-and-white tilework, black fixtures and brass accents, in a room that measures 8 × 15.'],
    ['Storage designed in, not added on', 'A custom closet system and two closets in the bedroom, and built-in cabinetry through the living room and bath.'],
    ['Solar panels installed in 2023', 'A 2023 addition to the house. Ownership, production and what transfers at closing are part of the due-diligence package.'],
    ['No HOA, and a lot you can keep', 'No association, no assessment, no architectural committee — on a compact 0.053-acre lot with off-street parking on a concrete driveway and pad.'],
    ['A proven short-term rental', 'The listing reports a successful run as a short-term rental. Permitting and the city rules that apply here are a buyer\u2019s own due diligence; no income figures are published.']
  ];

  var hlGrid = $('#hlGrid');
  if (hlGrid) {
    hlGrid.innerHTML = HIGHLIGHTS.map(function (h, i) {
      return '<article class="hl__item"><span class="hl__n">' + String(i + 1).padStart(2, '0') +
             '</span><h3>' + h[0] + '</h3><p>' + h[1] + '</p></article>';
    }).join('');
    reveal('.hl__item');
  }

  /* ----------------------------- Places ------------------------------ */
  /* Only destinations named in the property's own record are listed. Nothing
     is added from general knowledge, and no distance or drive time is stated
     unless it has been measured. */
  var PLACES = [
    ['Greenville Avenue', 'The East Dallas restaurant, bar and retail corridor the property\u2019s own directions run from.'],
    ['Ross Avenue', 'The main east\u2013west route through this part of East Dallas, two blocks from the house.']
  ];

  var places = $('#places');
  if (places) {
    places.innerHTML = PLACES.map(function (p) {
      return '<li><b>' + p[0] + '</b><span>' + p[1] + '</span></li>';
    }).join('');
  }

  /* ----------------------------- Gallery ----------------------------- */
  var CATS = [
    ['all', 'All 13'],
    ['living', 'Living'],
    ['kitchen', 'Kitchen'],
    ['bed', 'Bedroom'],
    ['bath', 'Bath'],
    ['outside', 'Exterior & Lot']
  ];

  /* Photography for this listing has not been delivered. While this is true the
     gallery renders labelled placeholder frames, so the page ships and every
     slot says what it will hold. When the photographs arrive: drop
     <slug>.jpg/.webp and <slug>-t.jpg/.webp into /assets/img/gallery/, set this
     to false, and remove the note under the Gallery heading in index.html. */
  var PHOTOS_PENDING = true;


  /* slug, category, short caption, full alt text */
  var PHOTOS = [
    ['exterior-front','outside','Front elevation','The front elevation of the 1920 cottage at 1614 Hubert Street.'],
    ['front-porch','outside','Front porch','The covered front porch at the entry.'],
    ['living-room','living','Living room','The living room, with built-in cabinets and herringbone-patterned floors.'],
    ['living-open-kitchen','living','Living to kitchen','The living room looking through to the open kitchen.'],
    ['living-builtins','living','Built-in cabinetry','Built-in cabinetry in the living room.'],
    ['kitchen-island','kitchen','Kitchen island','The kitchen island with seating and brass hardware.'],
    ['kitchen-range','kitchen','Gas range','The gas range and cabinetry in the renovated kitchen.'],
    ['kitchen-sink','kitchen','Apron-front sink','The apron-front sink and countertop workspace.'],
    ['bedroom','bed','Bedroom','The bedroom, 15 by 15 feet.'],
    ['bedroom-closets','bed','Closets','The bedroom closets and custom closet system.'],
    ['bath-shower','bath','Walk-in shower','The glass-enclosed walk-in shower with a built-in bench and subway tile.'],
    ['bath-vanity','bath','Vanity','The vanity, with black fixtures and brass accents.'],
    ['lot-solar','outside','Lot and solar','The lot and the solar panels installed in 2023.']
  ];

  /* A placeholder frame must never describe a photograph that does not exist,
     so its alt text says what it is. */
  function photoSrc(slug, thumb) {
    if (PHOTOS_PENDING) return '/assets/img/gallery/placeholder/' + slug + '.svg';
    return '/assets/img/gallery/' + slug + (thumb ? '-t' : '') + '.jpg';
  }
  function photoAlt(p) {
    return PHOTOS_PENDING
      ? 'Placeholder frame — photography of the ' + p[2].toLowerCase() + ' at 1614 Hubert Street is being prepared.'
      : p[3];
  }


  var galBar = $('#galBar'), galGrid = $('#galGrid');

  if (galBar && galGrid) {
    galBar.innerHTML = CATS.map(function (c, i) {
      return '<button class="chip" type="button" data-cat="' + c[0] + '" aria-pressed="' + (i === 0) + '">' + c[1] + '</button>';
    }).join('');

    galGrid.innerHTML = PHOTOS.map(function (p, i) {
      var alt = photoAlt(p);
      var img = '<img src="' + photoSrc(p[0], true) + '" width="800" height="533" loading="' +
                (i < 4 ? 'eager' : 'lazy') + '" decoding="async" alt="' + alt + '">';
      var media = PHOTOS_PENDING ? img
        : '<picture><source type="image/webp" srcset="/assets/img/gallery/' + p[0] + '-t.webp">' + img + '</picture>';
      return '<figure style="display:contents"><button class="gal__item" type="button" data-i="' + i + '" data-cat="' + p[1] + '" aria-label="Open photo ' + (i + 1) + ' of ' + PHOTOS.length + ': ' + alt + '">' +
        media +
        '<figcaption>' + p[2] + '</figcaption>' +
      '</button></figure>';
    }).join('');

    galBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip'); if (!btn) return;
      var cat = btn.getAttribute('data-cat');
      $$('.chip', galBar).forEach(function (c) { c.setAttribute('aria-pressed', String(c === btn)); });
      $$('.gal__item', galGrid).forEach(function (it) {
        it.hidden = !(cat === 'all' || it.getAttribute('data-cat') === cat);
      });
      track('gallery_filter', { filter: cat });
    });

    galGrid.addEventListener('click', function (e) {
      var it = e.target.closest('.gal__item'); if (!it) return;
      openLb(parseInt(it.getAttribute('data-i'), 10));
    });
  }

  /* ---------------------------- Lightbox ----------------------------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  var lbIndex = 0, lbReturn = null;

  function visibleIdx() {
    return PHOTOS.map(function (_, i) { return i; }).filter(function (i) {
      var el = galGrid && galGrid.querySelector('[data-i="' + i + '"]');
      return el && !el.hidden;
    });
  }

  function renderLb() {
    var p = PHOTOS[lbIndex];
    lbImg.src = photoSrc(p[0], false);
    lbImg.alt = photoAlt(p);
    lbCap.innerHTML = '<b>' + p[2] + '</b>' +
      (PHOTOS_PENDING ? 'Photography of this view is being prepared.' : p[3]);
    var list = visibleIdx();
    lbCount.textContent = (list.indexOf(lbIndex) + 1) + ' / ' + list.length;
  }

  function openLb(i) {
    if (!lb) return;
    lbReturn = document.activeElement;
    lbIndex = i; renderLb();
    lb.hidden = false;
    document.body.classList.add('is-locked');
    $('#lbClose').focus();
    track('gallery_open', { photo: PHOTOS[i][0] });
  }
  function closeLb() {
    if (!lb) return;
    lb.hidden = true;
    document.body.classList.remove('is-locked');
    if (lbReturn && lbReturn.focus) lbReturn.focus();
  }
  function stepLb(d) {
    var list = visibleIdx(); if (!list.length) return;
    var at = list.indexOf(lbIndex);
    lbIndex = list[(at + d + list.length) % list.length];
    renderLb();
  }

  if (lb) {
    $('#lbClose').addEventListener('click', closeLb);
    $('#lbPrev').addEventListener('click', function () { stepLb(-1); });
    $('#lbNext').addEventListener('click', function () { stepLb(1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.id === 'lbStage') closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); stepLb(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); stepLb(1); }
      else if (e.key === 'Tab') {
        var f = $$('button', lb);
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    /* swipe */
    var x0 = null, y0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.changedTouches[0].clientX; y0 = e.changedTouches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) stepLb(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
  }

  /* --------------------------- Tax estimator -------------------------- */
  /* Combined Dallas rate, 2.22671% per $100 — City of Dallas, Dallas ISD,
     Dallas County, Dallas College and Parkland. No appraisal district record
     was supplied for this parcel, so the rate and the jurisdictions should be
     confirmed with the county before anyone relies on the output. */
  var RATE = 0.0222671;
  var priceEl = $('#calcPrice'), yEl = $('#calcYear'), mEl = $('#calcMonth');
  var usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  function calc() {
    if (!priceEl) return;
    var v = parseFloat(String(priceEl.value).replace(/[^0-9.]/g, '')) || 0;
    v = Math.min(v, 100000000);
    var annual = v * RATE;
    yEl.textContent = v ? usd0.format(annual) : '—';
    mEl.textContent = v ? usd0.format(annual / 12) : '—';
  }
  if (priceEl) {
    var calcTimer;
    priceEl.addEventListener('input', function () {
      calc();
      clearTimeout(calcTimer);
      calcTimer = setTimeout(function () { track('tax_estimator_used'); }, 1200);
    });
    priceEl.addEventListener('blur', function () {
      var v = parseFloat(String(priceEl.value).replace(/[^0-9.]/g, ''));
      if (v) priceEl.value = usd0.format(Math.min(v, 100000000));
      calc();
    });
    calc();
  }

  /* ------------------------------- Map -------------------------------- */
  /* The map is embedded directly and loads itself lazily as the reader nears
     it. Record that it was actually seen, once, so the section still reports
     engagement now that there is no button to click. */
  var mapBox = $('#mapBox');
  if (mapBox && 'IntersectionObserver' in window) {
    var mapSeen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        track('map_viewed');
        mapSeen.disconnect();
      });
    }, { threshold: 0.35 });
    mapSeen.observe(mapBox);
  }

  /* ------------------------------ Form -------------------------------- */
  var form = $('#leadForm'), status = $('#formStatus'), submitBtn = $('#leadSubmit');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var fd = new FormData(form);
      var intent = fd.get('intent') || 'unspecified';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      status.hidden = true;

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fd).toString()
      })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        form.reset();
        status.hidden = false;
        status.textContent = 'Thank you — your request is on its way to Mysti. You will hear back shortly. For anything urgent, call or text 214-213-3537.';
        submitBtn.textContent = 'Request Sent';
        track('form_submit_success', { intent: intent });
      })
      .catch(function () {
        status.hidden = false;
        status.textContent = 'Something went wrong sending that. Please call or text Mysti at 214-213-3537, or email mysti.stewart@compass.com.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
        track('form_submit_error', { intent: intent });
      });
    });

    /* Deep-link intents: #contact?intent=valuation etc. set the dropdown. */
    $$('[data-intent]').forEach(function (el) {
      el.addEventListener('click', function () {
        var sel = $('#f-intent');
        if (sel) sel.value = el.getAttribute('data-intent');
      });
    });
  }

  /* --------------------------- Reveal sections ------------------------ */
  reveal('.rv');
})();
