# MoneyApp – Referenz zu money-app-skill

Aufbau der einzelnen Masken und Bereiche (Abschnitte 6 bis 8a). Die Regeln, die für alle Masken gelten (Ablauf, Arbeitsweise, Eingabeprüfung 5a, Speichern-Knopf 5b, Abschlussprüfung 10), stehen im Kern `money_app_skill.md`. Abschnittsnummern sind in beiden Dateien gleich; Abschnitt 9 (Reihenfolge der Umsetzung) ist erledigt und entfallen. Die Geschichte der Entscheidungen steht in `NAECHSTE_SCHRITTE.md`.

| Abschnitt | Inhalt |
|---|---|
| 6 | Buchungsmaske |
| 7 | Neue Kategorie / Kategorie bearbeiten |
| 7a | Konten in den Einstellungen |
| 7b | Einstellungen: Karte „Buchungen“ |
| 7c | Wiederkehrende Buchung |
| 7d | App-Info / Weiterempfehlen |
| 7e | Geöffneter Bereich in den Einstellungen markiert |
| 7f | App-Symbol auf dem Handy |
| 7g | Weiterempfehlen: Vorschaukarte und Nachricht |
| 7h | Keine Installations-Hinweise |
| 7i | Offline-Hinweis |
| 7j | Startseite ohne Doppel-Hinweis, untere Leiste |
| 7k | Onboarding, Kacheln mit Stift |
| 8a | Keine Monatsleiste |
| 8b | Aktuelles Datum, Datumswechsel bei offener App |
| 8c | Suche auf der Startseite |

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
- Der Knopf trägt Symbol und Text (siehe Abschnitt 5) und folgt den Zuständen aus Abschnitt 5b: unverändert deaktiviert (grauer Haken „Gespeichert“, wenn schon ein Wert gespeichert ist, sonst graue Diskette „Speichern“), geändert und gültig aktiv (Diskette, „Speichern“) mit Zeile „Nicht gespeicherte Änderung“, ungültig deaktiviert mit Meldung, nach dem Speichern 2 Sekunden grün mit Haken „Gespeichert“ (ohne Toast). Die Felder lassen nur Ziffern, einen Dezimaltrenner, 2 Nachkommastellen und ein führendes Minus zu (Bank und ein Altbestand im Minus). Prüfungen unverändert (Bar/Gespart nie unter 0, Altbestand im Minus zulässig). Nicht gespeicherte Eingaben in den anderen Feldern bleiben nach dem Speichern erhalten. Enter im Feld speichert nur, wenn der Knopf aktiv ist.
- Den Kontostände-Schritt im Onboarding (`ob2()`) gibt es nicht mehr (siehe Abschnitt 7k): Kontostände trägt man nur noch hier und über die Kacheln der Startseite ein.

# 7b. Einstellungen: Karte „Buchungen“

