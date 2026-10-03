/* MoneyApp – Hilfsfunktionen, Standardkategorien, Formatierung, Version */
const $ = (s) => document.querySelector(s),
  D = new Date(),
  pad = (n) => String(n).padStart(2, '0'),
  iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()),
  uid = () => Math.random().toString(36).slice(2, 9);
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
/* 1.20.0: Suchbegriff in Ergebnissen markieren (Text wird maskiert, Treffer in <mark>) */
const hl = (s, q) => {
  s = String(s);
  q = String(q || '').trim();
  if (!q) return esc(s);
  const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  let o = '',
    i = 0,
    m;
  while ((m = re.exec(s))) {
    o += esc(s.slice(i, m.index)) + '<mark class=hl>' + esc(m[0]) + '</mark>';
    i = m.index + m[0].length;
  }
  return o + esc(s.slice(i));
};
/* Ausschnitt einer langen Notiz, der den Treffer sichtbar hält */
const exc = (s, q) => {
  const i = String(s).toLowerCase().indexOf(String(q).trim().toLowerCase());
  return i > 10 ? '…' + String(s).slice(i - 8) : String(s);
};
const DC = [
  ['wohnen', 'e', '🏠'],
  ['lebensmittel', 'e', '🛒'],
  ['mobil', 'e', '🚗'],
  ['freizeit', 'e', '🎉'],
  ['gesund', 'e', '💊'],
  ['kleidung', 'e', '👕'],
  ['abos', 'e', '🔁'],
  ['sonst_e', 'e', '📦'],
  ['gehalt', 'i', '💼'],
  ['neben', 'i', '💸'],
  ['geschenk', 'i', '🎁'],
  ['sonst_i', 'i', '✨'],
];
const PAL = ['#c98a2e', '#8a9a4f', '#c15a3f', '#4f8f8a', '#2f7fd1', '#b355d6', '#da7756', '#7c9560', '#d1a73a', '#6b7fd7', '#a65d7a', '#5f9ea0'];
let S,
  ym = iso(D).slice(0, 7),
  tab = 'home',
  F = { q: '', c: '', all: 0 },
  ST = { t: 'e', p: 'm' },
  HS = {},
  X = {},
  SE = { o: null },
  DP,
  U;
const t = (k) => (T[k] || [k, k])[S.set.lang == 'en' ? 1 : 0],
  loc = () => (S.set.lang == 'en' ? 'en-GB' : 'de-DE');
