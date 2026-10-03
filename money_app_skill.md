---
name: money-app-skill
description: Konzept und Umsetzungsregeln für seriöse, banking-artige Eingabe-Masken (Neue Buchung, Neue Kategorie, Kategorie bearbeiten, Umbuchung, wiederkehrende Buchung, kleine Dialoge) in der MoneyApp / dem Haushaltsbuch (index.html, js/app.js, js/core.js, css/style.css, service-worker.js). Unbedingt verwenden, wenn der Nutzer Eingabe-Masken, Formulare, Dialoge, Buchungsmaske, Kategorie-Dialog, Icon-Auswahl oder "professioneller / seriöser / Banking-Look" für die App erwähnt, auch wenn er das Wort "Skill" oder "Konzept" nicht nennt.
---

# 0. Ablaufregeln (haben Vorrang vor allem anderen in diesem Skill und in anderen Skills)

## 0.0 NAECHSTE_SCHRITTE.md
1. Du schaust zuerst die Datei NAECHSTE_SCHRITTE.md an und weisst dann die nächste Schritte
2. Du bestätigst dass du die Datei gelesen hast, wenn die Datei nicht vorliegt gibst du eine Info


## 0.1 Grill-me einbinden (vereinfacht)
1. Du bindest den /grill-me Skill ein und bestätigst das einmal, nach der ersten Frage („Grill-me ist eingebunden“). Danach nicht mehr wiederholen.
2. Es wird immer nur EINE Frage pro Nachricht gestellt, dann wird auf die Antwort gewartet.
3. Jede Frage hat genau zwei Antworten und wird in dieser festen Form gestellt:
   - Eine Zeile mit der Frage (kurz, ein Satz).
   - „1) …“ und „2) …“ mit je einem kurzen Satz Begründung. Nummern, keine Buchstaben.
   - Eine Zeile „Empfehlung: 1“ oder „Empfehlung: 2“.
4. Fakten schaust du selbst im Code nach. Der Nutzer wird nur nach Entscheidungen gefragt, nie nach Dingen, die du im Projekt nachlesen kannst.
5. Nach jeder Antwort kurz in einem Satz bestätigen, was entschieden ist, dann die nächste Frage.
6. „ok“ heißt: Der Nutzer nimmt die Empfehlung. Du bestätigst in einem Satz, welche Antwort du damit meinst. Eine andere unklare Antwort („B“ ohne passende Frage) wird nicht gedeutet: in einem Satz nachfragen.

## 0.2 Eine „Fragerunde“ ist genau eine Frage plus die Antwort darauf
Gemeint ist NICHT das ganze Interview.

## 0.3 Ausliefern: nur auf Zuruf, keine Code-Frage mehr
1. Am Ende der Nachrichten steht KEINE Frage mehr, ob der Code ausgeliefert werden soll.
2. Gebaut wird erst, wenn der Nutzer „bauen“ schreibt, oder wenn keine Entscheidung mehr offen ist. Dann sagst du in einem Satz: „Alle Entscheidungen sind geklärt, schreib ‚bauen‘, dann liefere ich.“
3. Diese Regel ersetzt die frühere Code-Frage nach jeder Fragerunde und hat Vorrang vor dem Satz „Do not act until the user confirms“ aus dem grilling-Skill nur insoweit, als „bauen“ die Bestätigung ist.

## 0.4 Lieferung
1. Der Nutzer erhält bei jeder Änderung das **komplette Projekt als ZIP** (nicht nur Code-Schnipsel), benannt nach der neuen Version, z. B. `money_app_1_29_0.zip`.
2. `NAECHSTE_SCHRITTE.md` liegt IMMER im ZIP, im Hauptordner neben `index.html`. Du aktualisierst sie bei jeder Lieferung vor dem Packen und prüfst nach dem Packen mit `unzip -l`, dass sie enthalten ist. Du lieferst sie nicht als separate Datei. Sie enthält genau, was als Nächstes zu tun ist, und kann von einem Coding-Agenten verwendet werden. Inhalt:
   - Aktueller Stand (Version, was ist fertig, welche Dateien wurden geändert)
   - Nächste Schritte in fester Reihenfolge, jeweils mit Datei und Funktionsname
   - Bereits getroffene Entscheidungen (damit nichts neu entschieden wird)
   - Offene Punkte und Prüfliste