Aufbau von oben nach unten (`V.lb()` in `js/render.js`), Handy zuerst, nichts bricht um und kein Text wird abgeschnitten:
1. Umschalter „Monat | Alle Monate“ (`.fmd`, `fmd(all)`), gleicher Stil wie die Typ-Leiste der Buchungsmaske (Unterstrich in Hauptfarbe). Keine Checkbox.
2. Monatswahl `mn()` mit Pfeilen, nur im Modus „Monat“.
3. Suchfeld: Bootstrap Icon `search` links im Feld, Platzhalter „Notiz oder Kategorie suchen“ (einzeilig), rechts die **Trefferzahl als Abzeichen** (`#fqn`, `fqn()`, nur bei Suchtext, Hauptfarbe zart, rostrot bei 0, aktualisiert in `rs()` und `fr()`), daneben ✕ zum Leeren (`#fqx`, `fqc()`, erscheint nur bei Eingabe, 44 px). Kein Emoji. Feldart Suche (Abschnitt 5a). Die „Suchen“-Taste der Tastatur ruft `fqe()`: Tastatur schließen, danach die Ergebniszeile unter die Kopfleiste holen, damit die Treffer ganz sichtbar sind.
   **Suchlogik** (`fl()`, `mq()`, `qam()`, `qdt()` in `js/render.js`, `snc()`, `nrm()`, `qtok()`, `hl()` in `js/core.js`): Umlaute, Akzente und Groß-/Kleinschreibung sind egal (ä = a, ß = ss). Mehrere Wörter gelten gemeinsam (UND), jedes Wort muss in Notiz, Kategoriename, Betrag oder Datum vorkommen. Betrag: „45“ = ganze Euro 45 (nicht 450), „45,9“ und „45.90“ = beginnt mit 45,9 bzw. 45,90, „1.234,56“ mit Tausenderpunkt. Datum: „12.10.“, „12.10“, „12.10.26“, „12.10.2026“; seit 1.66.0 auch eine einzelne Zahl 1 bis 31 als Tag des Monats („12“, „04“) und eine vierstellige Zahl 2000 bis 2100 als Jahr („2026“); der Betrag bleibt dabei zusätzlich Treffer („2026“ findet auch 2.026,00 €). Markiert (`<mark class=hl>`) werden Treffer in Text (Notiz, Kategorie, `hl()`), Datum, Jahr und Betrag (`qhl()`, in `trow()`); das Jahr steht in der Zeile nur, wenn es getroffen ist (bzw. in der Startseiten-Suche immer).
4. Kategorie (`#fcw`; bei offener Tastatur, Fokus im Suchfeld und ohne aktiven Kategorie-Filter ausgeblendet, `body.kb.fqf`, damit mehr Platz bleibt; mit aktivem Filter bleibt sie sichtbar): kleine graue Beschriftung oben, darunter Auswahlfeld `#fcb` (`.fsel`). Tipp öffnet `fcp()`: Vollbild-Ansicht mit Titel „Kategorie“ und ✕, Suche, Zeile „Alle Kategorien“, darunter Ausgaben und Einnahmen als Listen mit Linien-Icon (`ci()`) und Anzahl der Buchungen. Keine Kategorie-Chips.
5. Ergebniszeile (`fsm()`): Anzahl und Summe, rechts „Zurücksetzen“ mit Icon `arrow-ccw` (Pfeil gegen den Uhrzeigersinn, nur bei aktivem Filter; nicht das ✕, das im Suchfeld „Suche leeren“ bedeutet). Direkt unter den Filtern. Der Text wird nie abgeschnitten: Reicht die Breite nicht (auf dem Handy ab 4 Buchungen mit Summe meist nicht), rutscht der Knopf als Ganzes rechtsbündig in die zweite Zeile (`flex-wrap`).
6. Liste der Buchungen. Ohne Treffer bei Suchtext: „Keine Treffer für „…“. Ändere die Suche oder setze sie zurück.“ (`nohitq`, Suchbegriff maskiert und umbrechend); nur mit Kategorie-Filter: `nohit`.
- Suche am Handy: Tippt der Nutzer ins Suchfeld `#fq`, rutscht es direkt unter die Kopfleiste und die Kopfzeile des Bereichs (`scroll-margin-top` auf `#fq` mit `--stk`, Fokus-Handler in `js/app.js`), damit Kategorie, Ergebniszeile (Anzahl und Summe) und die ersten Treffer über der Tastatur stehen. Die Klasse `fqf` am `body` schafft unten Platz (`#v::after`, 60vh), solange das Feld den Fokus hat, damit das Scrollen auch bei wenigen Treffern bis oben reicht. Nur dieses Feld, alle anderen Felder behalten die Zentrierung.
- Symbole in dieser Karte sind Bootstrap Icons, keine Emojis oder Sonderzeichen (gespeicherte Emojis eigener Kategorien bleiben als Emoji sichtbar).
- Änderungen am Filter zeichnen nur die betroffenen Teile neu (`rs()`, `fr()`, `fcs()`), damit die Ansicht nicht springt; nur der Umschalter zeichnet die Ansicht neu (`rd()`).

# 7c. Wiederkehrende Buchung

