/* MoneyApp – Eingabe-Sheets, Kategorien, Backup, PIN, Start */
/* Sheets & Toast */
let HP = 0;
function sheet(h) {
  let o = $('#o');
  if (!o) {
    o = document.createElement('div');
    o.id = 'o';
    o.className = 'ov';
    o.onclick = (e) => {
      if (e.target == o && !X.nc) cl();
    };
    document.body.append(o);
    if (!X.nc) {
      try {
        history.pushState({ sh: 1 }, '');
        HP = 1;
      } catch (e) {}
    }
  }
  o.innerHTML = `<div class=sh role=dialog aria-modal=true>${h}</div>`;
  vvf();
}
const cl = () => {
  const o = $('#o');
  if (o) {
    o.remove();
    if (HP) {
      HP = 0;
      history.back();
    }
  }
};
addEventListener('popstate', () => {
  const o = $('#o');
  if (o && HP) {
    HP = 0;
    o.remove();
  }
});
addEventListener('keydown', (e) => {
  if (e.key == 'Escape' && $('#o') && !X.nc) cl();
});
const hd = (ti) =>
  `<div class=sht><h2>${ti}</h2><button class=x onclick="cl()" aria-label="${t('x')}">✕</button></div>`;
function toast(m, f, l, k) {
  /* l = Beschriftung des Knopfes (Standard: Rückgängig), k = Toast bleibt stehen */
  const e = $('#toast');
  U = f;
  e.innerHTML = `${m}${f ? `<button onclick="U();U=0;$('#toast').style.display='none'">${l || t('undo')}</button>` : ''}`;
  e.style.display = 'flex';
  clearTimeout(toast.i);
  if (!k) toast.i = setTimeout(() => (e.style.display = 'none'), 5000);
}
/* Buchung erfassen / bearbeiten */
function ot(id) {
  const x = id && allT().find((y) => y.id == id);
  X = x
    ? { ...x, a: String(x.a).replace('.', ','), f: '', k: x.t == 'u' ? x.f : x.k || 'bank' }
    : { t: 'e', c: null, a: '', d: '', n: '', f: '', k: S.set.lk || 'bar' };
  op();
}
/* Betrag: nur Ziffern, ein Komma oder Punkt, max. 2 Nachkommastellen */
function amc(el) {
  const o = el.value;
  let v = o.replace(/[^\d.,]/g, '');
  const m = v.search(/[.,]/);
  if (m >= 0)
    v =
      v.slice(0, m + 1) +
      v
        .slice(m + 1)
        .replace(/[.,]/g, '')
        .slice(0, 2);
  if (v != o) {
    const p = Math.max(0, (el.selectionStart ?? o.length) - (o.length - v.length));
    el.value = v;
    try {
      el.setSelectionRange(p, p);
    } catch (e) {}
  }
  return v;
}
function am(el) {
  X.a = amc(el);
  if ($('#ew')) $('#ew').hidden = true;
  fm();
}
/* Kategorie-Vorschlag aus früheren Buchungen mit gleicher/ähnlicher Notiz */
function ns(v) {
  X.n = v;
  if (X.id || X.t == 'u' || (X.c && !X.ac)) return;
  const q = v.trim().toLowerCase();
  let m = null;
  if (q.length >= 2)
    for (let i = S.tx.length - 1; i >= 0; i--) {
      const x = S.tx[i],
        n = String(x.n || '')
          .trim()
          .toLowerCase();
      if (x.t == X.t && n && (n == q || n.startsWith(q)) && S.cats.some((c) => c.id == x.c)) {
        m = x.c;
        break;
      }
    }
  if (m) {
    X.c = m;
    X.ac = 1;
  } else if (X.ac) {
    X.c = null;
    X.ac = 0;
  } else return;
  fm();
  const bs = document.querySelectorAll('.grid button[data-c]');
  bs.forEach((b) => {
    const on = b.dataset.c == X.c;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
}
/* Kategorie-Kacheln: alle anzeigen, bei Suche nach Name oder früheren Notizen filtern */
function ghtml() {
  const cnt = (c) => S.tx.slice(-80).filter((x) => x.c == c.id).length,
    q = (X.q || '').trim().toLowerCase(),
    hn = {};
  let cs = S.cats.filter((c) => c.t == X.t);
  cs.sort((a, b) => cnt(b) - cnt(a));
  if (q) {
    /* jüngste passende Notiz je Kategorie merken, um sie unter der Kachel zu zeigen */
    [...S.tx].reverse().forEach((x) => {
      if (x.n && x.t == X.t && !hn[x.c] && String(x.n).toLowerCase().includes(q)) hn[x.c] = String(x.n);
    });
    cs = cs.filter((c) => t(c.n).toLowerCase().includes(q) || hn[c.id]);
  }
  return cs.length
    ? cs
        .map((c) => {
          const nameHit = !q || t(c.n).toLowerCase().includes(q),
            sub = !nameHit && hn[c.id] ? `<small class=hn>📝 ${hl(exc(hn[c.id], q), q)}</small>` : '';
          return `<button data-c="${c.id}" class="${X.c == c.id ? 'on' : ''}" aria-pressed="${X.c == c.id}" onclick="X.c='${c.id}';X.ac=0;op()"><b>${c.i}</b><span>${hl(t(c.n), q)}</span>${sub}</button>`;
        })
        .join('')
    : `<div class=nr><small>${t('nores')}</small></div>`;
}
const fcat = () => {
  const g = $('#cg');
  if (g) g.innerHTML = ghtml();
};
function op() {
  sheet(`${hd(t((X.id ? 'et_' : 'nt_') + X.t))}<div class=tp>${X.id && X.t == 'u' ? '' : `<button class="${X.t == 'e' ? 'on' : ''}" aria-pressed="${X.t == 'e'}" onclick="X.t='e';X.c=null;X.ac=0;X.k=X.k=='spar'?'bar':X.k;op()"><i class=te>−</i> ${t('e')}</button><button class="${X.t == 'i' ? 'on' : ''}" aria-pressed="${X.t == 'i'}" onclick="X.t='i';X.c=null;X.ac=0;X.k=X.k=='spar'?'bar':X.k;op()"><i class=ti>+</i> ${t('i')}</button>`}${X.id && X.t != 'u' ? '' : `<button class="${X.t == 'u' ? 'on' : ''}" aria-pressed="${X.t == 'u'}" onclick="X.t='u';X.c=null;X.ac=0;X.to=X.k=='bank'?'bar':'bank';op()"><i class=tu>⇄</i> ${t('tr')}</button>`}</div><small class=hint>${t('h_' + X.t)}</small>
<input class="form-control amt" id=ia inputmode=decimal placeholder="0,00" value="${esc(X.a)}" oninput="am(this)" autocomplete=off><div class="em invalid-feedback" id=ea hidden role=alert></div>${X.t == 'u' ? DIR() + '<div class="em invalid-feedback" id=eu hidden role=alert></div>' : ACC() + `<input class="form-control" id=csi type=search placeholder="🔍 ${t('search')}" value="${esc(X.q || '')}" oninput="X.q=this.value;fcat()" autocomplete=off enterkeyhint=search><div class=grid id=cg>${ghtml()}</div><button type=button class="btn btn-secondary s nwc" onclick="ncs(1)">＋ ${t('newc')}</button><div class="em invalid-feedback" id=ec hidden role=alert></div>`}
<details ${X.id || X.d || X.n || X.f ? 'open' : ''}><summary>${t('opts')}</summary><div class="seg d-flex gap-2"><button class="btn btn-secondary s sm" onclick="X.d='${iso(D)}';op()">${t('today')}</button><button class="btn btn-secondary s sm" onclick="X.d='${iso(new Date(D.getFullYear(), D.getMonth(), D.getDate() - 1))}';op()">${t('yest')}</button></div><input class="form-control" type=date value="${X.d || iso(D)}" onchange="X.d=this.value"><input class="form-control" id=ino placeholder="${t('note')}" value="${esc(X.n)}" oninput="ns(this.value)">${
    X.id || X.t == 'u'
      ? ''
      : `<label class="form-label">${t('rep')}</label><select class="form-select" onchange="X.f=this.value">${O(
          [
            ['', t('nr')],
            ['m', t('m')],
            ['w', t('w')],
            ['y', t('y')],
          ],
          X.f,
        )}</select>`
  }</details>
<div class="em warn alert alert-warning" id=ew hidden role=alert></div><div class=stkb><button class="btn pr" style="width:100%" onclick="sv()">${t('save')}</button></div><div class="seg d-flex gap-2 sc"><button class="btn btn-secondary s" onclick="cl()">${t('cancel')}</button>${X.id ? `<button class="btn dlt" onclick="dl()">🗑 ${t('del')}</button>` : ''}</div>`);
  const shh = $('.sh');
  if (shh) shh.dataset.t = X.t;
  fm();
  if (!X.id && !X.a) setTimeout(() => $('#ia') && $('#ia').focus({ preventScroll: true }), 50);
}
function msgs() {
  const a = parseFloat(String(X.a).replace(',', '.')),
    m = {};
  if (!(a > 0)) m.a = X.a ? t('e_amt0') : t('e_amt');
  if (X.t == 'u') {
    if (X.k == X.to) m.u = t('e_acc');
  } else if (!X.c) m.c = t('e_cat');
  return m;
}
function fm() {
  if (!X.tried) return;
  const m = msgs();
  [
    ['a', '#ea'],
    ['c', '#ec'],
    ['u', '#eu'],
  ].forEach(([k, q]) => {
    const e = $(q);
    if (!e) return;
    e.hidden = !m[k];
    e.textContent = m[k] ? '⚠ ' + m[k] : '';
  });
  const i = $('#ia');
  if (i) i.classList.toggle('bad', !!m.a);
  const g = $('#cg');
  if (g) g.classList.toggle('bad', !!m.c);
}
function warns(a, d) {
  const w = [],
    N = { bank: t('a_bank'), bar: t('a_bar'), spar: t('a_spar') },
    low = (k) => {
      const b = bal(k);
      if (a > b + 0.004)
        w.push(
          t('e_low')
            .replace('{k}', N[k])
            .replace('{v}', fmt(Math.max(b, 0))),
        );
    };
  if (X.t == 'u') {
    low(X.k);
    if (S.tr.some((x) => x.d == d && Math.abs(x.a - a) < 0.005 && x.f == X.k && x.to == X.to))
      w.push(t('e_dup'));
  } else {
    const k = X.k || 'bank';
    if (X.t == 'e' && (k == 'bar' || S.set.sb != null)) low(k);
    if (
      S.tx.some(
        (x) => x.t == X.t && x.c == X.c && x.d == d && Math.abs(x.a - a) < 0.005 && (x.k || 'bank') == k,
      )
    )
      w.push(t('e_dup'));
  }
  return w;
}
function sv(force) {
  const a = parseFloat(String(X.a).replace(',', '.')),
    m = msgs();
  if (Object.keys(m).length) {
    X.tried = 1;
    fm();
    const e = m.a ? $('#ia') : m.c ? $('#cg') : $('#eu');
    if (e) {
      e.scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (m.a) e.focus({ preventScroll: true });
    }
    return;
  }
  const d = X.d || iso(D);
  if (!force && !X.id) {
    const w = warns(a, d);
    if (w.length) {
      const e = $('#ew');
      e.innerHTML =
        w.map((x) => `<div>⚠ ${x}</div>`).join('') +
        `<button class="btn btn-secondary s sm" onclick="sv(1)">${t('e_force')}</button>`;
      e.hidden = false;
      e.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
  }
  if (X.t == 'u') {
    if (X.k == X.to) {
      op();
      return;
    }
    const o = { d, a, f: X.k, to: X.to, n: X.n || '' };
    if (X.id)
      Object.assign(
        S.tr.find((x) => x.id == X.id),
        o,
      );
    else S.tr.push({ id: uid(), ts: Date.now(), ...o });
  } else if (X.id)
    Object.assign(
      S.tx.find((x) => x.id == X.id),
      { t: X.t, a, c: X.c, d, n: X.n || '', k: X.k || 'bank' },
    );
  else {
    S.tx.push({ id: uid(), ts: Date.now(), t: X.t, a, c: X.c, d, n: X.n || '', k: X.k || 'bank', r: X.f ? 1 : 0 });
    S.set.lk = X.k || 'bank';
    if (X.f) S.rec.push({ id: uid(), t: X.t, a, c: X.c, n: X.n || '', f: X.f, s: d, k: 1 });
  }
  cl();
  P();
  toast(t('sav'));
}
function dl() {
  const L = X.t == 'u' ? S.tr : S.tx,
    i = L.findIndex((x) => x.id == X.id),
    o = L[i];
  L.splice(i, 1);
  cl();
  P();
  toast(t('gone'), () => {
    L.push(o);
    P();
  });
}
/* Fällige Buchungen */
function dsh() {
  const l = dues();
  if (!l.length) {
    cl();
    rd();
    return;
  }
  X.nc = 0;
  sheet(
    `${hd('🔔 ' + t('due'))}${l.map((o) => `<div class="card card-body"><div class=row style=border:0><span class=ic>${cn(o.r.c).i}</span><div class=g>${esc(o.r.n || t(cn(o.r.c).n))}<br><small>${o.d.slice(8)}.${o.d.slice(5, 7)}.</small></div><b class="${o.r.t == 'i' ? 'pos' : 'neg'}">${sg(o.r.a, o.r.t)}</b></div><div class="seg d-flex gap-2"><button class="btn sm" onclick="cf('${o.r.id}')">${t('ok')}</button><button class="btn btn-secondary s sm" onclick="cfa('${o.r.id}')">${t('chg')}</button><button class="btn btn-secondary s sm" onclick="cf('${o.r.id}',0,1)">${t('skip')}</button></div></div>`).join('')}<button class="btn btn-primary" style=width:100% onclick="ca()">${t('all')}</button>`,
  );
}
function cf(id, a, skip) {
  /* a = geänderter Betrag (optional), skip = überspringen statt buchen */
  const r = S.rec.find((x) => x.id == id);
  if (!r) return;
  if (!skip) S.tx.push({ id: uid(), ts: Date.now(), t: r.t, a: a || r.a, c: r.c, d: iso(dateK(r, r.k)), n: r.n, r: 1 });
  r.k++;
  P();
  dsh();
}
/* Betrag ändern (fällige Buchung): eigenes Fenster statt Browser-Dialog */
function cfa(id) {
  const r = S.rec.find((x) => x.id == id);
  if (!r) return;
  X.nc = 0;
  sheet(
    `${hd(t('chg'))}<small class=hint>${esc(r.n || t(cn(r.c).n))}</small><input class="form-control amt" id=ca_a inputmode=decimal placeholder="${t('sbp0')}" value="${String(r.a).replace('.', ',')}" oninput="amc(this);$('#ca_e').hidden=true" onkeydown="if(event.key=='Enter')cfs('${id}')" autocomplete=off><div class="em invalid-feedback" id=ca_e hidden role=alert>${t('e_amt0')}</div><button class="btn btn-primary pr" style="width:100%;margin-top:16px" onclick="cfs('${id}')">${t('ok')}</button><div class="seg d-flex gap-2 sc"><button class="btn btn-secondary s" onclick="dsh()">${t('cancel')}</button></div>`,
  );
  $('.sh').dataset.t = r.t;
  const e = $('#ca_a');
  e.focus({ preventScroll: true });
  e.select();
}
function cfs(id) {
  const v = num($('#ca_a').value);
  if (!(v > 0)) {
    $('#ca_e').hidden = false;
    return;
  }
  cf(id, Math.round(v * 100) / 100);
}
/* Wiederkehrende Buchung bearbeiten / löschen (Rückfrage) */
let RE = {};
function er(id) {
  const r = S.rec.find((x) => x.id == id);
  if (!r) return;
  const d = iso(dateK(r, r.k));
  X = {};
  RE = { id, t: r.t, a: String(r.a).replace('.', ','), c: r.c, n: r.n || '', f: r.f, d, d0: d, f0: r.f };
  erd();
}
function erd() {
  const r = RE;
  sheet(
    `${hd(t('rec_e'))}<input class="form-control amt" id=ra inputmode=decimal placeholder="${t('sbp0')}" value="${esc(r.a)}" oninput="RE.a=amc(this);$('#rea').hidden=true" autocomplete=off><div class="em invalid-feedback" id=rea hidden role=alert>${t('e_amt0')}</div><label class="form-label">${t('cat1')}</label><select class="form-select" onchange="RE.c=this.value">${O(
      S.cats.filter((c) => c.t == r.t).map((c) => [c.id, c.i + ' ' + esc(t(c.n))]),
      r.c,
    )}</select><label class="form-label">${t('note')}</label><input class="form-control" maxlength=80 value="${esc(r.n)}" oninput="RE.n=this.value" autocomplete=off><label class="form-label">${t('rep')}</label><select class="form-select" onchange="RE.f=this.value">${O(
      ['m', 'w', 'y'].map((k) => [k, t(k)]),
      r.f,
    )}</select><label class="form-label">${t('nextd')}</label><input class="form-control" type=date value="${r.d}" onchange="RE.d=this.value"><button class="btn pr" style="width:100%;margin-top:16px" onclick="rsv()">${t('save')}</button><div class="seg d-flex gap-2 sc"><button class="btn btn-secondary s" onclick="cl()">${t('cancel')}</button><button class="btn dlt" onclick="rdl()">🗑 ${t('del')}</button></div>`,
  );
  $('.sh').dataset.t = r.t;
}
function rsv() {
  const r = S.rec.find((x) => x.id == RE.id),
    a = num(RE.a);
  if (!r) return cl();
  if (!(a > 0)) {
    const e = $('#rea');
    e.hidden = false;
    e.scrollIntoView({ block: 'center', behavior: 'smooth' });
    $('#ra').focus({ preventScroll: true });
    return;
  }
  Object.assign(r, { a: Math.round(a * 100) / 100, c: RE.c, n: RE.n.trim(), f: RE.f });
  /* Intervall oder Fälligkeit geändert: ab dem gewählten Datum neu zählen */
  if (RE.d && (RE.d != RE.d0 || RE.f != RE.f0)) {
    r.s = RE.d;
    r.k = 0;
  }
  cl();
  P();
  toast(t('sav'));
}
function rdl() {
  const r = S.rec.find((x) => x.id == RE.id);
  if (!r) return cl();
  sheet(
    `${hd(t('recdt'))}<p style="margin:8px 0 14px">${t('recdq').replace('{n}', esc(r.n || t(cn(r.c).n)))}</p><div class="seg d-flex gap-2"><button class="btn btn-secondary s" onclick="erd()">${t('cancel')}</button><button class="btn dlt" onclick="rdo()">🗑 ${t('del')}</button></div>`,
  );
  $('.sh').dataset.t = r.t;
}
function rdo() {
  const id = RE.id;
  cl();
  rm(id);
}
function ca() {
  dues().forEach((o) => {
    for (let g = 0; g < 500 && iso(dateK(o.r, o.r.k)) <= iso(D); g++) {
      S.tx.push({ id: uid(), ts: Date.now(), t: o.r.t, a: o.r.a, c: o.r.c, d: iso(dateK(o.r, o.r.k)), n: o.r.n, r: 1 });
      o.r.k++;
    }
  });
  cl();
  P();
}
const rm = (id) => {
  const o = S.rec.find((x) => x.id == id);
  S.rec = S.rec.filter((x) => x.id != id);
  P();
  toast(t('gone'), () => {
    S.rec.push(o);
    P();
  });
};
/* Kategorien */
const ICONS = [
  '🏠',
  '🛒',
  '🚗',
  '🎉',
  '💊',
  '👕',
  '🔁',
  '💼',
  '💸',
  '🎁',
  '🍽️',
  '☕',
  '✈️',
  '📱',
  '🎓',
  '🐾',
  '⚽',
  '💡',
  '🧾',
  '🏷️',
];
let NC = {},
  CT = {},
  RT = {};
const gr = (v) => {
  v = (v || '').trim();
  if (!v) return '';
  try {
    return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(v)][0].segment;
  } catch (e) {
    return Array.from(v)[0];
  }
};
/* Kategorie anlegen / bearbeiten: eigene Dialoge (aus der Buchung heraus oder aus den Einstellungen).
   NC = { id (nur beim Bearbeiten), t, n, i, from (1 = aus der Buchung heraus geöffnet) } */
const hdc = (ti) =>
  `<div class="sht ns"><h2>${ti}</h2><button class=x onclick="ncx()" aria-label="${t('x')}">✕</button></div>`;
const cnm = () =>
  `<div class=cn><button type=button class=cpi id=cpi aria-expanded=false aria-controls=cpp aria-label="${t('ico')}" onclick="ipt()"><span id=cpg>${NC.i}</span><i class=cpe aria-hidden=true>✎</i></button><input class="form-control" id=nn placeholder="${t('name')}" value="${esc(NC.n)}" autocomplete=off maxlength=30 enterkeyhint=done onkeydown="if(event.key=='Enter')${NC.id ? 'ecv' : 'ac'}()"></div><div class="em invalid-feedback" id=en hidden role=alert>${t('e_name')}</div>`;
const cip = () =>
  `<div id=cpp class=cpp hidden><label class="form-label">${t('ico')}</label><div class=ip>${ICONS.map((i) => `<button type=button class="${i == NC.i ? 'on' : ''}" aria-pressed="${i == NC.i}" onclick="pi('${i}',this)">${i}</button>`).join('')}</div><input class="form-control" id=ni placeholder="${t('ico2')}" oninput="cpv(this.value)" autocomplete=off></div>`;
/* Symbolauswahl auf-/zuklappen (Tipp auf das Symbol oben links) */
function ipt(open) {
  const p = $('#cpp'),
    o = open == null ? p.hidden : open;
  p.hidden = !o;
  $('#cpi').setAttribute('aria-expanded', o);
  if (o) p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function pi(i, b) {
  NC.i = i;
  $('#ni').value = '';
  $('#cpg').textContent = i;
  ipt(false);
  document.querySelectorAll('.ip button').forEach((x) => {
    x.classList.toggle('on', x == b);
    x.setAttribute('aria-pressed', x == b);
  });
}
function cpv(v) {
  const g = gr(v);
  $('#cpg').textContent = g || NC.i;
  document.querySelectorAll('.ip button').forEach((x) => {
    const on = !g && x.textContent == NC.i;
    x.classList.toggle('on', on);
    x.setAttribute('aria-pressed', on);
  });
}
function cty(ty) {
  NC.t = ty;
  document.querySelectorAll('.ctp button').forEach((b) => {
    const on = b.dataset.t == ty;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
  $('#cth').textContent = t('h_' + ty);
  const s = $('#o .sh');
  if (s) s.dataset.t = ty;
}
function ncs(entry) {
  NC = { t: entry && X.t == 'i' ? 'i' : 'e', n: entry ? (X.q || '').trim() : '', i: '🏷️', from: entry ? 1 : 0 };
  const tb = (ty, sg, lb) =>
    `<button type=button data-t="${ty}" class="${NC.t == ty ? 'on' : ''}" aria-pressed="${NC.t == ty}" onclick="cty('${ty}')"><i class=t${ty}>${sg}</i> ${lb}</button>`;
  sheet(
    `${hdc(t('newc'))}${cnm()}<label class="form-label">${t('cty')}</label><div class="tp ctp" role=group>${tb('e', '−', t('e'))}${tb('i', '+', t('i'))}</div><small class=hint id=cth>${t('h_' + NC.t)}</small>${cip()}<button class="btn btn-primary pr" style="width:100%;margin-top:14px" onclick="ac()">${t('save')}</button><button class="btn btn-secondary s ghost" onclick="ncx()">${t('cancel')}</button>`,
  );
  $('#o .sh').dataset.t = NC.t;
  $('#o .sh').scrollTop = 0;
  $('#nn').focus({ preventScroll: true });
}
/* Abbrechen: zurück zur Buchung bzw. Dialog schließen */
const ncx = () => (NC.from ? op() : cl());
function ac() {
  const n = $('#nn').value.trim();
  if (!n) {
    $('#nn').style.borderColor = 'var(--rust)';
    $('#en').hidden = false;
    $('#nn').focus();
    return;
  }
  const c = { id: uid(), t: NC.t, n, i: gr($('#ni').value) || NC.i };
  S.cats.push(c);
  P();
  if (NC.from) {
    X.q = '';
    X.ac = 0;
    X.t = c.t;
    X.c = c.id;
    if (X.k == 'spar') X.k = 'bar';
    op();
  } else {
    cl();
    toast(t('sav'));
  }
}
function ecs(id) {
  const c = S.cats.find((x) => x.id == id);
  if (!c) return;
  const n = S.tx.filter((x) => x.c == id).length;
  NC = { id, t: c.t, n: t(c.n), i: c.i, from: 0 };
  sheet(
    `${hdc(t('ced'))}${cnm()}${cip()}<button class="btn btn-primary pr" style="width:100%;margin-top:14px" onclick="ecv()">${t('save')}</button>${
      id.startsWith('sonst')
        ? `<button class="btn btn-secondary s ghost" onclick="cl()">${t('cancel')}</button>`
        : `<button class="btn btn-secondary s ghost" onclick="cl()">${t('cancel')}</button><button class="btn dlt" style="width:100%;margin-top:18px" onclick="dc('${id}')">🗑 ${t('del')}</button><small class=hint style="margin-top:6px">${t(n == 0 ? 'cdh0' : n == 1 ? 'cdh1' : 'cdh').replace('{n}', n)}</small>`
    }`,
  );
  $('#o .sh').dataset.t = c.t;
}
function ecv() {
  const c = S.cats.find((x) => x.id == NC.id),
    n = $('#nn').value.trim();
  if (!n) {
    $('#nn').style.borderColor = 'var(--rust)';
    $('#en').hidden = false;
    $('#nn').focus();
    return;
  }
  if (n != t(c.n)) c.n = n;
  c.i = gr($('#ni').value) || NC.i;
  cl();
  P();
  toast(t('sav'));
}
function dc(id) {
  const c = S.cats.find((x) => x.id == id),
    to = 'sonst_' + c.t,
    ix = S.cats.indexOf(c),
    tx = S.tx.filter((x) => x.c == id),
    rc = S.rec.filter((x) => x.c == id);
  tx.forEach((x) => (x.c = to));
  rc.forEach((x) => (x.c = to));
  S.cats.splice(ix, 1);
  cl();
  P();
  toast(t('gone'), () => {
    S.cats.splice(Math.min(ix, S.cats.length), 0, c);
    tx.forEach((x) => (x.c = id));
    rc.forEach((x) => (x.c = id));
    P();
  });
}
/* Backup */
function dlf(f) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(f);
  a.download = f.name;
  a.click();
}
async function bk(k) {
  const j = k == 'j',
    txt = j
      ? JSON.stringify(S)
      : '\ufeff' +
        ['Datum;Typ;Kategorie;Betrag;Notiz']
          .concat(
            S.tx
              .slice()
              .sort(srt)
              .map((x) =>
                [
                  x.d,
                  t(x.t),
                  t(cn(x.c).n),
                  String(x.a).replace('.', ','),
                  '"' + x.n.replace(/"/g, '""') + '"',
                ].join(';'),
              ),
          )
          .join('\n'),
    f = new File([txt], 'moneyapp-' + iso(D) + (j ? '.json' : '.csv'), {
      type: j ? 'application/json' : 'text/csv',
    });
  try {
    if (navigator.canShare && navigator.canShare({ files: [f] })) await navigator.share({ files: [f] });
    else dlf(f);
  } catch (e) {
    if (e.name == 'AbortError') return;
    dlf(f);
  }
  if (j) {
    S.set.lb = Date.now();
    P();
  }
}
function im(el) {
  const f = el.files[0];
  if (!f) return;
  f.text().then((s) => {
    try {
      const d = JSON.parse(s);
      if (!Array.isArray(d.tx) || !d.cats) throw 0;
      X = { imp: d, nc: 0 };
      sheet(
        `${hd(t('imd'))}<div class="seg d-flex gap-2"><button class="btn btn-danger d" onclick="ip(1)">${t('rpl')}</button><button class="btn btn-primary" onclick="ip(0)">${t('mrg')}</button></div>`,
      );
    } catch (e) {
      X = {};
      sheet(
        `${hd(t('imerr'))}<p style="margin:8px 0 14px">${t('imerrt')}</p><button class="btn btn-primary" style="width:100%" onclick="cl()">${t('x')}</button>`,
      );
    }
  });
  el.value = '';
}
function ip(r) {
  const d = X.imp;
  if (r) {
    S = { ...blank(), ...d, set: { ...blank().set, ...d.set } };
  } else {
    const ids = new Set(S.tx.map((x) => x.id));
    d.tx.forEach((x) => {
      if (!ids.has(x.id)) S.tx.push(x);
    });
    d.cats.forEach((c) => {
      if (!S.cats.some((x) => x.id == c.id)) S.cats.push(c);
    });
    (d.rec || []).forEach((x) => {
      if (!S.rec.some((y) => y.id == x.id)) S.rec.push(x);
    });
    (d.tr || []).forEach((x) => {
      if (!S.tr.some((y) => y.id == x.id)) S.tr.push(x);
    });
  }
  S.tr.forEach((x) => {
    if (!x.to) x.to = x.f == 'bank' ? 'bar' : 'bank';
  });
  cl();
  P();
}
/* PIN */
const hs = (p) => btoa(p + 'ma');
function pn() {
  if (S.set.pin) {
    delete S.set.pin;
    P();
    return;
  }
  X = {};
  sheet(
    `${hd(t('pinset'))}<small class=hint>${t('pinrule')}</small><label class="form-label">${t('pin1')}</label><input id=pn1 class="form-control" type=password inputmode=numeric maxlength=6 autocomplete=off oninput="$('#pne').hidden=true"><label class="form-label">${t('pin2')}</label><input id=pn2 class="form-control" type=password inputmode=numeric maxlength=6 autocomplete=off onkeydown="if(event.key=='Enter')pns()" oninput="$('#pne').hidden=true"><div class="em invalid-feedback" id=pne hidden role=alert></div><button class="btn btn-primary pr" style="width:100%;margin-top:16px" onclick="pns()">${t('save')}</button><div class="seg d-flex gap-2 sc"><button class="btn btn-secondary s" onclick="cl()">${t('cancel')}</button></div>`,
  );
  $('#pn1').focus({ preventScroll: true });
}
function pns() {
  const a = $('#pn1').value,
    b = $('#pn2').value,
    m = !/^\d{4,6}$/.test(a) ? t('e_pin') : a != b ? t('e_pin2') : '';
  if (m) {
    const e = $('#pne');
    e.textContent = '⚠ ' + m;
    e.hidden = false;
    return;
  }
  S.set.pin = hs(a);
  cl();
  P();
  toast(t('sav'));
}
function lk() {
  if (!S.set.pin || $('#lk')) return;
  let n = 0;
  const o = document.createElement('div');
  o.id = 'lk';
  o.className = 'ov';
  o.style.cssText = 'z-index:30;align-items:center;background:var(--ink)';
  o.innerHTML = `<div class="card card-body" style="width:280px;text-align:center"><h2>🔒 ${t('pi')}</h2><input class="form-control" type=password inputmode=numeric maxlength=6 style="text-align:center;font-size:var(--fs-l)"><small></small></div>`;
  document.body.append(o);
  const i = o.querySelector('input');
  i.focus();
  i.oninput = () => {
    if (hs(i.value) == S.set.pin) o.remove();
    else if (i.value.length >= (S.set.pin ? atob(S.set.pin).length - 2 : 4)) {
      n++;
      i.value = '';
      if (n >= 3) {
        n = 0;
        i.disabled = 1;
        o.querySelector('small').textContent = t('wr');
        setTimeout(() => {
          i.disabled = 0;
          o.querySelector('small').textContent = '';
          i.focus();
        }, 3e4);
      }
    }
  };
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) window.hid = Date.now();
  else if (S && Date.now() - (window.hid || 0) > 3e5) lk();
});
/* Start */
/* Tastatur: Fenster an den sichtbaren Bereich anpassen, damit nichts verdeckt wird */
let KB0 = 0;
function vvf() {
  const v = window.visualViewport;
  if (!v) return;
  KB0 = Math.max(KB0, v.height);
  document.body.classList.toggle('kb', v.height < KB0 - 120);
  const o = $('#o');
  if (o) {
    o.style.bottom = 'auto';
    o.style.top = v.offsetTop + 'px';
    o.style.height = v.height + 'px';
  }
}
if (window.visualViewport) {
  visualViewport.addEventListener('resize', vvf);
  visualViewport.addEventListener('scroll', vvf);
  vvf();
}
addEventListener('orientationchange', () => {
  KB0 = 0;
});
addEventListener('focusin', (e) => {
  const el = e.target;
  if (!/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
  setTimeout(() => {
    try {
      el.scrollIntoView({ block: el.id == 'csi' ? 'start' : 'center', behavior: 'smooth' });
    } catch (x) {}
  }, 320);
});
/* Konten-Bereich in den Einstellungen: leere Felder zählen als 0, ungültige Eingaben werden markiert */
function ktoSave() {
  const vs = ['bank', 'bar', 'spar'].map((k) => {
    const e = $('#st_' + k),
      s = e ? e.value.trim() : '',
      v = s ? num(s) : 0;
    if (v == null && e) e.style.borderColor = 'var(--rust)';
    return [k, v];
  });
  if (vs.some(([, v]) => v == null)) return toast(t('e_num'));
  vs.forEach(([k, v]) => setAcc(k, v));
  P();
  toast(t('sav'));
}
function ob() {
  X = { nc: 1 };
  sheet(
    `<h2>${t('hi')}</h2><p style="margin:.2rem 0 0;color:var(--m)">${t('wl')}</p><ul class=wl><li><i>➕</i><span>${t('w1')}</span></li><li><i>🏦</i><span>${t('w2')}</span></li><li><i>📊</i><span>${t('w3')}</span></li></ul><div class=pv><b>🔒 ${t('wpt')}</b><br><span>${t('wp')}</span></div><label class="form-label">${t('sb')}</label><input id=ob_sb class="form-control" inputmode=decimal placeholder="${t('sbp')}"><small>${t('sbl')}</small><br><small>${t('wset')}</small><div class=cta><button class="btn btn-primary w-100" onclick="od()">${t('go')}</button></div>`,
  );
}
function od() {
  const e = $('#ob_sb'),
    v = e ? num(e.value) : null;
  S.ob = 1;
  if (v != null) setBank(v);
  X = {};
  cl();
  P();
}
/* Installations-Hinweis: nach dem Tippen auf „Installieren“ (oder nach erfolgter Installation) nie wieder anzeigen */
function ins() {
  const p = DP;
  p && p.prompt();
  DP = null;
  S.set.hd = 1;
  P();
}
addEventListener('appinstalled', () => {
  DP = null;
  if (S) {
    S.set.hd = 1;
    P();
  }
});
addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  DP = e;
  S && rd();
});
(async () => {
  try {
    S = await dbGet();
  } catch (e) {}
  S = S || blank();
  delete S.sav;
  S.tr = S.tr || [];
  S.tr.forEach((x) => {
    if (!x.to) x.to = x.f == 'bank' ? 'bar' : 'bank';
  });
  S.cats.forEach((c) => {
    if (c.n == 'c_sparen') c.n = 'Sparen';
  });
  S.set = Object.assign(blank().set, S.set);
  ap({ theme: S.set.theme, font: S.set.font });
  rd();
  if (!S.ob) ob();
  lk();
  navigator.storage && navigator.storage.persist && navigator.storage.persist();
  upd();
})();
/* Updates: Der neue Service Worker wartet (siehe service-worker.js). Er wird aktiviert, sobald kein
   Dialog offen ist, danach lädt die Seite neu. Ist ein Dialog offen, erscheint ein Hinweis mit „Neu laden“. */
function upd() {
  if (!('serviceWorker' in navigator)) return;
  const sw = navigator.serviceWorker,
    had = !!sw.controller; /* false = erste Installation: nie neu laden */
  let reg,
    go = 0,
    rl = 0;
  const safe = () => !$('#o'),
    reload = () => {
      if (!rl) {
        rl = 1;
        location.reload();
      }
    },
    act = () => {
      go = 1;
      reg && reg.waiting && reg.waiting.postMessage('SKIP_WAITING');
    },
    check = () => {
      if (!had || !reg || !reg.waiting) return;
      if (safe()) act();
      else if (!$('#toast').style.display || $('#toast').style.display == 'none') toast(t('upd'), act, t('updb'), 1);
    };
  sw.addEventListener('controllerchange', () => {
    if (!had) return;
    if (go || safe()) reload();
    else toast(t('upd'), reload, t('updb'), 1);
  });
  sw.register('./service-worker.js')
    .then((r) => {
      reg = r;
      r.addEventListener('updatefound', () => {
        const n = r.installing;
        n && n.addEventListener('statechange', () => n.state == 'installed' && check());
      });
      check();
    })
    .catch(() => {});
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && reg) {
      reg.update().catch(() => {});
      check();
    }
  });
  setInterval(check, 20000);
}