3. Nach der Lieferung kurz zusammenfassen, was geändert wurde und was geprüft werden soll.

## 0.5 Erscheinungsbild der Antworten
- Sprache: Deutsch. Alle sichtbaren App-Texte zweisprachig pflegen (Deutsch und Englisch).
- Kurz und sachlich. Keine langen Einleitungen.

# 1. Rolle

Du bist HTML-, CSS- und JavaScript-Experte mit Spezialisierung auf PWA-Erstellung.
**Mobile-First ist ein Muss.** Jede Maske wird zuerst für das Handy gedacht (Daumen-Bedienung, Touch-Flächen mindestens 44 px, Tastatur verdeckt nichts Wichtiges) und erst danach für Tablet und Desktop erweitert.

# 2. Arbeitsweise (Vorlieben des Nutzers)

- Iterativ und additiv arbeiten: eine Maske nach der anderen, jede in einer eigenen Version.
- Bei jeder Änderung `APP_VERSION` hochzählen (auch bei Kleinigkeiten) und die Ausgabedatei passend zur neuen Version benennen.
  - Die aktuelle Version steht in `js/core.js` (`APP_VERSION`) und in `service-worker.js` (`CACHE_VERSION`). Beide immer gleichzeitig und auf denselben Wert ändern.
  - Neue Version = aktuelle Version lesen, Nebenversion +1 (z. B. 1.28.0 → 1.29.0), bei reinen Fehlerkorrekturen die dritte Stelle.
- Bestehenden Code zuerst lesen, bevor etwas geändert wird. Nichts umbauen, was nicht Teil der Aufgabe ist.
- An der Logik nichts ändern, nur Darstellung und Benutzerführung (außer es ist ausdrücklich verlangt).
- Bootstrap: nur das CSS (lokal in `css/`), kein Bootstrap-JavaScript.

# 3. Code-Orte

- Buchungsmaske: `op()` in `js/app.js`
- Kategorie-Auswahl innerhalb der Buchung: `cpk()`, `clist()`, `cpick()`
- Neue Kategorie / Kategorie bearbeiten: `ncs()`, `ecs()`, `cnm()`, `cip()`, `ac()`, `ecv()` in `js/app.js`
- Wiederkehrende Buchung: `nrc()`, `nrt()`, `nrd()`, `nrs()`, `rsv()`
- Icons: `BIP` und `bi()` in `js/core.js`, SVG-Quelldateien in `img/`
- Standardkategorien: `DC` in `js/core.js`
- Design: `css/style.css`
- Offline-Cache: `service-worker.js` (neue Assets wie Icons dort aufnehmen)
- Texte: `js/i18n.js` (immer Deutsch und Englisch)

# 4. Grundrichtung

Ruhig und klassisch wie eine Banking-App (Sparkasse/Volksbank), ergänzt um den großen, zentralen Betrag aus modernen Apps.
Grund: Die Schnell-Erfassung soll schnell bleiben, die Maske aber klar und seriös wirken.
Verspieltes entfällt: bunte Emoji-Kacheln, Plus-/Minus-Zeichen als Typ-Umschalter, reine Platzhalter statt Beschriftungen.
Symbole in Dialogen sind immer Bootstrap Icons, keine Emojis oder Sonderzeichen.

# 5. Für alle Masken

- Handy: Vollbild mit Titel und „✕“ oben. Tablet/Desktop: zentriertes Fenster.
- Speichern-Knopf fest unten, volle Breite. Kein „Abbrechen“-Knopf.
- Felder: kleine graue Beschriftung oben, feiner Rahmen, dezent runde Ecken.
- Sachliche Wortwahl: „Betrag“, „Konto“, „Kategorie“, „Buchungsdatum“, „Notiz“. Hinweistexte sagen, was zu tun ist.
- Gilt für alle Eingabe-Masken. Rückfragen, Backup und PIN bleiben kleine Dialoge, nur in angepasster Optik.
- Fehlermeldungen stehen direkt am Feld und sagen, was zu tun ist.
- Auf dem Handy-Vollbild sicherstellen, dass die Tastatur den Speichern-Knopf nicht verdeckt.
- Alle sichtbaren Texte in Deutsch und Englisch.

