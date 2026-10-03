# MoneyApp – Nächste Schritte (Stand 1.36.0)

Diese Datei ist für einen Coding-Agenten gedacht. Sie beschreibt den aktuellen Stand, die bereits getroffenen
Entscheidungen und die nächsten Schritte in fester Reihenfolge. Konzept: Skill „banking-eingabemasken“.

## 1. Aktueller Stand

**Version 1.36.0** (`APP_VERSION` in `js/core.js`, `CACHE_VERSION` in `service-worker.js`, beide gleich).

Fertig:

- **1.36.0: Speichern-Knopf pro Konto (Einstellungen → Konten).** Geändert: `js/render.js` (`kto()`), `js/app.js` (`ktoSave(k)`),
  `js/core.js` (neues Icon `check` in `BIP`, `APP_VERSION`), `css/style.css` (Abschnitt „1.36.0“), `service-worker.js` (`CACHE_VERSION`).
  Jedes Feld (`#st_bank`, `#st_bar`, `#st_spar`) steht in einer Zeile `.kr` mit einem Symbol-Knopf (Haken, `.ks`, 52 × 52 px,
  `aria-label` und `title` = `t('save')`, also Deutsch und Englisch ohne neuen Text). `ktoSave(k)` speichert nur das Konto `k`.
  Prüfungen unverändert (ungültige Zahl → Toast `e_num` und roter Rahmen; Bar/Gespart nie unter 0 → Meldung `#st_e_<k>`; Altbestand
  im Minus bleibt zulässig). Noch nicht gespeicherte Eingaben in den anderen Feldern bleiben nach dem Neuzeichnen (`P()`) erhalten.
  Der gemeinsame Speichern-Knopf unten (`.seg.stk`) ist entfernt. Willkommen-Dialog `ob2()` und Umbuchung unverändert.
  Getestet in Chromium (390 px): drei Knöpfe, Einzel-Speichern, Entwurf bleibt, ungültige Zahl, Minus-Sperre, englisches `aria-label`, keine JS-Fehler.
- **1.35.2: nur Dokumentation.** Kein Code geändert (nur `APP_VERSION`/`CACHE_VERSION`). Hinweis des Nutzers („Speichern-Knopf neben dem Eingabefeld bei Bank, Bar, Gespart“) wurde in 1.36.0 umgesetzt.
- **Korrektur 1.35.1 (Fehlermeldung ganz sichtbar):** Am Handy war die Meldung unter dem Namensfeld nur zu etwa drei Vierteln
  sichtbar, weil die feste Knopfzeile (`.stkb`, seit 1.34.0 höher) ihren unteren Rand verdeckte. Neue Hilfsfunktion `evis(e)` in
  `js/app.js` (vor `cerr()`): setzt `scroll-margin-bottom` = Höhe der Knopfzeile + 12 px und ruft `scrollIntoView({block:'nearest'})`
  auf, ein zweites Mal nach 380 ms (das Fokus-Zentrieren in `focusin` läuft nach 320 ms und würde sonst wieder verschieben).
  Eingesetzt in `cerr()` (Kategorie leer/doppelt; Fokus dort jetzt mit `preventScroll`), `cfs()` (Betrag ändern, beide Meldungen)
  und `pns()` (PIN). Die Fehleranzeigen in Buchung (`sv()`) und wiederkehrender Buchung (`rsv()`, `nrs()`) zentrieren das Element
  schon selbst (`block:'center'`) und blieben bewusst unverändert. Keine CSS-, Text- oder Datenänderung.
- **CSS-Aufräumen (1.35.0):** Nur `css/style.css` (plus Versionen). Entfernt wurden ungenutzte Regeln: `.dir`, `.dir>div`, `.dir label`,
  `.sh .dir .form-label` (alte Von/Auf-Felder), `.cn`, `.cn .form-control`, beide `.cpi`-Blöcke samt `.cpi #cpg` (es gibt nur noch
  eine `id=cpi`, keine Klasse), `.cpe`, `.cpe .bi`, `.cpp`, `.ip`, `.ip button`, `.ip button.on`, `.sh[data-t] .ip button.on`, `.sht.ns`.
  Vorher geprüft: kein Treffer als Klasse in `js/*.js`, `index.html`, `service-worker.js` (nur Funktionen `ip()`/`ns()`/`cn()`,
  Daten-Eigenschaft `.dir` in `render.js`, Wort „dir“ in Texten). Geprüft in der Testumgebung: berechnete Stile von 2117 Elementen in
  16 Ansichten (Startseite, Einstellungen, Buchung E/A/Umbuchung, Kategorie-Auswahl, Kategorie neu/aus Buchung/bearbeiten,
  Symbol-Auswahl beide Reiter, wiederkehrende Buchung neu/bearbeiten, PIN, Löschen-Rückfrage) vor und nach dem Aufräumen
  identisch (Negativkontrolle mit absichtlich gelöschter Regel zeigte Unterschiede). Funktionstests (Dublettenprüfung, Knopfzeile)
  unverändert bestanden. Keine JS-, Text- oder Datenänderung.
