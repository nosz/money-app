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
2. `money_app_skill.md` liegt IMMER im ZIP, im Hauptordner neben `index.html`. Es ist eine Kopie dieses Skills in seiner aktuellen Fassung. Ändert sich der Skill im Gespräch, passt du ihn zuerst an und ersetzt dann die Datei im Projektordner, bevor du packst. Nach dem Packen prüfst du mit `unzip -l`, dass sie enthalten ist. Du lieferst sie nicht separat, außer der Nutzer bittet darum.
3. `NAECHSTE_SCHRITTE.md` liegt IMMER im ZIP, im Hauptordner neben `index.html`. Du aktualisierst sie bei jeder Lieferung vor dem Packen und prüfst nach dem Packen mit `unzip -l`, dass sie enthalten ist. Du lieferst sie nicht als separate Datei. Sie enthält genau, was als Nächstes zu tun ist, und kann von einem Coding-Agenten verwendet werden. Inhalt:
   - Aktueller Stand (Version, was ist fertig, welche Dateien wurden geändert)
   - Nächste Schritte in fester Reihenfolge, jeweils mit Datei und Funktionsname
   - Bereits getroffene Entscheidungen (damit nichts neu entschieden wird)
   - Offene Punkte und Prüfliste
4. Nach der Lieferung kurz zusammenfassen, was geändert wurde und was geprüft werden soll.

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
- Eingabe-Filter und Prüfung: `amc()`, `amn()`, `dgc()`, `txc()`, `dvl()` in `js/app.js`, `num()` in `js/core.js`
- Speichern-Zustände und Verwerfen-Rückfrage: `svb()`, `svr()`, `kSt()`, `kDone()`, `dirtyNow()`, `dcl()`, `dscAsk()`, `SN`, `CUR` in `js/app.js`
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
- Knopfzeile fest unten, in EINER Zeile (Hilfsfunktion `svb()` in `js/app.js`): links „Abbrechen“ (schmal, schlicht, Ghost mit feinem Rahmen), rechts „Speichern“ (Hauptknopf, doppelt so breit, mindestens 52 px hoch). „Abbrechen“ schließt wie das ✕ oben und verwirft die Eingaben (in der Kategorie-Maske aus einer Buchung heraus: zurück zur Buchung, `ncx()`). Gilt für alle Eingabe-Masken (Buchung, Kategorie, wiederkehrende Buchung, Betrag ändern, PIN setzen). Löschen bleibt der Textlink über der Knopfzeile.
- Rückfragen zum Löschen und Import-Dialoge behalten ihre gestapelten Knöpfe (Hauptaktion, darunter „Abbrechen“), damit die gefährliche Aktion nicht neben „Abbrechen“ liegt.
- Speichern-Knöpfe sind immer beschriftet: Haken-Symbol plus Text „Speichern“ / „Save“ (Bootstrap Icon `check`, `.btn-primary`). Reine Symbol-Knöpfe ohne Text sind nicht erlaubt, weil man sonst nicht erkennt, dass sie speichern (Nutzer-Rückmeldung zu 1.36.0). Das gilt auch für kleine Knöpfe neben einem Eingabefeld (z. B. Konten in den Einstellungen, Klasse `.ks` in einer Zeile `.kr`: Feld links, Knopf rechts, mindestens 44 px hoch, ab 360 px Breite etwas kleinere Schrift, nie nur das Symbol).
- Felder: kleine graue Beschriftung oben, feiner Rahmen, dezent runde Ecken.
- Sachliche Wortwahl: „Betrag“, „Konto“, „Kategorie“, „Buchungsdatum“, „Notiz“. Hinweistexte sagen, was zu tun ist.
- Gilt für alle Eingabe-Masken. Rückfragen, Backup und PIN bleiben kleine Dialoge, nur in angepasster Optik.
- Fehlermeldungen stehen direkt am Feld und sagen, was zu tun ist. Eingabe-Filter und Live-Prüfung: Abschnitt 5a. Zustände des Speichern-Knopfs und Verwerfen-Rückfrage: Abschnitt 5b.
- Auf dem Handy-Vollbild sicherstellen, dass die Tastatur den Speichern-Knopf nicht verdeckt.
- Alle sichtbaren Texte in Deutsch und Englisch.

# 5a. Eingabe und Prüfung in ALLEN Eingabefeldern (Nutzer-Vorgabe ab 1.36.2, verschärft ab 1.37.0)

