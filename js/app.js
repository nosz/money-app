/* MoneyApp – Eingabe-Sheets, Kategorien, Backup, PIN, Start */
/* Sheets & Toast */
let HP = 0,
  MK = null; /* 1.37.0: Kürzel der geöffneten Eingabe-Maske (x Buchung, n Kategorie, r wiederkehrend, c Betrag ändern, p PIN), null = keine */
function sheet(h, cls, mk) {
  MK = mk || null;
  let o = $('#o');
  if (!o) {
    o = document.createElement('div');
    o.id = 'o';
    o.className = 'ov';
    o.onclick = (e) => {
      if (e.target == o && !X.nc) dcl(() => cl());
    };
    document.body.append(o);
    if (!X.nc) {
      try {
        history.pushState({ sh: 1 }, '');
        HP = 1;
      } catch (e) {}
    }
  }
  o.innerHTML = `<div class="sh${cls ? ' ' + cls : ''}" role=dialog aria-modal=true>${h}</div>`;
  vvf();
  svr(1);
}
const cl = () => {
  const o = $('#o');
  MK = null;
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
    /* 1.37.0: Zurück-Geste mit ungespeicherten Änderungen: Eintrag wieder anlegen und nachfragen */
    if ($('#dsc') || dirtyNow()) {
      try {
        history.pushState({ sh: 1 }, '');
      } catch (e) {}
      if (!$('#dsc')) dscAsk(() => cl());
      return;
    }
    HP = 0;
    o.remove();
  }
});
addEventListener('keydown', (e) => {
  if (e.key != 'Escape') return;
  if ($('#dsc')) return dscN();
  if ($('#o') && !X.nc) dcl(() => cl());
});
/* Betrag fürs Eingabefeld: ganz = 12, sonst immer zwei Stellen = 12,50 */
const af = (a) => {
  const v = Math.round(Number(a) * 100) / 100;
  return (Number.isInteger(v) ? String(v) : v.toFixed(2)).replace('.', ',');
};
/* cx = Schließen-Aktion einer Eingabe-Maske (mit Verwerfen-Rückfrage, Skill 5b); ohne cx schließt das ✕ sofort */
const hd = (ti, cx) =>
  `<div class=sht><h2>${ti}</h2><button class=x onclick="${cx ? `dcl(()=>${cx})` : 'cl()'}" aria-label="${t('x')}">${bi('x')}</button></div>`;
/* Einheitliche Knopfzeile unter dem Hauptknopf: Abbrechen (schlicht), optional rote Aktion (Löschen/Ersetzen) */
const acts = (cx, dx, dl, dh) =>
  `<div class=acts><button class="btn btn-secondary s ghost" onclick="${cx}">${t('cancel')}</button>${dx ? `<button class="btn dlt" onclick="${dx}">${dl || bi('trash') + ' ' + t('del')}${dh ? `<small class=dh>${dh}</small>` : ''}</button>` : ''}</div>`;
/* Einheitliche Lösch-Rückfrage für Buchung, Kategorie und wiederkehrende Buchung */
function cdel(ti, msg, yes, back) {
  sheet(
    `${hd(ti)}<p class=cdm>${msg}</p><button class="btn btn-danger d cdy" onclick="${yes}">${bi('trash')} ${t('del')}</button><div class=acts><button class="btn btn-secondary s ghost" onclick="${back}">${t('cancel')}</button></div>`,
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
/* 1.45.0: App weiterempfehlen (Einstellungen → Über die App). Teilen-Menü des Geräts mit Text und Link; ohne Teilen-Menü wird Text samt Link kopiert.
   Link = Adresse, unter der die App gerade läuft (ohne Suchteil und ohne index.html). Läuft sie nicht unter einer Web-Adresse (z. B. Datei lokal geöffnet), gilt GITHUB_URL. */
async function shr() {
  const web = /^https?:$/.test(location.protocol),
    url = web ? location.origin + location.pathname.replace(/index\.html$/, '') : GITHUB_URL,
    txt = t('shr_t');
  if (navigator.share) {
    try {
      await navigator.share({ title: 'MoneyApp', text: txt, url });
      return;
    } catch (e) {
      /* Abbruch durch den Nutzer: nichts weiter tun; anderer Fehler: kopieren */
      if (e && e.name == 'AbortError') return;
    }
  }
  const all = txt + ' ' + url;
  try {
    await navigator.clipboard.writeText(all);
  } catch (e) {
    /* Ältere Browser ohne Zwischenablage-Zugriff: über ein verstecktes Feld kopieren */
    const ta = document.createElement('textarea');
    ta.value = all;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e2) {}
    ta.remove();
    if (!ok) return toast(t('shr_e'));
  }
  toast(t('shr_c'));
}
/* Buchung erfassen / bearbeiten */
function ot(id) {
  const x = id && allT().find((y) => y.id == id);
  X = x
    ? { ...x, a: af(x.a), f: '', k: x.t == 'u' ? x.f : x.k || 'bank' }
    : { t: 'e', c: null, a: '', d: '', n: '', f: '', k: S.set.lk || 'bar' };
  SN.x = CUR.x();
  op();
}
/* ===== 1.37.0: Eingabe-Filter und Prüfung für ALLE Feldarten (Skill 5a) ===== */
/* Feld blinkt kurz rostrot, wenn Zeichen nicht angenommen wurden */
function rej(el) {
  el.classList.remove('rej');
  void el.offsetWidth;
  el.classList.add('rej');
  setTimeout(() => el.classList.remove('rej'), 700);
}
/* Betrag normalisieren: nur Ziffern, ein Trenner, 2 Nachkommastellen, höchstens 9 Stellen davor, optional führendes Minus (neg).
   paste = Einfügen/Ziehen: Tausendertrenner erkennen („1.234,56“, „1,234.56“, „1.234.567“ → Zahl ohne Tausenderpunkte). */
function amn(o, neg, paste) {
  let v = String(o).replace(/[^\d.,-]/g, '');
  const ng = neg && v.charAt(0) == '-' ? '-' : '';
  v = v.replace(/-/g, '');
  if (paste) {
    const c = (v.match(/,/g) || []).length,
      d = (v.match(/\./g) || []).length;
    if (c && d) v = v.lastIndexOf(',') > v.lastIndexOf('.') ? v.replace(/\./g, '') : v.replace(/,/g, '');
    const m = v.match(/[.,]/g) || [];
    if (m.length > 1) v = v.replace(/[.,]/g, '');
    else if (m.length == 1 && /^\d{1,3}\.\d{3}$/.test(v)) v = v.replace('.', '');
  }
  const i = v.search(/[.,]/);
  if (i < 0) return ng + v.slice(0, 9);
  return ng + v.slice(0, i).slice(0, 9) + v.charAt(i) + v.slice(i + 1).replace(/[.,]/g, '').slice(0, 2);
}
/* Betragsfeld filtern (oninput). neg = führendes Minus erlaubt (Kontostände). Gibt den bereinigten Wert zurück. */
function amc(el, neg) {
  const o = el.value,
    ev = window.event,
    it = (ev && ev.inputType) || '',
    v = amn(o, neg, /^insertFrom(Paste|Drop|Yank)|^insertReplacementText/.test(it));
  if (v != o) {
    const p = Math.max(0, (el.selectionStart ?? o.length) - (o.length - v.length));
    el.value = v;
    try {
      el.setSelectionRange(p, p);
    } catch (e) {}
    if (/[^\d.,\s\u00a0€$£-]/.test(o) || (v.length < o.length && !/^insertFrom/.test(it))) rej(el);
  }
  return v;
}
/* PIN-Feld: nur Ziffern */
function dgc(el) {
  const v = el.value.replace(/\D/g, '');
  if (v != el.value) {
    el.value = v;
    rej(el);
  }
  return v;
}
/* Textfeld: keine Steuerzeichen, kein führendes Leerzeichen (maxlength steht am Feld) */
function txc(el) {
  const o = el.value,
    v = o.replace(/[\u0000-\u001f\u007f]/g, '').replace(/^\s+/, '');
  if (v != o) {
    const p = Math.max(0, (el.selectionStart ?? o.length) - (o.length - v.length));
    el.value = v;
    try {
      el.setSelectionRange(p, p);
    } catch (e) {}
  }
  return v;
}
/* Datum gültig (JJJJ-MM-TT, real existierend, 2000 bis 2100) */
const dvl = (v) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
  if (!m) return false;
  const y = +m[1],
    mo = +m[2],
    d = +m[3],
    dt = new Date(y, mo - 1, d);
  return y >= 2000 && y <= 2100 && dt.getMonth() == mo - 1 && dt.getDate() == d;
};
/* Wert wirklich eingegeben (nicht leer, nicht nur „-“, „,“ oder „.“) */
const typed = (s) => {
  s = String(s || '').trim();
  return !!s && !/^-?[.,]?$/.test(s);
};
/* ===== 1.37.0: Speichern-Knopf – Zustände, Änderungs-Erkennung, Verwerfen-Rückfrage (Skill 5b) =====
   Zustände (data-s am Knopf): idle (unverändert, deaktiviert), dirty (geändert und gültig, aktiv), bad (ungültig, deaktiviert), done (gerade gespeichert, 2 s grün).
   SN[mk] = Schnappschuss beim Öffnen, CUR[mk]() = aktuelle Werte, dirtyNow() vergleicht. */