- **Knopfzeile „Abbrechen | Speichern“ (1.34.0):** Neue Hilfsfunktion `svb(sx, cx, lb)` in `js/app.js` (direkt vor `acts2`) baut
  die feste Knopfzeile unten in EINER Zeile: links „Abbrechen“ (`.cb`, Ghost, flex 1), rechts Hauptknopf (`.sb`, flex 2,
  mindestens 52 px hoch). „Abbrechen“ macht dasselbe wie das ✕ oben und verwirft die Eingaben. Eingesetzt in: `op()` (Buchung inkl.
  Umbuchung, `cl()`), `erd()` / `nrd()` (wiederkehrende Buchung, `cl()`), `ncm()` (Kategorie, `ncx()`, also aus der Buchung zurück
  zur Buchung), `cfa()` (Betrag ändern, `dsh()`, Hauptknopf „OK“; die frühere separate `acts('dsh()')`-Zeile entfällt),
  `pn()` (PIN setzen, `cl()`; frühere `acts('cl()')`-Zeile entfällt). CSS am Ende von `css/style.css` (Abschnitt „1.34.0“).
  Nicht geändert: Rückfragen zum Löschen (`cdel()`), Import-Dialoge (`ip()`/`im()`, dort liegt „Ersetzen“ neben dem Abbruch),
  Willkommen (`ob()`, eigene Knöpfe „Los“/„Später“), Löschen-Textlink, alle Prüfungen und das Datenformat. Keine neuen Texte
  (`cancel` vorhanden). Skill-Regel „Kein Abbrechen“ ist entfallen (Skill-Abschnitt 5 und 10 angepasst).
- **Korrektur 1.33.1:** Der Text `e_catdup` in `js/i18n.js` ist auf eine Zeile gekürzt („Diese Kategorie gibt es schon“ /
  „This category already exists“). Grund: Am Handy verdeckte die Tastatur die zweite Zeile der längeren Meldung.
  Geändert: `js/i18n.js`, `js/core.js` (nur `APP_VERSION`), `service-worker.js` (nur `CACHE_VERSION`). Logik unverändert.
  Neue Meldungen am Namensfeld bitte einzeilig halten.
- **Doppelte Kategorienamen verhindert (1.33.0):** Geändert: `js/app.js`, `js/i18n.js`, `js/core.js` (nur `APP_VERSION`),
  `service-worker.js` (nur `CACHE_VERSION`). Neue Hilfsfunktionen in `js/app.js`: `cdup(n, ty, id)` (Name in derselben Art
  schon vergeben? Vergleich ohne Groß-/Kleinschreibung und ohne Randleerzeichen, mit dem angezeigten Namen `t(c.n)`, die
  Kategorie mit der Id `id` zählt nicht) und `cerr(k)` (Fehlertext am Namensfeld, rostroter Rahmen, Fokus). `ac()` (neu)
  prüft nach der Leer-Prüfung auf Dubletten; `ecv()` (bearbeiten) prüft nur, wenn der Name geändert wurde. Neuer Text
  `e_catdup` (Deutsch und Englisch). Der Fehlertext in `#en` wird bei jedem Fehler neu gesetzt (`e_name` oder `e_catdup`).
  Backup, Import und Datenformat unverändert, bestehende Dubletten bleiben unangetastet. Keine neuen CSS-Regeln, keine neuen Dateien.
- **Kleine Dialoge (1.32.0):** nur Optik, Logik unverändert. Umfang: Rückfragen (`cdel()`, Sperrmeldungen in `dl()`,
  `ip()`, `im()`), PIN-Maske `pn()` und Sperrbild `lk()`, Backup-Karte `brCard()` in `js/core.js`. Willkommen (`ob()`, `ob2()`),
  Kontostände beim Start und Starthinweis `negHint()` bewusst unverändert. „Abbrechen“ bleibt (Entscheidung), Knöpfe,
  Rahmen und Radien wie in den großen Masken (`.sh .acts .btn.ghost` mit Rahmen, 48 px Höhe). PIN-Felder in `.fld`/`.fl` mit
  Klasse `.pin` (zentriert, Ziffernabstand). Backup-Karte: Emoji 💾 durch Bootstrap Icon `download` ersetzt (neu in `BIP`),
  „Später“ als Ghost-Knopf. CSS am Ende von `css/style.css` (Abschnitt „1.32.0“). Backup, Import, Datenformat unverändert.