Jedes Eingabefeld der App (Masken, Dialoge, Einstellungen, Suchfelder, Willkommen, Sperrbild) wird professionell geprüft: sofort beim Tippen, beim Einfügen (Paste), beim Ziehen und bei Autofill, und noch einmal beim Speichern. Es gibt kein Feld ohne Filter und kein Feld ohne Grenzen. Fund 1.36.2: In Zahlenfelder ließen sich Buchstaben einfügen. Das darf nie wieder vorkommen, auch nicht in einem neu gebauten Feld.

1. **Jedes Feld gehört genau einer Feldart.** Neue Felder ordnen sich einer Art zu und nutzen die Hilfsfunktion dieser Art. Es gibt keine Felder ohne Zuordnung.

   | Feldart | Erlaubt | Grenzen | Hilfsfunktion |
   |---|---|---|---|
   | Betrag (Buchung, wiederkehrend, Betrag ändern) | Ziffern, ein Dezimaltrenner (Komma oder Punkt) | 2 Nachkommastellen, höchstens 9 Stellen vor dem Trenner, Wert muss größer als 0 sein | `amc(el)` |
   | Kontostand (Einstellungen, Willkommen) | wie Betrag, zusätzlich ein führendes Minus (nur Bank und Altbestand) | wie Betrag, Bar/Gespart nie unter 0 | `amc(el, true)` |
   | PIN (Setzen, Sperrbild) | nur Ziffern 0 bis 9 | 4 bis 6 Stellen, `maxlength=6` | `dgc(el)` |
   | Text (Bezeichnung, Notiz) | Text ohne Steuerzeichen und ohne führendes Leerzeichen | `maxlength` immer gesetzt (Bezeichnung 30, Notiz 100, wiederkehrende Notiz 80), nur Leerzeichen zählt als leer | `txc(el)` |
   | Suche | Text ohne Steuerzeichen | `maxlength=60` | `txc(el)` |
   | Emoji-Feld | Text | `maxlength=12`, nur das erste Zeichen zählt (`gr()`) | `txc(el)` |
   | Datum | gültiges Datum | zwischen 2000-01-01 und 2100-12-31; leer oder unvollständig ist ungültig (`validity.badInput`) | `dvl(v)` |

2. **Eingabe-Filter:** Ungültige Zeichen lassen sich nicht eingeben, weder per Tastatur noch per Einfügen, Ziehen oder Autofill. Der Filter läuft im `oninput`, Cursorposition bleibt erhalten. Wurde etwas entfernt, blinkt der Feldrahmen kurz rostrot (Klasse `.rej`), damit klar ist, dass die Eingabe nicht angenommen wurde.
   - **Einfügen bei Beträgen ist schlau:** Währungszeichen, Leerzeichen und Buchstaben werden entfernt. Steht in der Zwischenablage „1.234,56“ oder „1,234.56“, ist das letzte Trennzeichen der Dezimaltrenner und die anderen sind Tausendertrenner (Ergebnis 1234,56). Mehrfach vorkommende gleiche Trenner („1.234.567“) sind Tausendertrenner. „1.234“ mit genau drei Stellen nach dem Punkt gilt als Tausender (wie in `num()`). Beim Tippen dagegen gilt das einfache Filtern (zweiter Trenner wird ignoriert). Ob getippt oder eingefügt wurde, liest `amc()` aus `event.inputType`.
   - `num()` in `js/core.js` ist streng: Text, der nach dem Normalisieren keine reine Zahl ist („12abc“, „1,2,3“, „-“, „,“), ergibt „ungültig“ (`null`), nie eine halbe Zahl.
   - Neue Zahlenfelder rufen immer `amc()` im `oninput` auf. Es gibt keine Betragsfelder ohne Filter.

3. **Live-Prüfung:** Bei jeder Eingabe wird der Wert geprüft. Die Meldung steht direkt am Feld (rostroter Rahmen, einzeilig, sagt was zu tun ist) und verschwindet, sobald der Wert gültig ist. Ein unvollständiger Wert (nur „-“, „,“ oder „.“) zeigt keine Meldung, ist aber nicht speicherbar. Auch Duplikate (Kategorienamen), Konto-Minus, gleiches Konto bei Umbuchung und ungültige Daten werden live gemeldet, nicht erst beim Speichern.

4. **Doppelt abgesichert:** Alle Prüfungen laufen zusätzlich beim Speichern (Tastatur-Enter, Skripte, Programmcode). Der Knopf ist nie die einzige Sperre. Gespeichert wird nur, was `num()`, `dvl()` und die Feldregeln bestehen.