let SN = {};
const na = (s) => {
    const v = num(s);
    return v == null ? 's:' + String(s || '').trim() : String(Math.round(v * 100) / 100);
  },
  CUR = {
    x: () => JSON.stringify([X.t, na(X.a), X.k || '', X.t == 'u' ? X.to : X.c || '', X.d || iso(D), (X.n || '').trim(), X.f || '']),
    n: () => JSON.stringify([NC.t, (NC.n || '').trim(), NC.i || '']),
    r: () => JSON.stringify([RE.t, na(RE.a), RE.c || '', (RE.n || '').trim(), RE.f || '', RE.d || '']),
    c: () => ($('#ca_a') ? na($('#ca_a').value) : ''),
    p: () => JSON.stringify([($('#pn1') || {}).value || '', ($('#pn2') || {}).value || '']),
  },
  NW = { x: () => !X.id, n: () => !NC.id, r: () => !RE.id, c: () => false, p: () => true },
  dirtyNow = () => !!MK && SN[MK] != null && CUR[MK]() !== SN[MK],
  say = (q, m) => {
    const e = $(q);
    if (!e) return;
    e.hidden = !m;
    if (m) wm(e, m);
  },
  /* Ungültig-Prüfungen je Maske; live = true: Meldungen am Feld nachziehen (nur bei Eingabe, nie bei einem Tipp auf Speichern) */
  BADF = {
    x: (live) => {
      const a = num(X.a),
        ba = typed(X.a) && !(a > 0),
        su = X.t == 'u' && X.k == X.to;
      if (live) {
        const m = msgs();
        say('#ea', ba ? t('e_amt0') : X.tried ? m.a : '');
        say('#eu', su ? t('e_acc') : X.tried ? m.u : '');
      }
      return !!(ba || su || X.dbad || blq() || (X.id && Object.keys(msgs()).length));
    },
    n: (live) => {
      const n = (NC.n || '').trim(),
        c = NC.id && S.cats.find((x) => x.id == NC.id),
        dup = !!n && (NC.id ? n != t(c.n) && cdup(n, NC.t, NC.id) : cdup(n, NC.t)),
        em = !!NC.id && !n && dirtyNow();
      if (live) {
        say('#en', dup ? t('e_catdup') : em ? t('e_name') : '');
        const i = $('#nn');
        if (i) i.style.borderColor = dup || em ? 'var(--rust)' : '';
      }
      return dup || em;
    },
    r: (live) => {
      const s = String(RE.a || '').trim(),
        inc = /^-?[.,]?$/.test(s),
        ba = RE.id ? !(num(s) > 0) : !inc && !(num(s) > 0);
      if (live) say('#rea', ba && !(inc && s) ? t('e_amt0') : '');
      return !!(ba || RE.dbad);
    },
    c: (live) => {
      const e = $('#ca_a'),
        s = e ? e.value.trim() : '',
        v = s ? num(s) : null,
        r = S.rec.find((x) => x.id == (e && e.dataset.id)),
        bl = v > 0 && r ? recBlk(r, Math.round(v * 100) / 100) : '',
        bad = !(v > 0) || !!bl;
      if (live) {
        const m = $('#ca_e');
        if (m) {
          m.classList.toggle('blk', !!bl);
          m.hidden = !(bl || (!(v > 0) && !/^-?[.,]?$/.test(s)) || (!s && dirtyNow()));
          if (bl) wm(m, bl);
          else m.textContent = t('e_amt0');
        }
      }
      return bad;
    },
    p: (live) => {
      const a = ($('#pn1') || {}).value || '',
        b = ($('#pn2') || {}).value || '',
        mm = a.length >= 4 && b.length > 0 && b.length >= a.length && a != b;
      if (live) say('#pne', mm ? t('e_pin2') : '');
      return mm;
    },
  };
/* Knopf in einen Zustand setzen (Haken plus Text, nie nur ein Symbol) */
/* 1.60.0: Symbol je Zustand (Skill 5b): Diskette = es gibt etwas zu speichern bzw. noch nichts gespeichert, Haken NUR für „gespeichert“ (done, oder Konto mit unverändertem gespeichertem Wert).
   ic: 'floppy' | 'check' | '' (kein Symbol, z. B. „OK“, wo nichts gespeichert wird). Ohne Angabe: done = Haken, sonst Diskette. */
function sbs(b, s, lb, ic) {
  if (ic == null) ic = s == 'done' ? 'check' : 'floppy';
  const k = s + '|' + lb + '|' + ic;
  if (b.dataset.k == k) return;
  b.dataset.k = k;
  b.dataset.s = s;
  b.disabled = s == 'idle' || s == 'bad';
  b.innerHTML = `${ic ? bi(ic) : ''}<span>${lb}</span>`;
}
/* Zustand des Speichern-Knopfs der geöffneten Maske neu berechnen (live = true: auch Meldungen am Feld) */
function svr(live) {
  const b = $('#o .stkb .sb[data-mk]');
  if (!b || !MK || b.dataset.mk != MK) return;
  const d = dirtyNow(),
    bad = BADF[MK](live),
    nw = NW[MK](),
    lb = b.dataset.lb || '',
    st = nw ? (bad ? 'bad' : 'dirty') : !d ? 'idle' : bad ? 'bad' : 'dirty',
    txt = lb || t('save'); /* 1.40.0: auch unverändert (idle) „Speichern“, damit der Knopf beim Bearbeiten erkennbar ist */
  sbs(b, st, txt, lb ? '' : 'floppy'); /* mit eigenem Text (lb, z. B. „OK“) wird nichts gespeichert: kein Symbol */
  const h = $('#dh');
  if (h) h.hidden = !(d && st == 'dirty');
}
['input', 'change'].forEach((ev) => addEventListener(ev, () => setTimeout(() => svr(1), 0), true));
addEventListener('click', () => setTimeout(() => svr(0), 0), true);
/* Maske schließen: mit ungespeicherten Änderungen erst nachfragen, sonst sofort */
function dcl(fn) {
  if (dirtyNow()) dscAsk(fn);
  else fn();
}
let DSF = null;
function dscAsk(fn) {
  if ($('#dsc')) return;
  DSF = fn;
  const sh = $('#o .sh'),
    o = document.createElement('div');
  o.id = 'dsc';
  o.className = 'ov';
  o.innerHTML = `<div class="sh" role=alertdialog aria-modal=true aria-labelledby=dsct data-t="${sh ? sh.dataset.t || '' : ''}"><div class=sht><h2 id=dsct>${t('dsc_t')}</h2></div><p class=cdm>${t('dsc_m')}</p><button type=button class="btn btn-danger d cdy" onclick="dscY()">${bi('x')} ${t('dsc_y')}</button><div class=acts><button type=button class="btn btn-secondary s ghost" onclick="dscN()">${t('dsc_n')}</button></div></div>`;
  document.body.append(o);
  const k = o.querySelector('.acts .btn');
  if (k) k.focus();
}
function dscN() {
  const o = $('#dsc');
  if (o) o.remove();
  DSF = null;
}
function dscY() {
  const f = DSF;
  dscN();
  if (f) f();
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
  ckf();
}
/* ============================================================================
   1.28.0 – BUCHUNGSMASKE IM BANKING-LOOK (1.29.0: Neue Kategorie / Kategorie bearbeiten / Symbol-Auswahl erledigt, siehe ncm(), ipk())
   Konzept: Skill „banking-eingabemasken“. Aufbau von oben nach unten:
   Typ-Leiste → Betrag → Konto → Kategorie (Auswahlfeld) → Buchungsdatum → Notiz
   → Weitere Angaben (Wiederholung) → Löschen (nur beim Bearbeiten) → Speichern (fest unten)

   WEITER MACHEN (offene Punkte, in dieser Reihenfolge):
   [C] DIR() in js/core.js: „Von“/„Auf“ bei Umbuchung als Konto-Leisten statt Auswahlfelder.
   [D] Tastatur-Test auf echten Geräten (iOS/Android): Speichern-Knopf (.stkb) darf nicht verdeckt werden.
   [E] Weitere Masken (Wiederkehrende Buchung, Rückfragen, Backup, PIN) in gleicher Optik.
   ============================================================================ */