Gilt für „Neue wiederkehrende Buchung“ (`nrd()`) und „Bearbeiten“ (`erd()`), gemeinsamer Aufbau über `rfm()` in `js/app.js`. Von oben nach unten:
1. Typ-Leiste Ausgabe/Einnahme (nur beim Anlegen; beim Bearbeiten nur Anzeige).
2. Betrag: groß, zentriert, mit Währungssymbol (wie die Buchungsmaske).
3. Kategorie: Auswahlfeld, das die Vollbild-Ansicht `rcp()` öffnet (Suche, Liste mit Linien-Icon, „Kategorie hinzufügen“ am Ende; `ncs(2)` kehrt mit der neuen Kategorie zurück). Kein Dropdown.
4. Wiederholung als **Auswahlfeld** wie die Kategorie: Feld `#rfk` (`.sel`) zeigt nur den Namen („Monatlich“) mit › rechts. Tipp öffnet die Vollbild-Ansicht `rfp()` (Titel „Wiederholen“ und ✕) mit vier Zeilen (`.pk`, mindestens 56 px): Name, darunter der Zusatz in Grau (`rep_m` „Jeden Monat“, `rep_w` „Jede Woche“, `rep_q` „Alle 3 Monate“, `rep_y` „Jedes Jahr“), Haken rechts bei der Auswahl. Reihenfolge Monatlich, Wöchentlich, Vierteljährlich, Jährlich. Ein Tipp auf eine Zeile (`rfpick(k)`) setzt `RE.f` und kehrt mit `rback()` zurück, alle Eingaben bleiben erhalten. Kürzel in `r.f`: `m`, `w`, `q` (alle 3 Monate), `y`. Die Auswahl „Wiederholen“ in „Weitere Angaben“ der Buchungsmaske enthält ebenfalls „Vierteljährlich“ (unverändert). Datumsfeld „Erste Fälligkeit“ bleibt unverändert.
5. Erste bzw. Nächste Fälligkeit (Datumsfeld) mit Hinweiszeile live darunter: „Erste Buchung am {Datum}, danach {Rhythmus}.“ (Bearbeiten: „Nächste Buchung …“); liegt das Datum heute oder früher, kommt „Bereits fällig, erscheint auf der Startseite.“ dazu.
6. Notiz zuletzt (optional).
- Der Einstiegsknopf in den Einstellungen trägt das Bootstrap Icon `plus`, kein „＋“-Zeichen.
- Keine Konto-Leiste (neu angelegte laufen über Bank). Logik, Datenformat und Fälligkeitsberechnung unverändert.

# 7e. Einstellungen: Karte „Kategorien“ (Suche)

Aufbau von oben nach unten (`cats()` ruft `cth()` in `js/render.js`):
1. Suchfeld wie in der Karte „Buchungen“ (Abschnitt 7b, gleiche Klassen `.fsr`, `.fsi`, `.fsx`, `.fqn`): Lupe, Platzhalter „Kategorie suchen“, Trefferzahl als Abzeichen (`#cqn`, rostrot bei 0), ✕ zum Leeren (`#cqx`, `cqc()`). Feldart Suche (Abschnitt 5a), `txc()`, `maxlength=60`.
2. Knopf „Neue Kategorie“ (`#ncb`). Bei offener Tastatur und Fokus im Suchfeld ausgeblendet (`body.kb.fqf #ncb`), damit die Treffer höher stehen.
3. Liste `#cl` (`catl()`): Gruppen Ausgaben und Einnahmen, je mit sortierbarer Kopfzeile (Name, Anzahl) und Zeilen mit Symbol, Name, Anzahl der Buchungen.
- Suche (`cqm()`, `catn()`, `cqs()`): nur nach dem Kategorienamen. Umlaute und Groß-/Kleinschreibung egal (ä = a, ß = ss), mehrere Wörter gelten gemeinsam (`qtok()`, `nrm()` aus `js/core.js`, dieselben Hilfen wie bei den Buchungen). Treffer im Namen werden markiert (`hl()`). Keine Suche in Notizen von Buchungen.
- Gruppen beim Suchen: Gruppen mit Treffern sind aufgeklappt, Gruppen ohne Treffer fehlen, die Zahl in der Überschrift ist die Trefferzahl der Gruppe. Der gemerkte Zustand (`CT.cl`) wird beim Suchen nicht verändert (`ontoggle` speichert nur ohne Suchtext), nach dem Leeren stehen die Gruppen wieder wie vorher.
- Ohne Treffer: „Keine Treffer für „…“. Ändere die Suche oder setze sie zurück.“ (`nohitq`).
- Tastatur: Fokus im Feld setzt `body.fqf` (wie `#fq`, Fokus-Handler in `js/app.js`), das Feld rutscht unter die Kopfleiste (`scroll-margin-top` auf `#cq`). „Suchen“-Taste: `cqe()` schließt die Tastatur und holt das Feld wieder unter die Kopfleiste, die Treffer stehen darunter.
- Änderungen im Suchfeld zeichnen nur Liste, Abzeichen und ✕ neu (`cqs()`), nie das Feld, damit Fokus und Tastatur bleiben. Sortieren (`csort()`) zeichnet die Ansicht neu, `CT.q` bleibt erhalten.