- **Wiederkehrende Buchung (1.31.0):** `nrd()` (neu) und `erd()` (bearbeiten) in `js/app.js` im Banking-Look, gemeinsamer
  Aufbau über neue Hilfsfunktion `rfm(r, nw)`. Vollbild (`'fs'`) mit Titel und ✕, Beschriftungen oben (`.fld .fl`),
  Betrag mit Währungssymbol (`.amw`), Kategorie als normales Auswahlfeld (kein `cpk()`), Notiz, Wiederholen, Fälligkeit,
  Speichern fest unten (seit 1.34.0 mit „Abbrechen“ in einer Zeile). Neu: Typ-Leiste Ausgabe/Einnahme ohne Plus/Minus. Bearbeiten: Art nur als Anzeige
  (`.ro`), Löschen als Textlink (`acts2('rdl()')`) mit unveränderter Rückfrage. Die Kontostand-Leiste (`bstrip()`) oben
  in beiden Masken entfällt. Keine Konto-Leiste (Entscheidung), `nrs()`, `rsv()`, `rdl()`, `rdo()` und Datenformat unverändert.
  Keine neuen CSS-Regeln und keine neuen Texte nötig.
- **Umbuchung (1.30.0):** `DIR()` in `js/core.js` baut „Von“ und „Auf“ als zwei Konto-Leisten (Bank, Bar, Gespart)
  untereinander, mit Tauschen-Knopf (`.swr` / `.swp`, Pfeil um 90° gedreht) dazwischen. Gleiche Klassen wie `ACC()`
  (`.tp.acct`, `.al`, `.bl`), Kontostände an jedem Knopf, Knopfhöhe 56 px. Bei gleichem Konto in beiden Leisten
  bleibt alles wählbar, Meldung `same` erscheint unter „Auf“, Speichern bleibt über `msgs()` gesperrt (Prüfung unverändert).
  Nur Darstellung geändert: `op()`, `sv()`, `msgs()`, `warns()`, `bnu()` und das Datenformat sind unangetastet.
  CSS am Ende von `css/style.css` (Abschnitt „1.30.0“). Keine neuen Texte nötig (`from`, `bk_to`, `swap`, `same` vorhanden).
- Buchungsmaske `op()` im Banking-Look (seit 1.28.0), in 1.30.0 nur in der Umbuchung geändert (`DIR()`).
- **Neue Kategorie** und **Kategorie bearbeiten** im Banking-Look: `ncm()` in `js/app.js`.
  - Felder: Art, Bezeichnung, Symbol (mit Live-Vorschau). Seit 1.34.0: Knopfzeile „Abbrechen | Speichern“ fest unten (früher kein „Abbrechen“).
  - Art: nur beim Anlegen aus den Einstellungen wählbar (Typ-Leiste). Aus der Buchung heraus und beim
    Bearbeiten nur Anzeige (`.ro`) mit Hinweis.
  - Löschen beim Bearbeiten als Textlink in Rost mit Hinweiszeile (Anzahl betroffener Buchungen); nicht bei `sonst_*`.
- **Symbol-Auswahl** als eigene Vollbild-Ansicht: `ipk()`, `ipb()`, `igrid()`, `ipf()`, `ipt()`, `ipc()`, `ipe()`, `ipx()`.
  - Reiter „Symbole | Emoji“, Suche über Name sowie deutsche und englische Stichwörter (`CATL`).
  - 100 Bootstrap Icons 1.13.1, inline eingebettet in **neuer Datei `js/icons.js`** (`CATI`), im Service Worker gecacht.
- **Speicherung:** gewähltes Icon steht im bestehenden Kategorie-Feld `i` als `bi:<name>` (z. B. `bi:cart`).
  Kein neues Datenfeld. Emojis bleiben unverändert. Unbekannter Name zeigt Icon `tag`.
- **Linien-Icons für Standardkategorien** (nur Anzeige): `CATD` und `cin()` in `js/icons.js`. Gilt nur, solange die
  Kategorie noch ihr Standard-Emoji trägt. Gespeicherte Daten bleiben unverändert.
- Anzeige über `ci(c)` (HTML) und `cit(c)` (Text für `<option>`) in: Buchungsliste, Kategorie-Auswahl, Auswertung,
  Kategorieliste in den Einstellungen, Rückfrage-Karte, Auswahllisten der wiederkehrenden Buchung.