const fmt = (a) =>
  new Intl.NumberFormat(loc(), {
    style: 'currency',
    currency: S.set.cur,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(a) || 0);
const sg = (a, ty) => (ty ? (ty == 'i' ? '+' : '−') : a < 0 ? '−' : '+') + fmt(Math.abs(a));
const cn = (id) => S.cats.find((c) => c.id == id) || { id: 'x', n: 'c_sonst_e', i: '📦' };
const allT = () => S.tx.concat(S.tr.map((x) => ({ ...x, t: 'u', c: 'u' })));
/* Startwerte je Konto in S.set: bank → sb, bar → sbr, spar → sbs (null = nicht eingetragen) */
const SK = { bank: 'sb', bar: 'sbr', spar: 'sbs' };
const hasSt = () => Object.values(SK).some((f) => S.set[f] != null);
const bal = (k) =>
  (S.set[SK[k]] || 0) +
  S.tx.reduce((s, x) => ((x.k || 'bank') == k ? s + (x.t == 'i' ? x.a : -x.a) : s), 0) +
  S.tr.reduce((s, x) => s + (x.f == k ? -x.a : x.to == k ? x.a : 0), 0);
const svm = () =>
  S.tr.reduce(
    (s, x) =>
      x.d.startsWith(ym)
        ? s + (x.to == 'spar' && x.f != 'spar' ? x.a : x.f == 'spar' && x.to != 'spar' ? -x.a : 0)
        : s,
    0,
  );
/* Zahl aus Eingabe lesen (1.250,50 / 1250,5 / 1,250.50) – null bei ungültig */
const num = (s) => {
  s = String(s).trim().replace(/\s/g, '');
  const c = s.lastIndexOf(','),
    p = s.lastIndexOf('.');
  s = c > p ? s.replace(/\./g, '').replace(',', '.') : c < 0 && /^-?\d{1,3}(\.\d{3})+$/.test(s) ? s.replace(/\./g, '') : s.replace(/,/g, '');
  const v = parseFloat(s);
  return isNaN(v) ? null : v;
};
/* Aktueller Bankstand eingegeben → Startguthaben (sb) zurückrechnen: Eingabe minus Summe aller Bank-Buchungen */
const setAcc = (k, v) => {
  const f = SK[k];
  S.set[f] = Math.round((v - (bal(k) - (S.set[f] || 0))) * 100) / 100;
};
const setBank = (v) => setAcc('bank', v);
/* Kontosymbole (Bootstrap Icons 1.13.1: bank2, cash-coin, piggy-bank) inline, damit sie die Textfarbe annehmen. In Auswahlfeldern (<select>) geht nur Text, dort stehen die Konten ohne Symbol. */
const AP = {
  bank: `<path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916zM12.375 6v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1z"/>`,
  bar: `<path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/><path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z"/><path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z"/><path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567"/>`,
  spar: `<path d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.138-1.496A6.6 6.6 0 0 1 7.964 4.5c.666 0 1.303.097 1.893.273a.5.5 0 0 0 .286-.958A7.6 7.6 0 0 0 7.964 3.5c-.734 0-1.441.103-2.102.292a.5.5 0 1 0 .276.962"/><path fill-rule="evenodd" d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069q0-.218-.02-.431c.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a1 1 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.74.74 0 0 0-.375.562c-.024.243.082.48.32.654a2 2 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595M2.516 6.26c.455-2.066 2.667-3.733 5.448-3.733 3.146 0 5.536 2.114 5.536 4.542 0 1.254-.624 2.41-1.67 3.248a.5.5 0 0 0-.165.535l.66 2.175h-.985l-.59-1.487a.5.5 0 0 0-.629-.288c-.661.23-1.39.359-2.157.359a6.6 6.6 0 0 1-2.157-.359.5.5 0 0 0-.635.304l-.525 1.471h-.979l.633-2.15a.5.5 0 0 0-.17-.534 4.65 4.65 0 0 1-1.284-1.541.5.5 0 0 0-.446-.275h-.56a.5.5 0 0 1-.492-.414l-.254-1.46h.933a.5.5 0 0 0 .488-.393m12.621-.857a.6.6 0 0 1-.098.21l-.044-.025c-.146-.09-.157-.175-.152-.223a.24.24 0 0 1 .117-.173c.049-.027.08-.021.113.012a.2.2 0 0 1 .064.199"/>`,
};
const AV = (k) => `<svg class=ai viewBox="0 0 16 16" fill=currentColor aria-hidden=true focusable=false>${AP[k]}</svg>`;
const DIR = () => {
  const ss = (f) =>
    `<select class="form-select" onchange="X.${f}=this.value;op()">${O(
      ['bar', 'bank', 'spar'].map((a) => [a, t('a_' + a)]),
      X[f],
    )}</select>`;
  return `<div class=dir><div><label class="form-label">${t('from')}</label>${ss('k')}</div><button class=swp aria-label="${t('swap')}" title="${t('swap')}" onclick="[X.k,X.to]=[X.to,X.k];op()">⇄</button><div><label class="form-label">${t('to')}</label>${ss('to')}</div></div>${X.k == X.to ? `<small class=neg>${t('same')}</small>` : ''}`;
};
const ACC = () =>
  `<label class="form-label">${t(X.t == 'i' ? 'acc_i' : 'acc_e')}</label><div class=tp>${['bar', 'bank'].map((k) => `<button class="${X.k == k ? 'on' : ''}" aria-pressed="${X.k == k}" onclick="X.k='${k}';op()">${AV(k)} ${t('a_' + k)}</button>`).join('')}</div>`;
const dtxt = (n) =>
  S.set.lang == 'en' ? `${n} day${n == 1 ? '' : 's'} left` : `noch ${n} ${n == 1 ? 'Tag' : 'Tage'}`;
/* Erfassungszeit einer Buchung (hh:mm) – nur wenn ein Zeitstempel vorhanden ist */
const hm = (x) => (x.ts ? new Date(x.ts).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' }) : '');
const srt = (a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0);
const O = (a, v) =>
  a.map(([k, l]) => `<option value="${k}" ${k == v ? 'selected' : ''}>${l}</option>`).join('');
const APP_VERSION = '1.21.10'; /* Anzeige in den Einstellungen. Bei jedem Release hochzählen, zusammen mit CACHE_VERSION in service-worker.js */