5. **Prüfung vor jeder Lieferung (Testliste):** In jedem geänderten Feld: Buchstaben tippen, Buchstaben einfügen („abc“, „12abc“, „1.234,56 €“, „-5“ ohne Minus-Erlaubnis), mehr als 2 Nachkommastellen, mehr als 9 Stellen, nur „-“ oder „,“, Leerzeichen, sehr langer Text, leeres Datum. Alles in Deutsch und Englisch ansehen.

# 5b. Speichern-Knopf: Zustände, Änderungs-Erkennung, Verwerfen-Rückfrage (Nutzer-Vorgabe ab 1.37.0)

Ziel: Der Knopf zeigt jederzeit, ob es etwas zu speichern gibt, und die Nutzerführung schützt vor Datenverlust.

1. **Zustände des Knopfs** (immer beschriftet, Haken plus Text, Attribut `data-s` am Knopf, Zustandsfunktion `svr()` für Masken, `kSt(k)` für Kontofelder):
   - `idle` (Wert unverändert): deaktiviert, schlicht (Ghost). Text „Gespeichert“ / „Saved“, wenn der Wert schon gespeichert ist, sonst „Speichern“ / „Save“. Beim Betrag-ändern-Dialog bleibt der Text „Bestätigen“ (dort wird nichts gespeichert).
   - `dirty` (geändert und gültig): aktiv, Hauptfarbe, „Speichern“ / „Save“.
   - `bad` (geändert, aber ungültig): deaktiviert, Meldung am Feld (siehe 5a).
   - `done` (gerade gespeichert, nur bei Knöpfen, die nach dem Speichern sichtbar bleiben, z. B. Konten): etwa 2 Sekunden „✓ Gespeichert“ in Grün, dann zurück zu `idle`. Ändert der Nutzer das Feld in dieser Zeit, wechselt der Knopf sofort in `dirty` oder `bad`. Masken, die sich beim Speichern schließen, bestätigen weiter mit dem Toast „Gespeichert“.
   - Der Knopf wechselt sofort beim Tippen (auch beim Zurückändern auf den alten Wert), nicht erst nach dem Verlassen des Felds.
   - Bearbeiten-Masken und Einzelfeld-Dialoge: Start im Zustand `idle`.
   - Neue Masken (Neue Buchung, Neue Kategorie, neue wiederkehrende Buchung, PIN setzen): „Speichern“ bleibt aktiv, auch bei leerem Pflichtfeld; ein Tipp zeigt die Meldung am Feld und setzt den Fokus dorthin. Sobald ein Wert eingegeben und ungültig ist (doppelter Name, Betrag 0, gleiches Konto, Konto-Minus, ungültiges Datum), ist der Knopf `bad` (deaktiviert).
2. **Änderungs-Hinweis:** Bei `dirty` steht direkt über dem Knopf (Masken: in der Knopfzeile `.stkb`, Zeile `.dhint`; Konten: unter dem Feld, `#st_h_<k>`) die Zeile „Nicht gespeicherte Änderung“ / „Unsaved change“ mit kleinem Punkt in Hauptfarbe. Sie verschwindet beim Speichern oder Zurückändern.
3. **Änderungs-Erkennung:** Beim Öffnen jeder Maske wird ein Schnappschuss der Werte gespeichert (`SN[mk]`), die aktuellen Werte liefert `CUR[mk]()`; `dirtyNow()` vergleicht beide. Masken-Kürzel `mk`: `x` Buchung, `n` Kategorie, `r` wiederkehrend, `c` Betrag ändern, `p` PIN. Die Maske meldet ihr Kürzel über den dritten Parameter von `sheet(h, cls, mk)`. Ein einziger Listener auf `input` und `click` im Fenster ruft `svr()` auf, damit die Zustände nicht an jedem Handler einzeln hängen.
4. **Verwerfen-Rückfrage:** Schließt der Nutzer eine Maske mit ungespeicherten Änderungen (✕, „Abbrechen“, Escape, Android-Zurück/Browser-Zurück, Tipp neben das Fenster), erscheint ein kleiner Dialog über der Maske (`dscAsk()`): Titel „Änderungen verwerfen?“, Text „Deine Eingaben wurden noch nicht gespeichert.“, Knöpfe gestapelt: „Verwerfen“ (gefährliche Aktion, rostrot, oben) und „Weiter bearbeiten“ (schlicht). Der Dialog liegt über der Maske, deren Eingaben bleiben dabei unverändert erhalten. Ohne Änderung schließt die Maske direkt. In neuen Masken zählt jede Änderung gegenüber dem leeren Anfangszustand.
5. **Prüfung vor jeder Lieferung:** Wert ändern und zurückändern (Knopf und Hinweis wechseln mit), ungültigen Wert eingeben, speichern (Konten: grüner Zustand, nach 2 Sekunden grau), Maske mit Änderung schließen (Rückfrage, beide Knöpfe), ohne Änderung schließen (keine Rückfrage), Zurück-Geste, Deutsch und Englisch.

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