/* Währungssymbol aus der Einstellung (z. B. € für EUR); Rückfall: Währungscode */
const curSym = () => {
  try {
    return (0)
      .toLocaleString(loc(), { style: 'currency', currency: S.set.cur, minimumFractionDigits: 0, maximumFractionDigits: 0 })
      .replace(/[\d\s.,\u00a0\u202f]/g, '');
  } catch (e) {
    return S.set.cur || '';
  }
};

/* Inhalt des Kategorie-Auswahlfelds (#ck): gewählte Kategorie oder Hinweis „Kategorie wählen“ */
const ckin = () => {
  const c = S.cats.find((x) => x.id == X.c);
  return `<span class=ckv>${c ? `<b>${ci(c)}</b> ${esc(t(c.n))}` : `<em>${t('bk_catsel')}</em>`}</span>`;
};
const ckf = () => {
  const b = $('#ck');
  if (b) b.innerHTML = ckin();
};

/* Kategorie-Auswahl: eigene Ansicht über der Maske. X bleibt erhalten, Rückkehr immer mit op(). */
function cpk() {
  X.q = '';
  sheet(
    `<div class=sht><h2>${t('bk_cat')}</h2><button class=x onclick="op()" aria-label="${t('x')}">${bi('x')}</button></div><input class="form-control" id=csi type=search placeholder="${t('search')}" aria-label="${t('search')}" oninput="txc(this);X.q=this.value;cfil()" maxlength=60 autocomplete=off enterkeyhint=search><div class=cpl id=cpl>${clist()}</div>`,
    'fs',
    'x',
  );
  const sh = $('.sh');
  if (sh) {
    sh.dataset.t = X.t;
    sh.scrollTop = 0;
  }
}
/* Liste neu zeichnen (beim Tippen im Suchfeld) */
function cfil() {
  const l = $('#cpl'),
    q = $('#csi');
  if (l) l.innerHTML = clist();
  if (q) q.classList.toggle('fon', !!X.q);
}
function cpick(id) {
  X.c = id;
  X.ac = 0;
  X.q = '';
  op();
}
/* Liste: oben „Zuletzt benutzt“ (max. 4 Kategorien aus den letzten Buchungen gleicher Art), darunter alle,
   nach Häufigkeit sortiert. Bei Suche: Treffer nach Name oder früherer Notiz (Notiz als Zusatzzeile). */
function clist() {
  const q = (X.q || '').trim().toLowerCase(),
    hn = {},
    cnt = (c) => S.tx.slice(-80).filter((x) => x.c == c.id).length;
  let cs = S.cats.filter((c) => c.t == X.t).sort((a, b) => cnt(b) - cnt(a));
  const row = (c, sub) =>
    `<button type=button class="pk${X.c == c.id ? ' on' : ''}" aria-pressed="${X.c == c.id}" onclick="cpick('${c.id}')"><b>${ci(c)}</b><span>${hl(t(c.n), q)}${sub || ''}</span></button>`;
  const add = `<button type=button class="pk pn" onclick="ncs(1)">${bi('plus')}<span>${t('newc')}</span></button>`;
  if (q) {
    [...S.tx].reverse().forEach((x) => {
      if (x.n && x.t == X.t && !hn[x.c] && String(x.n).toLowerCase().includes(q)) hn[x.c] = String(x.n);
    });
    cs = cs.filter((c) => t(c.n).toLowerCase().includes(q) || hn[c.id]);
    return (
      (cs.length
        ? `<div class=pl>${cs
            .map((c) => {
              const nameHit = t(c.n).toLowerCase().includes(q);
              return row(c, !nameHit && hn[c.id] ? `<small class=hn>${bi('note')} ${hl(exc(hn[c.id], q), q)}</small>` : '');
            })
            .join('')}</div>`
        : `<div class=nr><small>${t('nores')}</small></div>`) + add
    );
  }
  const rec = [];
  for (let k = S.tx.length - 1; k >= 0 && rec.length < 4; k--) {
    const x = S.tx[k];
    if (x.t == X.t && !rec.includes(x.c) && cs.some((c) => c.id == x.c)) rec.push(x.c);
  }
  return (
    (rec.length
      ? `<h3 class=ph>${t('bk_rec')}</h3><div class=pl>${rec.map((id) => row(cs.find((c) => c.id == id))).join('')}</div>`
      : '') +
    `<h3 class=ph>${t('bk_all')}</h3><div class=pl>${cs.map((c) => row(c)).join('')}</div>` +
    add
  );
}

/* 1.41.0: Kategorie-Filter der Karte „Buchungen“ (Einstellungen). Auswahlfeld #fcb, Auswahl-Ansicht wie in der Buchungsmaske:
   Suche, „Alle Kategorien“ oben, Ausgaben und Einnahmen als Listen mit Linien-Icon und Anzahl der Buchungen. Gewählt wird F.c. */
let FQ = '';
const fcin = () => {
  const c = S.cats.find((x) => x.id == F.c);
  return c ? `<b>${ci(c)}</b> ${esc(t(c.n))}` : `<em>${t('bk_all')}</em>`;
};
function fcp() {
  FQ = '';
  sheet(
    `<div class=sht><h2>${t('bk_cat')}</h2><button class=x onclick="cl()" aria-label="${t('x')}">${bi('x')}</button></div><input class="form-control" id=fpi type=search placeholder="${t('search')}" aria-label="${t('search')}" oninput="txc(this);FQ=this.value;fpf()" maxlength=60 autocomplete=off enterkeyhint=search><div class=cpl id=fpl>${fpl()}</div>`,
    'fs',
  );
  const sh = $('.sh');
  if (sh) sh.scrollTop = 0;
}
function fpf() {
  const l = $('#fpl'),
    q = $('#fpi');
  if (l) l.innerHTML = fpl();
  if (q) q.classList.toggle('fon', !!FQ);
}
function fpl() {
  const q = FQ.trim().toLowerCase(),
    n = {};
  S.tx.forEach((x) => {
    n[x.c] = (n[x.c] || 0) + 1;
  });
  const cs = S.cats.filter((c) => (n[c.id] || c.id == F.c) && (!q || t(c.n).toLowerCase().includes(q))),
    row = (c) =>
      `<button type=button class="pk${F.c == c.id ? ' on' : ''}" aria-pressed="${F.c == c.id}" onclick="fcs('${c.id}')"><b>${ci(c)}</b><span>${hl(t(c.n), q)}</span><small class=pc>${n[c.id] || 0}</small></button>`,
    grp = (ty, ti) => {
      const g = cs.filter((c) => c.t == ty).sort((a, b) => (n[b.id] || 0) - (n[a.id] || 0));
      return g.length ? `<h3 class=ph>${t(ti)}</h3><div class=pl>${g.map(row).join('')}</div>` : '';
    },
    all = q
      ? ''
      : `<div class=pl><button type=button class="pk${F.c ? '' : ' on'}" aria-pressed="${!F.c}" onclick="fcs('')"><span>${t('bk_all')}</span></button></div>`,
    body = grp('e', 'fpe') + grp('i', 'fpn');
  return all + (body || (q ? `<div class=nr><small>${t('nores')}</small></div>` : ''));
}
function fcs(id) {
  F.c = id;
  cl();
  const v = $('#fcv'),
    b = $('#fcb');
  if (v) v.innerHTML = fcin();
  if (b) b.classList.toggle('fon', !!F.c);
  const w = $('#fcw');
  if (w) w.classList.toggle('fon', !!F.c);
  rs();
}

