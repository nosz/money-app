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
/* 1.27.0: Symbole in Dialogen = Bootstrap Icons 1.13.1 (Quelldateien in img/), inline, damit sie Farbe und Größe des Textes annehmen. Neue Symbole: SVG aus icons.getbootstrap.com nach img/ legen und den Pfad hier eintragen. */
const BIP = {
  download: '<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>', /* download */
  x: '<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>', /* x-lg */
  warn: '<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>', /* exclamation-triangle-fill */
  trash: '<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>', /* trash3 */
  bell: '<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>', /* bell */
  swap: '<path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>', /* arrow-left-right */
  pencil: '<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>', /* pencil */
  note: '<path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/>', /* card-text */
  plus: '<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>', /* plus-lg (1.28.0: Zeile „Kategorie hinzufügen“ in der Kategorie-Auswahl) */
};
const bi = (k) => `<svg class="bi" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">${BIP[k]}</svg>`;
/* Hinweis- und Fehlermeldung mit Warnsymbol in ein Meldungsfeld schreiben (leer = Feld leeren) */
const wm = (e, m) => {
  if (e) e.innerHTML = m ? bi('warn') + ' ' + esc(m) : '';
};
const t = (k) => (T[k] || [k, k])[S.set.lang == 'en' ? 1 : 0],
  loc = () => (S.set.lang == 'en' ? 'en-GB' : 'de-DE');