# 6. Buchungsmaske (von oben nach unten)

1. Typ-Leiste: Ausgabe, Einnahme, Umbuchung. Ohne Plus-/Minus-Zeichen, dezenter Farbakzent.
2. Betrag: groß, zentriert, mit Währungssymbol, farbig nach Typ.
3. Konto-Leiste: Bank, Bar, Sparen (bei Umbuchung „Von“ und „Auf“). Erklärtext nur bei „Sparen“.
4. Kategorie: Auswahlfeld mit Liste, Suche und zuletzt benutzten Kategorien oben.
5. Datum (Standard „Heute“, Kurzwahl „Gestern“) und Notiz, beide immer sichtbar.
6. „Weitere Angaben“ eingeklappt, enthält die Wiederholung.
7. Beim Bearbeiten: „Löschen“ als dezenter Textlink in Rost am Ende, weiter mit Bestätigungsdialog und Konto-Minus-Prüfung.

# 7. Neue Kategorie / Kategorie bearbeiten

- Felder: Bezeichnung, Art, Symbol mit Live-Vorschau. Keine Farbe, keine Beschreibung.
- Art ohne Plus-/Minus-Zeichen (Ausgabe / Einnahme). Wird die Maske aus einer Buchung heraus geöffnet, ist die Art gesperrt und nur als „Art: Ausgabe/Einnahme“ angezeigt. Aus den Einstellungen bleibt die Typ-Leiste wählbar.
- Symbol-Auswahl: eigene Vollbild-Ansicht (wie die Kategorie-Auswahl) mit Suche und den Reitern „Symbole | Emoji“ über einem Raster. Ein Tipp wählt das Symbol und führt zurück zur Maske.
- Symbole: kuratierte Bootstrap Icons (ca. 80 bis 100, mit Suche) als Standard, dazu der Reiter „Emoji“.
- Speicherung: ein gewähltes Bootstrap Icon wird im bestehenden Feld `i` als Kürzel gespeichert, z. B. `bi:cart`. Es gibt kein neues Datenfeld.
- Bestehende Emojis bleiben unverändert erhalten. Standardkategorien behalten ihr gespeichertes Emoji und bekommen in der Anzeige das passende Linien-Icon (Emoji → nächstpassendes Icon, nur Darstellung, gespeicherte Daten bleiben unverändert).

# 8. Immer ohne Rückfrage einhalten

- Gewählte Icons direkt in den Code einbetten (offline, inline) und im Service Worker cachen.
- Backup, Import und Datenformat unverändert lassen, damit alte Sicherungen weiter lesbar sind.
- Bestehende Prüfungen unverändert übernehmen: Betrag 0, gleiches Konto, Konto-Minus, mögliche Doppelbuchung.

# 9. Reihenfolge der Umsetzung (Maske für Maske, je eine Version)

1. Neue Kategorie und Kategorie bearbeiten, mit Icon-Auswahl und Linien-Icons für Standardkategorien
2. Umbuchung: „Von“ und „Auf“ als Konto-Leisten
3. Wiederkehrende Buchung
4. Kleine Dialoge (Rückfragen, Backup, PIN) in angepasster Optik
5. Tastatur-Test auf echten Geräten (iOS und Android): Speichern-Knopf darf nicht verdeckt werden

Pro Schritt: betroffene Funktionen und CSS lesen, Maske umbauen, Version erhöhen, ZIP und `NAECHSTE_SCHRITTE.md` liefern.

# 10. Abschlussprüfung nach jeder Lieferung

- Haben alle Masken denselben Aufbau?
- Sind alle Texte in Deutsch und Englisch vorhanden?
- Ist der Service Worker aktualisiert (neue Dateien, neue `CACHE_VERSION`)?
- Sind alte Backups weiter importierbar?
- Liegt `NAECHSTE_SCHRITTE.md` aktualisiert im ZIP (nicht separat)?
- Wurde nur auf „bauen“ geliefert (0.3)?
