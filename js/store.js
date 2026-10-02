/* MoneyApp – Speicher (IndexedDB), Datum/Wiederholungen, Summen */
/* Speicher: IndexedDB */
const DB = () =>
  new Promise((r, j) => {
    const q = indexedDB.open('moneyapp', 1);
    q.onupgradeneeded = () => q.result.createObjectStore('k');
    q.onsuccess = () => r(q.result);
    q.onerror = j;
  });
const dbGet = async () => {
  const d = await DB();
  return new Promise((r) => {
    const q = d.transaction('k').objectStore('k').get('s');
    q.onsuccess = () => r(q.result);
    q.onerror = () => r();
  });
};
const dbPut = async () => {
  const d = await DB();
  d.transaction('k', 'readwrite')
    .objectStore('k')
    .put(JSON.parse(JSON.stringify(S)), 's');
};
function P() {
  dbPut();
  try {
    localStorage.setItem('ma_ui', JSON.stringify({ theme: S.set.theme, font: S.set.font }));
  } catch (e) {}
  ap();
  rd();
}
const blank = () => ({
  tx: [],
  cats: DC.map(([id, ty, i]) => ({ id, t: ty, n: 'c_' + id, i })),
  rec: [],
  tr: [],
  ob: 0,
  set: { cur: 'EUR', lang: 'de', theme: 'chahell', font: 'n', sb: null },
});
/* Datum / Wiederholungen */
const dateK = (r, k) => {
  const s = new Date(r.s + 'T00:00');
  if (r.f == 'w') return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 7 * k);
  const mo = s.getMonth() + (r.f == 'y' ? 12 * k : k),
    dim = new Date(s.getFullYear(), mo + 1, 0).getDate();
  return new Date(s.getFullYear(), mo, Math.min(s.getDate(), dim));
};
const dues = () => S.rec.map((r) => ({ r, d: iso(dateK(r, r.k)) })).filter((o) => o.d <= iso(D));
const up = () => {
  let s = 0;
  S.rec.forEach((r) => {
    for (let k = r.k; k < r.k + 400; k++) {
      const d = iso(dateK(r, k)).slice(0, 7);
      if (d > ym) break;
      if (d == ym) s += r.t == 'i' ? r.a : -r.a;
    }
  });
  return s;
};
const mt = (p) => {
  let i = 0,
    e = 0;
  S.tx.forEach((x) => {
    if (x.d.startsWith(p)) x.t == 'i' ? (i += x.a) : (e += x.a);
  });
  return { i, e, b: i - e };
};
const mlab = (p) => new Date(p + '-01T00:00').toLocaleDateString(loc(), { month: 'long', year: 'numeric' });