/* 1.23.0: Einstellung S.set.dec. An (Standard) = immer zwei Nachkommastellen; aus = ganze Beträge, kaufmännisch gerundet. Nur die Anzeige ändert sich, gespeicherte Werte und Exporte bleiben centgenau. Nur ein ausdrücklich ausgeschalteter Wert (false) schaltet ab; fehlt der Wert (alter Stand, altes Backup), gilt „an“. */
const decOn = () => S.set.dec !== false;
/* 1.25.0: Einstellung S.set.csv. Nur ein ausdrücklich eingeschalteter Wert (true) blendet den CSV-Export ein; Standard: aus (der CSV-Export ist kein Backup). */
const csvOn = () => S.set.csv === true;
/* Wert so, wie er angezeigt wird (ohne -0) */
const dsp = (a) => {
  const v = Math.round((Number(a) || 0) * 100) / 100;
  return (decOn() ? v : Math.sign(v) * Math.round(Math.abs(v))) || 0;
};
const fmt = (a) => {
  const d = decOn() ? 2 : 0;
  return new Intl.NumberFormat(loc(), {
    style: 'currency',
    currency: S.set.cur,
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(dsp(a));
};
/* Vorzeichen nur, wenn der angezeigte Betrag nicht 0 ist (kein „−0 €“) */
const sg = (a, ty) => (dsp(a) === 0 ? '' : ty ? (ty == 'i' ? '+' : '−') : a < 0 ? '−' : '+') + fmt(Math.abs(a));
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
/* 1.21.22: Bar und Gespart dürfen nie unter 0 fallen (Bank darf ins Minus, dort bleibt es bei der Warnung). Gesperrt wird, was einen Stand unter 0 ergibt UND ihn gegenüber vorher verschlechtert; ein schon negativer Altbestand lässt Verbesserungen zu. */
const HK = ['bar', 'spar'];
const blk = (v, b) => v < -0.004 && v < b - 0.004;
/* fn verändert eine Kopie des Datenstands (Listen kopiert, Einträge nur ersetzen/anfügen/entfernen); Rückgabe: Konten, die dadurch unter 0 fielen [{k, n: neuer Stand, b: alter Stand}] */
const chk = (fn) => {
  const o = S,
    b = {};
  HK.forEach((k) => (b[k] = bal(k)));
  S = { ...o, tx: o.tx.slice(), tr: o.tr.slice(), rec: o.rec.slice(), cats: o.cats.slice(), set: { ...o.set } };
  try {
    fn();
    return HK.map((k) => ({ k, n: bal(k), b: b[k] })).filter((x) => blk(x.n, x.b));
  } finally {
    S = o;
  }
};
/* Meldung zu einer gesperrten Buchung; a = Betrag der Buchung, h = Schlüssel des Lösungshinweises */
const blkMsg = (r, a, h) =>
  r
    .map((x) => {
      const m = -x.n,
        v = a - m;
      return t(v > 0.004 ? 'e_blk' : 'e_blk0')
        .replace('{k}', t('a_' + x.k))
        .replace('{v}', fmt(Math.max(v, 0)))
        .replace('{m}', fmt(m));
    })
    .join(' ') +
  ' ' +
  t(h || 'e_blkh').replace('{k}', t('a_' + r[0].k));
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
/* Symbole (Bootstrap Icons 1.13.1: bank2, cash-coin, piggy-bank; 1.21.13 zusätzlich pencil-square, bar-chart-line, shield-lock, plus-lg, lock; 1.21.14 info-circle) inline, damit sie die Textfarbe annehmen. In Auswahlfeldern (<select>) geht nur Text, dort stehen die Konten ohne Symbol. */
const AP = {
  bank: `<path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916zM12.375 6v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1z"/>`,
  bar: `<path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/><path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z"/><path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z"/><path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567"/>`,
  spar: `<path d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.138-1.496A6.6 6.6 0 0 1 7.964 4.5c.666 0 1.303.097 1.893.273a.5.5 0 0 0 .286-.958A7.6 7.6 0 0 0 7.964 3.5c-.734 0-1.441.103-2.102.292a.5.5 0 1 0 .276.962"/><path fill-rule="evenodd" d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069q0-.218-.02-.431c.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a1 1 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.74.74 0 0 0-.375.562c-.024.243.082.48.32.654a2 2 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595M2.516 6.26c.455-2.066 2.667-3.733 5.448-3.733 3.146 0 5.536 2.114 5.536 4.542 0 1.254-.624 2.41-1.67 3.248a.5.5 0 0 0-.165.535l.66 2.175h-.985l-.59-1.487a.5.5 0 0 0-.629-.288c-.661.23-1.39.359-2.157.359a6.6 6.6 0 0 1-2.157-.359.5.5 0 0 0-.635.304l-.525 1.471h-.979l.633-2.15a.5.5 0 0 0-.17-.534 4.65 4.65 0 0 1-1.284-1.541.5.5 0 0 0-.446-.275h-.56a.5.5 0 0 1-.492-.414l-.254-1.46h.933a.5.5 0 0 0 .488-.393m12.621-.857a.6.6 0 0 1-.098.21l-.044-.025c-.146-.09-.157-.175-.152-.223a.24.24 0 0 1 .117-.173c.049-.027.08-.021.113.012a.2.2 0 0 1 .064.199"/>`,
  edit: `<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>`,
  stats: `<path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/>`,
  shield: `<path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/><path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>`,
  plus: `<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>`,
  lock: `<path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>`,
  info: `<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>`,
};
const AV = (k) => `<svg class=ai viewBox="0 0 16 16" fill=currentColor aria-hidden=true focusable=false>${AP[k]}</svg>`;
/* Kontostände: nur zeigen, wenn sie aussagekräftig sind (Startwert eingetragen, Umbuchung oder Bar-Buchung vorhanden) */
const balOn = () => hasSt() || S.tr.length > 0 || S.tx.some((x) => x.k == 'bar');
/* Kontoleiste für Geld-Dialoge und Startseite; hi = hervorgehobene Konten */
/* 1.21.24: nav = Kacheln sind Knöpfe und springen zum Konto-Feld in den Einstellungen (nur Startseite, nicht in den Dialogen) */
const bstrip = (hi, nav) => {
  if (!balOn()) return '';
  const ks = ['bar', 'bank'].concat(S.set[SK.spar] != null || Math.abs(bal('spar')) > 0.004 ? ['spar'] : []);
  return `<div class=bstrip role=group aria-label="${t('kto')}">${ks
    .map(
      (k) =>
        `<${nav ? 'button type=button' : 'div'} class="bc${(hi || []).includes(k) ? ' on' : ''}"${nav ? ` onclick="gk('${k}')"` : ''}><span class=bcn>${AV(k)} ${t('a_' + k)}</span><b class="${bal(k) < -0.004 ? 'neg' : ''}">${fmt(bal(k))}</b></${nav ? 'button' : 'div'}>`,
    )
    .join('')}</div>`;
};
/* 1.30.0: Umbuchung – „Von“ und „Auf“ als Konto-Leisten (Bank, Bar, Sparen) untereinander, Tauschen-Knopf dazwischen */
const DIR = () => {
  const bar = (f, lb) =>
    `<div class=fld><label class=\"form-label\">${lb}</label><div class=\"tp acct\" role=group aria-label=\"${lb}\">${['bank', 'bar', 'spar']
      .map(
        (k) =>
          `<button type=button class=\"${X[f] == k ? 'on' : ''}\" aria-pressed=\"${X[f] == k}\" onclick=\"X.${f}='${k}';op()\"><span class=al>${AV(k)} ${t('a_' + k)}</span>${balOn() ? `<small class=bl>${fmt(bal(k))}</small>` : ''}</button>`,
      )
      .join('')}</div></div>`;
  return `${bar('k', t('from'))}<div class=swr><button type=button class=swp aria-label=\"${t('swap')}\" title=\"${t('swap')}\" onclick=\"[X.k,X.to]=[X.to,X.k];op()\">${bi('swap')}</button></div>${bar('to', t('bk_to'))}${X.k == X.to ? `<small class=neg>${t('same')}</small>` : ''}<div id=bn class=bn2></div><div class=\"em blk\" id=eb hidden role=alert></div>`;
};
const ACC = () =>
  `<label class="form-label">${t('bk_acc')}</label><div class="tp acct">${['bar', 'bank']
    .map(
      (k) =>
        `<button class="${X.k == k ? 'on' : ''}" aria-pressed="${X.k == k}" onclick="X.k='${k}';op()"><span class=al>${AV(k)} ${t('a_' + k)}</span>${balOn() ? `<small class=bl>${fmt(bal(k))}</small>` : ''}</button>`,
    )
    .join('')}</div><small id=bn class=bn1 hidden></small><div class="em blk" id=eb hidden role=alert></div>`;
