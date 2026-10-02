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
const nmx = (x) => (x.t == 'u' ? t('tr') : t(cn(x.c).n));
const trow = (x) => {
  const u = x.t == 'u',
    c = u ? { i: '⇄', n: 'tr' } : cn(x.c);
  return `<div class="li d-flex align-items-center gap-3 tr" onclick="ot('${x.id}')"><span class=dc>${x.d.slice(8)}.${x.d.slice(5, 7)}.</span><span class=g>${c.i} ${esc(t(c.n))}${x.r ? ' ↻' : ''}${x.n ? `<br><small>${esc(x.n)}</small>` : ''}${u ? `<br><small>${t('a_' + x.f)} → ${t('a_' + x.to)}</small>` : x.k == 'bar' ? ` <small>· ${t('a_bar')}</small>` : ''}</span><b class="${x.t == 'i' ? 'pos' : u ? 'm' : 'neg'}">${u ? fmt(x.a) : sg(x.a, x.t)}</b></div>`;
};
const sortL = (l, sc, dr) => {
  const key = { d: (x) => x.d, c: (x) => nmx(x).toLowerCase(), a: (x) => x.a }[sc];
  return l.slice().sort((a, b) => {
    const p = key(a),
      q = key(b);
    return (p < q ? -1 : p > q ? 1 : 0) * dr;
  });
};
const hrow = (sc, dr, fn) => {
  const ar = (c) => (sc == c ? (dr > 0 ? ' ▲' : ' ▼') : '');
  return `<div class="li d-flex align-items-center gap-3 hd"><span class=dc onclick="${fn}('d')">${t('date')}${ar('d')}</span><span class=g onclick="${fn}('c')">${t('cat1')}${ar('c')}</span><span onclick="${fn}('a')">${t('amt')}${ar('a')}</span></div>`;
};
function hsort(c) {
  if ((HS.sc || 'd') == c) HS.dir = -(HS.dir || -1);
  else {
    HS.sc = c;
    HS.dir = c == 'c' ? 1 : -1;
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
        op = HS.o[m] != null ? HS.o[m] : m == cur;
      return `<div class="card card-body mh"><details ${op ? 'open' : ''} ontoggle="HS.o['${m}']=this.open"><summary><b>${mlab(m)}</b> <small>· ${g.length} · <span class="${b < 0 ? 'neg' : 'pos'}">${sg(b)}</span></small></summary>${hrow(sc, dr, 'hsort')}${g.map(trow).join('')}</details></div>`;
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
      return `<details ${st.cl[k] ? '' : 'open'} ontoggle="${id}.cl.${k}=!this.open"><summary><b>${t(n)} (${g.length})${k == 'u' ? '' : ' · ' + fmt(g.reduce((s, x) => s + x.a, 0))}</b></summary>${hrow(sc, dr, 'fsort')}${g.map(trow).join('')}</details>`;
    })
    .join('');
};
const rl = () => {
  const q = F.q.toLowerCase(),
    l = allT().filter(
      (x) =>
        (F.all || x.d.startsWith(ym)) &&
        (!F.c || x.c == F.c) &&
        (!q || (x.n + ' ' + t(cn(x.c).n)).toLowerCase().includes(q)),
    );
  if (!l.length) return `<small>${t('none')}</small>`;
  return lst(l, F, 'F');
};
const rs = () => ($('#res').innerHTML = rl());
/* Ansichten */
const V = {
  home() {
    const m = mt(ym),
      cur = ym == iso(D).slice(0, 7),
      n = dues().length;
    let h = mn() + '<div class="row g-3 home-grid"><div class="col-12 col-lg-5">';
    h += `<div class="card card-body"><small>${t('bal')}</small><div class="big ${m.b < 0 ? 'neg' : 'pos'}">${sg(m.b)}</div><small>↑ ${fmt(m.i)} &nbsp; ↓ ${fmt(m.e)}</small>`;
    if (S.set.sb != null || S.tr.length || S.tx.some((x) => x.k == 'bar'))
      h += `<div style="margin-top:8px"><small>🏦 ${t('a_bank')}</small> <b>${fmt(bal('bank'))}</b> &nbsp; <small>💵 ${t('a_bar')}</small> <b>${fmt(bal('bar'))}</b> &nbsp; <small>🐷 ${t('a_spar')}</small> <b>${fmt(bal('spar'))}</b>${S.set.sb != null ? `<br><small>${t('tot')}</small> <b>${fmt(bal('bank') + bal('bar') + bal('spar'))}</b>` : ''}</div>`;
    h += '</div>';
    if (cur) {
      const u = up(),
        sq = svm(),
        dl = new Date(D.getFullYear(), D.getMonth() + 1, 0).getDate() - D.getDate() + 1,
        c = Math.round((m.b + u - sq) * 100),
        rf = Math.floor(c / 100),
        pd = Math.floor(Math.floor(c / dl) / 100);
      h += `<div class="card card-body"><small>${t('left')} (${dtxt(dl)})</small><div class="big ${c < 0 ? 'neg' : ''}">${fmt(rf)}</div><small>${t('pd')}: <b class="${c < 0 ? 'neg' : ''}">${c < 0 ? t('over') : fmt(pd)}</b>${u ? `<br>${t('incl')} ${sg(u)}` : ''}${sq ? `<br>${t('spabz')} ${fmt(sq)}` : ''}</small></div>`;
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
    return `${F.all ? '' : mn()}<input class="form-control" placeholder="${t('search')}" value="${esc(F.q)}" oninput="F.q=this.value;rs()"><select class="form-select" onchange="F.c=this.value;rs()"><option value="">${t('allc')}</option>${S.cats.map((c) => `<option value="${c.id}" ${F.c == c.id ? 'selected' : ''}>${c.i} ${esc(t(c.n))}</option>`).join('')}</select><label style="display:flex;align-items:center;font-weight:400;color:var(--text)"><input type=checkbox ${F.all ? 'checked' : ''} onchange="F.all=this.checked;rd()">${t('allm')}</label><div class="card card-body" id=res style=margin-top:10px>${rl()}</div>`;
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
      h += `<svg viewBox="0 0 42 42" style="width:210px;display:block;margin:0 auto 10px">${a
        .map((x, i) => {
          const p = (x[1] / tot) * 100,
            s = `<circle r=15.9155 cx=21 cy=21 fill=none stroke="${PAL[i % 8]}" stroke-width=7 stroke-dasharray="${p} ${100 - p}" stroke-dashoffset="${25 - cum}"/>`;
          cum += p;
          return s;
        })
        .join(
          '',
        )}<text x=21 y=22 text-anchor=middle font-size=4 fill="currentColor">${fmt(tot)}</text></svg>`;
      h += a
        .map((x, i) => {
          const c = cn(x[0]);
          return `<div class=row onclick="gl('${x[0]}')"><span style="width:12px;height:12px;border-radius:50%;background:${PAL[i % 8]}"></span><span class=g>${c.i} ${esc(t(c.n))}</span><b>${fmt(x[1])}</b><small>${((x[1] / tot) * 100).toFixed(0)}%</small></div>`;
        })
        .join('');
    }
    h += `</div><div class="card card-body"><b>${t('trend')}</b><svg viewBox="0 0 300 120" style="width:100%">`;
    const ms = [];
    for (let k = 5; k >= 0; k--) {
      const [y, m] = ym.split('-'),
        d = new Date(+y, +m - 1 - k, 1),
        p = d.getFullYear() + '-' + pad(d.getMonth() + 1);
      ms.push([d, mt(p)]);
    }
    const mx = Math.max(1, ...ms.map((x) => Math.max(x[1].i, x[1].e)));
    h += ms
      .map((x, k) => {
        const hi = (x[1].i / mx) * 80,
          he = (x[1].e / mx) * 80;
        return `<rect x=${k * 50 + 6} y=${90 - hi} width=17 height=${hi} fill="var(--sage)"/><rect x=${k * 50 + 25} y=${90 - he} width=17 height=${he} fill="var(--rust)"/><text x=${k * 50 + 24} y=108 text-anchor=middle font-size=10 fill="currentColor">${x[0].toLocaleDateString(loc(), { month: 'short' })}</text>`;
      })
      .join('');
    return h + '</svg></div>';
  },
  set() {
    const s = S.set,
      lb = (k, h) => `<label class="form-label">${t(k)}</label>${h}`,
      sec = (k, ic, ti, fn) => {
        const o = SE.o == k;
        return `<div class="card card-body sec${o ? ' open' : ''}" id="s_${k}"><button aria-expanded="${o}" onclick="se('${k}')"><span class=ic>${ic}</span><span class=g>${ti}</span><span class=chev aria-hidden=true>›</span></button>${o ? `<div class=sb>${fn()}</div>` : ''}</div>`;
      },
      rec = () => {
        if (!S.rec.length) return `<small>${t('norec')}</small>`;
        RT.cl = RT.cl || {};
        const nx = (r) => iso(dateK(r, r.k)),
          nm = (r) => (r.n || t(cn(r.c).n)).toLowerCase(),
          so = {
            n: (a, b) => nm(a).localeCompare(nm(b)),
            h: (a, b) => b.a - a.a,
            l: (a, b) => a.a - b.a,
            d: (a, b) => (nx(a) < nx(b) ? -1 : nx(a) > nx(b) ? 1 : 0),
          }[RT.s || 'd'];
        const grp = (ty, ti) => {
          const l = S.rec.filter((r) => r.t == ty).sort(so);
          return l.length
            ? `<details class=gx ${RT.cl[ty] ? '' : 'open'} ontoggle="RT.cl.${ty}=!this.open"><summary class="rh ${ty}">${ti} (${l.length})</summary>` +
                l
                  .map(
                    (r) =>
                      `<div class="li d-flex align-items-center gap-3 r${ty}"><span class=ic>${cn(r.c).i}</span><div class=g>${esc(r.n || t(cn(r.c).n))}<br><small>${t(r.f)} · 📅 ${nx(r).split('-').reverse().join('.')} · <b class="${ty == 'i' ? 'pos' : 'neg'}">${sg(r.a, r.t)}</b></small></div><button class="btn btn-secondary s sm" aria-label="${t('del')}" onclick="rm('${r.id}')">✕</button></div>`,
                  )
                  .join('') +
                '</details>'
            : '';
        };
        return (
          `<select class="form-select" aria-label="Sort" onchange="RT.s=this.value;rd()">${O(
            ['d', 'n', 'h', 'l'].map((k) => [k, t('o_' + k)]),
            RT.s || 'd',
          )}</select>` +
          grp('e', t('ex')) +
          grp('i', t('inn'))
        );
      },
      cats = () => {
        CT.cl = CT.cl || {};
        const cnt = (id) => S.tx.filter((x) => x.c == id).length,
          nm = (c) => t(c.n).toLowerCase(),
          so = {
            n: (a, b) => nm(a).localeCompare(nm(b)),
            z: (a, b) => nm(b).localeCompare(nm(a)),
            u: (a, b) => cnt(b.id) - cnt(a.id),
          }[CT.s || 'n'];
        const grp = (ty, ti) => {
          const l = S.cats.filter((c) => c.t == ty).sort(so);
          return l.length
            ? `<details class=gx ${CT.cl[ty] ? '' : 'open'} ontoggle="CT.cl.${ty}=!this.open"><summary class="rh ${ty}">${ti} (${l.length})</summary>` +
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
          `<select class="form-select" aria-label="Sort" onchange="CT.s=this.value;rd()">${O(
            ['n', 'z', 'u'].map((k) => [k, t('o_' + k)]),
            CT.s || 'n',
          )}</select>` +
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
        lb(
          'sb',
          `<input class="form-control" inputmode=decimal value="${s.sb == null ? '' : String(s.sb).replace('.', ',')}" onchange="const v=parseFloat(this.value.replace(',','.'));S.set.sb=isNaN(v)?null:v;P()">`,
        ) +
        `<div class="seg d-flex gap-2" style=margin-top:14px><button class="btn btn-secondary s" onclick="pn()">${s.pin ? t('pinoff') : t('pinon')}</button></div><small style="display:block;margin-top:16px">${t('ver')} ${APP_VERSION}</small>`,
      dat = () =>
        `<div class="seg d-flex gap-2" style="align-items:flex-start"><div class=g><button class="btn btn-secondary s" style="width:100%" onclick="bk('j')">${t('bk')}</button><small>${t('bkj')}</small></div><div class=g><button class="btn btn-secondary s" style="width:100%" onclick="bk('c')">${t('csv')}</button><small>${t('bkc')}</small></div></div><button class="btn btn-secondary s sm" style="margin-top:10px" onclick="bki()">ⓘ ${t('bki')}</button><label class="form-label">${t('imp')}</label><input class="form-control" type=file accept=".json,application/json" onchange="im(this)">`;
    return (
      `<h2>${t('set')}</h2>` +
      sec('list', '📋', t('list'), () => V.lb()) +
      sec('stats', '📊', t('stats'), () => V.sb()) +
      sec('rec', '🔁', t('recs'), rec) +
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
    `<button class="nb${tab == 'home' ? ' on' : ''}" ${tab == 'home' ? 'aria-current=page ' : ''}onclick="go('home')" aria-label="${t('home')}"><img src="img/house.svg" alt=""><span class=nl>${t('home')}</span></button>${tab == 'set' ? '<span></span>' : `<button id=fab onclick="ot()" aria-label="${t('new')}"><svg viewBox="0 0 24 24" width=36 height=36 aria-hidden=true><path d="M12 4.5v15M4.5 12h15" stroke="currentColor" stroke-width=3 stroke-linecap=round fill=none /></svg></button>`}<button class="nb${tab == 'set' ? ' on' : ''}" ${tab == 'set' ? 'aria-current=page ' : ''}onclick="go('set')" aria-label="${t('set')}"><img src="img/settings.svg" alt=""><span class=nl>${t('set')}</span></button>`;
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
