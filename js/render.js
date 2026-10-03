/* MoneyApp – Ansichten und Navigation */
const mn = () =>
  `<div class=mn><button class="btn btn-secondary s" onclick="mv(-1)">‹</button><div class=g>${ST.p == 'y' && tab == 'set' && SE.o == 'stats' ? ym.slice(0, 4) : mlab(ym)}</div><button class="btn btn-secondary s" onclick="mv(1)">›</button></div>`;
function mv(d) {
  const [y, m] = ym.split('-'),
    n =
      ST.p == 'y' && tab == 'set' && SE.o == 'stats'
        ? new Date(+y + d, +m - 1, 1)
        : new Date(+y, +m - 1 + d, 1);
  ym = n.getFullYear() + '-' + pad(n.getMonth() + 1);
  rd();
}
/* Navigationssymbole (Bootstrap Icons) inline, damit sie die Farbe des Farbschemas annehmen */
const NI = {
  home: `<svg class=ni viewBox="0 0 16 16" width=32 height=32 fill=currentColor aria-hidden=true><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/> <path d="M10.3 7.8A2.4 2.4 0 1 0 10.3 11.4M6.4 9.1h3.3M6.4 10.3h3.3" fill="none" stroke="currentColor" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 -.2)"/></svg>`,
  set: `<svg class=ni viewBox="0 0 16 16" width=32 height=32 fill=currentColor aria-hidden=true><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/> <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/></svg>`,
};
/* Menüsymbole der Einstellungen (Bootstrap Icons 1.13.1, Quelldateien in img/) inline, damit sie die Farbe des Farbschemas annehmen */
const BI = (b) => `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">${b}</svg>`;
const SI = {
  list: BI('<path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>'), /* card-list */
  stats: BI('<path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/>'), /* bar-chart-line */
  rec: BI('<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>'), /* arrow-repeat */
  kto: BI('<path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z"/>'), /* bank */
  cats: BI('<path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z"/><path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z"/>'), /* tags */
  look: BI('<path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/><path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7"/>'), /* palette */
  gen: BI('<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>'), /* gear */
  dat: BI('<path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/><path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>'), /* shield-lock */
};
const nmx = (x) => (x.t == 'u' ? t('tr') : t(cn(x.c).n));
const trow = (x, q) => {
  const u = x.t == 'u',
    c = u ? { i: '⇄', n: 'tr' } : cn(x.c),
    ty = u ? 'u' : x.t,
    kt = u ? t('a_' + x.f) + ' → ' + t('a_' + x.to) : t('a_' + (x.k || 'bank')),
    tm = hm(x);
  return `<div class="li d-flex align-items-center gap-3 tr" data-id="${x.id}" onclick="ot('${x.id}')"><span class=dc>${x.d.slice(8)}.${x.d.slice(5, 7)}.</span><span class=g>${c.i} ${hl(t(c.n), q)}${x.r ? ' ↻' : ''}${x.n ? `<br><small>${hl(x.n, q)}</small>` : ''}<br><small><i class="tb ${ty}">${u ? t('tr') : t(x.t)}</i> ${kt}${tm ? ' · ' + tm : ''}</small></span><b class="${x.t == 'i' ? 'pos' : u ? 'm' : 'neg'}">${u ? fmt(x.a) : sg(x.a, x.t)}</b></div>`;
};
const sortL = (l, sc, dr) => {
  /* Datum + Erfassungszeit (Zeitstempel); alte Buchungen ohne Zeitstempel zählen als 0 */
  const dk = (x) => x.d + String(x.ts || 0).padStart(14, '0'),
    /* 1.21.3: Betrag mit Vorzeichen (Ausgabe −, Einnahme +, Umbuchung 0) */
    sv = (x) => (x.t == 'i' ? Number(x.a) : x.t == 'e' ? -Number(x.a) : 0),
    key = { d: dk, c: (x) => nmx(x).toLowerCase(), a: sv }[sc],
    /* Umbuchungen (alle 0) untereinander nach Betrag */
    sub = (x) => (sc == 'a' && x.t == 'u' ? Number(x.a) : 0),
    cmp = (p, q) => (p < q ? -1 : p > q ? 1 : 0);
  return l
    .slice()
    .sort((a, b) => cmp(key(a), key(b)) * dr || cmp(sub(a), sub(b)) * dr || (sc != 'd' ? cmp(dk(b), dk(a)) : 0));
};
/* Einheitlicher Spaltenkopf für alle sortierbaren Listen: Datum/Fällig | Kategorie/Name | Betrag (aktive Spalte mit ▲/▼).
   cols = [[Sortierschlüssel, Textschlüssel] × 3], cls = Zusatzklasse, tail = Platzhalter für die Pfeil-Spalte rechts */