# 7d. Einstellungen: Bereich „App-Info / Weiterempfehlen“

Letzter Bereich der Einstellungen, Titel „App-Info / Weiterempfehlen“ / „App info / Recommend“ (Textschlüssel `about`; `sec('about', SI.about, t('about'), about)` in `V.set()`, `js/render.js`), Symbol `info-circle`. Von oben nach unten, Handy zuerst, nichts bricht um und kein Text wird abgeschnitten (390 und 320 px):
1. **Weiterempfehlen:** Beschriftung „Weiterempfehlen“, kurzer Hinweis, Hauptknopf „App weiterempfehlen“ mit Bootstrap Icon `share` (`.btn-primary`, mindestens 48 px). `shr()` in `js/app.js`: öffnet das Teilen-Menü des Geräts (`navigator.share` mit Titel „MoneyApp“, kurzem Text `shr_t` und Link); fehlt es oder schlägt es fehl (außer Abbruch durch den Nutzer, der nichts auslöst), wird Text samt Link kopiert (Toast „Text und Link kopiert“, Rückfall über verstecktes Feld; Toast „Kopieren nicht möglich“, wenn auch das scheitert). Der Link ist die Adresse, unter der die App gerade läuft (`location.origin + location.pathname`, ohne `index.html`, Suchteil und `#`). Läuft die App nicht unter einer Web-Adresse (z. B. Datei lokal geöffnet), wird `GITHUB_URL` geteilt. Kein QR-Code.
2. **Datenschutz:** Karte direkt unter „Weiterempfehlen“: Beschriftung „Datenschutz“, Text `loc_i`: Daten werden nur lokal auf dem Gerät gespeichert (kein Konto, keine Cloud, keine Übertragung), deshalb regelmäßig Backup unter „Daten & Sicherheit“. Nur Text, kein Knopf.
3. **Open Source:** Karte direkt im Bereich (kein Dialog): Beschriftung „Open Source“, Text, dass der Programmcode öffentlich auf GitHub liegt, Knopf „Auf GitHub ansehen“ mit Bootstrap Icon `github` (`.btn-secondary`, Link `<a>` mit `target=_blank rel="noopener noreferrer"`). Die Adresse steht nur einmal als Konstante `GITHUB_URL` in `js/core.js` (`https://github.com/nosz/money-app`).
4. **Version:** Zeile „Version x.y.z“.
- Knöpfe tragen immer Icon plus Text; unter 360 px Breite etwas kleinere Schrift (`.abt .btn`, `css/style.css`), nie umbrechend.
- Texte (Deutsch und Englisch) in `js/i18n.js`: `about`, `shr_h`, `shr_i`, `shr`, `shr_t`, `shr_c`, `shr_e`, `loc_h`, `loc_i`, `oss`, `oss_i`, `gh`.
- Backup, Import und Datenformat bleiben unverändert (nichts davon wird gespeichert).

# 7e. Einstellungen: geöffneter Bereich markiert