- Neue Texte in `js/i18n.js` (Deutsch und Englisch): `cat_new`, `cat_nm`, `cty_lock`, `sym`, `sym_chg`,
  `sym_tab_i`, `sym_tab_e`, `sym_none`, `sym_use`.
- CSS am Ende von `css/style.css` (Abschnitt „1.29.0“). Klasse `fsk` (nur Kategorie-Masken) hält den
  Speichern-Knopf bei kurzem Inhalt am unteren Rand. Die Buchungsmaske ist davon bewusst nicht betroffen.

Geprüft (jsdom und Chromium, 390 px breit): Anlegen aus Einstellungen und aus der Buchung, Bearbeiten,
Symbol wählen, Suche, Emoji-Reiter, leerer Name, Rückkehr in die Buchung mit erhaltenem Betrag, keine JS-Fehler.

## 2. Getroffene Entscheidungen (nicht neu entscheiden)

- Umsetzung Maske für Maske, jede in einer eigenen Version.
- Symbol-Auswahl = eigene Vollbild-Ansicht (wie die Kategorie-Auswahl), nicht aufklappbar in der Maske.
- Icons werden als `bi:<name>` im Feld `i` gespeichert. Datenformat, Backup und Import bleiben unverändert.
- Art der Kategorie ist gesperrt, wenn die Maske aus der Buchung heraus geöffnet wird.
- Lieferung immer als komplettes Projekt-ZIP plus diese Datei. Nach jeder Fragerunde wird gefragt, ob Code
  ausgeliefert werden soll.
- Symbole in Dialogen sind Bootstrap Icons, keine Emojis oder Sonderzeichen.
- Alle sichtbaren Texte in Deutsch und Englisch.
- Kleine Dialoge: nur Rückfragen, Backup und PIN; „Abbrechen“ bleibt; Willkommen, Kontostände beim Start und Starthinweis unverändert.
- Wiederkehrende Buchung: nur Optik, keine Konto-Leiste (Konto bleibt wie bisher, neu angelegte laufen über Bank), Kategorie als normales Auswahlfeld im neuen Stil, keine Vollbild-Kategorieliste.
- Umbuchung: Von/Auf als zwei Konto-Leisten untereinander (nicht nebeneinander), Reihenfolge Bank, Bar, Gespart, Tauschen-Knopf dazwischen. Gleiches Konto bleibt wählbar, Meldung wie bisher.

- Doppelte Kategorienamen: gelten nur innerhalb derselben Art (Ausgabe/Einnahme) als doppelt; Vergleich ohne Groß-/Kleinschreibung und
  ohne Randleerzeichen; Meldung am Feld, Speichern bleibt gesperrt, kein Knopf „Vorhandene verwenden“; bestehende Dubletten bleiben
  in den Daten und sind weiter bearbeitbar, solange der Name unverändert bleibt (Prüfung nur beim Speichern, nie gegen sich selbst).

- Knopfzeile (1.34.0): „Abbrechen“ links (schmal) und „Speichern“ rechts (größer) in einer Zeile, in allen Eingabe-Masken inkl. Betrag ändern
  und PIN setzen; „Abbrechen“ verwirft wie das ✕. Löschen-Rückfragen und Import-Dialoge behalten gestapelte Knöpfe (Sicherheit).
- Fehlermeldungen bleiben unter dem Feld und werden nach dem Fehler automatisch über die feste Knopfzeile gescrollt (`evis()`, Entscheidung 1.35.1); eine Meldung über dem Feld wurde verworfen.
- Fehlermeldungen in Masken sind einzeilig (Entscheidung 1.33.1), statt eine Scroll-Logik für die Tastatur einzubauen.

- Konten-Einstellungen (1.36.0): Ein Speichern-Knopf pro Konto neben dem Feld (speichert nur dieses Konto), als Symbol-Knopf mit Haken
  (mindestens 44 px, `aria-label` Deutsch/Englisch); der gemeinsame Knopf unten entfällt; der Willkommen-Dialog `ob2()` bleibt unverändert
  (dort speichert „Los“ alle Felder).

## 3. Nächste Schritte (in dieser Reihenfolge, je eine Version)

### Schritt 1 – Tastatur-Test auf echten Geräten [Punkt D]
- iOS und Android: Der Speichern-Knopf (`.stkb`) darf in allen Masken nicht von der Tastatur verdeckt werden. Neu: Auch die Haken-Knöpfe neben den Kontofeldern (Einstellungen → Konten, `.ks`) müssen bei offener Tastatur erreichbar bleiben.
- Besonders prüfen: Bezeichnung (Kategorie), Betrag und Notiz (Buchung), Suchfelder der Auswahl-Ansichten.
- Ergebnis als Rückmeldung an den Nutzer. Nur bei Mängeln eine Korrekturversion bauen.

