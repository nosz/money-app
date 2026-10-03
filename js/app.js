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
/* Betrag fürs Eingabefeld: ganz = 12, sonst immer zwei Stellen = 12,50 */
const af = (a) => {
  const v = Math.round(Number(a) * 100) / 100;
  return (Number.isInteger(v) ? String(v) : v.toFixed(2)).replace('.', ',');
};
const hd = (ti) =>
  `<div class=sht><h2>${ti}</h2><button class=x onclick="cl()" aria-label="${t('x')}">✕</button></div>`;
/* Einheitliche Knopfzeile unter dem Hauptknopf: Abbrechen (schlicht), optional rote Aktion (Löschen/Ersetzen) */
const acts = (cx, dx, dl, dh) =>
  `<div class=acts><button class="btn btn-secondary s ghost" onclick="${cx}">${t('cancel')}</button>${dx ? `<button class="btn dlt" onclick="${dx}">${dl || '🗑 ' + t('del')}${dh ? `<small class=dh>${dh}</small>` : ''}</button>` : ''}</div>`;
/* Einheitliche Lösch-Rückfrage für Buchung, Kategorie und wiederkehrende Buchung */
function cdel(ti, msg, yes, back) {
  sheet(
    `${hd(ti)}<p class=cdm>${msg}</p><button class="btn btn-danger d cdy" onclick="${yes}">🗑 ${t('del')}</button><div class=acts><button class="btn btn-secondary s ghost" onclick="${back}">${t('cancel')}</button></div>`,
  );
}
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
    ? { ...x, a: af(x.a), f: '', k: x.t == 'u' ? x.f : x.k || 'bank' }
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
  bnu();
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
  const q = $('#csi');
  if (q) q.classList.toggle('fon', !!X.q);
};
function op() {
  sheet(`${hd(t((X.id ? 'et_' : 'nt_') + X.t))}<div class=tp>${X.id && X.t == 'u' ? '' : `<button class="${X.t == 'e' ? 'on' : ''}" aria-pressed="${X.t == 'e'}" onclick="X.t='e';X.c=null;X.ac=0;X.k=X.k=='spar'?'bar':X.k;op()"><i class=te>−</i> ${t('e')}</button><button class="${X.t == 'i' ? 'on' : ''}" aria-pressed="${X.t == 'i'}" onclick="X.t='i';X.c=null;X.ac=0;X.k=X.k=='spar'?'bar':X.k;op()"><i class=ti>+</i> ${t('i')}</button>`}${X.id && X.t != 'u' ? '' : `<button class="${X.t == 'u' ? 'on' : ''}" aria-pressed="${X.t == 'u'}" onclick="X.t='u';X.c=null;X.ac=0;X.to=X.k=='bank'?'bar':'bank';op()"><i class=tu>⇄</i> ${t('tr')}</button>`}</div><small class=hint>${t('h_' + X.t)}</small>
<input class="form-control amt" id=ia inputmode=decimal placeholder="0,00" value="${esc(X.a)}" oninput="am(this)" autocomplete=off><div class="em invalid-feedback" id=ea hidden role=alert></div>${X.t == 'u' ? DIR() + '<div class="em invalid-feedback" id=eu hidden role=alert></div>' : ACC() + `<input class="form-control${X.q ? ' fon' : ''}" id=csi type=search placeholder="🔍 ${t('search')}" value="${esc(X.q || '')}" oninput="X.q=this.value;fcat()" autocomplete=off enterkeyhint=search><div class=grid id=cg>${ghtml()}</div><button type=button class="btn btn-secondary s nwc" onclick="ncs(1)">＋ ${t('newc')}</button><div class="em invalid-feedback" id=ec hidden role=alert></div>`}
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
<div class="em warn alert alert-warning" id=ew hidden role=alert></div><div class=stkb><button class="btn btn-primary pr" style="width:100%" onclick="sv()">${t('save')}</button></div>${acts('cl()', X.id ? 'dl()' : '')}`);
  const shh = $('.sh');
  if (shh) shh.dataset.t = X.t;
  fm();
  bnu();
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
/* 1.21.22: Eingabe auf S anwenden (neue Buchung, Bearbeiten, Umbuchung); liefert die ID einer neuen Buchung. Einträge werden ersetzt statt verändert, damit chk() auf einer Kopie prüfen kann. */
/* Sperrprüfung für die aktuelle Eingabe im Erfassungsfenster; '' = alles in Ordnung */
function blq() {
  const a = num(X.a);
  if (!(a > 0) || (X.t == 'u' && X.k == X.to)) return '';
  const q = chk(() => mut(a, X.d || iso(D)));
  return q.length ? blkMsg(q, a) : '';
}
function mut(a, d) {
  let nid = null;
  const rep = (L, o) => {
    const i = L.findIndex((x) => x.id == X.id);
    if (i >= 0) L[i] = { ...L[i], ...o };
  };
  if (X.t == 'u') {
    const o = { d, a, f: X.k, to: X.to, n: X.n || '' };
    if (X.id) rep(S.tr, o);
    else {
      nid = uid();
      S.tr.push({ id: nid, ts: Date.now(), ...o });
    }
  } else if (X.id) rep(S.tx, { t: X.t, a, c: X.c, d, n: X.n || '', k: X.k || 'bank' });
  else {
    nid = uid();
    S.tx.push({ id: nid, ts: Date.now(), t: X.t, a, c: X.c, d, n: X.n || '', k: X.k || 'bank', r: X.f ? 1 : 0 });
    S.set.lk = X.k || 'bank';
    if (X.f) S.rec.push({ id: uid(), t: X.t, a, c: X.c, n: X.n || '', f: X.f, s: d, k: 1, ka: X.k || 'bank' });
  }
  return nid;
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
  /* 1.21.22: Bar und Gespart nie unter 0 – harte Sperre vor allen Warnungen, gilt auch beim Bearbeiten. Die Meldung steht schon beim Tippen unter der Kontoauswahl (bnu), hier springt die Ansicht dorthin. */
  if (blq()) {
    bnu();
    const eb = $('#eb');
    if (eb) eb.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return;
  }
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
  if (X.t == 'u' && X.k == X.to) {
    op();
    return;
  }
  const nid = mut(a, d);
  /* 1.21.18: Nach einer NEUEN Buchung (auch Umbuchung) zur Startseite wechseln, den Monat der Buchung aufklappen, einen Kachel-Filter nur lösen, wenn er die Buchung verbergen würde, und zur Buchung scrollen. Liegt das Datum nicht in den angezeigten Monaten (aktueller + zwei vorherige), gibt es keinen Sprung. */
  const bm = d.slice(0, 7),
    jmp = nid && bm >= iso(new Date(D.getFullYear(), D.getMonth() - 2, 1)).slice(0, 7) && bm <= iso(D).slice(0, 7);
  cl();
  if (jmp) {
    tab = 'home';
    HS.o = HS.o || {};
    HS.o[bm] = true;
    if (HS.ty && HS.ty != X.t) HS.ty = '';
  }
  P();
  toast(balOn() ? `${t('sav')} · ${(X.t == 'u' ? [X.k, X.to] : [X.k || 'bank']).map((k) => t('a_' + k) + ' ' + fmt(bal(k))).join(' · ')}` : t('sav'));
  if (jmp) shw(nid);
}
/* 1.21.18: Zur neuen Buchung scrollen und die Zeile kurz aufleuchten lassen. Kurze Verzögerung, weil cl() per history.back() eine Scroll-Wiederherstellung auslösen kann. */
function shw(id) {
  setTimeout(() => {
    const e = document.querySelector(`.mh [data-id="${id}"]`);
    if (!e) return;
    e.scrollIntoView({
      block: 'center',
      behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth',
    });
    e.classList.add('fl');
    setTimeout(() => e.classList.remove('fl'), 2000);
  }, 150);
}
function dl() {
  /* 1.21.22: Löschen sperren, wenn Bar/Gespart dadurch unter 0 fiele */
  const dq = chk(() => {
    const L = X.t == 'u' ? S.tr : S.tx,
      i = L.findIndex((x) => x.id == X.id);
    if (i >= 0) L.splice(i, 1);
  });
  if (dq.length)
    return sheet(
      `${hd(t('e_delt'))}<div class="em blk" role=alert style="margin:0 0 14px">⚠ ${esc(t('e_delb').replace(/\{k\}/g, t('a_' + dq[0].k)).replace('{n}', fmt(dq[0].n)))}</div><div class=acts><button class="btn btn-secondary s ghost" onclick="op()">${t('e_back')}</button></div>`,
    );
  const nm = X.t == 'u' ? t('tr') : X.n || t(cn(X.c).n);
  cdel(t('delt'), `<b>${esc(nm)} · ${fmt(num(X.a))}</b><br>${t('delm')}`, 'dlo()', 'op()');
}
function dlo() {
  const L = X.t == 'u' ? S.tr : S.tx,
    i = L.findIndex((x) => x.id == X.id);
  if (i >= 0) L.splice(i, 1);
  cl();
  P();
  toast(t('gone'));
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
    `${hd('🔔 ' + t('due'))}${bstrip([...new Set(l.map((o) => o.r.ka || 'bank'))])}${l.map((o) => {
      const bm = recBlk(o.r);
      return `<div class="card card-body"><div class=row style=border:0><span class=ic>${cn(o.r.c).i}</span><div class=g>${esc(o.r.n || t(cn(o.r.c).n))}<br><small>${o.d.slice(8)}.${o.d.slice(5, 7)}.</small></div><b class="${o.r.t == 'i' ? 'pos' : 'neg'}">${sg(o.r.a, o.r.t)}</b></div>${bm ? `<div class="em blk" role=alert>⚠ ${esc(bm)}</div>` : ''}<div class="seg d-flex gap-2"><button class="btn sm" ${bm ? 'disabled' : ''} onclick="cf('${o.r.id}')">${t('ok')}</button><button class="btn btn-secondary s sm" onclick="cfa('${o.r.id}')">${t('chg')}</button><button class="btn btn-secondary s sm" onclick="cf('${o.r.id}',0,1)">${t('skip')}</button></div></div>`;
    }).join('')}<button class="btn btn-primary" style=width:100% onclick="ca()">${t('all')}</button>`,
  );
}
/* 1.21.22: Buchung aus einer wiederkehrenden Buchung (Konto der Vorlage, Standard Bank) und Sperrprüfung dafür */
const recTx = (r, a) => ({ id: uid(), ts: Date.now(), t: r.t, a: a || r.a, c: r.c, d: iso(dateK(r, r.k)), n: r.n, r: 1, k: r.ka || 'bank' });
const recBlk = (r, a) => {
  const x = recTx(r, a),
    q = chk(() => S.tx.push(x));
  return q.length ? blkMsg(q, x.a, 'e_blkd') : '';
};
function cf(id, a, skip) {
  /* a = geänderter Betrag (optional), skip = überspringen statt buchen */
  const r = S.rec.find((x) => x.id == id);
  if (!r) return;
  if (!skip) {
    if (recBlk(r, a)) return dsh();
    S.tx.push(recTx(r, a));
  }
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
    `${hd(t('chg'))}${bstrip([r.ka || 'bank'])}<small class=hint>${esc(r.n || t(cn(r.c).n))}</small><input class="form-control amt" id=ca_a inputmode=decimal placeholder="${t('sbp0')}" value="${af(r.a)}" oninput="caLive('${id}',this)" onkeydown="if(event.key=='Enter')cfs('${id}')" autocomplete=off><div class="em invalid-feedback" id=ca_e hidden role=alert>${t('e_amt0')}</div><div class=stkb><button class="btn btn-primary pr" onclick="cfs('${id}')">${t('ok')}</button></div>${acts('dsh()')}`,
  );
  $('.sh').dataset.t = r.t;
  const e = $('#ca_a');
  e.focus({ preventScroll: true });
  e.select();
}
/* Live-Prüfung des geänderten Betrags einer fälligen Buchung */
function caLive(id, el) {
  const v = num(amc(el)),
    r = S.rec.find((x) => x.id == id),
    m = r && v > 0 ? recBlk(r, Math.round(v * 100) / 100) : '',
    e = $('#ca_e');
  e.textContent = m ? '⚠ ' + m : t('e_amt0');
  e.classList.toggle('blk', !!m);
  e.hidden = !m;
}
function cfs(id) {
  const v = num($('#ca_a').value);
  const e = $('#ca_e');
  if (!(v > 0)) {
    e.textContent = t('e_amt0');
    e.hidden = false;
    return;
  }
  const r = S.rec.find((x) => x.id == id),
    m = r && recBlk(r, Math.round(v * 100) / 100);
  if (m) {
    e.textContent = '⚠ ' + m;
    e.hidden = false;
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
  RE = { id, t: r.t, a: af(r.a), c: r.c, n: r.n || '', f: r.f, d, d0: d, f0: r.f };
  erd();
}
function erd() {
  const r = RE;
  sheet(
    `${hd(t('rec_e'))}${bstrip()}<input class="form-control amt" id=ra inputmode=decimal placeholder="${t('sbp0')}" value="${esc(r.a)}" oninput="RE.a=amc(this);$('#rea').hidden=true" autocomplete=off><div class="em invalid-feedback" id=rea hidden role=alert>${t('e_amt0')}</div><label class="form-label">${t('cat1')}</label><select class="form-select" onchange="RE.c=this.value">${O(
      S.cats.filter((c) => c.t == r.t).map((c) => [c.id, c.i + ' ' + esc(t(c.n))]),
      r.c,
    )}</select><label class="form-label">${t('note')}</label><input class="form-control" maxlength=80 value="${esc(r.n)}" oninput="RE.n=this.value" autocomplete=off><label class="form-label">${t('rep')}</label><select class="form-select" onchange="RE.f=this.value">${O(
      ['m', 'w', 'y'].map((k) => [k, t(k)]),
      r.f,
    )}</select><label class="form-label">${t('nextd')}</label><input class="form-control" type=date value="${r.d}" onchange="RE.d=this.value"><div class=stkb><button class="btn btn-primary pr" onclick="rsv()">${t('save')}</button></div>${acts('cl()', 'rdl()')}`,
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
  cdel(t('recdt'), t('recdq').replace('{n}', esc(r.n || t(cn(r.c).n))), 'rdo()', 'erd()');
}
/* 1.21.14: Neue wiederkehrende Buchung (Einstellungen → Wiederkehrende Buchungen → „Neue wiederkehrende Buchung“) */
function nrc() {
  X = {};
  RE = { nw: 1, t: 'e', a: '', c: '', n: '', f: 'm', d: iso(D) };
  nrt('e');
}
function nrt(ty) {
  RE.t = ty;
  if (!S.cats.some((c) => c.id == RE.c && c.t == ty)) RE.c = (S.cats.find((c) => c.t == ty) || {}).id || '';
  nrd();
}
function nrd() {
  const r = RE,
    on = (k) => `class="${r.t == k ? 'on' : ''}" aria-pressed="${r.t == k}"`;
  sheet(
    `${hd(t('rec_n'))}${bstrip()}<div class=tp><button ${on('e')} onclick="nrt('e')">${t('ex')}</button><button ${on('i')} onclick="nrt('i')">${t('inn')}</button></div><input class="form-control amt" id=ra inputmode=decimal placeholder="${t('sbp0')}" value="${esc(r.a)}" oninput="RE.a=amc(this);$('#rea').hidden=true" autocomplete=off><div class="em invalid-feedback" id=rea hidden role=alert>${t('e_amt0')}</div><label class="form-label">${t('cat1')}</label><select class="form-select" id=rc onchange="RE.c=this.value;$('#rec').hidden=true">${O(
      S.cats.filter((c) => c.t == r.t).map((c) => [c.id, c.i + ' ' + esc(t(c.n))]),
      r.c,
    )}</select><div class="em invalid-feedback" id=rec hidden role=alert>${t('e_cat')}</div><label class="form-label">${t('note')}</label><input class="form-control" maxlength=80 value="${esc(r.n)}" oninput="RE.n=this.value" autocomplete=off><label class="form-label">${t('rep')}</label><select class="form-select" onchange="RE.f=this.value">${O(
      ['m', 'w', 'y'].map((k) => [k, t(k)]),
      r.f,
    )}</select><label class="form-label">${t('rec_f1')}</label><input class="form-control" type=date value="${r.d}" onchange="RE.d=this.value"><div class=stkb><button class="btn btn-primary pr" onclick="nrs()">${t('save')}</button></div>${acts('cl()')}`,
  );
  $('.sh').dataset.t = r.t;
}
function nrs() {
  const v = num(RE.a);
  if (!(v > 0)) {
    const e = $('#rea');
    e.hidden = false;
    e.scrollIntoView({ block: 'center', behavior: 'smooth' });
    $('#ra').focus({ preventScroll: true });
    return;
  }
  if (!RE.c) {
    const e = $('#rec');
    e.hidden = false;
    e.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return;
  }
  /* k = 0: noch keine Buchung erzeugt, die erste entsteht zur ersten Fälligkeit */
  S.rec.push({
    id: uid(),
    t: RE.t,
    a: Math.round(v * 100) / 100,
    c: RE.c,
    n: (RE.n || '').trim(),
    f: RE.f,
    s: RE.d || iso(D),
    k: 0,
  });
  cl();
  P();
  toast(t('sav'));
}
function rdo() {
  const id = RE.id;
  cl();
  rm(id);
}
/* 1.21.22: Alle fälligen Buchungen chronologisch buchen; was Bar/Gespart unter 0 brächte, bleibt fällig (mit Meldung im Dialog) */
function ca() {
  const stuck = new Set(),
    nx = (r) => iso(dateK(r, r.k));
  for (let g = 0; g < 2000; g++) {
    const c = S.rec.filter((r) => !stuck.has(r.id) && nx(r) <= iso(D)).sort((a, b) => (nx(a) < nx(b) ? -1 : 1))[0];
    if (!c) break;
    if (recBlk(c)) stuck.add(c.id);
    else {
      S.tx.push(recTx(c));
      c.k++;
    }
  }
  P();
  stuck.size ? dsh() : cl();
}
const rm = (id) => {
  S.rec = S.rec.filter((x) => x.id != id);
  P();
  toast(t('gone'));
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
    `${hdc(t('newc'))}${cnm()}<label class="form-label">${t('cty')}</label><div class="tp ctp" role=group>${tb('e', '−', t('e'))}${tb('i', '+', t('i'))}</div><small class=hint id=cth>${t('h_' + NC.t)}</small>${cip()}<div class=stkb><button class="btn btn-primary pr" onclick="ac()">${t('save')}</button></div>${acts('ncx()')}`,
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
    `${hdc(t('ced'))}${cnm()}${cip()}<div class=stkb><button class="btn btn-primary pr" onclick="ecv()">${t('save')}</button></div>${acts('cl()', id.startsWith('sonst') ? '' : "dc('" + id + "')", '', id.startsWith('sonst') ? '' : t(n == 0 ? 'cdh0' : n == 1 ? 'cdh1' : 'cdh').replace('{n}', n))}`,
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
  const c = S.cats.find((x) => x.id == id);
  if (!c) return cl();
  const n = S.tx.filter((x) => x.c == id).length,
    h = t(n == 0 ? 'cdh0' : n == 1 ? 'cdh1' : 'cdh').replace('{n}', n);
  cdel(t('delct'), t('delc').replace('{n}', esc(t(c.n))) + ' ' + h, `dco('${id}')`, `ecs('${id}')`);
}
function dco(id) {
  const c = S.cats.find((x) => x.id == id);
  if (!c) return cl();
  const to = 'sonst_' + c.t;
  S.tx.filter((x) => x.c == id).forEach((x) => (x.c = to));
  S.rec.filter((x) => x.c == id).forEach((x) => (x.c = to));
  S.cats.splice(S.cats.indexOf(c), 1);
  cl();
  P();
  toast(t('gone'));
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
                  af(x.a),
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
      const q = chk(() => mergeIn(d)),
        bm = q.length ? t('e_impb').replace(/\{k\}/g, t('a_' + q[0].k)).replace('{n}', fmt(q[0].n)) : '';
      sheet(
        `${hd(t('imd'))}${bm ? `<div class="em blk" role=alert style="margin:0 0 14px">⚠ ${esc(bm)}</div>` : ''}<button class="btn btn-primary pr" style="width:100%" ${bm ? 'disabled' : ''} onclick="ip(0)">${t('mrg')}</button>${acts('cl()', 'ip(1)', t('rpl'))}`,
      );
    } catch (e) {
      X = {};
      sheet(
        `${hd(t('imerr'))}<p style="margin:8px 0 14px">${t('imerrt')}</p><button class="btn btn-primary" style="width:100%" onclick="${S.ob ? 'cl()' : 'ob()'}">${t('x')}</button>`,
      );
    }
  });
  el.value = '';
}
const trTo = () =>
  S.tr.forEach((x) => {
    if (!x.to) x.to = x.f == 'bank' ? 'bar' : 'bank';
  });
