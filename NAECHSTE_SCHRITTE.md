# MoneyApp – Nächste Schritte (Stand 1.29.0)

Diese Datei ist für einen Coding-Agenten gedacht. Sie beschreibt den aktuellen Stand, die bereits getroffenen
Entscheidungen und die nächsten Schritte in fester Reihenfolge. Konzept: Skill „banking-eingabemasken“.

## 1. Aktueller Stand

**Version 1.29.0** (`APP_VERSION` in `js/core.js`, `CACHE_VERSION` in `service-worker.js`, beide gleich).

Fertig:

- Buchungsmaske `op()` im Banking-Look (seit 1.28.0), in 1.29.0 unverändert.
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

## 3. Nächste Schritte (in dieser Reihenfolge, je eine Version)

### Schritt 1 – Version 1.30.0: Umbuchung („Von“ / „Auf“ als Konto-Leisten) [Punkt C]
- Ort: `DIR()` in `js/core.js`, Aufruf in `op()` (`konto`) in `js/app.js`.
- Ziel: „Von“ und „Auf“ als Konto-Leisten (Bank, Bar, Sparen) wie bei normalen Buchungen statt Auswahlfelder.
- Prüfungen unverändert lassen: gleiches Konto, Konto-Minus, Betrag 0, mögliche Doppelbuchung.
- Vor dem Umbau `DIR()`, `ACC()`, `msgs()`, `warns()`, `mut()`, `sv()` lesen. Fehlermeldung `#eu` beibehalten.

### Schritt 2 – Version 1.31.0: Wiederkehrende Buchung [Punkt E, Teil 1]
- Orte: `nrc()`, `nrt()`, `nrd()`, `nrs()`, `rsv()`, `rdl()`, `rdo()`, `er()`, `erd()` in `js/app.js`.
  (Funktionsnamen aus der Funktionsliste. Code vor dem Umbau vollständig lesen.)
- Ziel: gleicher Aufbau wie die Buchungsmaske: Vollbild mit Titel und ✕, Typ-Leiste ohne Plus/Minus,
  Beschriftungen oben, Kategorie als Auswahlfeld, Speichern fest unten, kein „Abbrechen“, Löschen als Textlink.

### Schritt 3 – Version 1.32.0: Kleine Dialoge [Punkt E, Teil 2]
- Rückfragen (`cdel()`), Backup, PIN: bleiben kleine Dialoge, nur in angepasster Optik
  (Beschriftungen, Rahmen, Radien, Knöpfe wie in den großen Masken).
- Backup, Import und Datenformat nicht verändern.

### Schritt 4 – Tastatur-Test auf echten Geräten [Punkt D]
- iOS und Android: Der Speichern-Knopf (`.stkb`) darf in allen Masken nicht von der Tastatur verdeckt werden.
- Besonders prüfen: Bezeichnung (Kategorie), Betrag und Notiz (Buchung), Suchfelder der Auswahl-Ansichten.
- Ergebnis als Rückmeldung an den Nutzer. Nur bei Mängeln eine Korrekturversion bauen.

## 4. Offene Punkte und optionales Aufräumen

- Nach Rückmeldung des Nutzers zu 1.29.0 (Test am Handy) zuerst eventuelle Korrekturen einbauen.
- Optional (eigene Version, nur Aufräumen): nicht mehr benutzte CSS-Regeln der alten Kategorie-Maske entfernen:
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
