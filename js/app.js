/* Dwak — app logic. No framework, no build step. */

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('dwak.' + k)) ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem('dwak.' + k, JSON.stringify(v)); },
};

const state = {
  city: store.get('city', 'alger'),
  pos: null,                       // {lat,lng} from geolocation, else city center
  recents: store.get('recents', []),
  alerts: store.get('alerts', []), // med ids
  reports: store.get('reports', {}), // `${medId}|${phId}` -> {status, at(ms), src:'you'}
  currentMed: null,
  expandedPh: null,
  bulletinOpen: false,
};

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- geo ---------- */
function cityOf(id) { return CITIES.find(c => c.id === id) || CITIES[0]; }
function userPos() { return state.pos || { lat: cityOf(state.city).lat, lng: cityOf(state.city).lng }; }
function km(a, b) {
  const R = 6371, dLa = (b.lat - a.lat) * Math.PI / 180, dLo = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
function tryGeolocate() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (p) => {
      state.pos = { lat: p.coords.latitude, lng: p.coords.longitude };
      // snap to the closest covered city
      let best = CITIES[0], bd = Infinity;
      for (const c of CITIES) { const d = km(state.pos, c); if (d < bd) { bd = d; best = c; } }
      if (bd < 80) { state.city = best.id; store.set('city', best.id); }
      renderLocBar(); if (state.currentMed) renderResults();
    },
    () => {}, { timeout: 6000, maximumAge: 300000 }
  );
}

/* ---------- availability (seed + user reports overlay) ---------- */
function availability(medId, phId) {
  const rep = state.reports[medId + '|' + phId];
  if (rep) {
    const minsAgo = Math.max(0, Math.round((Date.now() - rep.at) / 60000));
    return { status: rep.status, minsAgo, src: 'you' };
  }
  return seedAvailability(medId, phId);
}
function freshLabel(minsAgo) {
  if (minsAgo < 2) return t('freshNow');
  if (minsAgo < 60) return t('freshMin', minsAgo);
  if (minsAgo < 24 * 60) return t('freshHour', Math.round(minsAgo / 60));
  return t('freshOld');
}
/* rank: fresher pharmacist-confirmed stock first, then distance */
function rankEntry(e) {
  if (!e.av) return 4;
  const stale = e.av.minsAgo > 24 * 60;
  if (e.av.status === 'ok') return stale ? 2 : 0;
  if (e.av.status === 'low') return stale ? 2.5 : 1;
  return 3;
}

/* ---------- medicine search ---------- */
function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function searchMeds(q) {
  const n = norm(q.trim());
  if (n.length < 2) return [];
  return MEDICINES
    .filter(m => norm(m.brand).includes(n) || norm(m.dci).includes(n) || (m.ar && m.ar.includes(q.trim())))
    .slice(0, 6);
}

/* ---------- views ---------- */
function show(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  $('#view-' + view).classList.add('active');
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.view === (view === 'results' ? 'search' : view)));
  window.scrollTo({ top: 0 });
}

function renderStatic() {
  $('#tagline').textContent = t('tagline');
  $('#search-input').placeholder = t('searchPlaceholder');
  $('#search-hint').textContent = t('searchHint');
  $('#tab-search span').textContent = t('tabSearch');
  $('#tab-garde span').textContent = t('tabGarde');
  $('#tab-alerts span').textContent = t('tabAlerts');
  $('#lang-btn').textContent = t('langSwitch');
  $('#legal-search').textContent = t('legal');
  $('#install-label').textContent = t('install');
  renderLocBar(); renderBulletin(); renderRecents(); renderGarde(); renderAlerts();
}

function renderLocBar() {
  $('#loc-label').textContent = state.pos ? t('located') : t('allCities');
  $('#city-select').innerHTML = CITIES.map(c =>
    `<button class="city-chip" aria-pressed="${c.id === state.city}" data-city="${c.id}">${esc(LANG === 'ar' ? c.ar : c.fr)}</button>`
  ).join('');
}

