# MoneyApp – Nächste Schritte (Stand 1.32.0)

Diese Datei ist für einen Coding-Agenten gedacht. Sie beschreibt den aktuellen Stand, die bereits getroffenen
Entscheidungen und die nächsten Schritte in fester Reihenfolge. Konzept: Skill „banking-eingabemasken“.

## 1. Aktueller Stand

**Version 1.32.0** (`APP_VERSION` in `js/core.js`, `CACHE_VERSION` in `service-worker.js`, beide gleich).

Fertig:

- **Kleine Dialoge (1.32.0):** nur Optik, Logik unverändert. Umfang: Rückfragen (`cdel()`, Sperrmeldungen in `dl()`,
  `ip()`, `im()`), PIN-Maske `pn()` und Sperrbild `lk()`, Backup-Karte `brCard()` in `js/core.js`. Willkommen (`ob()`, `ob2()`),
  Kontostände beim Start und Starthinweis `negHint()` bewusst unverändert. „Abbrechen“ bleibt (Entscheidung), Knöpfe,
  Rahmen und Radien wie in den großen Masken (`.sh .acts .btn.ghost` mit Rahmen, 48 px Höhe). PIN-Felder in `.fld`/`.fl` mit
  Klasse `.pin` (zentriert, Ziffernabstand). Backup-Karte: Emoji 💾 durch Bootstrap Icon `download` ersetzt (neu in `BIP`),
  „Später“ als Ghost-Knopf. CSS am Ende von `css/style.css` (Abschnitt „1.32.0“). Backup, Import, Datenformat unverändert.
- **Wiederkehrende Buchung (1.31.0):** `nrd()` (neu) und `erd()` (bearbeiten) in `js/app.js` im Banking-Look, gemeinsamer
  Aufbau über neue Hilfsfunktion `rfm(r, nw)`. Vollbild (`'fs'`) mit Titel und ✕, Beschriftungen oben (`.fld .fl`),
  Betrag mit Währungssymbol (`.amw`), Kategorie als normales Auswahlfeld (kein `cpk()`), Notiz, Wiederholen, Fälligkeit,
  Speichern fest unten, kein „Abbrechen“. Neu: Typ-Leiste Ausgabe/Einnahme ohne Plus/Minus. Bearbeiten: Art nur als Anzeige
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
  - Felder: Art, Bezeichnung, Symbol (mit Live-Vorschau). Kein „Abbrechen“-Knopf, Speichern fest unten.
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

## 3. Nächste Schritte (in dieser Reihenfolge, je eine Version)

### Schritt 1 – Tastatur-Test auf echten Geräten [Punkt D]
- iOS und Android: Der Speichern-Knopf (`.stkb`) darf in allen Masken nicht von der Tastatur verdeckt werden.
- Besonders prüfen: Bezeichnung (Kategorie), Betrag und Notiz (Buchung), Suchfelder der Auswahl-Ansichten.
- Ergebnis als Rückmeldung an den Nutzer. Nur bei Mängeln eine Korrekturversion bauen.

## 4. Offene Punkte und optionales Aufräumen

- Nach Rückmeldung des Nutzers zu 1.29.0 bis 1.32.0 (Test am Handy) zuerst eventuelle Korrekturen einbauen.
- Optional (eigene Version, nur Aufräumen): nicht mehr benutzte CSS-Regeln entfernen: `.dir`, `.dir>div`, `.dir label`, `.sh .dir .form-label` (alte Von/Auf-Auswahlfelder) sowie die der alten Kategorie-Maske:
  `.cn`, `.cpi`, `.cpe`, `.cpp`, `.ip` (in `css/style.css`) sowie die zugehörigen `.sht.ns`-Regeln. Vorher per Suche
  prüfen, dass nichts anderes sie benutzt.
- Bekannte Eigenheit: Wählt der Nutzer für eine Standardkategorie im Emoji-Reiter genau ihr Standard-Emoji,
  wird in der Anzeige weiterhin das Linien-Icon gezeigt. Falls das stört: `CATD`-Zuordnung zusätzlich an ein
  Merkmal knüpfen (z. B. nur anwenden, wenn die Kategorie nie bearbeitet wurde).
- Bei jeder Lieferung: `APP_VERSION` und `CACHE_VERSION` gleichzeitig erhöhen, neue Dateien in `ASSETS`
  (`service-worker.js`) eintragen, ZIP nach der Version benennen (`money_app_<x_y_z>.zip`).

## 5. Prüfliste nach jeder Lieferung

- [ ] Alle Masken gleicher Aufbau (Titel + ✕, Beschriftungen oben, Speichern fest unten, kein „Abbrechen“)?
- [ ] Texte in Deutsch und Englisch?
- [ ] Service Worker aktualisiert (neue Dateien, neue `CACHE_VERSION`)?
- [ ] Alte Backups weiter importierbar (Datenformat unverändert)?
- [ ] Bestehende Prüfungen unverändert (Betrag 0, gleiches Konto, Konto-Minus, Doppelbuchung)?
- [ ] Buchungsmaske unverändert, falls nicht Teil der Aufgabe?
- [ ] Wiederkehrende Buchung am Handy: neu anlegen, bearbeiten, löschen, Fehlermeldungen bei leerem Betrag, Speichern nicht von Tastatur verdeckt?
- [ ] Kleine Dialoge am Handy: Löschen-Rückfrage, PIN setzen und eingeben, Backup-Karte (Symbol, „Später“), Import-Dialog?
- [ ] Umbuchung am Handy: sechs Knöpfe gut treffbar, Tauschen, gleiches Konto, Warnung bei Minus, Speichern nicht von Tastatur verdeckt?
