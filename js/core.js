/* MoneyApp – Hilfsfunktionen, Standardkategorien, Formatierung, Version */
const $ = (s) => document.querySelector(s),
  D = new Date(),
  pad = (n) => String(n).padStart(2, '0'),
  iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()),
  uid = () => Math.random().toString(36).slice(2, 9);
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
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
const PAL = ['#c98a2e', '#8a9a4f', '#c15a3f', '#4f8f8a', '#2f7fd1', '#b355d6', '#da7756', '#7c9560'];
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
const bal = (k) =>
  (k == 'bank' && S.set.sb != null ? S.set.sb : 0) +
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
const AI = { bank: '🏦', bar: '💵', spar: '🐷' };
const DIR = () => {
  const ss = (f) =>
    `<select class="form-select" onchange="X.${f}=this.value;op()">${O(
      ['bar', 'bank', 'spar'].map((a) => [a, AI[a] + ' ' + t('a_' + a)]),
      X[f],
    )}</select>`;
  return `<div class=dir><div><label class="form-label">${t('from')}</label>${ss('k')}</div><button class=swp aria-label="${t('swap')}" title="${t('swap')}" onclick="[X.k,X.to]=[X.to,X.k];op()">⇄</button><div><label class="form-label">${t('to')}</label>${ss('to')}</div></div>${X.k == X.to ? `<small class=neg>${t('same')}</small>` : ''}`;
};
const ACC = () =>
  `<label class="form-label">${t(X.t == 'i' ? 'acc_i' : 'acc_e')}</label><div class=tp>${['bar', 'bank'].map((k) => `<button class="${X.k == k ? 'on' : ''}" aria-pressed="${X.k == k}" onclick="X.k='${k}';op()">${AI[k]} ${t('a_' + k)}</button>`).join('')}</div>`;
const dtxt = (n) =>
  S.set.lang == 'en' ? `${n} day${n == 1 ? '' : 's'} left` : `noch ${n} ${n == 1 ? 'Tag' : 'Tage'}`;
const srt = (a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0);
const O = (a, v) =>
  a.map(([k, l]) => `<option value="${k}" ${k == v ? 'selected' : ''}>${l}</option>`).join('');
const APP_VERSION = '1.15.2'; /* EINZIGE Stelle für die Versionsnummer: bei jeder Änderung hier hochzählen */