Der geöffnete Bereich (`.sec.open`) ist auf einen Blick erkennbar: farbiger Balken (4 px, `var(--gold)`) am linken Rand der Karte (`border-left`), Symbol und Pfeil in Hauptfarbe. Titel bleibt in Textfarbe, keine Farbfläche. Die Kopfzeile rückt links 3 px ein, damit der Inhalt nicht springt. Nur CSS (Abschnitt „1.48.0“ in `css/style.css`), `aria-expanded` bleibt wie bisher. Gilt für alle Bereiche der Einstellungen.

# 7f. App-Symbol auf dem Handy

Das Symbol auf dem Startbildschirm soll wie bei anderen installierten Apps aussehen: Symbol mittig auf weißem Grund, vom Handy in die Form (Kreis, abgerundetes Quadrat) geschnitten.
- `manifest.json`: vier Symbole, getrennt nach Zweck: `icon-192.png` und `icon-512.png` mit `purpose: any`, `icon-maskable-192.png` und `icon-maskable-512.png` mit `purpose: maskable`. Nie wieder `any maskable` in einem Eintrag. Dazu `id: "./"`.
- Maskable-Symbole: weißer Hintergrund bis zum Rand, Symbol so klein, dass es in der sicheren Zone liegt (weitester Pixel höchstens 40 % der Breite vom Mittelpunkt, aktuell 38,4 %). Symbol selbst (Münze mit Herz) unverändert.
- Alle vier Dateien stehen im Service Worker (`ASSETS`).
- Das Chrome-Zeichen am Symbol lässt sich nicht aus der App steuern: Es erscheint bei einer Verknüpfung. Echte Installation über das Chrome-Menü „App installieren“ (nicht „Zum Startbildschirm hinzufügen“). Alte Verknüpfung vorher löschen.

# 7g. Weiterempfehlen: Vorschaukarte und Nachricht

Ziel: Die geteilte Nachricht soll in WhatsApp und Co. mit Bild und Beschreibung sofort Vertrauen wecken.
- **Vorschaukarte** (`index.html`, `<head>`): `description`, Open-Graph-Angaben (`og:title`, `og:description`, `og:url`, `og:image` mit Breite, Höhe, Alternativtext, `og:site_name`, `og:locale`) und `twitter:card=summary_large_image`. Die Adressen sind absolut (`https://nosz.github.io/money-app/`), weil Vorschau-Dienste keine relativen Adressen lesen. Zieht die App um, diese Adressen anpassen (zusammen mit `GITHUB_URL`).
- **Vorschaubild** `og-image.png`, 1200 × 630 px: Münzen-Symbol, „MoneyApp“, „Dein Haushaltsbuch fürs Handy“ und drei Vertrauenspunkte (Kostenlos, ohne Konto / Daten nur auf deinem Gerät / Open Source auf GitHub). Liegt im Hauptordner, nicht im Service Worker (wird nur von außen gelesen).
- **Nachricht** (`shr_t`, Deutsch und Englisch): neutral und an den Empfänger gerichtet, ohne „mein/meine“ (die Nachricht wird von beliebigen Nutzern verschickt). Wortlaut: „Die MoneyApp: Haushaltsbuch fürs Handy. Kostenlos, ohne Konto, ohne Werbung. Deine Daten bleiben nur auf deinem Gerät. Hier kannst du sie ansehen:“. Nicht in Ich-Form und nicht persönlich-einladend („Schau dir mal …“).
- Vorschau-Dienste (WhatsApp, Telegram, iMessage) speichern Vorschauen zwischen: Nach Änderungen kann die alte Vorschau noch eine Weile erscheinen. Eine geänderte Adresse (zum Beispiel `?v=2`) zeigt sofort die neue.

# 7h. Keine Installations-Hinweise