const hrow = (sc, dr, fn, cols = [['d', 'date'], ['c', 'cat1'], ['a', 'amt']], cls = '', tail = '') => {
  const ar = (c) => (sc == c ? (dr > 0 ? ' ▲' : ' ▼') : ''),
    [a, b, c] = cols;
  return `<div class="li d-flex align-items-center gap-3 hd${cls}"><span class=dc onclick="${fn}('${a[0]}')">${t(a[1])}${ar(a[0])}</span><span class=g><i class=hs onclick="${fn}('${b[0]}')">${t(b[1])}${ar(b[0])}</i></span><span class=am onclick="${fn}('${c[0]}')">${t(c[1])}${ar(c[0])}</span>${tail}</div>`;
};
function hsort(c) {
  if ((HS.sc || 'd') == c) HS.dir = -(HS.dir || -1);
  else {
    HS.sc = c;
    HS.dir = c == 'c' ? 1 : -1;
  }
  rd();
}
/* Kategorien (Einstellungen): Sortierung über die Spaltenköpfe Name / Anzahl */
function csort(c) {
  if ((CT.sc || 'n') == c) CT.dir = -(CT.dir || (c == 'u' ? -1 : 1));
  else {
    CT.sc = c;
    CT.dir = c == 'u' ? -1 : 1;
  }
  rd();
}
/* Wiederkehrende Buchungen: Sortierung über Fällig / Name / Betrag */
function rsort(c) {
  if ((RT.sc || 'f') == c) RT.dir = -(RT.dir || (c == 'a' ? -1 : 1));
  else {
    RT.sc = c;
    RT.dir = c == 'a' ? -1 : 1;
  }
  rd();
}
function fsort(c) {
  if ((F.sc || 'd') == c) F.dir = -(F.dir || -1);
  else {
    F.sc = c;
    F.dir = c == 'c' ? 1 : -1;
  }
  rs();
}
/* 1.21.1: Anzahl Ausgaben / Einnahmen / Umbuchungen oben im aufgeklappten Monat.
   1.21.3: Kacheln sind Filter-Schalter (HS.ty, gilt für alle Monate); Zahlen zeigen immer die Monatsgesamtzahl */