/* Live-Vorschau: Kontostand jetzt und nach dieser Buchung (beim Bearbeiten ohne die alte Buchung gerechnet) */
function bnu() {
  const eb = $('#eb');
  if (eb) {
    const m = blq();
    eb.hidden = !m;
    wm(eb, m);
  }
  const e = $('#bn');
  if (!e || !balOn()) return e && (e.hidden = true);
  const a = num(X.a) > 0 ? num(X.a) : 0,
    o = X.id && (X.t == 'u' ? S.tr : S.tx).find((x) => x.id == X.id),
    eff = (k) => {
      let d = 0;
      if (o) d -= X.t == 'u' ? (o.f == k ? -o.a : o.to == k ? o.a : 0) : (o.k || 'bank') == k ? (o.t == 'i' ? o.a : -o.a) : 0;
      if (X.t == 'u') d += X.k == X.to ? 0 : X.k == k ? -a : X.to == k ? a : 0;
      else d += (X.k || 'bank') == k ? (X.t == 'i' ? a : -a) : 0;
      return d;
    },
    c = (v) => (v < -0.004 ? 'neg' : '');
  if (X.t == 'u') {
    e.innerHTML = [X.k, X.to]
      .map((k) => {
        const n = bal(k) + eff(k);
        return `<div class=bc><span class=bcn>${AV(k)} ${t('a_' + k)}</span><b>${fmt(bal(k))}</b>${a ? `<small class="${c(n)}">→ ${fmt(n)}</small>` : ''}</div>`;
      })
      .join('');
    e.hidden = false;
    return;
  }
  const k = X.k || 'bank',
    n = bal(k) + eff(k);
  e.hidden = !a;
  e.innerHTML = a ? `${t('after')}: ${t('a_' + k)} <b class="${c(n)}">${fmt(n)}</b>` : '';
}
const dtxt = (n) =>
  S.set.lang == 'en' ? `${n} day${n == 1 ? '' : 's'} left` : `noch ${n} ${n == 1 ? 'Tag' : 'Tage'}`;
/* Erfassungszeit einer Buchung (hh:mm) – nur wenn ein Zeitstempel vorhanden ist */
const hm = (x) => (x.ts ? new Date(x.ts).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' }) : '');
const srt = (a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0);
const O = (a, v) =>
  a.map(([k, l]) => `<option value="${k}" ${k == v ? 'selected' : ''}>${l}</option>`).join('');
/* 1.22.0: Backup-Erinnerung (Karte oben auf der Startseite, Auswahl unter Einstellungen → Daten & Sicherheit)
   S.set.br = Intervall: 'off' | 'w' (7 Tage) | 'b' (14 Tage) | 'm' (30 Tage); leer = 'm' (Standard: an)
   S.set.lb = letztes JSON-Backup; S.set.b0 = erster Start mit Erinnerung (Zählbeginn für Nutzer ohne Backup)
   S.set.bs = „Später“: Karte bis dahin ausgeblendet. Nur das JSON-Backup zählt (CSV lässt sich nicht wiederherstellen). */
const BR = { w: 7, b: 14, m: 30 };
let BKS = false; /* Karte war beim letzten Zeichnen der Startseite sichtbar */
const brv = () => (S.set.br in BR || S.set.br == 'off' ? S.set.br : 'm');
const brNext = () => {
  const d = BR[brv()],
    ref = S.set.lb || S.set.b0;
  return d && ref ? ref + d * 864e5 : 0;
};
/* Ohne Buchungen gibt es nichts zu sichern: dann keine Karte */
const brShow = () => {
  const n = brNext(),
    now = Date.now();
  return !!n && now >= n && now >= (S.set.bs || 0) && (S.tx.length > 0 || S.rec.length > 0);
};
const brCard = () => {
  BKS = brShow();
  if (!BKS) return '';
  const d = S.set.lb ? t('bkc_d').replace('{n}', Math.floor((Date.now() - S.set.lb) / 864e5)) : t('bkn0');
  return `<div class="card card-body bkc" role=status><b>${bi('download')} ${t('bkc_t')}</b><small>${d}</small><div class="seg d-flex gap-2"><button class="btn btn-primary" onclick="bk('j')">${t('bkc_go')}</button><button class="btn btn-secondary s ghost" onclick="bkl()">${t('bkc_later')}</button></div></div>`;
};
const brDate = (x) => new Date(x).toLocaleDateString(loc(), { day: '2-digit', month: '2-digit', year: 'numeric' });
const brStatus = () => {
  if (brv() == 'off') return t('bkr_s0');
  const nx = Math.max(brNext(), S.set.bs || 0),
    a = S.set.lb ? t('bkr_s1').replace('{l}', brDate(S.set.lb)) : t('bkr_s2');
  return a + ' · ' + (nx <= Date.now() ? t('bkr_s3') : t('bkr_s4').replace('{n}', brDate(nx)));
};
const APP_VERSION = '1.35.1'; /* Anzeige in den Einstellungen. Bei jedem Release hochzählen, zusammen mit CACHE_VERSION in service-worker.js */
