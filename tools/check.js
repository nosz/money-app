#!/usr/bin/env node
/* MoneyApp – automatische Prüfung vor jeder Lieferung.
   Aufruf im Projektordner:   node tools/check.js
   Nach dem Packen zusätzlich: node tools/check.js ../money_app_1_63_0.zip
   Keine Abhängigkeiten, nur Node. Rückgabewert 0 = alles in Ordnung, 1 = mindestens ein Fehler.
   Geprüft wird nur, was sich zuverlässig prüfen lässt. Die Punkte, die Augen oder ein Gerät brauchen
   (Optik, Tastatur, Handy), stehen weiter in der Prüfliste von money_app_skill.md. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const has = (f) => fs.existsSync(path.join(root, f));
let errors = 0,
  warns = 0;
const ok = (m) => console.log('  ok      ' + m);
const bad = (m) => (errors++, console.log('  FEHLER  ' + m));
const warn = (m) => (warns++, console.log('  Hinweis ' + m));
const head = (m) => console.log('\n' + m);

/* 1. Version: APP_VERSION = CACHE_VERSION = „Stand“ in NAECHSTE_SCHRITTE.md */
head('1. Version');
const av = (rd('js/core.js').match(/APP_VERSION\s*=\s*'([^']+)'/) || [])[1];
const cv = (rd('service-worker.js').match(/CACHE_VERSION\s*=\s*'([^']+)'/) || [])[1];
const ns = (has('NAECHSTE_SCHRITTE.md') && rd('NAECHSTE_SCHRITTE.md').match(/\(Stand ([\d.]+)\)/)) || [];
if (!av || !cv) bad('APP_VERSION oder CACHE_VERSION nicht gefunden');
else if (av !== cv) bad(`APP_VERSION ${av} und CACHE_VERSION ${cv} sind verschieden`);
else ok(`APP_VERSION und CACHE_VERSION sind ${av}`);
if (ns[1] && ns[1] !== av) bad(`NAECHSTE_SCHRITTE.md nennt Stand ${ns[1]}, die App ist ${av}`);
else if (ns[1]) ok('NAECHSTE_SCHRITTE.md nennt denselben Stand');
else bad('NAECHSTE_SCHRITTE.md: Überschrift „(Stand x.y.z)“ fehlt');

/* 2. Pflichtdateien im Projekt */
head('2. Pflichtdateien');
['index.html', 'README.md', '.gitignore', 'NAECHSTE_SCHRITTE.md', 'money_app_skill.md', 'money_app_referenz.md', 'tools/check.js', 'manifest.json'].forEach(
  (f) => (has(f) ? ok(f) : bad(f + ' fehlt')),
);
if (has('.gitignore') && !/^\*\.zip\s*$/m.test(rd('.gitignore'))) bad('.gitignore enthält „*.zip“ nicht');

/* 3. JavaScript: Syntax jeder Datei */
head('3. JavaScript-Syntax');
const jsFiles = fs.readdirSync(path.join(root, 'js')).filter((f) => f.endsWith('.js'));
jsFiles.forEach((f) => {
  try {
    new vm.Script(rd('js/' + f), { filename: f });
    ok('js/' + f);
  } catch (e) {
    bad(`js/${f}: ${e.message}`);
  }
});