const mergeIn = (d) => {
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
  trTo();
};
function ip(r) {
  const d = X.imp;
  if (r) {
    S = { ...blank(), ...d, set: { ...blank().set, ...d.set } };
  } else {
    /* 1.21.22: Zusammenführen darf Bar/Gespart nicht unter 0 bringen (Ersetzen übernimmt den Stand des Backups, Hinweis siehe negHint) */
    const q = chk(() => mergeIn(d));
    if (q.length)
      return sheet(
        `${hd(t('e_impt'))}<div class="em blk" role=alert style="margin:0 0 14px">⚠ ${esc(t('e_impb').replace(/\{k\}/g, t('a_' + q[0].k)).replace('{n}', fmt(q[0].n)))}</div><button class="btn btn-primary" style="width:100%" onclick="${S.ob ? 'cl()' : 'ob()'}">${t('e_ver')}</button>`,
      );
    mergeIn(d);
  }
  trTo();
  S.ob = 1; /* wer ein Backup einspielt, braucht den Willkommensdialog nicht */
  cl();
  P();
  if (r) setTimeout(negHint, 400);
}
/* 1.21.22: Starthinweis, wenn Bar/Gespart (Altbestand) im Minus liegt: pro Konto einmal; wird ein Konto wieder positiv, kann der Hinweis später erneut erscheinen */
function negHint() {
  if ($('#o') || !S.ob) return;
  S.set.nw = S.set.nw || {};
  const l = HK.filter((k) => bal(k) < -0.004),
    ok = HK.filter((k) => bal(k) >= -0.004 && S.set.nw[k]),
    sh = l.filter((k) => !S.set.nw[k]);
  ok.forEach((k) => delete S.set.nw[k]);
  sh.forEach((k) => (S.set.nw[k] = 1));
  if (ok.length || sh.length) dbPut();
  if (!sh.length) return;
  X = {};
  sheet(
    `${hd(t('e_negt'))}${sh.map((k) => `<p class=cdm>${esc(t('e_negm').replace('{k}', t('a_' + k)).replace('{v}', fmt(bal(k))))}</p>`).join('')}<p class=cdm>${esc(t('e_negh'))}</p><button class="btn btn-primary" style="width:100%" onclick="cl()">${t('e_ver')}</button>`,
  );
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
    `${hd(t('pinset'))}<small class=hint>${t('pinrule')}</small><label class="form-label">${t('pin1')}</label><input id=pn1 class="form-control" type=password inputmode=numeric maxlength=6 autocomplete=off oninput="$('#pne').hidden=true"><label class="form-label">${t('pin2')}</label><input id=pn2 class="form-control" type=password inputmode=numeric maxlength=6 autocomplete=off onkeydown="if(event.key=='Enter')pns()" oninput="$('#pne').hidden=true"><div class="em invalid-feedback" id=pne hidden role=alert></div><div class=stkb><button class="btn btn-primary pr" onclick="pns()">${t('save')}</button></div>${acts('cl()')}`,
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
  o.innerHTML = `<div class="card card-body" style="width:280px;text-align:center"><h2>${AV('lock')} ${t('pi')}</h2><input class="form-control" type=password inputmode=numeric maxlength=6 style="text-align:center;font-size:var(--fs-l)"><small></small></div>`;
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
/* 1.21.23: Live-Prüfung eines Kontofelds beim Tippen (p = 'st' Einstellungen, 'ob' Onboarding) */
function kLive(p, k) {
  const i = $('#' + p + '_' + k),
    m = $('#' + p + '_e_' + k);
  if (!i || !m) return;
  const s = i.value.trim(),
    v = s ? num(s) : 0,
    bad = v != null && HK.includes(k) && blk(v, bal(k));
  i.style.borderColor = bad ? 'var(--rust)' : '';
  m.hidden = !bad;
  m.textContent = bad ? '⚠ ' + t('e_neg0').replace('{k}', t('a_' + k)) : '';
}
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
  /* 1.21.22: Bar/Gespart nicht negativ (ein unverändert gelassener Altbestand im Minus bleibt zulässig) */
  const bad = vs.filter(([k, v]) => HK.includes(k) && blk(v, bal(k)));
  HK.forEach((k) => {
    const m = $('#st_e_' + k);
    if (m) m.hidden = true;
  });
  if (bad.length) {
    bad.forEach(([k]) => {
      const e = $('#st_' + k),
        m = $('#st_e_' + k);
      if (e) e.style.borderColor = 'var(--rust)';
      if (m) {
        m.textContent = '⚠ ' + t('e_neg0').replace('{k}', t('a_' + k));
        m.hidden = false;
      }
    });
    return;
  }
  vs.forEach(([k, v]) => setAcc(k, v));
  P();
  toast(t('sav'));
}
/* Erster Start (nur solange S.ob == 0): Schritt 1 Willkommen, Schritt 2 Kontostände. Beide Schritte lassen sich nicht wegtippen. */
function ob() {
  X = { nc: 1 };
  sheet(
    `<h2>${t('hi')}</h2><p style="margin:.2rem 0 0;color:var(--m)">${t('wl')}</p><ul class=wl><li><i>${AV('edit')}</i><span>${t('w1')}</span></li><li><i>${AV('bank')}</i><span>${t('w2')}</span></li><li><i>${AV('stats')}</i><span>${t('w3')}</span></li></ul><div class=pv><b>${AV('shield')} ${t('wpt')}</b><br><span>${t('wp')}</span></div><div class=cta style="margin-top:14px"><button class="btn btn-primary w-100" onclick="ob2()">${t('onx')}</button><button type=button class="btn btn-link w-100" onclick="$('#obf').click()">${t('obbk')}</button><input id=obf class=vh type=file accept=".json,application/json" onchange="im(this)" tabindex=-1 aria-hidden=true></div>`,
  );
}
function ob2() {
  X = { nc: 1 };
  sheet(
    `<h2>${t('obk')}</h2><p style="margin:.2rem 0 6px;color:var(--m)">${t('obkh')}</p>${['bank', 'bar', 'spar']
      .map(
        (k) =>
          `<label class="form-label">${AV(k)} ${t('a_' + k)}${k == 'spar' ? ` <small>(${t('oopt')})</small>` : ''}</label><small style="display:block;margin-bottom:8px">${t('kh_' + k)}</small><input id=ob_${k} class="form-control" inputmode=decimal placeholder="${t('sbp0')}" oninput="kLive('ob','${k}')" autocomplete=off><div class="em" id=ob_e_${k} hidden role=alert></div>`,
      )
      .join('')}<small style="display:block;margin-top:12px">${t('wset')}</small><div class=stkb><button class="btn btn-primary w-100" onclick="od(1)">${t('go')}</button><button type=button class="btn btn-link w-100" onclick="od(0)">${t('olat')}</button></div>`,
  );
}
/* sv = 1: eingegebene Stände übernehmen (leere Felder zählen dann als 0, sind alle leer, wird nichts gesetzt); sv = 0: später */
function od(sv) {
  const vs = sv
    ? ['bank', 'bar', 'spar'].map((k) => {
        const e = $('#ob_' + k),
          s = e ? e.value.trim() : '';
        if (!s) return [k, 0, 1];
        const v = num(s);
        if (v == null && e) e.style.borderColor = 'var(--rust)';
        return [k, v, 0];
      })
    : [];
  if (vs.some(([, v]) => v == null)) return toast(t('e_num'));
  /* 1.21.22: Bar/Gespart dürfen nicht negativ starten */
  const bad = vs.filter(([k, v, empty]) => !empty && HK.includes(k) && blk(v, bal(k)));
  if (bad.length) {
    HK.forEach((k) => {
      const m = $('#ob_e_' + k);
      if (m) m.hidden = true;
    });
    bad.forEach(([k]) => {
      const e = $('#ob_' + k),
        m = $('#ob_e_' + k);
      if (e) e.style.borderColor = 'var(--rust)';
      if (m) {
        m.textContent = '⚠ ' + t('e_neg0').replace('{k}', t('a_' + k));
        m.hidden = false;
      }
    });
    return;
  }
  S.ob = 1;
  if (vs.some(([, , empty]) => !empty)) vs.forEach(([k, v]) => setAcc(k, v));
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
  negHint();
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
