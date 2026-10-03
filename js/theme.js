/* MoneyApp – Themes (läuft im <head>, vor dem ersten Rendern) */
const TH = {
  chahell: ['#f7f1e4', '#ffffff', '#c98a2e', '#8a9a4f', '#c15a3f', '#3a2f22'],
  chadunk: ['#17130c', '#221b12', '#e3a93e', '#9db56a', '#d9704f', '#f2e9d8'],
  daylight: ['#f5f6f4', '#ffffff', '#4f8f8a', '#6a9c6f', '#c1614f', '#232a28'],
  ember: ['#f5f1e8', '#ffffff', '#da7756', '#7c9560', '#b8493f', '#3d3929'],
  skylight: ['#f2f5fa', '#ffffff', '#2f7fd1', '#4fae7c', '#d1544f', '#1c2733'],
  dimension: ['#0a0d12', '#151b24', '#4a9eff', '#52c785', '#d1544f', '#e9eef3'],
  phantom: ['#15130f', '#211d17', '#e0793c', '#7c9e5f', '#b3503f', '#f1ece2'],
  solidstate: ['#17121c', '#221b2b', '#b355d6', '#4fae9e', '#c9527a', '#f0e9f5'],
};
const FS = { s: 16, n: 18, l: 21 };
function ap(u) {
  try {
    u = u || JSON.parse(localStorage.getItem('ma_ui') || '{}');
  } catch (e) {
    u = {};
  }
  const c = TH[u.theme] || TH.chahell,
    s = document.documentElement.style;
  ['ink', 'surface', 'gold', 'sage', 'rust', 'text'].forEach((k, i) => s.setProperty('--' + k, c[i]));
  s.fontSize = (FS[u.font] || 18) + 'px';
  {
    const g = c[2],
      l =
        0.299 * parseInt(g.slice(1, 3), 16) +
        0.587 * parseInt(g.slice(3, 5), 16) +
        0.114 * parseInt(g.slice(5, 7), 16);
    s.setProperty('--on', l > 150 ? '#1d1a14' : '#fff');
  }
  /* 1.21.15: lesbare Textfarbe auf Rot (Ausgaben) und Grün (Einnahmen) je Theme: weiß oder dunkel, was mehr Kontrast hat */
  {
    const hx = (k) => [1, 3, 5].map((i) => parseInt(k.slice(i, i + 2), 16)),
      lm = (r) => {
        const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(r[0]) + 0.7152 * f(r[1]) + 0.0722 * f(r[2]);
      },
      pk = (bg) => ((l) => (1.05 / (l + 0.05) >= (l + 0.05) / (lm([29, 26, 20]) + 0.05) ? '#fff' : '#1d1a14'))(lm(bg)),
      tx = hx(c[5]);
    s.setProperty('--onr', pk(hx(c[4])));
    s.setProperty('--ong', pk(hx(c[3]).map((v, i) => Math.round(v * 0.7 + tx[i] * 0.3))));
  }
  const m = document.querySelector('meta[name=theme-color]');
  m && m.setAttribute('content', c[0]);
}
ap();