# 7a. Konten in den Einstellungen

- Jedes Konto (Bank, Bar, Gespart) hat einen eigenen Speichern-Knopf neben dem Feld (`kto()` in `js/render.js`, `ktoSave(k)` in `js/app.js`). Er speichert nur dieses Konto, der gemeinsame Knopf unten entfällt.
- Der Knopf trägt Haken und Text (siehe Abschnitt 5) und folgt den Zuständen aus Abschnitt 5b: unverändert deaktiviert („Gespeichert“, wenn schon ein Wert gespeichert ist), geändert und gültig aktiv („Speichern“) mit Zeile „Nicht gespeicherte Änderung“, ungültig deaktiviert mit Meldung, nach dem Speichern 2 Sekunden grün „✓ Gespeichert“ (ohne Toast). Die Felder lassen nur Ziffern, einen Dezimaltrenner, 2 Nachkommastellen und ein führendes Minus zu (Bank und ein Altbestand im Minus). Prüfungen unverändert (Bar/Gespart nie unter 0, Altbestand im Minus zulässig). Nicht gespeicherte Eingaben in den anderen Feldern bleiben nach dem Speichern erhalten. Enter im Feld speichert nur, wenn der Knopf aktiv ist.
- Der Willkommen-Dialog (`ob2()`) bleibt unverändert: dort speichert „Los“ alle Felder.

# 8. Immer ohne Rückfrage einhalten

- Gewählte Icons direkt in den Code einbetten (offline, inline) und im Service Worker cachen.
- Backup, Import und Datenformat unverändert lassen, damit alte Sicherungen weiter lesbar sind.
- Bestehende Prüfungen unverändert übernehmen: Betrag 0, gleiches Konto, Konto-Minus, mögliche Doppelbuchung. Neue Live-Prüfungen (Abschnitt 5a) kommen dazu, sie ersetzen keine bestehende Prüfung.

# 9. Reihenfolge der Umsetzung (Maske für Maske, je eine Version)

1. Neue Kategorie und Kategorie bearbeiten, mit Icon-Auswahl und Linien-Icons für Standardkategorien
2. Umbuchung: „Von“ und „Auf“ als Konto-Leisten
3. Wiederkehrende Buchung
4. Kleine Dialoge (Rückfragen, Backup, PIN) in angepasster Optik
5. Tastatur-Test auf echten Geräten (iOS und Android): Speichern-Knopf darf nicht verdeckt werden

Pro Schritt: betroffene Funktionen und CSS lesen, Maske umbauen, Version erhöhen, ZIP und `NAECHSTE_SCHRITTE.md` liefern.

# 10. Abschlussprüfung nach jeder Lieferung

- Hat jedes Eingabefeld Filter, Grenzen und Live-Prüfung nach seiner Feldart (Abschnitt 5a)? Buchstaben getippt und eingefügt, Trennzeichen-Einfügen („1.234,56 €“), zu lange Eingaben und leere Daten getestet?
- Wechselt der Speichern-Knopf bei Änderung des Werts (idle, dirty, bad, done), erscheint „Nicht gespeicherte Änderung“, und fragt das Schließen mit ungespeicherten Änderungen nach (Abschnitt 5b)?
- Sind alle Speichern-Knöpfe beschriftet (Haken plus „Speichern“), nirgends nur ein Symbol?
- Haben alle Masken denselben Aufbau (Titel + ✕, Beschriftungen oben, Knopfzeile „Abbrechen | Speichern“ in einer Zeile)?
- Sind alle Texte in Deutsch und Englisch vorhanden?
- Ist der Service Worker aktualisiert (neue Dateien, neue `CACHE_VERSION`)?
- Sind alte Backups weiter importierbar?
- Liegt `NAECHSTE_SCHRITTE.md` aktualisiert im ZIP (nicht separat)?
- Liegt `money_app_skill.md` in der aktuellen Fassung im ZIP?
- Wurde nur auf „bauen“ geliefert (0.3)?