/* Buchungsdatum: Kurzwahl Heute/Gestern und Datumsfeld bleiben synchron, ohne die Maske neu zu zeichnen */
function dpk(v, el) {
  /* 1.37.0: ungültiges oder unvollständiges Datum wird gemeldet, das letzte gültige bleibt gespeichert */
  const bad = !dvl(v) || !!(el && el.validity && el.validity.badInput);
  X.dbad = bad ? 1 : 0;
  say('#ed', bad ? t('e_date') : '');
  const di = $('#idd');
  if (di) di.classList.toggle('bad', bad);
  if (bad) return;
  X.d = v || '';
  const cd = X.d || iso(D);
  document.querySelectorAll('.dq .dqb').forEach((b) => {
    const on = b.dataset.d == cd;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
  const i = $('#idd');
  if (i && i.value != cd) i.value = cd;
}

/* 1.34.0: Einheitliche Knopfzeile unten in einer Zeile: Abbrechen (schmal, schlicht) links, Speichern (groß) rechts.
   sx = Speichern-Aktion, cx = Abbrechen-Aktion (wie das ✕ oben), lb = Beschriftung des Hauptknopfs (Standard: Speichern) */
/* 1.37.0: mk = Masken-Kürzel (Skill 5b). Mit mk: Abbrechen fragt bei ungespeicherten Änderungen nach, der Knopf bekommt Haken, Zustände (data-s) und die Zeile „Nicht gespeicherte Änderung“. */
const svb = (sx, cx, lb, mk) =>
  `<div class=stkb>${mk ? `<div class=dhint id=dh hidden><i></i>${t('unsv')}</div>` : ''}<div class=sbr><button type=button class="btn ghost cb" onclick="${mk ? `dcl(()=>${cx})` : cx}">${t('cancel')}</button><button type=button class="btn btn-primary pr sb"${mk ? ` data-mk="${mk}" data-lb="${lb || ''}" data-s=dirty` : ''} onclick="${sx}">${mk ? (lb ? '' : bi('floppy')) + '<span>' + (lb || t('save')) + '</span>' : lb || t('save')}</button></div></div>`;
/* Löschen als dezenter Textlink in Rost am Ende der Maske (nur beim Bearbeiten) */
const acts2 = (dx, h) =>
  `<div class=acts2>${h ? `<small class=dh2>${h}</small>` : ''}<button type=button class=lnk onclick="${dx}">${bi('trash')} ${t('del')}</button></div>`;

function op() {
  const isU = X.t == 'u',
    td = iso(D),
    yd = iso(new Date(D.getFullYear(), D.getMonth(), D.getDate() - 1)),
    cd = X.d || td,
    /* Typ-Leiste: ohne Plus-/Minus-Zeichen. Beim Bearbeiten nur der eigene Typ-Bereich (Buchung ↔ Umbuchung nicht mischbar). */
    tb = (ty, lb, js) =>
      `<button type=button class="${X.t == ty ? 'on' : ''}" aria-pressed="${X.t == ty}" onclick="${js}">${lb}</button>`,
    ei = `X.c=null;X.ac=0;X.k=X.k=='spar'?'bar':X.k;op()`,
    typ = `<div class="tp typ" role=group aria-label="${t('bk_nt')}">${
      X.id && isU ? '' : tb('e', t('e'), `X.t='e';${ei}`) + tb('i', t('i'), `X.t='i';${ei}`)
    }${X.id && !isU ? '' : tb('u', t('tr'), `X.t='u';X.c=null;X.ac=0;X.to=X.k=='bank'?'bar':'bank';op()`)}</div>`,
    betrag = `<div class=fld><label class=fl for=ia>${t('bk_amt')}</label><div class=amw><input class="form-control amt" id=ia inputmode=decimal placeholder="0,00" value="${esc(X.a)}" oninput="am(this)" autocomplete=off><span class=cur aria-hidden=true>${curSym()}</span></div><div class="em invalid-feedback" id=ea hidden role=alert></div></div>`,
    /* Konto: Bar/Bank (ACC in js/core.js, Label „Konto“); bei Umbuchung Von/Auf (DIR, siehe TODO [C]) */
    konto = isU ? DIR() + '<div class="em invalid-feedback" id=eu hidden role=alert></div>' : `<div class=fld>${ACC()}</div>`,
    kat = isU
      ? ''
      : `<div class=fld><label class=fl for=ck>${t('bk_cat')}</label><button type=button class=sel id=ck aria-haspopup=dialog onclick="cpk()">${ckin()}</button><div class="em invalid-feedback" id=ec hidden role=alert></div></div>`,
    /* Datum und Notiz sind immer sichtbar (nicht mehr eingeklappt) */
    dat = `<div class=fld><label class=fl for=idd>${t('bk_date')}</label><div class=dq><button type=button class="dqb${cd == td ? ' on' : ''}" data-d="${td}" aria-pressed="${cd == td}" onclick="dpk('${td}')">${t('today')}</button><button type=button class="dqb${cd == yd ? ' on' : ''}" data-d="${yd}" aria-pressed="${cd == yd}" onclick="dpk('${yd}')">${t('yest')}</button><input class="form-control" id=idd type=date min="2000-01-01" max="2100-12-31" value="${cd}" oninput="dpk(this.value,this)" onchange="dpk(this.value,this)"></div><div class="em invalid-feedback" id=ed hidden role=alert></div></div><div class=fld><label class=fl for=ino>${t('note')}</label><input class="form-control" id=ino maxlength=100 value="${esc(X.n)}" oninput="txc(this);ns(this.value)" autocomplete=off></div>`,
    /* Weitere Angaben: eingeklappt, enthält die Wiederholung (nur bei neuer Buchung, nicht bei Umbuchung) */
    mehr =
      X.id || isU
        ? ''
        : `<details class=more ${X.f ? 'open' : ''}><summary>${t('bk_more')}</summary><div class=fld><label class=fl for=irp>${t('rep')}</label><select class="form-select" id=irp onchange="X.f=this.value">${O(
            [
              ['', t('nr')],
              ['m', t('m')],
              ['w', t('w')],
              ['q', t('q')],
              ['y', t('y')],
            ],
            X.f,
          )}</select></div></details>`;
  sheet(
    `${hd(t(X.id ? 'et_' + X.t : 'bk_nt'), 'cl()')}${typ}<small class=hint>${t('bk_h_' + X.t)}</small>${betrag}${konto}${kat}${dat}${mehr}<div class="em warn alert alert-warning" id=ew hidden role=alert></div>${X.id ? acts2('dl()') : ''}${svb('sv()', 'cl()', '', 'x')}`,
    'fs',
    'x',
  );
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
    wm(e, m[k]);
  });
  const i = $('#ia');
  if (i) i.classList.toggle('bad', !!m.a);
  const g = $('#ck');
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
  /* 1.37.0: ungültiges Datum sperrt das Speichern (zusätzlich zur Live-Prüfung) */
  if (X.dbad) {
    const e = $('#ed');
    if (e) {
      say('#ed', t('e_date'));
      e.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    return;
  }
  if (Object.keys(m).length) {
    X.tried = 1;
    fm();
    const e = m.a ? $('#ia') : m.c ? $('#ck') : $('#eu');
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
        w.map((x) => `<div>${bi('warn')} ${x}</div>`).join('') +
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
/* 1.21.18: Zur neuen Buchung scrollen und die Zeile aufleuchten lassen (1.21.24: 5 s statt 2 s). Kurze Verzögerung, weil cl() per history.back() eine Scroll-Wiederherstellung auslösen kann. */
function shw(id) {
  setTimeout(() => {
    const e = document.querySelector(`.mh [data-id="${id}"]`);
    if (!e) return;
    e.scrollIntoView({
      block: 'center',
      behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth',
    });
    e.classList.add('fl');
    setTimeout(() => e.classList.remove('fl'), 5000);
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
      `${hd(t('e_delt'))}<div class="em blk" role=alert style="margin:0 0 14px">${bi('warn')} ${esc(t('e_delb').replace(/\{k\}/g, t('a_' + dq[0].k)).replace('{n}', fmt(dq[0].n)))}</div><div class=acts><button class="btn btn-secondary s ghost" onclick="op()">${t('e_back')}</button></div>`,
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
    `${hd(bi('bell') + ' ' + t('due'))}${bstrip([...new Set(l.map((o) => o.r.ka || 'bank'))])}${l.map((o) => {
      const bm = recBlk(o.r);
      return `<div class="card card-body"><div class=row style=border:0><span class=ic>${ci(cn(o.r.c))}</span><div class=g>${esc(o.r.n || t(cn(o.r.c).n))}<br><small>${o.d.slice(8)}.${o.d.slice(5, 7)}.</small></div><b class="${o.r.t == 'i' ? 'pos' : 'neg'}">${sg(o.r.a, o.r.t)}</b></div>${bm ? `<div class="em blk" role=alert>${bi('warn')} ${esc(bm)}</div>` : ''}<div class="seg d-flex gap-2"><button class="btn sm" ${bm ? 'disabled' : ''} onclick="cf('${o.r.id}')">${t('ok')}</button><button class="btn btn-secondary s sm" onclick="cfa('${o.r.id}')">${t('chg')}</button><button class="btn btn-secondary s sm" onclick="cf('${o.r.id}',0,1)">${t('skip')}</button></div></div>`;
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
    `${hd(t('chg'), 'dsh()')}${bstrip([r.ka || 'bank'])}<small class=hint>${esc(r.n || t(cn(r.c).n))}</small><input class="form-control amt" id=ca_a data-id="${id}" inputmode=decimal maxlength=13 placeholder="${t('sbp0')}" value="${af(r.a)}" oninput="caLive('${id}',this)" onkeydown="if(event.key=='Enter'&&!$('#o .sb').disabled)cfs('${id}')" autocomplete=off><div class="em invalid-feedback" id=ca_e hidden role=alert>${t('e_amt0')}</div>${svb(`cfs('${id}')`, 'dsh()', t('ok'), 'c')}`,
    '',
    'c',
  );
  SN.c = CUR.c();
  svr(1);
  $('.sh').dataset.t = r.t;
  const e = $('#ca_a');
  e.focus({ preventScroll: true });
  e.select();
}
/* Live-Prüfung des geänderten Betrags einer fälligen Buchung */
function caLive(id, el) {
  amc(el); /* Filter; Meldung und Knopfzustand setzt svr() (BADF.c) */
}
function cfs(id) {
  const v = num($('#ca_a').value);
  const e = $('#ca_e');
  if (!(v > 0)) {
    e.textContent = t('e_amt0');
    e.hidden = false;
    evis(e);
    return;
  }
  const r = S.rec.find((x) => x.id == id),
    m = r && recBlk(r, Math.round(v * 100) / 100);
  if (m) {
    wm(e, m);
    e.hidden = false;
    evis(e);
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
  SN.r = CUR.r();
  erd();
}
/* 1.31.0: Wiederkehrende Buchung im Banking-Look (gleiche Klassen wie die Buchungsmaske: .fld .fl .amw .sel-Optik .acts2); Logik unverändert */
/* 1.42.0: Aufbau der Maske (neu und bearbeiten): Betrag, Kategorie (Auswahl-Ansicht rcp()), Wiederholung als Leiste, Fälligkeit mit Hinweiszeile, Notiz zuletzt */
const rckin = () => {
  const c = S.cats.find((x) => x.id == RE.c);
  return `<span class=ckv>${c ? `<b>${ci(c)}</b> ${esc(t(c.n))}` : `<em>${t('bk_catsel')}</em>`}</span>`;
};
/* Hinweiszeile unter der Fälligkeit: sagt, wann die erste (bzw. nächste) Buchung entsteht; leer bei ungültigem Datum */
const rhtx = () => {
  const d = RE.d;
  if (!d || RE.dbad || !dvl(d)) return '';
  const ds = new Date(d + 'T00:00').toLocaleDateString(loc(), { day: '2-digit', month: '2-digit', year: 'numeric' });
  return (
    t(RE.id ? 'rh_n' : 'rh_1').replace('{d}', ds).replace('{f}', t(RE.f || 'm').toLowerCase()) +
    (d <= iso(D) ? ' ' + t('rh_p') : '')
  );
};
function rhf() {
  const h = $('#rhint');
  if (!h) return;
  const x = rhtx();
  h.textContent = x;
  h.hidden = !x;
}
/* 1.61.0: Wiederholung als Auswahlfeld (wie die Kategorie): Tipp öffnet die Vollbild-Ansicht rfp() mit vier Zeilen (Name, Zusatz, Haken bei der Auswahl);
   rfpick(k) setzt RE.f und kehrt mit rback() in die Maske zurück (RE hält alle Eingaben). Kürzel unverändert: m, w, q, y. */
const RFK = ['m', 'w', 'q', 'y'];
const rfin = () => `<span class=ckv>${esc(t(RE.f || 'm'))}</span>`;
function rfp() {
  const row = (k) =>
    `<button type=button class="pk${RE.f == k ? ' on' : ''}" aria-pressed="${RE.f == k}" onclick="rfpick('${k}')"><span>${t(k)}<small class=hn>${t('rep_' + k)}</small></span>${RE.f == k ? `<i class=ck>${bi('check')}</i>` : ''}</button>`;
  sheet(
    `<div class=sht><h2>${t('rep')}</h2><button class=x onclick="rback()" aria-label="${t('x')}">${bi('x')}</button></div><div class=cpl><div class=pl>${RFK.map(row).join('')}</div></div>`,
    'fs',
    'r',
  );
  const sh = $('.sh');
  if (sh) {
    sh.dataset.t = RE.t;
    sh.scrollTop = 0;
  }
}
function rfpick(k) {
  RE.f = k;
  rback();
}
function rfm(r, nw) {
  const hx = rhtx();
  return `<div class=fld><label class=fl for=ra>${t('bk_amt')}</label><div class=amw><input class="form-control amt" id=ra inputmode=decimal placeholder="0,00" value="${esc(r.a)}" oninput="RE.a=amc(this)" maxlength=13 autocomplete=off><span class=cur aria-hidden=true>${curSym()}</span></div><div class="em invalid-feedback" id=rea hidden role=alert>${t('e_amt0')}</div></div><div class=fld><span class=fl>${t('bk_cat')}</span><button type=button class=sel id=rck aria-haspopup=dialog onclick="rcp()">${rckin()}</button><div class="em invalid-feedback" id=rec hidden role=alert>${t('e_cat')}</div></div><div class=fld><span class=fl>${t('rep')}</span><button type=button class=sel id=rfk aria-haspopup=dialog onclick="rfp()">${rfin()}</button></div><div class=fld><label class=fl for=rd>${t(nw ? 'rec_f1' : 'nextd')}</label><input class="form-control" id=rd type=date min="2000-01-01" max="2100-12-31" value="${r.d}" oninput="rdc(this)" onchange="rdc(this)"><div class="em invalid-feedback" id=red hidden role=alert>${t('e_date')}</div><small class=hint id=rhint${hx ? '' : ' hidden'}>${hx}</small></div><div class=fld><label class=fl for=rn>${t('note')}</label><input class="form-control" id=rn maxlength=80 value="${esc(r.n)}" oninput="txc(this);RE.n=this.value" autocomplete=off></div>`;
}
/* 1.42.0: Kategorie-Auswahl der wiederkehrenden Buchung: eigene Ansicht über der Maske (wie cpk() der Buchung), Suche, Liste mit Linien-Icon,
   „Neue Kategorie“ am Listenende (ncs(2), Rückkehr mit der neuen Kategorie). RE bleibt erhalten, Rückkehr immer mit rback(). */
function rback() {
  RE.dbad = 0; /* das Datumsfeld wird mit dem letzten gültigen Wert neu gezeichnet */
  RE.id ? erd() : nrd();
}
function rcp() {
  RE.q = '';
  sheet(
    `<div class=sht><h2>${t('bk_cat')}</h2><button class=x onclick="rback()" aria-label="${t('x')}">${bi('x')}</button></div><input class="form-control" id=rqi type=search placeholder="${t('search')}" aria-label="${t('search')}" oninput="txc(this);RE.q=this.value;rcf()" maxlength=60 autocomplete=off enterkeyhint=search><div class=cpl id=rql>${rcl()}</div>`,
    'fs',
    'r',
  );
  const sh = $('.sh');
  if (sh) {
    sh.dataset.t = RE.t;
    sh.scrollTop = 0;
  }
}
function rcf() {
  const l = $('#rql'),
    q = $('#rqi');
  if (l) l.innerHTML = rcl();
  if (q) q.classList.toggle('fon', !!RE.q);
}
function rcl() {
  const q = (RE.q || '').trim().toLowerCase(),
    cnt = (c) => S.tx.filter((x) => x.c == c.id).length + S.rec.filter((x) => x.c == c.id).length,
    cs = S.cats.filter((c) => c.t == RE.t && (!q || t(c.n).toLowerCase().includes(q))).sort((a, b) => cnt(b) - cnt(a)),
    row = (c) =>
      `<button type=button class="pk${RE.c == c.id ? ' on' : ''}" aria-pressed="${RE.c == c.id}" onclick="rcpick('${c.id}')"><b>${ci(c)}</b><span>${hl(t(c.n), q)}</span></button>`;
  return (
    (cs.length
      ? `<h3 class=ph>${t(RE.t == 'i' ? 'fpn' : 'fpe')}</h3><div class=pl>${cs.map(row).join('')}</div>`
      : `<div class=nr><small>${t('nores')}</small></div>`) +
    `<button type=button class="pk pn" onclick="ncs(2)">${bi('plus')}<span>${t('newc')}</span></button>`
  );
}
function rcpick(id) {
  RE.c = id;
  RE.q = '';
  rback();
}
function erd() {
  const r = RE;
  sheet(
    `${hd(t('rec_e'), 'cl()')}<div class=fld><span class=fl>${t('cty')}</span><div class=ro>${t(r.t)}</div></div>${rfm(r, 0)}${acts2('rdl()')}${svb('rsv()', 'cl()', '', 'r')}`,
    'fs',
    'r',
  );
  $('.sh').dataset.t = r.t;
}
/* 1.37.0: Datum der wiederkehrenden Buchung prüfen (Live und beim Speichern) */
function rdc(el) {
  const bad = !dvl(el.value) || el.validity.badInput;
  RE.dbad = bad ? 1 : 0;
  say('#red', bad ? t('e_date') : '');
  el.classList.toggle('bad', bad);
  if (!bad) RE.d = el.value;
  rhf();
}
function rdBad() {
  const e = $('#red');
  say('#red', t('e_date'));
  if (e) e.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
  if (RE.dbad) return rdBad();
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
  SN.r = CUR.r(); /* Schnappschuss nach dem Vorbelegen der Kategorie */
  svr(1);
}
function nrt(ty) {
  RE.t = ty;
  if (!S.cats.some((c) => c.id == RE.c && c.t == ty)) RE.c = (S.cats.find((c) => c.t == ty) || {}).id || '';
  nrd();
}
function nrd() {
  const r = RE,
    tb = (k, lb) => `<button type=button class="${r.t == k ? 'on' : ''}" aria-pressed="${r.t == k}" onclick="nrt('${k}')">${lb}</button>`;
  sheet(
    `${hd(t('rec_n'), 'cl()')}<div class=fld><div class="tp typ" role=group aria-label="${t('cty')}">${tb('e', t('e'))}${tb('i', t('i'))}</div></div>${rfm(r, 1)}${svb('nrs()', 'cl()', '', 'r')}`,
    'fs',
    'r',
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
  if (RE.dbad) return rdBad();
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
/* Kategorie anlegen / bearbeiten (1.29.0, Banking-Look): Vollbild-Maske mit Art, Bezeichnung und Symbol.
   Das Symbol wird in einer eigenen Vollbild-Ansicht gewählt (Suche, Reiter „Symbole | Emoji“).
   NC = { id (nur beim Bearbeiten), t, n, i, from (1 = aus der Buchung, 2 = aus der wiederkehrenden Buchung heraus geöffnet), tab ('s' | 'e'), q, nodel, dh }
   NC.i: Emoji oder 'bi:<name>' (Bootstrap-Icon, siehe js/icons.js). Datenformat bleibt unverändert (Feld i). */
const hdc = (ti, js) =>
  `<div class=sht><h2>${ti}</h2><button class=x onclick="${js || 'dcl(()=>ncx())'}" aria-label="${t('x')}">${bi('x')}</button></div>`;
/* Maske zeichnen (neu und bearbeiten); beim Rückweg aus der Symbol-Auswahl bleiben Name und Symbol erhalten */
function ncm() {
  const ed = !!NC.id,
    lock = !!NC.from || ed,
    save = ed ? 'ecv()' : 'ac()',
    tb = (ty, lb) =>
      `<button type=button data-t="${ty}" class="${NC.t == ty ? 'on' : ''}" aria-pressed="${NC.t == ty}" onclick="cty('${ty}')">${lb}</button>`,
    /* Art: wählbar nur beim Anlegen aus den Einstellungen; aus der Buchung heraus und beim Bearbeiten nur Anzeige */
    art = lock
      ? `<div class=fld><span class=fl>${t('cty')}</span><div class=ro>${t(NC.t)}</div><small class=hint>${t(NC.from == 2 ? 'cty_lockr' : NC.from ? 'cty_lock' : 'h_' + NC.t)}</small></div>`
      : `<div class=fld><span class=fl>${t('cty')}</span><div class="tp typ ctp" role=group aria-label="${t('cty')}">${tb('e', t('e'))}${tb('i', t('i'))}</div><small class=hint id=cth>${t('h_' + NC.t)}</small></div>`,
    nm = `<div class=fld><label class=fl for=nn>${t('cat_nm')}</label><input class="form-control" id=nn value="${esc(NC.n)}" autocomplete=off maxlength=30 enterkeyhint=done oninput="txc(this);NC.n=this.value;this.style.borderColor='';$('#en').hidden=true" onkeydown="if(event.key=='Enter'&&!$('#o .sb').disabled)${save}"><div class="em invalid-feedback" id=en hidden role=alert>${t('e_name')}</div></div>`,
    sy = `<div class=fld><span class=fl>${t('sym')}</span><button type=button class=sel id=cpi aria-haspopup=dialog onclick="ipk()"><span class=ckv><span class=cvp id=cpg>${ci(NC)}</span>${t('sym_chg')}</span></button></div>`;
  sheet(
    `${hdc(t(ed ? 'ced' : 'cat_new'))}${art}${nm}${sy}${ed && !NC.nodel ? acts2(`dc('${NC.id}')`, NC.dh) : ''}${svb(save, 'ncx()', '', 'n')}`,
    'fs fsk',
    'n',
  );
  const s = $('#o .sh');
  s.dataset.t = NC.t;
  s.scrollTop = 0;
}
/* Symbol-Auswahl: eigene Vollbild-Ansicht über der Maske. Ein Tipp wählt und führt zurück (ipx = zurück ohne Änderung) */
function ipk() {
  const n = $('#nn');
  if (n) NC.n = n.value;
  NC.tab = cin(NC) ? 's' : 'e';
  NC.q = '';
  const tab = (k, lb) =>
    `<button type=button data-k="${k}" class="${NC.tab == k ? 'on' : ''}" aria-pressed="${NC.tab == k}" onclick="ipt('${k}')">${lb}</button>`;
  sheet(
    `${hdc(t('ico'), 'ipx()')}<div class="tp typ ipt" role=group aria-label="${t('ico')}">${tab('s', t('sym_tab_i'))}${tab('e', t('sym_tab_e'))}</div><div id=ipb>${ipb()}</div>`,
    'fs',
    'n',
  );
  const s = $('#o .sh');
  s.dataset.t = NC.t;
  s.scrollTop = 0;
}
/* Inhalt unter den Reitern */
const ipb = () =>
  NC.tab == 's'
    ? `<input class="form-control" id=isi type=search placeholder="${t('search')}" aria-label="${t('search')}" value="${esc(NC.q)}" oninput="txc(this);NC.q=this.value;ipf()" maxlength=60 autocomplete=off enterkeyhint=search><div class=ig id=ig>${igrid()}</div>`
    : `<label class=fl for=ni style="margin-top:18px">${t('ico2')}</label><div class=ie><input class="form-control" id=ni maxlength=12 oninput="txc(this)" autocomplete=off enterkeyhint=done onkeydown="if(event.key=='Enter')ipe()"><button type=button class=dqb onclick="ipe()">${t('sym_use')}</button></div><div class=ig>${ICONS.map((e) => `<button type=button class="ib${!cin(NC) && NC.i == e ? ' on' : ''}" aria-pressed="${!cin(NC) && NC.i == e}" onclick="ipc('${e}')">${e}</button>`).join('')}</div>`;
/* Raster der Bootstrap-Icons, gefiltert nach Suchbegriff (Name, deutsche und englische Stichwörter) */
function igrid() {
  const q = (NC.q || '').trim().toLowerCase(),
    cur = cin(NC),
    ns = Object.keys(CATI).filter((n) => !q || n.includes(q) || CATL[n].join(' ').includes(q));
  return ns.length
    ? ns
        .map(
          (n) =>
            `<button type=button class="ib${cur == n ? ' on' : ''}" aria-pressed="${cur == n}" aria-label="${esc(CATL[n][S.set.lang == 'en' ? 1 : 0].split(' ')[0])}" onclick="ipc('${n}')">${svgi(n)}</button>`,
        )
        .join('')
    : `<div class=nr><small>${t('sym_none')}</small></div>`;
}
function ipf() {
  const g = $('#ig');
  if (g) g.innerHTML = igrid();
}
/* Reiter wechseln */
function ipt(k) {
  NC.tab = k;
  document.querySelectorAll('.ipt button').forEach((b) => {
    const on = b.dataset.k == k;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
  $('#ipb').innerHTML = ipb();
}
/* Bootstrap-Icon gewählt */
function ipc(v) {
  NC.i = CATI[v] ? 'bi:' + v : v;
  ncm();
}
/* Eigenes Emoji übernehmen */
function ipe() {
  const g = gr($('#ni').value);
  if (!g) return $('#ni').focus();
  NC.i = g;
  ncm();
}
/* Zurück zur Maske ohne Änderung des Symbols */
const ipx = () => ncm();
function cty(ty) {
  NC.t = ty;
  document.querySelectorAll('.ctp button').forEach((b) => {
    const on = b.dataset.t == ty;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
  const h = $('#cth');
  if (h) h.textContent = t('h_' + ty);
  const s = $('#o .sh');
  if (s) s.dataset.t = ty;
}
function ncs(entry) {
  /* entry: 1 = aus der Buchung, 2 = aus der wiederkehrenden Buchung (1.42.0), sonst aus den Einstellungen */
  NC = {
    t: entry == 2 ? RE.t : entry && X.t == 'i' ? 'i' : 'e',
    n: entry == 2 ? (RE.q || '').trim() : entry ? (X.q || '').trim() : '',
    i: 'bi:tag',
    from: entry || 0,
  };
  SN.n = CUR.n();
  ncm();
  $('#nn').focus({ preventScroll: true });
}
/* Zurück: zur Buchung bzw. Maske schließen */
const ncx = () => (NC.from == 2 ? rback() : NC.from ? op() : cl());
/* 1.35.1: Fehlermeldung ganz sichtbar machen: über der festen Knopfzeile (.stkb) halten. Der Abstand wird aus deren Höhe berechnet.
   Zweiter Aufruf nach 380 ms, weil das Fokus-Zentrieren des Eingabefelds (focusin, 320 ms) sonst wieder verschiebt. */
function evis(e) {
  const f = () => {
    const b = $('#o .stkb');
    e.style.scrollMarginBottom = (b ? b.offsetHeight + 12 : 12) + 'px';
    try {
      e.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } catch (x) {}
  };
  f();
  setTimeout(f, 380);
}
/* 1.33.0: Fehler direkt am Namensfeld zeigen (leer oder doppelt) */
function cerr(k) {
  $('#nn').style.borderColor = 'var(--rust)';
  const e = $('#en');
  e.textContent = t(k);
  e.hidden = false;
  $('#nn').focus({ preventScroll: true });
  evis(e);
}
/* 1.33.0: Name in derselben Art schon vergeben? Groß-/Kleinschreibung und Randleerzeichen egal; die Kategorie selbst (id) zählt nicht */
const cdup = (n, ty, id) => {
  const k = (v) => String(v).trim().toLowerCase();
  return S.cats.some((c) => c.t == ty && c.id != id && k(t(c.n)) == k(n));
};
function ac() {
  const n = $('#nn').value.trim();
  if (!n) return cerr('e_name');
  if (cdup(n, NC.t)) return cerr('e_catdup');
  const c = { id: uid(), t: NC.t, n, i: NC.i };
  S.cats.push(c);
  P();
  if (NC.from == 2) {
    RE.q = '';
    RE.c = c.id;
    return rback();
  }
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
  const n = S.tx.filter((x) => x.c == id).length,
    nodel = id.startsWith('sonst');
  NC = {
    id,
    t: c.t,
    n: t(c.n),
    i: c.i,
    from: 0,
    nodel,
    dh: nodel ? '' : t(n == 0 ? 'cdh0' : n == 1 ? 'cdh1' : 'cdh').replace('{n}', n),
  };
  SN.n = CUR.n();
  ncm();
}
function ecv() {
  const c = S.cats.find((x) => x.id == NC.id),
    n = $('#nn').value.trim();
  if (!n) return cerr('e_name');
  /* 1.33.0: nur prüfen, wenn der Name geändert wurde (bestehende Dubletten bleiben bearbeitbar) */
  if (n != t(c.n) && cdup(n, c.t, c.id)) return cerr('e_catdup');
  if (n != t(c.n)) c.n = n;
  c.i = NC.i;
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
/* 1.21.24: Zeitstempel für Dateinamen (JJJJ-MM-TT_hh-mm, ohne Doppelpunkt) */
const stamp = () => {
  const n = new Date();
  return iso(n) + '_' + pad(n.getHours()) + '-' + pad(n.getMinutes());
};
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
    f = new File([txt], 'moneyapp-' + stamp() + (j ? '.json' : '.csv'), {
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
    delete S.set.bs;
    P();
  }
  toast(t(j ? 'bkok' : 'csvok').replace('{n}', f.name));
}
/* 1.22.0: „Später“ auf der Backup-Karte blendet sie 1 Tag aus */
function bkl() {
  S.set.bs = Date.now() + 864e5;
  P();
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
        `${hd(t('imd'))}<p class=cdm>${t('imdt')}</p>${acts('cl()', 'ip()', t('rpl'))}`,
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
function ip() {
  const d = X.imp;
  S = { ...blank(), ...d, set: { ...blank().set, ...d.set } };
  /* 1.22.0: wiederhergestellte Daten sind in genau dieser Datei gesichert: Zähler der Backup-Erinnerung neu starten */
  S.set.lb = Date.now();
  delete S.set.bs;
  trTo();
  S.ob = 1; /* wer ein Backup einspielt, braucht den Willkommensdialog nicht */
  cl();
  P();
  setTimeout(negHint, 400);
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
    `${hd(t('pinset'), 'cl()')}<small class=hint>${t('pinrule')}</small><div class=fld><label class=fl for=pn1>${t('pin1')}</label><input id=pn1 class="form-control pin" type=password inputmode=numeric maxlength=6 autocomplete=off oninput="dgc(this);$('#pne').hidden=true"></div><div class=fld><label class=fl for=pn2>${t('pin2')}</label><input id=pn2 class="form-control pin" type=password inputmode=numeric maxlength=6 autocomplete=off onkeydown="if(event.key=='Enter'&&!$('#o .sb').disabled)pns()" oninput="dgc(this);$('#pne').hidden=true"><div class="em invalid-feedback" id=pne hidden role=alert></div></div>${svb('pns()', 'cl()', '', 'p')}`,
    '',
    'p',
  );
  SN.p = CUR.p();
  $('#pn1').focus({ preventScroll: true });
}
function pns() {
  const a = $('#pn1').value,
    b = $('#pn2').value,
    m = !/^\d{4,6}$/.test(a) ? t('e_pin') : a != b ? t('e_pin2') : '';
  if (m) {
    const e = $('#pne');
    wm(e, m);
    e.hidden = false;
    evis(e);
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
  o.innerHTML = `<div class="card card-body" style="width:280px;text-align:center"><h2>${AV('lock')} ${t('pi')}</h2><input class="form-control pin" type=password inputmode=numeric maxlength=6 aria-label="${t('pi')}"><small></small></div>`;
  document.body.append(o);
  const i = o.querySelector('input');
  i.focus();
  i.oninput = () => {
    dgc(i);
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
  const kb = v.height < KB0 - 120;
  document.body.classList.toggle('kb', kb);
  document.body.classList.toggle('kbs', kb && v.height < 400); /* 1.62.1: sehr wenig Platz (Handy quer, große Tastatur): Titelleiste scrollt mit */
  const o = $('#o');
  if (o) {
    o.style.bottom = 'auto';
    o.style.top = v.offsetTop + 'px';
    o.style.height = v.height + 'px';
    sfitLater(); /* 1.62.1: sichtbarer Bereich hat sich geändert: Feld mit Fokus wieder in den freien Bereich holen */
  }
}
/* 1.62.1: Feld mit Fokus in einer Maske immer im freien Bereich halten (zwischen fester Titelleiste und fester Knopfzeile).
   Ersetzt das feste Warten (320 ms) mit scrollIntoView: Die Tastatur braucht je nach Gerät länger, und scrollIntoView kennt
   die feste Knopfzeile nicht. Aufruf bei Fokus (mehrfach, solange die Tastatur einfährt) und bei jeder Änderung des sichtbaren Bereichs. */
function sfit(el) {
  const sh = el && el.closest ? el.closest('#o .sh') : null;
  if (!sh) return false;
  const sr = sh.getBoundingClientRect(),
    hd = sh.querySelector('.sht'),
    bar = sh.querySelector('.stkb'),
    tl = Math.max(sr.top, hd ? hd.getBoundingClientRect().bottom : sr.top) + 8,
    bl = Math.min(sr.bottom, bar ? bar.getBoundingClientRect().top : sr.bottom) - 8;
  let r = (el.closest('.fld') || el).getBoundingClientRect();
  if (r.height > bl - tl) r = el.getBoundingClientRect(); /* Feld samt Beschriftung zu hoch: nur das Feld */
  let d = 0;
  if (el.id == 'csi') d = r.top - tl; /* Suchfeld der Kategorie-Auswahl: oben, damit die Treffer über der Tastatur stehen */
  else if (r.bottom - r.top > bl - tl) d = r.top - tl; /* auch das Feld allein passt nicht (Handy quer): Feldanfang oben */
  else if (r.top < tl || r.bottom > bl) d = (r.top + r.bottom) / 2 - (tl + bl) / 2;
  if (Math.abs(d) > 1) sh.scrollTop += d;
  return true;
}
let SFT = 0;
function sfitLater() {
  const a = document.activeElement;
  if (!a || !/^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) return;
  cancelAnimationFrame(SFT);
  SFT = requestAnimationFrame(() => sfit(document.activeElement));
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
  /* 1.44.0: Suchfeld der Karte „Buchungen“ (#fq): Feld oben unter die Kopfleiste (scroll-margin im CSS), damit Kategorie, Ergebniszeile und
     erste Treffer über der Tastatur stehen. Die Klasse fqf schafft Platz unten, damit das Scrollen auch bei wenigen Treffern bis oben reicht. */
  if (el.id == 'fq' || el.id == 'cq' || el.id == 'hq') document.body.classList.add('fqf'); /* 1.64.0: auch das Suchfeld der Karte „Kategorien“ (#cq); 1.65.0: und das Suchfeld der Startseite (#hq) */
  /* 1.74.0: das Suchfeld der Startseite (#hq) steht seit 1.73.0 fest oben und ist immer sichtbar; kein Hochscrollen des Feldes mehr (es würde die Suche nach oben scrollen überstimmen) */
  if (el.id == 'hq') return;
  /* 1.62.1: in Masken (#o .sh) mit sfit(): sofort und noch dreimal, solange die Tastatur einfährt (nur wenn das Feld den Fokus behält) */
  if (el.closest('#o .sh')) {
    sfit(el);
    [120, 320, 650].forEach((ms) => setTimeout(() => document.activeElement == el && sfit(el), ms));
    return;
  }
  setTimeout(() => {
    try {
      el.scrollIntoView({ block: el.id == 'csi' || el.id == 'fq' || el.id == 'cq' || el.id == 'hq' ? 'start' : 'center', behavior: 'smooth' });
    } catch (x) {}
  }, 320);
});
addEventListener('focusout', (e) => {
  /* 1.73.0: Verlassen des Suchfelds der Startseite merkt den Begriff (Tipp auf ✕ oder Vorschlag im Feldbereich zählt nicht als Verlassen) */
  if (e.target && e.target.id == 'hq' && Date.now() - (window.hqSkip || 0) > 500) hqrem();
  if (!e.target || (e.target.id != 'fq' && e.target.id != 'cq' && e.target.id != 'hq')) return;
  setTimeout(() => {
    const a = document.activeElement;
    if (!a || (a.id != 'fq' && a.id != 'cq' && a.id != 'hq')) document.body.classList.remove('fqf');
  }, 300);
});
/* 1.65.0: Tipp neben das Suchfeld der Startseite schließt die Tastatur; die Treffer bleiben stehen. Tipps auf das Feld, das ✕ und die Liste „Zuletzt gesucht“ (alles in .hqw) zählen nicht. */
document.addEventListener(
  'pointerdown',
  (e) => {
    const a = document.activeElement;
    if (a && a.id == 'hq' && e.target.closest && e.target.closest('.hqw')) window.hqSkip = Date.now();
    if (a && a.id == 'hq' && !(e.target.closest && e.target.closest('.hqw'))) a.blur();
  },
  true,
);
/* 1.22.0: Kommt die App nach Tagen wieder in den Vordergrund, kann die Backup-Karte fällig sein: Startseite neu zeichnen, aber nur bei Änderung und nie bei offenem Dialog */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && S && S.set && tab == 'home' && !$('#o') && brShow() != BKS) rd();
});
/* 1.62.0: Datum aktuell halten. Wechselt der Tag bei offener oder im Hintergrund liegender App (Mitternacht, Handy-Uhr geändert), werden D und der Monat nachgezogen und die Ansicht neu gezeichnet. Nie bei offenem Dialog und nie, solange ein Eingabefeld den Fokus hat (nichts Eingegebenes geht verloren); dann prüft der nächste Durchlauf erneut. Wer auf einen anderen Monat geblättert hat, bleibt dort. */
function tick() {
  if (!S || !S.set) return;
  const n = new Date(),
    ti = iso(n);
  if (ti == TD) return;
  const a = document.activeElement;
  if ($('#o') || (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
  const cur = ym == TD.slice(0, 7);
  D = n;
  TD = ti;
  if (cur) ym = ti.slice(0, 7);
  /* Einstellungen enthalten Eingabefelder: dort nur neu zeichnen, wenn die Auswertung offen ist */
  if (tab != 'set' || SE.o == 'stats') rd();
}
document.addEventListener('visibilitychange', () => !document.hidden && tick());
addEventListener('pageshow', tick);
addEventListener('focus', tick);
setInterval(tick, 60000);
/* 1.21.23: Live-Prüfung eines Kontofelds beim Tippen (p = 'st' Einstellungen, 'ob' Onboarding) */
function kLive(p, k) {
  const i = $('#' + p + '_' + k),
    m = $('#' + p + '_e_' + k);
  if (!i || !m) return;
  amc(i, true); /* 1.37.0: Filter auch hier (Konten: Minus erlaubt) */
  const s = i.value.trim(),
    v = s ? num(s) : 0,
    bad = v != null && HK.includes(k) && blk(v, bal(k));
  i.style.borderColor = bad ? 'var(--rust)' : '';
  m.hidden = !bad;
  wm(m, bad ? t('e_neg0').replace('{k}', t('a_' + k)) : '');
  if (p == 'st') kSt(k);
}
/* 1.37.0: Zustand des Speichern-Knopfs je Konto (Skill 5b): idle, dirty, bad, done */
const KD = {};
function kSt(k) {
  const i = $('#st_' + k),
    b = $('#st_b_' + k),
    h = $('#st_h_' + k);
  if (!i || !b) return;
  clearTimeout(KD[k]);
  const s = i.value.trim(),
    inc = s != '' && !typed(s),
    v = s ? num(s) : 0,
    o = Number(i.dataset.o || 0),
    sv = b.dataset.sv == '1',
    bad = inc || (s != '' && v == null) || (v != null && HK.includes(k) && blk(v, bal(k))),
    dirty = v != null && (Math.round(v * 100) != Math.round(o * 100) || (!sv && s != '')),
    st = bad ? 'bad' : dirty ? 'dirty' : 'idle';
  const sd = st == 'idle' && sv; /* gespeicherter, unveränderter Wert: grauer Haken „Gespeichert“; sonst Diskette */
  sbs(b, st, sd ? t('sav') : t('save'), sd ? 'check' : 'floppy');
  if (h) h.hidden = st != 'dirty';
}
/* Nach dem Speichern: etwa 2 Sekunden grün „✓ Gespeichert“, dann zurück zu idle */
function kDone(k) {
  const b = $('#st_b_' + k),
    h = $('#st_h_' + k);
  if (!b) return;
  clearTimeout(KD[k]);
  sbs(b, 'done', t('sav'));
  if (h) h.hidden = true;
  KD[k] = setTimeout(() => kSt(k), 2000);
}
/* Konten-Bereich in den Einstellungen: leere Felder zählen als 0, ungültige Eingaben werden markiert.
   1.36.0: Jedes Konto hat seinen eigenen Speichern-Knopf neben dem Feld und speichert nur dieses Konto (k = 'bank' | 'bar' | 'spar').
   Noch nicht gespeicherte Eingaben in den anderen Feldern bleiben nach dem Neuzeichnen erhalten. Prüfungen unverändert. */
function ktoSave(k) {
  const e = $('#st_' + k),
    m = $('#st_e_' + k),
    s = e ? e.value.trim() : '',
    v = s ? num(s) : 0;
  if (v == null) {
    if (e) e.style.borderColor = 'var(--rust)';
    return toast(t('e_num'));
  }
  /* 1.21.22: Bar/Gespart nicht negativ (ein unverändert gelassener Altbestand im Minus bleibt zulässig) */
  if (HK.includes(k) && blk(v, bal(k))) {
    if (e) e.style.borderColor = 'var(--rust)';
    if (m) {
      wm(m, t('e_neg0').replace('{k}', t('a_' + k)));
      m.hidden = false;
    }
    return;
  }
  const others = ['bank', 'bar', 'spar'].filter((x) => x != k),
    draft = {};
  others.forEach((x) => {
    const o = $('#st_' + x);
    draft[x] = o ? o.value : null;
  });
  setAcc(k, v);
  P();
  others.forEach((x) => {
    const o = $('#st_' + x);
    if (o && draft[x] != null && o.value != draft[x]) {
      o.value = draft[x];
      kLive('st', x);
    }
  });
  kDone(k);
}
/* Erster Start (nur solange S.ob == 0): Schritt 1 Willkommen, Schritt 2 Kontostände. Beide Schritte lassen sich nicht wegtippen. */
function ob() {
  X = { nc: 1 };
  sheet(
    `<h2>${t('hi')}</h2><p style="margin:.2rem 0 0;color:var(--m)">${t('wl')}</p><ul class=wl><li><i>${AV('edit')}</i><span>${t('w1')}</span></li><li><i>${AV('bank')}</i><span>${t('w2')}</span></li><li><i>${AV('stats')}</i><span>${t('w3')}</span></li><li><i>${AV('off')}</i><span>${t('w4')}</span></li></ul><div class=pv><b>${AV('shield')} ${t('wpt')}</b><br><span>${t('wp')}</span></div><div class=cta style="margin-top:14px"><button class="btn btn-primary w-100" onclick="od()">${t('onx')}</button></div>`,
  );
}
/* 1.55.0: Willkommen-Fenster ist der einzige Onboarding-Schritt; Kontostände trägt man auf der Startseite ein (Kacheln antippen) */
function od() {
  S.ob = 1;
  X = {};
  cl();
  P();
}
/* 1.55.0: keine eigenen Installations-Hinweise in der App. 1.69.0: der Listener `beforeinstallprompt` ist entfernt, das Browser-eigene Installationsangebot (z. B. Mini-Leiste in Chrome auf Android) wird nicht mehr unterdrückt. */
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
  /* 1.22.0: Zählbeginn der Backup-Erinnerung für alle ohne Backup (einmalig, wird gleich gespeichert) */
  if (!S.set.lb && !S.set.b0) {
    S.set.b0 = Date.now();
    dbPut();
  }
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