function renderBulletin() {
  const b = SHORTAGE_BULLETIN;
  const shortages = MEDICINES.filter(m => m.shortage === 'national');
  $('#bulletin').innerHTML = `
    <h2>${t('bulletinTitle')}</h2>
    <p>${t('bulletinBody', b.national, b.tension)}</p>
    <p class="src">${t('bulletinSrc', b.updated, b.source)}</p>
    <button class="toggle" id="bulletin-toggle">${state.bulletinOpen ? t('hideList') : t('seeList')}</button>
    ${state.bulletinOpen ? `<ul class="bulletin-list">${shortages.map(m =>
      `<li><button data-med="${m.id}"><span class="b-name">${esc(m.brand)}</span></button><span>${esc(m.dci)}</span></li>`).join('')}</ul>` : ''}
  `;
}

function renderRecents() {
  const el = $('#recents');
  if (!state.recents.length) { el.innerHTML = ''; return; }
  el.innerHTML = `<h2>${t('recent')}</h2><div class="recent-row">${state.recents.map(id => {
    const m = MEDICINES.find(x => x.id === id);
    return m ? `<button data-med="${m.id}">${esc(m.brand)}</button>` : '';
  }).join('')}</div>`;
}

function openMed(medId) {
  const med = MEDICINES.find(m => m.id === medId);
  if (!med) return;
  state.currentMed = med; state.expandedPh = null;
  state.recents = [medId, ...state.recents.filter(r => r !== medId)].slice(0, 6);
  store.set('recents', state.recents);
  $('#search-input').value = ''; $('#suggest').innerHTML = '';
  renderResults(true); show('results');
}

function renderResults(firstPaint = false) {
  const med = state.currentMed; if (!med) return;
  const me = userPos();
  const entries = PHARMACIES
    .filter(p => p.city === state.city)
    .map(p => ({ p, av: availability(med.id, p.id), d: km(me, { lat: p.lat, lng: p.lng }) }))
    .sort((a, b) => (rankEntry(a) - rankEntry(b)) || (a.d - b.d));
  const okCount = entries.filter(e => e.av && e.av.status !== 'out' && e.av.minsAgo < 24 * 60).length;
  const isWatched = state.alerts.includes(med.id);
  const sub = med.subs.map(id => MEDICINES.find(m => m.id === id)).find(Boolean);
  const mostlyOut = okCount === 0 || med.shortage === 'national';

  $('#results-inner').innerHTML = `
    <div class="med-head">
      <button class="back" id="back-btn">← ${t('backSearch')}</button>
      <h1>${esc(med.brand)}</h1>
      <p class="dci-line">${t('dci')} : ${esc(med.dci)} · ${esc(med.form)}</p>
      <div class="flags">
        ${med.shortage === 'national' ? `<span class="flag rupture">${t('ruptureNational')}</span>` : ''}
        ${med.shortage === 'tension' ? `<span class="flag tension">${t('tension')}</span>` : ''}
        <button class="alert-btn" id="watch-btn" aria-pressed="${isWatched}">
          ${bellSvg()} ${isWatched ? t('alertOn') : t('alertAdd')}
        </button>
      </div>
    </div>
    <p class="summary">${okCount ? t('summaryAvail', okCount) : t('summaryNone')}
      <span class="sort-note">${t('sortNote')} · ${esc(LANG === 'ar' ? cityOf(state.city).ar : cityOf(state.city).fr)}</span>
    </p>
    <ul class="ph-list ${firstPaint ? 'stagger' : ''}" id="ph-list">
      ${entries.map(e => phRow(e, med)).join('')}
    </ul>
    ${sub && mostlyOut ? `
      <div class="substitute">
        <h3>${t('substituteTitle')}</h3>
        <p class="sub-name">${esc(sub.brand)}</p>
        <p class="why">${t('substituteWhy')}</p>
        <button data-med="${sub.id}">${t('checkSubstitute')} — ${esc(sub.brand)}</button>
      </div>` : ''}
  `;
}