Die App zeigt nirgends eigene Installations-Hinweise: nicht im Willkommen-Fenster, nicht auf der Startseite. Entfernt wurden `obi()`, `obIns()`, `ins()`, die Variable `DP`, der Startseiten-Block mit `S.set.hd`, die Texte `inst`, `ins`, `oit`, `oi_a`, `oi_m`, `oi_i`, das Symbol `inst` und der Stil `.pv.pi`. `S.set.hd` bleibt als unbenutztes Feld in alten Daten und Backups bestehen (Datenformat nicht ändern). Der Listener `beforeinstallprompt` ruft nur `preventDefault()` auf, damit der Browser keine eigene Mini-Leiste zeigt; Installieren geht weiter über das Browser-Menü. Der Hinweis auf die Offline-Nutzung (7i) und die Symbole fürs Handy (7f) bleiben. Keine neuen Installations-Hinweise ohne ausdrücklichen Wunsch.

# 7i. Offline-Hinweis

Die App funktioniert nach dem ersten Laden ohne Internet (Service Worker, Daten lokal). Das wird kurz und sachlich genannt, ohne neue Karten:
- **Onboarding:** vierter Punkt der Liste im Willkommen-Fenster (`w4`, Symbol `off` = Bootstrap Icon `wifi-off`): „Funktioniert auch ohne Internet.“
- **App-Info:** Satz im Datenschutz-Text (`loc_i`): „Nach dem ersten Laden funktioniert die App auch ohne Internetverbindung.“ (ehrlich mit „nach dem ersten Laden“).
- **Weiterempfehlen:** in der Nachricht (`shr_t`): „… ohne Werbung, auch offline nutzbar.“
- Alle Texte in Deutsch und Englisch (`js/i18n.js`).

# 7j. Startseite ohne Doppel-Hinweis, untere Leiste über der Browser-Leiste

- **Startseite:** Solange es gar keine Buchung gibt (`!S.tx.length`), steht oben die große Karte „Erste Buchung erfassen“. Der Hinweis „Noch keine Buchungen. Tippe auf +“ (`none`) unter der Monatsbilanz entfällt dann (`mlist()` in `js/render.js`). Gibt es Buchungen, nur keine in den letzten drei Monaten, bleibt der Hinweis (oben steht dann keine Karte).
- **Untere Leiste:** Auf manchen Handys (Samsung Internet) überdeckt die Browser-Leiste unten die feste App-Leiste, bis man scrollt. `nbo()` in `js/core.js` misst den verdeckten Bereich (Layout-Viewport `clientHeight` minus `visualViewport.height` minus `offsetTop`) und setzt `--nbo`. `nav`, `.ov` (Fenster) und `#toast` heben sich um `var(--nbo,0px)`. Schutz: nur bei Zoom ≤ 1,01, nur 0–120 px (größer = Tastatur oder Fehlmessung → 0), in der installierten App immer 0. Aktualisiert bei `visualViewport` resize/scroll, `resize`, `orientationchange`, `load`. Nicht am Gerät geprüft.
- Neue feste Elemente am unteren Rand müssen `bottom: var(--nbo,0px)` bzw. `+ var(--nbo,0px)` verwenden.

# 7k. Onboarding nur ein Schritt, Kacheln mit Stift

- **Onboarding:** Nur das Willkommen-Fenster (`ob()`), der Knopf heißt „Los geht’s“ / „Get started“ (`onx`) und ruft `od()` auf (setzt `S.ob=1`, schließt, speichert). Die Maske „Kontostände“ (`ob2()`) mit den Feldern und „Später eintragen“ ist entfernt, ebenso die Texte `obk`, `obkh`, `olat`, `oopt`, `wset`. Auch „Backup importieren“ ist im Willkommen-Fenster entfernt (Text `obbk`, Datei-Feld `obf`); das Backup lässt sich weiter in den Einstellungen unter „Daten & Sicherheit“ importieren (`im()` unverändert).
- **Kacheln auf der Startseite** (`bstrip(hi, nav)` in `js/core.js`, nur mit `nav`, Banking-Look): Zeile 1 Kontosymbol und Kontoname in EINER Zeile, Zeile 2 der Betrag, alles linksbündig. Der Stift (`pen`, Bootstrap Icon `pencil`) steht rechts neben dem Betrag NUR, wenn alle drei Konten 0,00 € sind. Schrift des Namens `min(var(--fs-s),3.6vw)`, Symbol 13 px, Betrag `min(var(--fs-m),3.9vw)`, damit bei 320 px „Gespart“ und „1.234,56 €“ ohne Abschneiden passen (Der Stift steht nicht neben dem Namen, weil er bei 320 px Namen abschnitt, und nicht als Abzeichen an der Ecke.). Kein zusätzlicher Text im Normalfall (Platz sparen). In Dialogen (ohne `nav`) bleiben die Kacheln mittig ohne Stift.
- **Alle drei Konten 0,00 €:** Klasse `.bstrip.z`: gestrichelter Rand in Hauptfarbe und Stift in Hauptfarbe, darunter ein zartes Banner (`.bzh`, helle Hauptfarbe, kleines Stift-Symbol, normale Schrift, Text `bzh`: „Tippe auf ein Konto, um deinen Kontostand einzutragen.“). Sobald ein Konto ungleich 0 ist, entfallen Rand, Banner und Stift (die Kachel bleibt antippbar). Keine Animation.
- Tippen auf eine Kachel springt wie bisher zum Konto-Feld in den Einstellungen (`gk(k)`).