## 4. Offene Punkte und optionales Aufräumen

- Nach Rückmeldung des Nutzers zu 1.29.0 bis 1.36.0 (Test am Handy) zuerst eventuelle Korrekturen einbauen.
- Bekannte Eigenheit: Wählt der Nutzer für eine Standardkategorie im Emoji-Reiter genau ihr Standard-Emoji,
  wird in der Anzeige weiterhin das Linien-Icon gezeigt. Falls das stört: `CATD`-Zuordnung zusätzlich an ein
  Merkmal knüpfen (z. B. nur anwenden, wenn die Kategorie nie bearbeitet wurde).
- Optionales Aufräumen: Die CSS-Regel `.stk` (Zeile mit `position:sticky;bottom:calc(76px …`) wird seit 1.36.0 nicht mehr benutzt; vor dem Löschen per Suche in `js/*.js` bestätigen.
- Bei jeder Lieferung: `APP_VERSION` und `CACHE_VERSION` gleichzeitig erhöhen, neue Dateien in `ASSETS`
  (`service-worker.js`) eintragen, ZIP nach der Version benennen (`money_app_<x_y_z>.zip`).

## 5. Prüfliste nach jeder Lieferung

- [ ] Einstellungen → Konten am Handy: Haken-Knopf neben jedem Feld sichtbar ohne Scrollen, gut treffbar, speichert nur das eigene Konto, Eingaben in anderen Feldern bleiben stehen, Meldung bei Bar/Gespart unter 0 und bei ungültiger Zahl, Texte Deutsch und Englisch?
- [ ] Fehlermeldungen am Handy mit offener Tastatur: Kategorie (Name leer, Name doppelt), Betrag ändern (0), PIN (zu kurz) – Meldung ganz sichtbar über der Knopfzeile, ohne selbst zu scrollen? Auch auf kleinen Handys und im Querformat.
- [ ] Nach dem CSS-Aufräumen (1.35.0) am Handy kurz alle Masken ansehen: Buchung, Umbuchung, Kategorie neu/bearbeiten, Symbol-Auswahl (Symbole und Emoji), wiederkehrende Buchung, PIN, Löschen-Rückfrage – sieht alles aus wie in 1.34.0?
- [ ] Knopfzeile am Handy (Buchung, Umbuchung, Kategorie neu/bearbeiten, wiederkehrende Buchung neu/bearbeiten, Betrag ändern, PIN setzen): „Abbrechen“ und „Speichern“ in einer Zeile, beide gut treffbar, Texte auf Deutsch und Englisch ohne Umbruch, Tastatur verdeckt die Zeile nicht, „Abbrechen“ schließt ohne Speichern (Kategorie aus der Buchung: zurück in die Buchung)?
- [ ] Kategorien am Handy: gleicher Name in derselben Art (auch „ESSEN “ statt „Essen“) wird mit einzeiliger Meldung abgelehnt (bei geöffneter Tastatur voll sichtbar), in der anderen Art erlaubt; Umbenennen auf vorhandenen Namen wird abgelehnt; Symbol ändern bei bestehender Dublette funktioniert?
- [ ] Alle Masken gleicher Aufbau (Titel + ✕, Beschriftungen oben, Knopfzeile „Abbrechen | Speichern“ in einer Zeile fest unten)?
- [ ] Texte in Deutsch und Englisch?
- [ ] Service Worker aktualisiert (neue Dateien, neue `CACHE_VERSION`)?
- [ ] Alte Backups weiter importierbar (Datenformat unverändert)?
- [ ] Bestehende Prüfungen unverändert (Betrag 0, gleiches Konto, Konto-Minus, Doppelbuchung)?
- [ ] Buchungsmaske unverändert, falls nicht Teil der Aufgabe?
- [ ] Wiederkehrende Buchung am Handy: neu anlegen, bearbeiten, löschen, Fehlermeldungen bei leerem Betrag, Speichern nicht von Tastatur verdeckt?
- [ ] Kleine Dialoge am Handy: Löschen-Rückfrage, PIN setzen und eingeben, Backup-Karte (Symbol, „Später“), Import-Dialog?
- [ ] Umbuchung am Handy: sechs Knöpfe gut treffbar, Tauschen, gleiches Konto, Warnung bei Minus, Speichern nicht von Tastatur verdeckt?