function phRow(e, med) {
  const { p, av, d } = e;
  const stale = av && av.minsAgo > 24 * 60;
  const status = av ? (stale && av.status !== 'out' ? 'unknown' : av.status) : 'unknown';
  const statusLabel = { ok: t('statusOk'), low: t('statusLow'), out: t('statusOut'), unknown: t('statusUnknown') }[status];
  const srcLabel = av ? { pharmacist: t('srcPharmacist'), community: t('srcCommunity'), you: t('srcYou') }[av.src] : '';
  const expanded = state.expandedPh === p.id;
  return `
    <li class="ph-row">
      <button data-ph="${p.id}" aria-expanded="${expanded}">
        <div class="ph-line1">
          <span class="ph-name">${esc(p.name)}</span>
          <span class="ph-dist">${t('distanceKm', d.toFixed(1))}</span>
        </div>
        <div class="ph-line2">
          <span class="status ${status}">${statusLabel}</span>
          ${av ? `<span class="fresh ${av.minsAgo < 60 ? 'strong' : ''}">${freshLabel(av.minsAgo)}</span>` : ''}
          ${av ? `<span class="src-chip ${av.src === 'pharmacist' ? 'pharmacist' : ''}">${av.src === 'pharmacist' ? '✓ ' : ''}${srcLabel}</span>` : ''}
        </div>
      </button>
      ${expanded ? phDetail(p, med) : ''}
    </li>`;
}

function phDetail(p, med) {
  const reported = state.reports[med.id + '|' + p.id];
  const justNow = reported && (Date.now() - reported.at) < 15000;
  return `
    <div class="ph-detail">
      <p class="meta">${esc(p.commune)} · ${t('open')} ${esc(p.hours)}${p.garde ? ' · ' + (p.garde === '24h' ? t('garde24') : t('gardeNight')) : ''}</p>
      <div class="actions">
        <a class="act-call" href="tel:${p.phone.replace(/\s/g, '')}">${t('call')}</a>
        <a class="act-dir" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}">${t('directions')}</a>
      </div>
      <div class="report">
        ${justNow ? `<p class="thanks">${t('reportThanks')}</p>` : `
        <p>${t('reportTitle')}</p>
        <div class="report-btns">
          <button data-r="ok" data-ph="${p.id}">${t('reportFound')}</button>
          <button data-r="low" data-ph="${p.id}">${t('reportLow')}</button>
          <button data-r="out" data-ph="${p.id}">${t('reportOut')}</button>
        </div>`}
      </div>
    </div>`;
}

/* ---------- garde ---------- */
function renderGarde() {
  const list = PHARMACIES.filter(p => p.city === state.city && p.garde);
  const me = userPos();
  $('#garde-inner').innerHTML = `
    <div class="garde-head">
      <h1>${t('gardeTitle')}</h1>
      <p>${t('gardeSub')}</p>
    </div>
    ${list.length ? `<ul class="garde-list">${list
      .map(p => ({ p, d: km(me, { lat: p.lat, lng: p.lng }) }))
      .sort((a, b) => a.d - b.d)
      .map(({ p, d }) => `
      <li class="garde-row">
        <div class="g-name">${esc(p.name)}<span class="g-badge">${p.garde === '24h' ? t('garde24') : t('gardeNight')}</span></div>
        <p class="g-meta">${esc(p.commune)} · ${t('distanceKm', d.toFixed(1))}</p>
        <div class="actions">
          <a class="act-call" href="tel:${p.phone.replace(/\s/g, '')}">${t('call')}</a>
          <a class="act-dir" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}">${t('directions')}</a>
        </div>
      </li>`).join('')}</ul>` : `<p class="garde-empty">${t('gardeEmpty')}</p>`}
    <p class="garde-src">${t('gardeSrc')}</p>
  `;
}

/* ---------- alerts ---------- */
function renderAlerts() {
  const meds = state.alerts.map(id => MEDICINES.find(m => m.id === id)).filter(Boolean);
  $('#tab-alerts').dataset.n = meds.length;
  $('#alerts-inner').innerHTML = `
    <div class="alerts-head">
      <h1>${t('alertsTitle')}</h1>
      <p>${t('alertsSub')}</p>
    </div>
    ${meds.length ? `
      <p class="alerts-count">${t('watching', meds.length)}</p>
      ${meds.map(m => `
        <div class="alert-row">
          <div class="a-info">
            <button data-med="${m.id}">
              <div class="a-name">${esc(m.brand)}</div>
              <div class="a-dci">${esc(m.dci)} · ${m.shortage === 'national' ? t('ruptureNational') : m.shortage === 'tension' ? t('tension') : t('statusOk')}</div>
            </button>
          </div>
          <button class="a-remove" data-remove="${m.id}">${t('alertRemove')}</button>
        </div>`).join('')}` :
      `<p class="alerts-empty">${t('alertsEmpty')}</p>`}
  `;
}

