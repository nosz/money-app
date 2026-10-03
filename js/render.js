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
const nmx = (x) => (x.t == 'u' ? t('tr') : t(cn(x.c).n));
const trow = (x, q) => {
  const u = x.t == 'u',
    c = u ? { i: '⇄', n: 'tr' } : cn(x.c),
    ty = u ? 'u' : x.t,
    kt = u ? t('a_' + x.f) + ' → ' + t('a_' + x.to) : t('a_' + (x.k || 'bank')),
    tm = hm(x);
  return `<div class="li d-flex align-items-center gap-3 tr" onclick="ot('${x.id}')"><span class=dc>${x.d.slice(8)}.${x.d.slice(5, 7)}.</span><span class=g>${c.i} ${hl(t(c.n), q)}${x.r ? ' ↻' : ''}${x.n ? `<br><small>${hl(x.n, q)}</small>` : ''}<br><small><i class="tb ${ty}">${u ? t('tr') : t(x.t)}</i> ${kt}${tm ? ' · ' + tm : ''}</small></span><b class="${x.t == 'i' ? 'pos' : u ? 'm' : 'neg'}">${u ? fmt(x.a) : sg(x.a, x.t)}</b></div>`;
};
const sortL = (l, sc, dr) => {
  /* Datum + Erfassungszeit (Zeitstempel); alte Buchungen ohne Zeitstempel zählen als 0 */
  const dk = (x) => x.d + String(x.ts || 0).padStart(14, '0'),
    key = { d: dk, c: (x) => nmx(x).toLowerCase(), a: (x) => x.a, t: (x) => ({ e: 0, i: 1, u: 2 })[x.t] }[sc],
    cmp = (p, q) => (p < q ? -1 : p > q ? 1 : 0);
  return l.slice().sort((a, b) => cmp(key(a), key(b)) * dr || (sc != 'd' ? cmp(dk(b), dk(a)) : 0));
};
const hrow = (sc, dr, fn, ty) => {
  const ar = (c) => (sc == c ? (dr > 0 ? ' ▲' : ' ▼') : '');
  return `<div class="li d-flex align-items-center gap-3 hd"><span class=dc onclick="${fn}('d')">${t('date')}${ar('d')}</span><span class=g><i class=hs onclick="${fn}('c')">${t('cat1')}${ar('c')}</i>${ty ? `<i class=hs onclick="${fn}('t')">${t('typ')}${ar('t')}</i>` : ''}</span><span onclick="${fn}('a')">${t('amt')}${ar('a')}</span></div>`;
};
function hsort(c) {
  if ((HS.sc || 'd') == c) HS.dir = -(HS.dir || -1);
  else {
    HS.sc = c;
    HS.dir = c == 'c' || c == 't' ? 1 : -1;
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
    F.dir = c == 'c' || c == 't' ? 1 : -1;
  }
  rs();
}
/* 1.21.1: Anzahl Ausgaben / Einnahmen (und ggf. Umbuchungen) oben im aufgeklappten Monat */
const mcn = (g) => {
  const n = (ty) => g.filter((x) => x.t == ty).length,
    c = (ty, lbl) => `<span class="mc ${ty}">${lbl}<b>${n(ty)}</b></span>`;
  return `<div class=mcnt>${c('e', t('ex'))}${c('i', t('inn'))}${n('u') ? c('u', t('tr')) : ''}</div>`;
};
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
      const g = sortL(
          all.filter((x) => x.d.slice(0, 7) == m),
          sc,
          dr,
        ),
        b = mt(m).b,
        op = HS.o[m] != null ? HS.o[m] : false; /* 1.19.0: beim Start alle Monate eingeklappt */
      return `<div class="card card-body mh"><details ${op ? 'open' : ''} ontoggle="HS.o['${m}']=this.open"><summary><span class=mt>${mlab(m)}</span><span class="mb ${b < 0 ? 'neg' : 'pos'}">${sg(b)}</span></summary>${mcn(g)}${hrow(sc, dr, 'hsort', true)}${g.map((x) => trow(x)).join('')}</details></div>`;
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
    let h = `<div class="seg d-flex gap-2"><button class="btn ${ST.t == 'e' ? '' : 's'}" onclick="ST.t='e';rd()">${t('ex')}</button><button class="btn ${ST.t == 'i' ? '' : 's'}" onclick="ST.t='i';rd()">${t('inn')}</button></div><div class="seg d-flex gap-2" style=margin:8px 0><button class="btn sm ${ST.p == 'm' ? '' : 's'}" onclick="ST.p='m';rd()">${t('month')}</button><button class="btn sm ${ST.p == 'y' ? '' : 's'}" onclick="ST.p='y';rd()">${t('year')}</button></div>${mn()}<div class="card card-body">`;
    if (!tot) h += `<small>${t('none')}</small>`;
    else {
      const gap = a.length > 1 ? 0.6 : 0,
        ft = fmt(tot);
      h += `<svg viewBox="0 0 42 42" style="width:230px;max-width:80%;display:block;margin:4px auto 14px"><circle r=15.9155 cx=21 cy=21 fill=none stroke="rgba(128,128,128,.15)" stroke-width=5.5 />${a
        .map((x, i) => {
          const p = (x[1] / tot) * 100,
            s = `<circle r=15.9155 cx=21 cy=21 fill=none stroke="${PAL[i % PAL.length]}" stroke-width=5.5 stroke-dasharray="${Math.max(p - gap, 0.01)} ${100 - p + gap}" stroke-dashoffset="${25 - cum}"/>`;
          cum += p;
          return s;
        })
        .join(
          '',
        )}<text x=21 y=19.5 text-anchor=middle font-size=2.6 fill=currentColor opacity=.65>${t(ST.t == 'e' ? 'ex' : 'inn')}</text><text x=21 y=24.5 text-anchor=middle font-size=${ft.length > 8 ? 4 : 5} font-weight=700 fill=currentColor>${ft}</text></svg>`;
      h += a
        .map((x, i) => {
          const c = cn(x[0]),
            p = (x[1] / tot) * 100,
            col = PAL[i % PAL.length];
          return `<div onclick="gl('${x[0]}')" style="cursor:pointer;padding:9px 0;border-top:1px solid rgba(128,128,128,.18)"><div style="display:flex;align-items:center;gap:8px"><span style="width:10px;height:10px;border-radius:50%;background:${col};flex:none"></span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.i} ${esc(t(c.n))}</span><small style="opacity:.7">${p.toFixed(0)} %</small><b style="min-width:4.6em;text-align:right">${fmt(x[1])}</b></div><div style="height:4px;border-radius:2px;background:rgba(128,128,128,.18);margin:6px 0 0 18px"><div style="width:${p}%;height:100%;border-radius:2px;background:${col}"></div></div></div>`;
        })
        .join('');
    }
    const dot = (c) => `<span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c};margin-right:5px"></span>`;
    h += `</div><div class="card card-body"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:6px"><b style="flex:1">${t('trend')}</b><small>${dot('var(--sage)')}${t('inn')}</small><small>${dot('var(--rust)')}${t('ex')}</small></div><svg viewBox="0 0 300 120" style="width:100%"><line x1=0 x2=300 y1=90 y2=90 stroke=currentColor opacity=.2 />`;
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
        if (!S.rec.length) return `<small>${t('norec')}</small>`;
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
          head = `<div class="li d-flex align-items-center gap-3 hd ch"><span class=ic></span><span class=g><i class=hs onclick="rsort('f')">${t('rdue')}${ar('f')}</i><i class=hs onclick="rsort('n')">${t('name')}${ar('n')}</i><i class=hs onclick="rsort('a')">${t('amt')}${ar('a')}</i></span><span class=sp></span></div>`;
        const grp = (ty, ti) => {
          const l = S.rec.filter((r) => r.t == ty).sort(so);
          return l.length
            ? `<details class=gx ${RT.cl[ty] === false ? 'open' : ''} ontoggle="RT.cl.${ty}=!this.open"><summary class="rh ${ty}">${ti} (${l.length})</summary>` +
                head +
                l
                  .map(
                    (r) =>
                      `<div class="li d-flex align-items-center gap-3 r${ty}" role=button tabindex=0 aria-label="${t('rec_e')}" onclick="er('${r.id}')" onkeydown="if(event.key=='Enter'||event.key==' '){event.preventDefault();er('${r.id}')}"><span class=ic>${cn(r.c).i}</span><div class=g>${esc(r.n || t(cn(r.c).n))}<br><small>${t(r.f)} · 📅 ${nx(r).split('-').reverse().join('.')} · <b class="${ty == 'i' ? 'pos' : 'neg'}">${sg(r.a, r.t)}</b></small></div><span class=chv aria-hidden=true>›</span></div>`,
                  )
                  .join('') +
                '</details>'
            : '';
        };
        return grp('e', t('ex')) + grp('i', t('inn'));
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
              `<label class="form-label">${k == 'spar' ? SPI : AI[k]} ${t('a_' + k)}</label><small style="display:block;margin-bottom:8px">${t('kh_' + k)}</small><input id=st_${k} class="form-control" inputmode=decimal placeholder="${t('sbp0')}" oninput="this.style.borderColor=''" value="${set || Math.round(b * 100) ? String(Math.round(b * 100) / 100).replace('.', ',') : ''}">`,
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
      sec('list', '📋', t('list'), () => V.lb()) +
      sec('stats', '📊', t('stats'), () => V.sb()) +
      sec('rec', '🔁', t('recs'), rec) +
      sec('kto', '🏦', t('kto'), kto) +
      sec('cats', '🏷️', t('cats'), cats) +
      sec('look', '🎨', t('look'), look) +
      sec('gen', '⚙️', t('gen'), gen) +
      sec('dat', '💾', t('dat'), dat)
    );
  },
};
function rd() {
  $('#v').innerHTML = V[tab]();
  $('#nav').innerHTML =
    `<button class="nb${tab == 'home' ? ' on' : ''}" ${tab == 'home' ? 'aria-current=page ' : ''}onclick="go('home')" aria-label="${t('home')}">${NI.home}<span class=nl>${t('home')}</span></button>${tab == 'set' ? '<span></span>' : `<button id=fab onclick="ot()" aria-label="${t('new')}"><svg viewBox="0 0 24 24" width=36 height=36 aria-hidden=true><path d="M12 4.5v15M4.5 12h15" stroke="currentColor" stroke-width=3 stroke-linecap=round fill=none /></svg></button>`}<button class="nb${tab == 'set' ? ' on' : ''}" ${tab == 'set' ? 'aria-current=page ' : ''}onclick="go('set')" aria-label="${t('set')}">${NI.set}<span class=nl>${t('set')}</span></button>`;
}
const fx = (k) => {
  const e = $('#s_' + k);
  e &&
    e.scrollIntoView({
      block: 'start',
      behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth',
    });
};
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