/* 4. Texte: jeder Eintrag hat Deutsch und Englisch, keine doppelten Schlüssel, alle benutzten Schlüssel vorhanden */
head('4. Texte (Deutsch und Englisch)');
let T = null;
try {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(rd('js/i18n.js') + '\nthis.__T = T;', ctx);
  T = ctx.__T;
} catch (e) {
  bad('js/i18n.js lässt sich nicht lesen: ' + e.message);
}
if (T) {
  const keys = Object.keys(T);
  const raw = rd('js/i18n.js');
  const seen = {},
    dups = [];
  for (const m of raw.matchAll(/^\s{2}([A-Za-z0-9_$]+):\s*\[/gm)) (seen[m[1]] = (seen[m[1]] || 0) + 1) == 2 && dups.push(m[1]);
  dups.length ? bad('doppelte Textschlüssel: ' + dups.join(', ')) : ok(`${keys.length} Textschlüssel, keine doppelten`);
  const incomplete = keys.filter((k) => !Array.isArray(T[k]) || T[k].length !== 2 || T[k].some((s) => typeof s !== 'string' || !s.trim()));
  incomplete.length ? bad('Deutsch oder Englisch fehlt bei: ' + incomplete.join(', ')) : ok('jeder Text hat Deutsch und Englisch');
  const same = keys.filter((k) => Array.isArray(T[k]) && T[k][0] === T[k][1] && /[a-zäöüß]{4,}/i.test(T[k][0]));
  if (same.length) warn('Deutsch und Englisch gleich (Absicht?): ' + same.slice(0, 12).join(', ') + (same.length > 12 ? ' …' : ''));
  const used = new Set();
  jsFiles
    .filter((f) => f !== 'i18n.js')
    .forEach((f) => {
      for (const m of rd('js/' + f).matchAll(/\bt\(\s*'([A-Za-z0-9_]+)'\s*\)/g)) used.add(m[1]);
    });
  const missing = [...used].filter((k) => !(k in T));
  missing.length ? bad('benutzte Textschlüssel ohne Eintrag: ' + missing.join(', ')) : ok(`${used.size} im Code benutzte Textschlüssel sind alle vorhanden`);
}

/* 5. Service Worker: jede Datei in ASSETS gibt es, alle App-Dateien stehen in ASSETS */
head('5. Service Worker (Offline-Cache)');
const sw = rd('service-worker.js');
const assets = [...((sw.match(/ASSETS\s*=\s*\[([\s\S]*?)\]/) || [])[1] || '').matchAll(/'([^']+)'/g)].map((m) => m[1].replace(/^\.\//, ''));
if (!assets.length) bad('ASSETS nicht gefunden');
else {
  const gone = assets.filter((a) => a && !has(a));
  gone.length ? bad('in ASSETS, aber nicht im Projekt: ' + gone.join(', ')) : ok(`${assets.length} Einträge in ASSETS, alle vorhanden`);
  const must = ['index.html', 'manifest.json', ...jsFiles.map((f) => 'js/' + f), ...fs.readdirSync(path.join(root, 'css')).map((f) => 'css/' + f), ...fs.readdirSync(root).filter((f) => /^(icon|apple-touch).*\.png$/.test(f))];
  const nocache = must.filter((f) => !assets.includes(f));
  nocache.length ? bad('Datei fehlt in ASSETS (offline nicht verfügbar): ' + nocache.join(', ')) : ok('alle js-, css-, Symbol- und Startdateien stehen in ASSETS');
}

/* 6. Manifest: Symbole getrennt nach any und maskable, Dateien vorhanden */
head('6. Manifest');
try {
  const mf = JSON.parse(rd('manifest.json'));
  const icons = mf.icons || [];
  icons.some((i) => /any\s+maskable|maskable\s+any/.test(i.purpose || '')) ? bad('Symbol mit „any maskable“ in einem Eintrag (getrennt halten)') : ok('any und maskable getrennt');
  const noFile = icons.filter((i) => !has(i.src.replace(/^\.\//, '')));
  noFile.length ? bad('Symbol-Datei fehlt: ' + noFile.map((i) => i.src).join(', ')) : ok(`${icons.length} Symbole vorhanden`);
} catch (e) {
  bad('manifest.json: ' + e.message);
}

/* 7. Eingabefelder: jedes Betragsfeld läuft über amc() (Skill 5a), direkt oder über eine Hilfsfunktion, die amc() aufruft */
head('7. Eingabefelder');
const appSrc = rd('js/app.js'),
  allSrc = appSrc + rd('js/render.js');
const viaAmc = new Set(['amc']);
for (const m of appSrc.matchAll(/\nfunction ([A-Za-z0-9_$]+)\([^)]*\)\s*\{([\s\S]*?)(?=\nfunction |\nconst |\nlet )/g)) if (/\bamc\(/.test(m[2])) viaAmc.add(m[1]);
const amtInputs = [...allSrc.matchAll(/<input[^>]*inputmode=decimal[^>]*>/g)].map((m) => m[0]);
const noFilter = amtInputs.filter((s) => ![...viaAmc].some((fn) => new RegExp('\\b' + fn + '\\(').test((s.match(/oninput="([^"]*)"|oninput=\\"([^"]*?)\\"/) || [])[0] || '')));
noFilter.length
  ? bad(`Betragsfeld(er) ohne Filter im oninput: ${noFilter.map((s) => (s.match(/id=\\?"?([\w$]+)/) || [])[1] || '?').join(', ')}`)
  : ok(`${amtInputs.length} Betragsfelder, alle mit Filter (amc direkt oder über ${[...viaAmc].filter((f) => f !== 'amc').join(', ')})`);

/* 7b. Masken und Tastatur (Skill 5c): jedes Feld mit Fokus wird zentral in den freien Bereich geholt, nicht pro Maske einzeln */
head('7b. Masken und Tastatur');
const css = rd('css/style.css');
/\bfunction sfit\(/.test(appSrc) && /\bsfit\(el\)/.test(appSrc.split("addEventListener('focusin'")[1] || '') ? ok('sfit() in js/app.js, vom Fokus-Handler benutzt') : bad('sfit() fehlt oder der Fokus-Handler ruft es nicht auf (Skill 5c)');
/sfitLater\(\)/.test((appSrc.split('function vvf()')[1] || '').split('\nfunction sfit(')[0]) ? ok('vvf() zieht das Feld bei Änderung des sichtbaren Bereichs nach') : bad('vvf() ruft sfitLater() nicht auf (Skill 5c)');
/\.kbs \.ov \.sh \.sht\s*\{[^}]*position:\s*static/.test(css) && /\.kb \.ov \.sh \.stkb/.test(css) ? ok('CSS für geöffnete Tastatur (.kb, .kbs) vorhanden') : bad('CSS für .kb/.kbs fehlt (Skill 5c)');
/\n\s*(?:const|let)?\s*el\.scrollIntoView|scrollIntoView\(\{ block: 'center'/.test((appSrc.split("addEventListener('focusin'")[1] || '').split("addEventListener('focusout'")[0].split("el.closest('#o .sh')")[0]) ? bad('Fokus-Handler zentriert Felder in Masken wieder per scrollIntoView (Skill 5c)') : ok('kein scrollIntoView-Zentrieren vor der Masken-Behandlung');

/* 8. ZIP (nur mit Pfad als Argument): enthält alles Wichtige, keine Test- und Zwischendateien */
const zip = process.argv[2];
if (zip) {
  head('8. ZIP ' + path.basename(zip));
  try {
    const list = execFileSync('unzip', ['-Z1', path.resolve(zip)], { encoding: 'utf8' }).split('\n').filter(Boolean);
    ['index.html', 'NAECHSTE_SCHRITTE.md', 'money_app_skill.md', 'money_app_referenz.md', 'README.md', '.gitignore', 'tools/check.js', 'service-worker.js'].forEach((f) =>
      list.includes(f) ? ok(f + ' im ZIP') : bad(f + ' fehlt im ZIP'),
    );
    const junk = list.filter((f) => /\.(zip|pyc|log)$|node_modules|\.DS_Store|Thumbs\.db/.test(f));
    junk.length ? bad('Zwischendateien im ZIP: ' + junk.join(', ')) : ok('keine Zwischendateien im ZIP');
    const zn = path.basename(zip).match(/money_app_(\d+)_(\d+)_(\d+)\.zip/);
    if (!zn) warn('ZIP-Name nicht nach dem Muster money_app_x_y_z.zip');
    else if (zn.slice(1).join('.') !== av) bad(`ZIP-Name nennt ${zn.slice(1).join('.')}, die App ist ${av}`);
    else ok('ZIP-Name passt zur Version');
  } catch (e) {
    bad('ZIP lässt sich nicht lesen (unzip nötig): ' + e.message.split('\n')[0]);
  }
}

console.log(`\n${errors ? 'FEHLGESCHLAGEN' : 'BESTANDEN'}: ${errors} Fehler, ${warns} Hinweis(e)`);
process.exit(errors ? 1 : 0);