function toggleAlert(medId) {
  if (state.alerts.includes(medId)) state.alerts = state.alerts.filter(a => a !== medId);
  else state.alerts.push(medId);
  store.set('alerts', state.alerts);
  renderAlerts(); if (state.currentMed) renderResults();
}

/* ---------- svg ---------- */
function bellSvg() { return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>'; }

/* ---------- events (delegated) ---------- */
document.addEventListener('click', (ev) => {
  const medBtn = ev.target.closest('[data-med]');
  const phBtn = ev.target.closest('[data-ph]:not([data-r])');
  const reportBtn = ev.target.closest('[data-r]');
  const cityBtn = ev.target.closest('[data-city]');
  const removeBtn = ev.target.closest('[data-remove]');

  if (reportBtn && state.currentMed) {
    const key = state.currentMed.id + '|' + reportBtn.dataset.ph;
    state.reports[key] = { status: reportBtn.dataset.r, at: Date.now(), src: 'you' };
    store.set('reports', state.reports);
    renderResults();
    return;
  }
  if (removeBtn) { toggleAlert(removeBtn.dataset.remove); return; }
  if (medBtn) { openMed(medBtn.dataset.med); return; }
  if (phBtn && phBtn.closest('.ph-list')) {
    state.expandedPh = state.expandedPh === phBtn.dataset.ph ? null : phBtn.dataset.ph;
    renderResults(); return;
  }
  if (cityBtn) {
    state.city = cityBtn.dataset.city; store.set('city', state.city); state.pos = null;
    renderLocBar(); renderGarde(); if (state.currentMed) renderResults();
    return;
  }
  if (ev.target.closest('#bulletin-toggle')) { state.bulletinOpen = !state.bulletinOpen; renderBulletin(); return; }
  if (ev.target.closest('#back-btn')) { state.currentMed = null; show('search'); return; }
  if (ev.target.closest('#watch-btn') && state.currentMed) { toggleAlert(state.currentMed.id); return; }
  const tab = ev.target.closest('.tabs button');
  if (tab) {
    if (tab.dataset.view === 'search' && state.currentMed) show('results');
    else show(tab.dataset.view);
    return;
  }
  if (ev.target.closest('#lang-btn')) {
    setLang(LANG === 'fr' ? 'ar' : 'fr');
    renderStatic(); if (state.currentMed) renderResults();
    return;
  }
});

$('#search-input').addEventListener('input', (ev) => {
  const results = searchMeds(ev.target.value);
  const q = norm(ev.target.value.trim());
  $('#suggest').innerHTML = results.map(m => {
    const hl = (txt) => {
      const i = norm(txt).indexOf(q);
      return i < 0 ? esc(txt) : esc(txt.slice(0, i)) + '<mark>' + esc(txt.slice(i, i + q.length)) + '</mark>' + esc(txt.slice(i + q.length));
    };
    return `<button data-med="${m.id}"><span class="name">${hl(m.brand)}</span><span class="meta">${hl(m.dci)}</span></button>`;
  }).join('');
  if (ev.target.value.trim().length >= 2 && !results.length) {
    $('#suggest').innerHTML = `<button disabled style="color:var(--ink-faint)">${t('noResults')}</button>`;
  }
});

/* ---------- PWA install ---------- */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); deferredInstall = e;
  $('#install-banner').classList.add('show');
});
$('#install-btn').addEventListener('click', async () => {
  if (!deferredInstall) return;
  deferredInstall.prompt(); await deferredInstall.userChoice;
  deferredInstall = null; $('#install-banner').classList.remove('show');
});

/* ---------- boot ---------- */
setLang(LANG);
renderStatic();
const bootView = new URLSearchParams(location.search).get('view');
show(['garde', 'alerts'].includes(bootView) ? bootView : 'search');
tryGeolocate();
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js');
}