const mcn = (g) => {
  const ty = HS.ty || '',
    n = (k) => g.filter((x) => x.t == k).length,
    c = (k, lbl) =>
      `<button type=button class="mc ${k}${ty == k ? ' on' : ''}${ty && ty != k ? ' off' : ''}${n(k) ? '' : ' zero'}" aria-pressed="${ty == k}" onclick="mty('${k}')"><b>${n(k)}</b><span>${lbl}</span></button>`;
  return `<div class=mcnt role=group aria-label="${t('typ')}">${c('e', t('ex'))}${c('i', t('inn'))}${c('u', t('tr'))}</div>`;
};
/* Tipp auf aktive Kachel hebt den Filter auf, Tipp auf andere Kachel wechselt direkt */
function mty(k) {
  HS.ty = HS.ty == k ? '' : k;
  rd();
}
const mlist = () => {
  const cur = iso(D).slice(0, 7),
    from = iso(new Date(D.getFullYear(), D.getMonth() - 2, 1)).slice(0, 7),
    all = allT().filter((x) => x.d.slice(0, 7) >= from && x.d.slice(0, 7) <= cur),
    ms = [...new Set(all.map((x) => x.d.slice(0, 7)))].sort();
  if (!ms.length) return `<div class="card card-body"><small>${t('none')}</small></div>`;
  HS.o = HS.o || {};
  const sc = HS.sc || 'd',
    dr = HS.dir || -1;
  return ms
    .map((m) => {
      const gm = all.filter((x) => x.d.slice(0, 7) == m),
        ft = HS.ty || '',
        g = sortL(gm, sc, dr).filter((x) => !ft || x.t == ft),
        b = mt(m).b,
        op = HS.o[m] != null ? HS.o[m] : false; /* 1.19.0: beim Start alle Monate eingeklappt */
      return `<div class="card card-body mh"><details ${op ? 'open' : ''} ontoggle="HS.o['${m}']=this.open"><summary><span class=mt>${mlab(m)}</span><span class="mb ${b < 0 ? 'neg' : 'pos'}">${sg(b)}</span></summary>${mcn(gm)}${g.length ? hrow(sc, dr, 'hsort') + g.map((x) => trow(x)).join('') : `<div class=mno>${t('no_' + ft)}</div>`}</details></div>`;
    })
    .join('');
};
const lst = (l, st, id) => {
  st.cl = st.cl || {};
  const sc = st.sc || 'd',
    dr = st.dir || -1;
  return [
    ['e', 'ex'],
    ['i', 'inn'],
    ['u', 'tr'],
  ]
    .map(([k, n]) => {
      const g = sortL(
        l.filter((x) => x.t == k),
        sc,
        dr,
      );
      if (!g.length) return '';
      return `<details ${st.cl[k] === false || (st.cl[k] == null && (st.q || st.c)) ? 'open' : ''} ontoggle="${id}.cl.${k}=!this.open"><summary><b>${t(n)} (${g.length})${k == 'u' ? '' : ' · ' + fmt(g.reduce((s, x) => s + x.a, 0))}</b></summary>${hrow(sc, dr, 'fsort')}${g.map((x) => trow(x, st.q)).join('')}</details>`;
    })
    .join('');
};
/* Gefilterte Liste (Monat / alle Monate, Kategorie, Suche) */
const fl = () => {
  const q = F.q.trim().toLowerCase();
  return allT().filter(
    (x) =>
      (F.all || x.d.startsWith(ym)) &&
      (!F.c || x.c == F.c) &&
      (!q || ((x.n || '') + ' ' + nmx(x)).toLowerCase().includes(q)),
  );
};
const rl = () => {
  const l = fl();
  if (!l.length) return `<small>${t(F.q || F.c ? 'nohit' : 'none')}</small>`;
  return lst(l, F, 'F');
};
/* 1.21.0: Zusammenfassung über der Liste: Anzahl, Summe (ohne Umbuchungen) und „Zurücksetzen“ */
const fsm = () => {
  const l = fl(),
    act = !!(F.q || F.c || F.all),
    net = l.reduce((s, x) => (x.t == 'i' ? s + x.a : x.t == 'e' ? s - x.a : s), 0),
    has = l.some((x) => x.t != 'u');
  return `<span>${l.length ? `<b>${l.length}</b> ${t(l.length == 1 ? 'hit1' : 'hitn')}${has ? ` · <b class="${net < 0 ? 'neg' : 'pos'}">${sg(net)}</b>` : ''}` : ''}</span>${act ? `<button type=button class=fclr onclick="frs()">✕ ${t('frs')}</button>` : ''}`;
};
const rs = () => {
  $('#res').innerHTML = rl();
  $('#fsum').innerHTML = fsm();
};
const fr = () => $('#fq').classList.toggle('fon', !!F.q);
const frs = () => {
  F.q = '';
  F.c = '';
  F.all = 0;
  rd();
};
/* Kategorie-Chips: Tipp setzt den Filter, erneuter Tipp hebt ihn auf */
function fc(id) {
  F.c = F.c == id ? '' : id;
  document.querySelectorAll('.chips .chip').forEach((b) => {
    const on = b.dataset.c == F.c;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
  rs();
}
/* Ansichten */
const V = {
  home() {
    const m = mt(ym),
      cur = ym == iso(D).slice(0, 7),
      n = dues().length;
    let h = mn() + '<div class="row g-3 home-grid"><div class="col-12 col-lg-5">';
    /* solange es keine einzige Buchung gibt: große Karte, die direkt den Buchungsdialog öffnet */
    if (!S.tx.length)
      h += `<div class="card card-body first" role=button tabindex=0 onclick="ot()" onkeydown="if(event.key=='Enter'||event.key==' '){event.preventDefault();ot()}"><b>${AV('plus')} ${t('ofirst')}</b><small>${t('ofirst2')}</small></div>`;
    h += `<div class="card card-body"><small>${t('bal')}</small><div class="big ${m.b < 0 ? 'neg' : 'pos'}">${sg(m.b)}</div><small>↑ ${fmt(m.i)} &nbsp; ↓ ${fmt(m.e)}</small>`;
    if (hasSt() || S.tr.length || S.tx.some((x) => x.k == 'bar'))
      h += `<div style="margin-top:8px"><small>${t('a_bank')}</small> <b>${fmt(bal('bank'))}</b> &nbsp; <small>${t('a_bar')}</small> <b>${fmt(bal('bar'))}</b><br><small>${t('a_spar')}</small> <b>${fmt(bal('spar'))}</b>${hasSt() ? `<br><small>${t('tot')}</small> <b>${fmt(bal('bank') + bal('bar') + bal('spar'))}</b>` : ''}</div>`;
    h += '</div>';
    if (cur) {
      const u = up(),
        sq = svm(),
        dl = new Date(D.getFullYear(), D.getMonth() + 1, 0).getDate() - D.getDate() + 1,
        hs = hasSt(),
        c = Math.round(((hs ? bal('bank') + bal('bar') : m.b - sq) + u) * 100),
        rf = Math.floor(c / 100),
        pd = Math.floor(Math.floor(c / dl) / 100);
      h += `<div class="card card-body"><small>${t('left')} (${dtxt(dl)})</small><div class="big ${c < 0 ? 'neg' : ''}">${fmt(rf)}</div><small>${t('pd')}</small> <b class="${c < 0 ? 'neg' : ''}">${c < 0 ? t('over') : fmt(pd)}</b>${u || (sq && !hs) ? `<small>${u ? `<br>${t('incl')} ${sg(u)}` : ''}${sq && !hs ? `<br>${t('spabz')} ${fmt(sq)}` : ''}</small>` : ''}</div>`;
    }
    if (n)
      h += `<div class="card card-body" onclick=dsh() style=cursor:pointer><b>🔔 ${n} ${t('due')}</b> ›</div>`;

    if (
      !S.set.hd &&
      !matchMedia('(display-mode:standalone)').matches &&
      (DP || /iphone|ipad/i.test(navigator.userAgent))
    )
      h += `<div class="card card-body"><small>${DP ? '' : t('inst')}</small><div class="seg d-flex gap-2">${DP ? `<button class="btn btn-primary" onclick="ins()">${t('ins')}</button>` : ''}<button class="btn btn-secondary s" onclick="S.set.hd=1;P()">✕</button></div></div>`;
    return (
      h +
      '</div><div class="col-12 col-lg-7">' +
      mlist() +
      '</div></div>'
    );
  },
  lb() {
    const used = new Set(S.tx.map((x) => x.c)),
      cs = S.cats.filter((c) => used.has(c.id) || c.id == F.c),
      chip = (id, cls, lbl) =>
        `<button type=button class="chip ${cls}${F.c == id ? ' on' : ''}" data-c="${id}" aria-pressed="${F.c == id}" onclick="fc('${id}')">${lbl}</button>`;
    return `${F.all ? '' : mn()}<label class=allm><input type=checkbox ${F.all ? 'checked' : ''} onchange="F.all=this.checked;rd()">${t('allm')}</label><input id=fq type=search enterkeyhint=search class="form-control${F.q ? ' fon' : ''}" placeholder="🔍 ${t('search2')}" aria-label="${t('search2')}" value="${esc(F.q)}" oninput="F.q=this.value;rs();fr()"><div class=chips role=group aria-label="${t('fcat')}">${chip('', '', t('allk'))}${cs.map((c) => chip(c.id, c.t == 'i' ? 'ci' : 'ce', `${c.i} ${esc(t(c.n))}`)).join('')}</div><div class=fsum id=fsum>${fsm()}</div><div class="card card-body" id=res>${rl()}</div>`;
  },
  sb() {
    const pre = ST.p == 'y' ? ym.slice(0, 4) : ym,
      by = {};
    S.tx.forEach((x) => {
      if (x.t == ST.t && x.d.startsWith(pre)) by[x.c] = (by[x.c] || 0) + x.a;
    });
    const a = Object.entries(by).sort((p, q) => q[1] - p[1]),
      tot = a.reduce((s, x) => s + x[1], 0);
    let cum = 0;
    /* 1.21.14: Kennzahlen, Bilanz und Hinweise. Vergleich mit dem Vorzeitraum (Vormonat bzw. Vorjahr);
       ist der gewählte Zeitraum noch nicht vorbei, wird nur bis zum gleichen Tag verglichen. */
    const yr = ST.p == 'y',
      nowP = yr ? String(D.getFullYear()) : D.getFullYear() + '-' + pad(D.getMonth() + 1),
      live = pre == nowP,
      d0 = new Date(+pre.slice(0, 4), +pre.slice(5, 7) - 2, 1),
      pp = yr ? String(+pre - 1) : d0.getFullYear() + '-' + pad(d0.getMonth() + 1),
      dm = yr ? 0 : new Date(+pp.slice(0, 4), +pp.slice(5, 7), 0).getDate(),
      inP = (x) =>
        !live ||
        (yr
          ? x.d.slice(5) <= pad(D.getMonth() + 1) + '-' + pad(D.getDate())
          : +x.d.slice(8) <= Math.min(D.getDate(), dm)),
      pc = S.tx.filter((x) => x.d.startsWith(pre)),
      pq = S.tx.filter((x) => x.d.startsWith(pp) && inP(x)),
      sm = (l, k) => l.filter((x) => x.t == k).reduce((q, x) => q + x.a, 0),
      nq = (l, k) => l.filter((x) => x.t == k).length,
      inc = sm(pc, 'i'),
      exp = sm(pc, 'e'),
      sal = inc - exp,
      L = pc.filter((x) => x.t == ST.t),
      big = L.reduce((m, x) => (!m || x.a > m.a ? x : m), null),
      pt = sm(pq, ST.t),
      df = tot - pt,
      pct = pt > 0 ? (df / pt) * 100 : null,
      nb = (n) => `${n} ${t(n == 1 ? 'au_b1' : 'au_bn')}`,
      vw = t(yr ? 'au_vj' : 'au_vp'),
      fl = (q, o) => Object.keys(o).reduce((z, k) => z.replace('{' + k + '}', () => o[k]), q),
      cls = (v) => (v == 0 ? '' : v > 0 == (ST.t == 'i') ? 'pos' : 'neg'),
      cname = (id) => esc(t(cn(id).n)),
      hs = [],
      pb = {};
    pq.forEach((x) => x.t == 'e' && (pb[x.c] = (pb[x.c] || 0) + x.a));
    /* Reihenfolge: Saldo, größter Anstieg, Veränderung, dominante Kategorie (höchstens 3) */
    if (sal < 0) hs.push(fl(t('au_h1'), { x: fmt(-sal) }));
    if (ST.t == 'e' && pt > 0) {
      let ri = null;
      a.forEach(([c, v]) => {
        const g = v - (pb[c] || 0);
        if (g >= 20 && (!ri || g > ri[1])) ri = [c, g];
      });
      if (ri) hs.push(fl(t('au_h3'), { c: cname(ri[0]), x: '+' + fmt(ri[1]), v: vw }));
    }
    if (pct != null && Math.abs(pct) >= 10)
      hs.push(
        fl(t(ST.t == 'e' ? 'au_h2e' : 'au_h2i'), {
          p: Math.abs(pct).toFixed(0),
          d: t(pct > 0 ? 'au_ab' : 'au_bl'),
          v: vw,
        }),
      );
    if (a.length > 1 && a[0][1] / tot >= 0.4)
      hs.push(
        fl(t(ST.t == 'e' ? 'au_h4e' : 'au_h4i'), { c: cname(a[0][0]), p: ((a[0][1] / tot) * 100).toFixed(0) }),
      );
    const bl = pc.length
        ? `<div class="card card-body"><b>${t('au_bil')}</b><div class=ar><span>${t('inn')}<small>${nb(nq(pc, 'i'))}</small></span><b class=pos>${fmt(inc)}</b></div><div class=ar><span>${t('ex')}<small>${nb(nq(pc, 'e'))}</small></span><b class=neg>${fmt(exp)}</b></div><div class=ar><span>${t('au_sal')}</span><b class="${sal < 0 ? 'neg' : 'pos'}">${sg(sal)}</b></div><div class=ar><span>${t('au_sq')}</span><b>${inc > 0 ? ((sal / inc) * 100).toFixed(0).replace('-', '−') + ' %' : '–'}</b></div></div>`
        : '',
      hn = hs.length
        ? `<div class="card card-body"><b>${t('au_hin')}</b>${hs
            .slice(0, 3)
            .map((x) => `<div class=ah>${AV('info')}<span>${x}</span></div>`)
            .join('')}</div>`
        : '',
      sn = df > 0 ? '+' : df < 0 ? '−' : '±',
      kz = tot
        ? `<div class=kz><div><small>${t('au_n')}</small><b>${L.length}</b></div><div><small>${t('au_avg')}</small><b>${fmt(tot / L.length)}</b></div><div><small>${t('au_max')}</small><b>${fmt(big.a)}</b><small>${cname(big.c)} · ${big.d.slice(8)}.${big.d.slice(5, 7)}.</small></div><div><small>${fl(t('au_vgl'), { v: vw })}</small>${pct == null ? '<b>–</b>' : `<b class="${cls(df)}">${sn}${fmt(Math.abs(df))}</b><small>${sn}${Math.abs(pct).toFixed(0)} %</small>`}</div></div>${live && pct != null ? `<small class=kn>${t('au_bis')}</small>` : ''}`
        : '';
    /* 1.21.16: Umschalter Ausgaben/Einnahmen bleibt beim Scrollen oben (sticky, #tps). Reihenfolge: alles, was vom Umschalter abhängt, steht oben (Donut, Hinweise, Kennzahlen, Kategorieliste); danach Bilanz und Trend. Kategorien unter 3 % werden im Donut zu „Sonstiges“ gebündelt. */
    const sm3 = a.filter((x) => (x[1] / tot) * 100 < 3),
      bu = sm3.length >= 2 && sm3.length < a.length,
      GR = 'rgba(128,128,128,.55)',
      ds = bu ? [...a.slice(0, a.length - sm3.length), [null, sm3.reduce((q, x) => q + x[1], 0)]] : a;
    let h = `<div class=tps id=tps><div class=tp><button class="${ST.t == 'e' ? 'on' : ''}" data-ty=e aria-pressed="${ST.t == 'e'}" onclick="stt('e')">${t('ex')}</button><button class="${ST.t == 'i' ? 'on' : ''}" data-ty=i aria-pressed="${ST.t == 'i'}" onclick="stt('i')">${t('inn')}</button></div></div><div class=tp><button class="${ST.p == 'm' ? 'on' : ''}" aria-pressed="${ST.p == 'm'}" onclick="ST.p='m';rd()">${t('month')}</button><button class="${ST.p == 'y' ? 'on' : ''}" aria-pressed="${ST.p == 'y'}" onclick="ST.p='y';rd()">${t('year')}</button></div>${mn()}<div class="card card-body" id=dn>`;
    if (!tot) h += `<small>${t(pc.length ? 'no_' + ST.t + (yr ? 'y' : '') : 'none')}</small>`;
    else {
      const gap = ds.length > 1 ? 0.6 : 0,
        ft = fmt(tot);
      h += `<svg viewBox="0 0 42 42" style="width:230px;max-width:80%;display:block;margin:4px auto 14px"><circle r=15.9155 cx=21 cy=21 fill=none stroke="rgba(128,128,128,.15)" stroke-width=5.5 />${ds
        .map((x, i) => {
          const p = (x[1] / tot) * 100,
            s = `<circle r=15.9155 cx=21 cy=21 fill=none stroke="${bu && i == ds.length - 1 ? GR : PAL[i % PAL.length]}" stroke-width=5.5 stroke-dasharray="${Math.max(p - gap, 0.01)} ${100 - p + gap}" stroke-dashoffset="${25 - cum}"/>`;
          cum += p;
          return s;
        })
        .join(
          '',
        )}<text x=21 y=19.5 text-anchor=middle font-size=2.6 fill=currentColor opacity=.65>${t(ST.t == 'e' ? 'ex' : 'inn')}</text><text x=21 y=24.5 text-anchor=middle font-size=${ft.length > 8 ? 4 : 5} font-weight=700 fill=currentColor>${ft}</text></svg>`;
      if (bu)
        h += `<small style="display:block;text-align:center;margin:-6px 0 2px;opacity:.75"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${GR};margin-right:5px"></span>${t('au_oth')}</small>`;
    }
    h += `</div>${hn}`;
    if (tot)
      h += `<div class="card card-body">${kz}${a
        .map((x, i) => {
          const c = cn(x[0]),
            p = (x[1] / tot) * 100,
            col = bu && i >= a.length - sm3.length ? GR : PAL[i % PAL.length];
          return `<div onclick="gl('${x[0]}')" style="cursor:pointer;padding:9px 0;border-top:1px solid rgba(128,128,128,.18)"><div style="display:flex;align-items:center;gap:8px"><span style="width:10px;height:10px;border-radius:50%;background:${col};flex:none"></span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.i} ${esc(t(c.n))}</span><small style="opacity:.7">${p.toFixed(0)} %</small><b style="min-width:4.6em;text-align:right">${fmt(x[1])}</b></div><div style="height:4px;border-radius:2px;background:rgba(128,128,128,.18);margin:6px 0 0 18px"><div style="width:${p}%;height:100%;border-radius:2px;background:${col}"></div></div></div>`;
        })
        .join('')}</div>`;
    const dot = (c) => `<span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c};margin-right:5px"></span>`;
    h += `${bl}<div class="card card-body"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:6px"><b style="flex:1">${t('trend')}</b><small>${dot('var(--sage)')}${t('inn')}</small><small>${dot('var(--rust)')}${t('ex')}</small></div><svg viewBox="0 0 300 120" style="width:100%"><line x1=0 x2=300 y1=90 y2=90 stroke=currentColor opacity=.2 />`;
    const ms = [];
    for (let k = 5; k >= 0; k--) {
      const [y, m] = ym.split('-'),
        d = new Date(+y, +m - 1 - k, 1),
        p = d.getFullYear() + '-' + pad(d.getMonth() + 1);
      ms.push([d, mt(p)]);
    }
    const mx = Math.max(1, ...ms.map((x) => Math.max(x[1].i, x[1].e))),
      bh = (v) => (v > 0 ? Math.max((v / mx) * 80, 2) : 0);
    h += ms
      .map((x, k) => {
        const hi = bh(x[1].i),
          he = bh(x[1].e);
        return `<rect x=${k * 50 + 6} y=${90 - hi} width=17 height=${hi} rx=3 fill="var(--sage)"/><rect x=${k * 50 + 25} y=${90 - he} width=17 height=${he} rx=3 fill="var(--rust)"/><text x=${k * 50 + 24} y=106 text-anchor=middle font-size=11 ${k == 5 ? 'font-weight=700' : 'opacity=.75'} fill=currentColor>${x[0].toLocaleDateString(loc(), { month: 'short' })}</text>`;
      })
      .join('');
    return h + '</svg></div>';
  },
  set() {
    const s = S.set,
      lb = (k, h) => `<label class="form-label">${t(k)}</label>${h}`,
      bx = (h) => `<div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(128,128,128,.25)">${h}</div>`,
      sec = (k, ic, ti, fn) => {
        const o = SE.o == k;
        return `<div class="card card-body sec${o ? ' open' : ''}" id="s_${k}"><button aria-expanded="${o}" onclick="se('${k}')"><span class=ic>${ic}</span><span class=g>${ti}</span><span class=chev aria-hidden=true>›</span></button>${o ? `<div class=sb>${fn()}</div>` : ''}</div>`;
      },
      rec = () => {
        /* 1.21.14: neue wiederkehrende Buchung direkt anlegen (wie „Neue Kategorie“), auch bei leerer Liste */
        const nb = `<button class="btn btn-primary" style="width:100%;margin:2px 0 8px" onclick="nrc()">＋ ${t('rec_n')}</button>`;
        if (!S.rec.length) return nb + `<small>${t('norec')}</small>`;
        RT.cl = RT.cl || {};
        /* Sortierung wählbar (Standard: nächste Fälligkeit zuerst) */
        const nx = (r) => iso(dateK(r, r.k)),
          nm = (r) => (r.n || t(cn(r.c).n)).toLowerCase(),
          cmp = (p, q) => (p < q ? -1 : p > q ? 1 : 0),
          sc = RT.sc || 'f',
          dr = RT.dir || (sc == 'a' ? -1 : 1),
          ar = (c) => (sc == c ? (dr > 0 ? ' ▲' : ' ▼') : ''),
          key = { f: nx, n: nm, a: (r) => r.a }[sc],
          so = (a, b) => cmp(key(a), key(b)) * dr || cmp(nx(a), nx(b)) || cmp(nm(a), nm(b)),
          head = hrow(sc, dr, 'rsort', [['f', 'rdue'], ['n', 'name'], ['a', 'amt']], ' rcd', '<span class=sp></span>');
        const grp = (ty, ti) => {
          const l = S.rec.filter((r) => r.t == ty).sort(so);
          return l.length
            ? `<details class=gx ${RT.cl[ty] === false ? 'open' : ''} ontoggle="RT.cl.${ty}=!this.open"><summary class="rh ${ty}">${ti} (${l.length})</summary>` +
                head +
                l
                  .map(
                    (r) =>
                      `<div class="li d-flex align-items-center gap-3 tr r${ty}" role=button tabindex=0 aria-label="${t('rec_e')}" onclick="er('${r.id}')" onkeydown="if(event.key=='Enter'||event.key==' '){event.preventDefault();er('${r.id}')}"><span class=dc>${nx(r).slice(8)}.${nx(r).slice(5, 7)}.</span><span class=g>${cn(r.c).i} ${esc(r.n || t(cn(r.c).n))}<br><small>${t(r.f)}${nx(r).slice(0, 4) != iso(D).slice(0, 4) ? ' · ' + nx(r).slice(0, 4) : ''}</small></span><b class="${ty == 'i' ? 'pos' : 'neg'}">${sg(r.a, r.t)}</b><span class=chv aria-hidden=true>›</span></div>`,
                  )
                  .join('') +
                '</details>'
            : '';
        };
        return nb + grp('e', t('ex')) + grp('i', t('inn'));
      },
      cats = () => {
        CT.cl = CT.cl || {};
        const cm = {};
        S.tx.forEach((x) => (cm[x.c] = (cm[x.c] || 0) + 1));
        const cnt = (id) => cm[id] || 0,
          nm = (c) => t(c.n).toLowerCase(),
          sc = CT.sc || 'n',
          dr = CT.dir || (sc == 'u' ? -1 : 1),
          ar = (c) => (sc == c ? (dr > 0 ? ' ▲' : ' ▼') : ''),
          head = `<div class="li d-flex align-items-center gap-3 hd ch"><span class=ic></span><span class=g onclick="csort('n')">${t('name')}${ar('n')}</span><span class=cc onclick="csort('u')">${t('cnt')}${ar('u')}</span><span class=sp></span></div>`,
          so = (a, b) =>
            (sc == 'u' ? cnt(a.id) - cnt(b.id) : nm(a).localeCompare(nm(b))) * dr || nm(a).localeCompare(nm(b));
        const grp = (ty, ti) => {
          const l = S.cats.filter((c) => c.t == ty).sort(so);
          return l.length
            ? `<details class=gx ${CT.cl[ty] === false ? 'open' : ''} ontoggle="CT.cl.${ty}=!this.open"><summary class="rh ${ty}">${ti} (${l.length})</summary>` +
                head +
                l
                  .map(
                    (c) =>
                      `<div class="li cr" role=button tabindex=0 onclick="ecs('${c.id}')" onkeydown="if(event.key=='Enter'||event.key==' '){event.preventDefault();ecs('${c.id}')}"><span class=ic>${c.i}</span><div class=g>${esc(t(c.n))}</div><small>${cnt(c.id)}</small><span class=chv aria-hidden=true>›</span></div>`,
                  )
                  .join('') +
                '</details>'
            : '';
        };
        return (
          `<button class="btn btn-primary" style="width:100%;margin:2px 0 8px" onclick="ncs(0)">＋ ${t('newc')}</button>` +
          grp('e', t('ex')) +
          grp('i', t('inn'))
        );
      },
      look = () =>
        lb(
          'font',
          `<select class="form-select" onchange="S.set.font=this.value;P()">${O(
            [
              ['s', t('f_s')],
              ['n', t('f_n')],
              ['l', t('f_l')],
            ],
            s.font,
          )}</select>`,
        ) +
        lb(
          'theme',
          '<div>' +
            Object.keys(TH)
              .map(
                (k) =>
                  `<button class=th title=${k} aria-label=${k} style="background:linear-gradient(135deg,${TH[k][0]} 50%,${TH[k][2]} 50%);${s.theme == k ? 'border-color:var(--gold)' : ''}" onclick="S.set.theme='${k}';P()"></button>`,
              )
              .join('') +
            '</div>',
        ),
      gen = () =>
        lb(
          'cur',
          `<select class="form-select" onchange="S.set.cur=this.value;P()">${O(
            ['EUR', 'CHF', 'USD', 'GBP'].map((c) => [c, c]),
            s.cur,
          )}</select>`,
        ) +
        lb(
          'lang',
          `<select class="form-select" onchange="S.set.lang=this.value;P()">${O(
            [
              ['de', 'Deutsch'],
              ['en', 'English'],
            ],
            s.lang,
          )}</select>`,
        ) +
        `<small style="display:block;margin-top:16px">${t('ver')} ${APP_VERSION}</small>`,
      kto = () =>
        `<small style="display:block;margin-bottom:6px">${t('ktoh')}</small>` +
        ['bank', 'bar', 'spar']
          .map((k) => {
            const set = s[SK[k]] != null,
              b = bal(k);
            return bx(
              `<label class="form-label">${AV(k)} ${t('a_' + k)}</label><small style="display:block;margin-bottom:8px">${t('kh_' + k)}</small><input id=st_${k} class="form-control" inputmode=decimal placeholder="${t('sbp0')}" oninput="this.style.borderColor=''" value="${set || Math.round(b * 100) ? String(Math.round(b * 100) / 100).replace('.', ',') : ''}">`,
            );
          })
          .join('') +
        `<div class="seg d-flex gap-2 stk"><button class="btn btn-primary w-100" onclick="ktoSave()">${t('save')}</button></div>`,
      dat = () =>
        `<div class=dgrid><button class="btn btn-secondary s" onclick="bk('j')">${t('bk')}</button><button class="btn btn-secondary s" onclick="bk('c')">${t('csv')}</button><small>${t('bkj')}</small><small>${t('bkc')}</small></div><button type=button class="btn btn-secondary s w-100" style="margin-top:12px" onclick="$('#imf').click()">📥 ${t('imp')}</button><input id=imf class=vh type=file accept=".json,application/json" onchange="im(this)" tabindex=-1 aria-hidden=true>` +
        bx(
          lb(
            'pin',
            `<div class="seg d-flex gap-2"><button class="btn btn-secondary s w-100" onclick="pn()">${s.pin ? t('pinoff') : t('pinon')}</button></div><small style="display:block;margin-top:8px">${t('pinh')}</small>`,
          ),
        );
    return (
      `<h2>${t('set')}</h2>` +
      sec('list', SI.list, t('list'), () => V.lb()) +
      sec('stats', SI.stats, t('stats'), () => V.sb()) +
      sec('kto', SI.kto, t('kto'), kto) +
      sec('rec', SI.rec, t('recs'), rec) +
      sec('cats', SI.cats, t('cats'), cats) +
      sec('look', SI.look, t('look'), look) +
      sec('gen', SI.gen, t('gen'), gen) +
      sec('dat', SI.dat, t('dat'), dat)
    );
  },
};
/* 1.21.17: Das ＋ (neue Buchung) in der unteren Leiste bleibt auch in den Einstellungen sichtbar (vorher dort ausgeblendet, mit leerer Lücke) */
function rd() {
  $('#v').innerHTML = V[tab]();
  $('#nav').innerHTML =
    `<button class="nb${tab == 'home' ? ' on' : ''}" ${tab == 'home' ? 'aria-current=page ' : ''}onclick="go('home')" aria-label="${t('home')}">${NI.home}<span class=nl>${t('home')}</span></button><button id=fab onclick="ot()" aria-label="${t('new')}"><svg viewBox="0 0 24 24" width=36 height=36 aria-hidden=true><path d="M12 4.5v15M4.5 12h15" stroke="currentColor" stroke-width=3 stroke-linecap=round fill=none /></svg></button><button class="nb${tab == 'set' ? ' on' : ''}" ${tab == 'set' ? 'aria-current=page ' : ''}onclick="go('set')" aria-label="${t('set')}">${NI.set}<span class=nl>${t('set')}</span></button>`;
}
const fx = (k) => {
  const e = $('#s_' + k);
  e &&
    e.scrollIntoView({
      block: 'start',
      behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth',
    });
};
/* 1.21.16: Umschalten Ausgaben/Einnahmen in der Auswertung. Steht der Donut dabei nicht (ganz) im Bild, scrollt die Ansicht sanft zu ihm; sonst bleibt die Position. */
function stt(k) {
  ST.t = k;
  rd();
  const e = $('#dn'),
    b = $('#tps');
  if (!e) return;
  const r = e.getBoundingClientRect(),
    top = b ? b.getBoundingClientRect().bottom : 0;
  if (r.top < top || r.bottom > innerHeight)
    scrollBy({
      top: r.top - top - 8,
      behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth',
    });
}
function se(k) {
  SE.o = SE.o == k ? null : k;
  rd();
  if (SE.o) fx(k);
}
function go(x) {
  tab = x;
  scrollTo(0, 0);
  rd();
}
function gl(id) {
  F = { q: '', c: id, all: 0 };
  tab = 'set';
  SE.o = 'list';
  rd();
  fx('list');
}