# 8a. Startseite: keine Monatsleiste

- Die Monatsleiste (wischbare Chips in einer zweiten Zeile der Kopfleiste) ist entfernt und wird nicht wieder eingebaut. Die Kopfleiste `#tb` besteht nur aus Home-Symbol und Titel (48 px, `--mbh` bleibt 0).
- Monate auf der Startseite werden über die Monatszeilen der Monatsliste geöffnet (`mtg()`), die Karte scrollt nach oben.

# 8b. Aktuelles Datum und Datumswechsel bei offener App

- **Anzeige:** In der Monatsleiste `mn()` (`js/render.js`) steht unter dem Monatsnamen eine kleine graue Zeile `.mnd` mit dem heutigen Tag, z. B. „Sonntag, 1. November“ (`tlab()`, Sprache aus `loc()`). Sie steht in jeder Ansicht mit Monatsleiste (Start, Buchungen, Auswertung), auch wenn ein anderer Monat gewählt ist, und zeigt immer HEUTE, nicht den gewählten Monat. Regular, `--fs-s`, Farbe `--m`; keine neuen Texte nötig.
- **`D` ist veränderlich** (`let D` in `js/core.js`), `TD` merkt den Tag (ISO), für den die Ansicht gezeichnet wurde. Alles, was „heute“ braucht (fällige Buchungen `dues()`, „Bleibt bis Monatsende“, Resttage, Standarddatum), liest `D` zum Zeitpunkt des Zeichnens. Kein Datum beim Start in eine Konstante kopieren.
- **`tick()`** (`js/app.js`) vergleicht `iso(new Date())` mit `TD`. Aufgerufen bei Rückkehr in die App (`visibilitychange`, `pageshow`, `focus`) und einmal pro Minute (`setInterval`). Bei Änderung: `D` und `TD` setzen; steht `ym` auf dem aktuellen Monat, springt er auf den neuen, ein bewusst geblätterter Monat bleibt; dann `rd()`. Auch bei zurückgestelltem Handy-Datum.
- **Nie stören:** Bei offenem Dialog (`#o`) oder fokussiertem Eingabefeld passiert nichts, der nächste Durchlauf prüft erneut (nichts Eingegebenes geht verloren). In den Einstellungen (Eingabefelder) wird nur neu gezeichnet, wenn die Auswertung offen ist (`SE.o == 'stats'`); `D` und `ym` werden trotzdem nachgezogen. Kein Toast, die Karte „fällig“ erscheint von selbst.
- **Prüfung vor jeder Lieferung:** Uhr über Mitternacht stellen (Datumszeile, Monat, Karte „fällig“ aktualisieren sich); Dialog offen (nichts passiert, nach dem Schließen Nachzug); geblätterter Monat bleibt; Eingabefeld mit Fokus; Handy-Datum zurück; Deutsch und Englisch; 320 px (Zeile bricht nicht um, Pfeile bleiben gleich hoch).

# 8c. Suche auf der Startseite

- **Platz:** Suchfeld `#hq` oben auf der Startseite, direkt unter der Monatsleiste `mn()`, volle Breite, Aufbau wie in 7b (Icon `search` links, ✕ `#hqx` rechts nur bei Eingabe, 44 px). Platzhalter nur „Suchen“ / „Search“ (`hqph`). Kein Abzeichen mit Trefferzahl im Feld (die Zahl steht in der Ergebniszeile). Feldart Suche (Abschnitt 5a, `txc(this)`, `maxlength=60`).
- **Eigener Zustand:** `HQ = { q, sc, dir, rec }` in `js/core.js`, nur im Speicher, nicht gesichert. Getrennt von `F` (Karte „Buchungen“): kein gemeinsamer Suchtext. `rd()` leert `HQ.q` außerhalb der Startseite, `go()` bei jedem Wechsel (auch Start-Symbol). Ein Neuzeichnen auf der Startseite (z. B. nach Speichern einer Buchung) behält die Suche.
- **Logik:** startet live ab 2 Zeichen (`hqa()`, Leerzeichen am Rand zählen nicht), durchsucht alle Monate. Gleiche Suchlogik wie 7b (`qam()`, `qdt()`, `qtok()`, `nrm()`); `hqm()` ergänzt den Konto-Namen (Bank, Bar, Gespart; bei Umbuchungen beide Konten). Keine Schnellfilter.
- **Ansicht:** Solange `hqa()` gilt, ist `#hm` (Konten-Kacheln, Monatsbilanz, „Bleibt bis Monatsende“, Monatsliste) `hidden` und `#hqr` zeigt Ergebniszeile (`#hqsum`) und Liste (`#hqres`). Nur `#hqr`, `#hm`, `#hqc` und `#hqx` werden neu gezeichnet (`hqs()`), das Feld behält den Fokus. Backup-Karte und Monatsleiste stehen über dem Feld und bleiben.
- **Ergebniszeile:** Anzahl (Buchung/Buchungen), Einnahmen und Ausgaben getrennt (`hqsm()`), Umbuchungen zählen nicht mit; nur Umbuchungen: nur die Anzahl. Text bricht um, wird nie abgeschnitten (`.fsum`).
- **Liste:** durchgehend über alle Monate, neueste zuerst, Sortier-Kopfzeile (`hrow(…, 'hqsort')`, Datum, Kategorie, Betrag). Zeilen wie `trow()` mit Jahr unter dem Tag; seit 1.67.0 wird auch der Konto-Name markiert (`trow(x, q, yr, ac)`, bei Umbuchungen das passende Konto); Umbuchungen tragen das Etikett „Umbuchung“. Tipp öffnet die Buchung (`ot()`), danach bleibt die Suche stehen.
- **Ohne Treffer:** nur „Keine Treffer“ / „No results“ (`hqno`), ohne Hinweis.
- **Zuletzt gesucht:** `HQ.rec`, höchstens 5, neuester zuerst, ohne Doppelte (ohne Groß-/Kleinschreibung). Gemerkt wird erst beim Tipp auf einen Treffer (`hqt()`, `hqrec()`), nie halbe Eingaben oder Suchen ohne Treffer. Anzeige als Chips (`.hqch`, 44 px) mit kleiner Beschriftung „Zuletzt gesucht“ unter dem Feld, nur solange das Feld leer ist; Tipp auf einen Chip füllt das Feld und sucht (`hqu()`).
- **Tastatur:** ✕ leert das Feld, zeigt die normale Startseite und lässt die Tastatur offen (`hqclr()`). „Suchen“/Enter und Tipp neben das Feld (`pointerdown`-Handler in `js/app.js`, außerhalb `.hqw`) schließen die Tastatur, die Treffer bleiben stehen (`hqe()` holt die Ergebniszeile nach oben). Fokus-Handler wie `#fq`: Feld rutscht nach oben, `fqf` schafft unten Platz.
- **Seit 1.66.0:** Tag und Jahr als Suchbegriff („04“, „2026“) und Markierung von Datum, Jahr und Betrag, siehe 7b. Auf der Startseite startet die Suche erst ab 2 Zeichen, ein einzelner Tag unter 10 wird als „04“ gesucht.
