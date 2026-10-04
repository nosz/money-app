# MoneyApp – Nächste Schritte (Stand 1.44.0)

Diese Datei ist für einen Coding-Agenten gedacht. Sie beschreibt den aktuellen Stand, die bereits getroffenen
Entscheidungen und die nächsten Schritte in fester Reihenfolge. Konzept: Skill „banking-eingabemasken“.

## 1. Aktueller Stand

**Version 1.44.0** (`APP_VERSION` in `js/core.js`, `CACHE_VERSION` in `service-worker.js`, beide gleich).

Fertig:

- **1.44.0: Suche in der Karte „Buchungen“ am Handy: Treffer sofort sichtbar.** Anlass (Screenshot des Nutzers): Bei offener Tastatur zentrierte `focusin` das Suchfeld mitten im Bild, Kategorie, Ergebniszeile und Treffer lagen hinter der Tastatur, der Nutzer musste scrollen. Nur Darstellung und Bedienung; Filterlogik (`fl()`, `rl()`, `fsm()`, `rs()`, `F`), Datenformat und Backup unverändert.
  1) *Fokus-Handler* (`addEventListener('focusin', …)` in `js/app.js`): Für `#fq` wird `scrollIntoView({block:'start'})` statt `center` benutzt (wie schon bei `#csi`), alle anderen Felder bleiben bei `center`. Beim Fokus bekommt der `body` die Klasse `fqf`; ein neuer `focusout`-Handler nimmt sie nach 300 ms wieder weg, wenn `#fq` den Fokus nicht mehr hat (✕ im Feld holt den Fokus zurück, die Klasse bleibt dann).
  2) *CSS* (Abschnitt „1.44.0“): `#fq{scroll-margin-top:calc(var(--stk) + 8px)}` (--stk = Kopfleiste plus Kopfzeile des geöffneten Bereichs, im `.sec` gesetzt, damit das Feld nicht unter den mitlaufenden Zeilen verschwindet) und `body.fqf #v::after{content:'';display:block;height:60vh}` (Platz unten, damit das Scrollen auch bei wenigen Treffern bis oben reicht, nur solange das Feld den Fokus hat).
  Geändert: `js/app.js`, `css/style.css`, `js/core.js` (`APP_VERSION`), `service-worker.js` (`CACHE_VERSION`), `money_app_skill.md` (Abschnitt 7b), `NAECHSTE_SCHRITTE.md`. Keine neuen Dateien, keine neuen Texte.
  Getestet in Chromium (390 und 320 px, Handy-Emulation, Deutsch und Englisch, 4 bis 40 Testbuchungen): Suchfeld steht nach dem Antippen bei 118 px direkt unter Kopfleiste (48 px) und Bereichskopf (62 px), auch bei nur vier Treffern; Klasse `fqf` nur bei Fokus im Suchfeld, weg nach dem Verlassen; ✕ leert die Suche, Feld bleibt oben; Kontofeld (anderes Feld) bekommt die Klasse nicht; keine Seitenbreite über Fenster, keine JS-Fehler. Die echte Tastatur wurde nicht simuliert: Auf dem Handy prüfen, wie viele Zeilen oberhalb der Tastatur sichtbar sind (erwartet: Suchfeld, Kategorie, Ergebniszeile mit Anzahl und Summe, Gruppenkopf und der Anfang des ersten Treffers).
  Offen/Hinweis: Reicht die Höhe bei kleinen Handys nicht für einen Treffer, wäre eine nächste Stufe, die Kategorie bei offener Tastatur auszublenden (nicht entschieden, nur auf Wunsch).

- **1.43.0: Wiederholung „Vierteljährlich“ bei wiederkehrenden Buchungen.** Neues Kürzel `q` in `r.f` (alle 3 Monate); Datenformat sonst unverändert, alte Backups bleiben lesbar (`m`, `w`, `y` wie bisher).
  1) *Fälligkeit:* `dateK(r, k)` in `js/store.js`: Monatsschritt `3 * k` bei `r.f == 'q'`. Monatsende bleibt wie bei monatlich (31.01. → 30.04. → 31.07., immer vom Startdatum `r.s` aus gerechnet).
  2) *Leiste* in `rfm()` (`js/app.js`): `['m', 'w', 'q', 'y']`, in zwei Reihen mit je zwei Feldern (`.sh .tp.rtp{flex-wrap:wrap}`, Felder `flex:1 1 calc(50% - 2px)`): „Monatlich | Wöchentlich“ oben, „Vierteljährlich | Jährlich“ unten.
  3) *Buchungsmaske* `op()`: Auswahl „Wiederholen“ unter „Weitere Angaben“ enthält „Vierteljährlich“ (Reihenfolge Nie, Monatlich, Wöchentlich, Vierteljährlich, Jährlich).
  4) *Texte:* `q` in `js/i18n.js` („Vierteljährlich“ / „Quarterly“); Hinweiszeile und Liste der wiederkehrenden Buchungen nutzen `t(r.f)` und zeigen den Text automatisch.
  Geändert: `js/store.js`, `js/app.js`, `js/i18n.js`, `css/style.css` (Abschnitt „1.43.0“), `js/core.js` (`APP_VERSION`), `service-worker.js` (`CACHE_VERSION`), `money_app_skill.md` (Abschnitt 7c), `NAECHSTE_SCHRITTE.md`. Keine neuen Dateien.
  Getestet in Chromium (390 px Deutsch, 320 px Englisch): vier Felder in zwei Reihen ohne abgeschnittenen Text, keine Seitenbreite über Fenster; Hinweiszeile „… danach vierteljährlich“ / „… then quarterly“; Fälligkeiten (01.12.2026 → 01.03.2027 …, 30.11. → 28.02., 31.01. → 30.04.); Anlegen (richtiger Wert `q` in `S.rec`), Bearbeiten (`idle` → `dirty` bei Wechsel, zurück auf `idle`), Speichern, Auswahl in der Buchungsmaske, `dues()` mit Start in der Vergangenheit; keine JS-Fehler. Echte Geräte nicht getestet.

- **1.42.0: Neue wiederkehrende Buchung (und Bearbeiten) verbessert.** Nur Darstellung und Bedienung; `nrs()`, `rsv()`, Datenformat, Backup und Fälligkeitslogik unverändert.
  1) *Feldreihenfolge* (`rfm(r, nw)` in `js/app.js`, gilt für `nrd()` und `erd()`): Typ-Leiste (nur neu), Betrag, Kategorie, Wiederholung, Erste bzw. Nächste Fälligkeit mit Hinweiszeile, Notiz zuletzt.
  2) *Kategorie* als Auswahlfeld `#rck` (`.sel`, `rckin()`): Tipp öffnet die Vollbild-Ansicht `rcp()` (Suche `#rqi`, `rcf()`, Liste `rcl()` mit Linien-Icon, nach Häufigkeit sortiert, Überschrift Ausgaben bzw. Einnahmen, Zeile „Kategorie hinzufügen“ am Ende); `rcpick(id)` setzt `RE.c`; `rback()` kehrt immer in die Maske zurück (`erd()` bzw. `nrd()`, setzt `RE.dbad = 0`, weil das Datumsfeld mit dem letzten gültigen Wert neu gezeichnet wird). Eingaben bleiben erhalten, weil `RE` alle Felder hält.
  3) *Neue Kategorie aus der Maske:* `ncs(2)` (`NC.from == 2`): Art gesperrt (Text `cty_lockr`), Bezeichnung aus der Suche vorbelegt, `ncx()` und `ac()` kehren mit `rback()` zurück, `ac()` setzt dabei `RE.c` auf die neue Kategorie.
  4) *Wiederholung* als Leiste „Monatlich | Wöchentlich | Jährlich“ (`.tp.typ.rtp`, `rft(k)` setzt `RE.f` ohne Neuzeichnen) statt Dropdown.
  5) *Hinweiszeile* `#rhint` unter dem Datum (`rhtx()`, `rhf()`, Texte `rh_1`, `rh_n`, `rh_p`): „Erste Buchung am 01.11.2026, danach monatlich.“ (bei Bearbeiten „Nächste Buchung …“), bei Datum heute oder früher zusätzlich „Bereits fällig, erscheint auf der Startseite.“, bei ungültigem Datum ausgeblendet; `rdc()` aktualisiert sie live.
  6) *Einstieg:* Knopf „Neue wiederkehrende Buchung“ in den Einstellungen (`js/render.js`, `rec()`) mit Bootstrap Icon `plus` statt „＋“.
  Geändert: `js/app.js`, `js/render.js`, `js/i18n.js` (neu `rh_1`, `rh_n`, `rh_p`, `cty_lockr`), `css/style.css` (Abschnitt „1.42.0“: Abstand Symbol und Name im Kategorie-Feld, gilt auch in der Buchungsmaske), `js/core.js` (`APP_VERSION`), `service-worker.js` (`CACHE_VERSION`), `money_app_skill.md` (Abschnitt 7c, Abschnitt 10). Keine neuen Dateien.
  Offen/Hinweis: Beim Wechsel der Art (Ausgabe/Einnahme) und beim Öffnen einer neuen Maske wird weiter die erste Kategorie der Art vorbelegt (bestehende Logik `nrt()`, nicht geändert). Falls gewünscht: leer lassen und „Kategorie wählen“ zeigen, Meldung `e_cat` beim Speichern.
  Getestet in Chromium (390 px Deutsch, 320 px Englisch): Reihenfolge der Felder, Hinweiszeile live (Wiederholung, Zukunft, heute, leeres Datum), Auswahl mit Suche, Rückkehr mit erhaltenen Eingaben (Betrag, Notiz, Datum, Wiederholung), Neue Kategorie aus der Maske (Art gesperrt, Rückkehr mit neuer Kategorie, Abbrechen), Typwechsel, Speichern (richtige Werte in `S.rec`), Bearbeiten (Hinweis „Nächste Buchung“, Zustand `idle` → `dirty`, Wiederholung geändert und gespeichert), keine Seitenbreite über 320 px, keine JS-Fehler. Echte Geräte nicht getestet.

- **1.41.0: Karte „Buchungen“ (Einstellungen) professioneller, Monatsleiste der Startseite entfernt.** Zwei Rückmeldungen des Nutzers am Handy (Screenshots). Nur Darstellung und Bedienung, Logik der Filter (`fl()`, `rl()`, `fsm()`, `F`), Datenformat und Backup unverändert.
  1) *Monatsleiste entfernt:* Die zweite Zeile der Kopfleiste (Chips wie „Okt“, `mbar()`, `mbu()`, `mgo()`, `mshort()`, `tbr()`-Teil) ist weg, die Kopfleiste ist wieder 48 px hoch (`--mbh` bleibt 0 px in `css/style.css`). Text `mbar` aus `js/i18n.js` entfernt. `mlms()` bleibt (wird von `mlist()` gebraucht), `mtg()` ruft kein `mbu()` mehr auf.
  2) *Karte „Buchungen“ (`V.lb()` in `js/render.js`):* Von oben nach unten: Umschalter „Monat | Alle Monate“ (`.fmd`, `fmd(all)`, ersetzt die Checkbox `.allm`), Monatswahl `mn()` nur im Modus „Monat“, Suchfeld mit Bootstrap Icon `search` links, kürzerem Platzhalter (`search2`: „Notiz oder Kategorie suchen“) und ✕ zum Leeren (`#fqx`, `fqc()`, neuer Text `fqc`), Beschriftung „Kategorie“ mit Auswahlfeld `#fcb` (`.fsel`, zeigt `fcin()`), Ergebniszeile `fsm()` (Knopf „Filter zurücksetzen“ jetzt mit Icon `x` statt ✕-Zeichen), Liste. Die umbrechenden Kategorie-Chips (`.chips`, `.chip`, `fc()`) sind entfernt.
  3) *Kategorie-Auswahl für den Filter* (`js/app.js`, vor `dpk()`): `fcp()` öffnet die Vollbild-Ansicht (`sheet(…, 'fs')`) mit Suche (`#fpi`, `fpf()`), oben „Alle Kategorien“, darunter Ausgaben und Einnahmen als Listen (`fpl()`, nur Kategorien mit Buchungen oder die gewählte, nach Häufigkeit sortiert, Linien-Icon über `ci()`, Anzahl der Buchungen rechts); `fcs(id)` setzt `F.c`, schließt die Ansicht und aktualisiert nur Feld, Ergebniszeile und Liste (`rs()`), ohne die Einstellungen neu zu zeichnen. Neue Texte `fpe`, `fpn` (Deutsch und Englisch). Gespeicherte Emojis eigener Kategorien bleiben als Emoji sichtbar (nur Darstellung).
  Geändert: `js/render.js`, `js/app.js`, `js/core.js` (neues Icon `search` in `BIP`, `APP_VERSION`), `js/i18n.js`, `css/style.css` (Abschnitt „1.41.0“ am Ende; Regeln für Monatsleiste, `.allm`, `.chips`, `.chip` entfernt), `service-worker.js` (`CACHE_VERSION`), `money_app_skill.md` (Abschnitt 7b neu, 8a ersetzt, Abschnitt 10). Keine neuen Dateien.
  Getestet in Chromium (390 px, Deutsch und Englisch, Testdaten): Kopfleiste 48 px ohne Monatsleiste; Karte zeigt Umschalter, Suchfeld ohne abgeschnittenen Platzhalter, Kategorie-Feld; Auswahl öffnet und schließt, Wahl setzt `F.c` und Feld, Suche in der Auswahl, ✕ leert die Suche, „Alle Monate“ blendet die Monatswahl aus, „Filter zurücksetzen“ setzt `F` zurück; keine JS-Fehler. Echte Geräte (iOS, Android) und das dunkle Theme wurden nicht gesondert geprüft.

- **1.40.0: Speichern-Knopf beim Bearbeiten erkennbar, Monatsleiste auf der Startseite (Monatsleiste seit 1.41.0 wieder entfernt).** Zwei Rückmeldungen des Nutzers am Handy (Version neu als Nebenversion, weil ein neues Bedienelement dazukommt).
  1) *Speichern-Knopf:* Beim Öffnen einer bestehenden Buchung (und jeder Bearbeiten-Maske) stand der unveränderte Knopf im Zustand `idle` mit dem Text „Gespeichert“ (grau, deaktiviert), der Nutzer sah „den Speichern-Button nicht“. Jetzt heißt er in allen Masken auch im Zustand `idle` „Speichern“ / „Save“ (weiterhin grau und deaktiviert, wird bei einer Änderung aktiv). `svr()` in `js/app.js`: `txt = lb || t('save')`. Die Kontofelder (`kSt()`) behalten „Gespeichert“. Zustände, Hinweiszeile und Verwerfen-Rückfrage unverändert. Die Knopfzeile `.stkb` war auch mit simulierter Tastatur sichtbar (Chromium); echte Geräte weiter ungetestet.
  2) *Monatsleiste:* Anlass: Nach dem Antippen eines Monats scrollt die Ansicht nach oben, andere Monate waren dann nicht mehr erreichbar. Jetzt klebt in der Kopfleiste `#tb` eine zweite Zeile mit wischbaren Chips (`mbar()`, `.mbc`, 44 px hoch): ein Chip je Monat der Monatsliste, ältester links, immer sichtbar. Tipp auf einen Chip (`mgo(m)`): Monat öffnen, die anderen zuklappen, Monatskarte nach oben scrollen. Offene Monate sind im Chip markiert (`mbu()`, auch beim Öffnen über die Monatszeile in `mtg()`).
  Geändert: `js/render.js` (neu `mlms()` aus `mlist()` herausgezogen, `mshort()`, `mbar()`, `mbu()`, `mgo()`; `tbr()` baut zwei Zeilen und setzt `--mbh`; Monatskarte `.mh` bekommt `data-m`; `mtg()` ruft `mbu()`), `js/i18n.js` (neuer Text `mbar`, Deutsch und Englisch), `css/style.css` (`--mbh`, `--tbh` = 48 px + `--mbh`, `#tb` als Spalte, Abschnitt „1.40.0“: `.tbr1`, `.mbar`, `.mbc`), `js/app.js`, `js/core.js` (`APP_VERSION`), `service-worker.js` (`CACHE_VERSION`), `money_app_skill.md` (5b und neuer Abschnitt 8a). Keine neuen Dateien, Datenformat und Backup unverändert.
  Da `--tbt` mitwächst, kleben Monatszeilen, Einstellungs-Bereiche und Scroll-Ziele automatisch unter der größeren Kopfleiste (nur auf der Startseite, in den Einstellungen bleibt sie 48 px).
  Getestet in Chromium (390 px Deutsch, 320 px Englisch, drei Monate mit Testbuchungen): drei Chips (44 px), Kopfleiste 96 px; Tipp auf ältesten und neuesten Monat öffnet nur diesen, schließt die anderen und setzt die Monatskarte direkt unter die Leiste; beim Scrollen bleiben Leiste und Monatszeile oben; manuelles Öffnen markiert den Chip; Einstellungen ohne Leiste (48 px); Bearbeiten-Maske zeigt „Speichern“ / „Save“ (idle, nach Änderung dirty, nach Zurückändern wieder idle); keine JS-Fehler.

- **1.39.0: Home-Symbol oben wie unten, Home springt zum aktuellen Monat.**
  1) Das Home-Symbol in der Kopfleiste ist jetzt dasselbe wie in der unteren Leiste (`NI.home`, Haus mit €, 32 px), mit denselben Farben (`var(--m)` mit 75 % Deckkraft, auf der Startseite `var(--gold)` mit hellem Hintergrund 14 %). Das Bootstrap Icon `house` (1.38.0) ist wieder aus `BIP` entfernt.
  2) `go(x)` in `js/render.js` setzt bei `x == 'home'` den Monat `ym` auf den aktuellen Monat (`iso(D).slice(0, 7)`), springt nach oben und zeichnet neu. Das gilt für das Symbol oben und für „Start“ unten (beide rufen `go('home')`). Gilt auch, wenn man schon auf der Startseite ist.
  Geändert: `js/render.js` (`tbr()`, `go()`), `js/core.js` (`BIP.house` entfernt, `APP_VERSION`), `css/style.css` (Abschnitt „1.38.0“: `.tbh` 48 × 44 px, `svg.ni`, aktueller Zustand), `service-worker.js` (nur `CACHE_VERSION`). Keine neuen Texte, Datenformat und Backup unverändert.
  Getestet in Chromium (390 px): Monat 2 Mal zurück, Tipp auf Home oben stellt den aktuellen Monat ein; „Start“ unten aus den Einstellungen mit anderem Monat ebenso; Icon oben und unten je 32 px; Einstellungen ohne Markierung; keine JS-Fehler.

- **1.38.0: Kopfleiste mit Home-Symbol oben links (Startseite und Einstellungen).** Anlass: Wer in Einstellungen → Konten ein Feld bearbeitet (z. B. Bar nach Tipp auf die Kachel), sieht bei offener Tastatur keinen Weg zur Startseite, weil die untere Leiste dann ausgeblendet wird (`.kb #nav`).
  Geändert: `index.html` (neues `<header class="w" id="tb">` vor `#v`), `js/render.js` (neue Funktion `tbr()`, wird am Anfang von `rd()` aufgerufen; Home-Knopf ruft `go('home')`, daneben der Titel der Ansicht `t('home')` / `t('set')`), `js/core.js` (neues Icon `house` in `BIP`, `APP_VERSION`), `css/style.css` (Abschnitt „1.38.0“ am Ende; Variablen `--tbh` 48 px und `--tbt` = Höhe plus Rand oben; `--stk`, `.sec`, `.sec.open>button` und `.tps` kleben jetzt unter der Leiste; `#v.w` oben nur noch 12 px, weil die Leiste den Rand oben übernimmt), `service-worker.js` (nur `CACHE_VERSION`). Keine neuen Dateien, keine neuen Texte.
  Verhalten: Die Leiste ist `position:sticky`, bleibt beim Scrollen und bei offener Tastatur sichtbar, Knopf mindestens 44 × 44 px. Auf der Startseite ist das Symbol als aktuelle Seite markiert (`aria-current=page`, Hauptfarbe), ein Tipp dort springt nach oben. Dialoge (`.ov`, z-index 9) liegen über der Leiste und behalten nur das ✕ (Entscheidung, siehe Abschnitt 2).
  Mitlaufende Überschriften (Monate, Bereiche, Gruppen, Umschalter der Auswertung) und Scroll-Ziele (`.mh`, `.sec`) berücksichtigen die Leiste über `--tbt`. Logik, Datenformat und Backup unverändert.
  Getestet in Chromium (390 und 320 px): Leiste oben fix, Monat aufklappen landet bei 56 px (unter der Leiste), Konten mit simulierter Tastatur zeigen Home, Home-Tipp aus den Einstellungen führt zur Startseite, Dialog liegt über der Leiste, keine JS-Fehler. Echte Tastatur auf iOS und Android nicht getestet.

- **1.37.2: Monat auf der Startseite aufklappen, Buchungen sofort sichtbar.** Anlass: Nach dem Aufklappen eines Monats (Karte „Monatsliste“ unter „Monatsbilanz“ und „Bleibt bis Monatsende“) lagen die Buchungen unterhalb des sichtbaren Bereichs, der Nutzer musste erst scrollen.
  Geändert: `js/render.js` (neue Funktion `mtg(m, el)` vor `mlist()`; `ontoggle` der Monats-`<details>` ruft sie statt direkt `HS.o[m]=this.open` auf), `css/style.css` (am Ende: `.mh{scroll-margin-top:calc(var(--stk) + 8px)}`), `js/core.js` (`APP_VERSION`), `service-worker.js` (`CACHE_VERSION`).
  Ablauf: `mtg()` merkt den Zustand in `HS.o[m]`. Öffnet der Nutzer den Monat (vorher zu, jetzt offen), scrollt `scrollIntoView({block:'start'})` nach einem Frame die Karte `.mh` nach oben, sanft (bei „Bewegung reduzieren“ ohne Animation). Beim Zuklappen und beim Neuzeichnen über `rd()` (Monat schon als offen gemerkt) wird nicht gescrollt. Der Abstand oben kommt aus `--stk` (Rand oben plus 8 px), damit die mitlaufende Monatszeile nichts verdeckt.
  Logik, Datenformat, Backup, Filter und Sortierung unverändert. Keine neuen Texte.
  Getestet in Chromium (390 px, Testbuchungen in zwei Monaten): Aufklappen setzt die Karte auf 8 px unter den oberen Rand, Zuklappen und `rd()` springen nicht, keine JS-Fehler.

- **1.37.1: Korrektur „Konto-Kacheln fehlen bei überall 0“.** Fund: In der Karte „Monatsbilanz“ auf der Startseite fehlten die Kacheln Bar, Bank und Gespart (und die Zeile „Gesamtguthaben“), solange kein Startwert gespeichert, keine Umbuchung und keine Bar-Buchung vorhanden war.
  Ursache: `balOn()` in `js/core.js` war dann `false`, `bstrip()` lieferte leeren Text; `V.home()` in `js/render.js` zeigte die Kacheln nur bei `balOn()`, „Gesamtguthaben“ nur bei `hasSt()`; die Kachel „Gespart“ erschien nur bei gesetztem Sparwert oder Saldo ungleich 0.
  Geändert: `js/core.js` (`balOn()` liefert immer `true`; `bstrip()` zeigt immer `bar`, `bank`, `spar`; `APP_VERSION`), `js/render.js` (`V.home()`: Kacheln und „Gesamtguthaben“ immer), `service-worker.js` (nur `CACHE_VERSION`).
  Folge von `balOn() = true`: Kontostände erscheinen auch an den Konto-Knöpfen in Buchung und Umbuchung, in der Live-Vorschau `bnu()` („Danach“) und im Toast nach dem Speichern, auch bei 0,00 €. Berechnung (`bal()`, `hasSt()` für „Bleibt bis Monatsende“), Datenformat, Backup und Import unverändert.
  Getestet in Chromium (390 px, ohne Daten): Startseite zeigt Bar, Bank, Gespart je 0,00 € und Gesamtguthaben 0,00 €, Buchungsmaske öffnet, keine JS-Fehler.

- **1.37.0: Validierung aller Eingabefelder, Speichern-Zustände, Verwerfen-Rückfrage** (Skill 5a und 5b, Spezifikation siehe Abschnitt 3, Schritt 1).
  Geändert: `js/app.js` (neuer Block nach `rej()`: `amn()`, `amc(el, neg)`, `dgc()`, `txc()`, `dvl()`, `typed()`, `SN`, `CUR`, `NW`, `BADF`, `sbs()`, `svr()`, `dcl()`, `dscAsk()`/`dscN()`/`dscY()`;
  `kLive()` mit Filter, neu `kSt()`, `kDone()`; `sheet(h, cls, mk)`, `cl()`, `hd(ti, cx)`, `svb(sx, cx, lb, mk)`; Maskenfunktionen `ot()`, `op()`, `dpk()`, `sv()`, `cfa()`, `caLive()`, `er()`, `nrc()`, `rfm()`, `rdc()`, `rdBad()`, `rsv()`, `nrs()`, `ncm()`, `ncs()`, `ecs()`, `ipk()`, `pn()`, `lk()`),
  `js/core.js` (`num()` streng, `APP_VERSION`), `js/render.js` (`kto()`: Knopf-Zustände, Hinweiszeile, Enter-Verhalten, Suchfeld `fq`), `js/i18n.js` (neue Texte `unsv`, `dsc_t`, `dsc_m`, `dsc_y`, `dsc_n`, `e_date`),
  `css/style.css` (Abschnitt „1.37.0“), `service-worker.js` (nur `CACHE_VERSION`). Datenformat, Backup und Import unverändert.
  Ergebnis: Buchstaben lassen sich in keinem Zahlenfeld mehr tippen oder einfügen (Kontostände, Buchung, wiederkehrend, Betrag ändern, Willkommen); Einfügen von „1.234,56 €“ ergibt 1234,56; PIN nur Ziffern (auch Sperrbild);
  alle Textfelder mit `maxlength`; Datum geprüft (2000 bis 2100); Live-Meldungen (Betrag 0, gleiches Konto, Konto-Minus, Kategorie-Dublette, Datum, PIN abweichend); Speichern-Knopf `idle`/`dirty`/`bad`/`done`;
  Zeile „Nicht gespeicherte Änderung“; Verwerfen-Rückfrage bei ✕, Abbrechen, Escape, Zurück-Geste und Tipp neben das Fenster.
  Konten: nach dem Speichern 2 Sekunden grün „✓ Gespeichert“ (kein Toast mehr), Enter speichert nur bei aktivem Knopf. Masken, die sich beim Speichern schließen, behalten den Toast.
  Getestet in Chromium (390 und 320 px, Deutsch und Englisch): 71 automatische Prüfungen bestanden, keine JS-Fehler (Filter, Einfügen, Zustandswechsel, Zurückändern, Rückfrage, Zurück-Geste, Datum, Dublette, PIN, Umbuchung, Konto-Minus, Bearbeiten und Speichern).
- **1.36.2: nur Dokumentation (Skill).** Kein Code geändert (nur `APP_VERSION`/`CACHE_VERSION`). Neue Nutzer-Vorgaben stehen im Skill (Abschnitt 5a, 7a, 10):
  Eingabe-Filter (keine Buchstaben in Zahlenfeldern, auch nicht per Einfügen), Live-Prüfung in allen Dialogen, Speichern-Knopf mit Zuständen
  (unverändert deaktiviert/„Gespeichert“, geändert und gültig aktiv, ungültig deaktiviert). Umsetzung folgt in 1.37.0 (Schritt 1 unten).
  Fund im Code: Die Konto-Felder (`#st_<k>`, `#ob_<k>`) hatten keinen Filter, und `num()` las „12abc“ als 12.
- **1.36.1: Speichern-Knopf beschriftet.** Rückmeldung des Nutzers: Nur ein Haken ist nicht als „Speichern“ erkennbar. Der Knopf `.ks` neben den
  Kontofeldern zeigt jetzt Haken plus Text `t('save')` („Speichern“ / „Save“), Schrift 1rem, Polster 0 14px (unter 360 px Breite 0,9rem und 0 10px).
  Geändert: `js/render.js` (`kto()`), `css/style.css` (Abschnitt „1.36.1“ ersetzt „1.36.0“), `js/core.js` und `service-worker.js` (nur Version).
  `aria-label`/`title` entfallen (sichtbarer Text). Skill ergänzt: Speichern-Knöpfe sind nie nur ein Symbol (Abschnitt 5, 7a und 10). Getestet in Chromium
  bei 390 und 320 px (Deutsch und Englisch), keine JS-Fehler; Logik von `ktoSave(k)` unverändert.
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

- Konten-Einstellungen (1.36.0): Ein Speichern-Knopf pro Konto neben dem Feld (speichert nur dieses Konto), mit beschriftetem Knopf (Haken plus Text „Speichern“, ab 1.36.1; ein reiner Haken war nicht erkennbar, mindestens 44 px); der gemeinsame Knopf unten entfällt; der Willkommen-Dialog `ob2()` bleibt unverändert
  (dort speichert „Los“ alle Felder).

- Konto-Kacheln (1.37.1): Bar, Bank und Gespart sowie „Gesamtguthaben“ werden in der Monatsbilanz immer angezeigt, egal wie hoch die Werte sind (auch überall 0,00 €). Konto-Knöpfe in Buchung und Umbuchung zeigen die Kontostände ebenfalls immer.

- Monat aufklappen (1.37.2): Die Ansicht scrollt sanft so, dass die Monatszeile oben steht; die Monatsliste bleibt unter den Karten der Startseite (Aufbau der Startseite unverändert, Variante 2 „Monatsliste ganz oben“ wurde verworfen).

- Home-Symbol (1.38.0): oben links in den Hauptansichten (Start und Einstellungen), fest und beim Scrollen sichtbar; auf der Startseite als aktuelle Seite markiert. Kein Home in den Dialogen (Variante „Home auch im Dialog“ wurde verworfen, Grund: Verwechslung mit ✕, Datenverlust-Risiko, verschachtelte Fenster).

- Home (1.39.0): Das Symbol oben ist das gleiche wie unten (gleiche Größe und Farben). Home oben und „Start“ unten verhalten sich gleich: Startseite und aktueller Monat.

- Speichern-Knopf beim Bearbeiten (1.40.0): Der unveränderte Knopf bleibt grau und deaktiviert, heißt aber „Speichern“ statt „Gespeichert“ (Variante „bleibt Gespeichert“ verworfen). Gilt für alle Masken, nicht für die Kontofelder.

- Monatsleiste (1.40.0, **seit 1.41.0 entfernt** auf Wunsch des Nutzers, nicht wieder einbauen): Wischbare Chips in einer zweiten Zeile der Kopfleiste, immer sichtbar auf der Startseite (Variante „Pfeile ‹ › in der Monatszeile“ verworfen). Tipp auf einen Chip öffnet diesen Monat, klappt die anderen zu und scrollt die Monatskarte nach oben (Variante „andere Monate bleiben offen“ verworfen). Chips = Monate der Monatsliste (aktueller und zwei davor, nur mit Buchungen).

- Karte „Buchungen“ (1.41.0): Kategorie-Filter als Auswahlfeld mit Vollbild-Auswahl wie in der Buchungsmaske (Variante „eine wischbare Chip-Zeile“ verworfen); „Alle Monate“ als Umschalter „Monat | Alle Monate“ (Variante „Checkbox schlichter gestalten“ verworfen); Suchfeld mit Icon `search`, kürzerem Platzhalter und ✕ zum Leeren (Variante „nur Emoji ersetzen“ verworfen); Ergebniszeile mit „Zurücksetzen“ bleibt direkt unter den Filtern, Knopf mit Icon `x` (Variante „Zusammenfassung über den Filtern“ verworfen).

- Wiederkehrende Buchung (1.42.0, ersetzt die Entscheidung aus 1.31.0 „Kategorie als normales Auswahlfeld, keine Vollbild-Kategorieliste“): Maske selbst verbessern (Variante „nur Einstieg und Ablauf“ verworfen); Kategorie mit Auswahl-Ansicht inklusive „Kategorie hinzufügen“; Wiederholung als Leiste; Hinweiszeile unter der Fälligkeit (Variante „nur Datumsfeld“ verworfen); Reihenfolge Typ, Betrag, Kategorie, Wiederholung, Fälligkeit, Notiz zuletzt (Variante „unverändert“ verworfen). Keine Konto-Leiste (Entscheidung 1.31.0 gilt weiter).

- Wiederholung „Vierteljährlich“ (1.43.0): Neues Kürzel `q` (alle 3 Monate); Leiste der wiederkehrenden Buchung in zwei Reihen mit je zwei Feldern (Variante „eine Reihe mit vier Feldern“ verworfen); Reihenfolge „Monatlich | Wöchentlich“ oben, „Vierteljährlich | Jährlich“ unten (Variante „nach Rhythmus sortiert“ verworfen). Die Auswahl in „Weitere Angaben“ der Buchungsmaske bekommt den Eintrag ebenfalls.

- Suche in der Karte „Buchungen“ am Handy (1.44.0): Suchfeld rutscht beim Antippen direkt unter die Kopfleiste, darunter sofort Kategorie, Ergebniszeile und erste Treffer (Variante „Vollbild-Suchansicht“ verworfen, Grund: zusätzlicher Bildschirm, Monat und Kategorie dort nicht sichtbar). Gilt nur für `#fq`.

## 3. Nächste Schritte (in dieser Reihenfolge, je eine Version)

### ERLEDIGT in 1.37.0 – Professionelle Validierung ALLER Eingabefelder, Speichern-Zustände, Verwerfen-Rückfrage [Nutzer-Vorgabe, Skill 5a und 5b]
Anlass: In Zahlenfelder ließen sich Buchstaben einfügen (Konto-Felder `#st_<k>`/`#ob_<k>` ohne Filter, `num()` las „12abc“ als 12). Jetzt gilt überall:

**A. Validierung (Skill 5a), jedes Feld nach Feldart:**
- `amc(el, neg)` (`js/app.js`): nur Ziffern, ein Trenner, 2 Nachkommastellen, höchstens 9 Stellen vor dem Trenner, optional führendes Minus (`neg`, nur Konten); schlaues Einfügen („1.234,56 €“ → 1234,56) über `amn()` und `event.inputType`; rotes Blinken `.rej`, wenn etwas entfernt wurde. Einsatz in: `ia` (Buchung), `ra` (wiederkehrend), `ca_a` (Betrag ändern), `st_<k>`, `ob_<k>` (über `kLive()`).
- `num()` (`js/core.js`) streng: nur reine Zahlen, sonst `null`.
- `dgc(el)`: PIN nur Ziffern in `pn1`, `pn2` und im Sperrbild `lk()`.
- `txc(el)` + `maxlength`: Notiz `ino` (100), Bezeichnung `nn` (30, Live-Prüfung leer/Dublette), `rn` (80), Suchfelder `csi`, `isi`, `fq` (60), Emoji `ni` (12).
- `dvl(v)`: Datum gültig und 2000-01-01 bis 2100-12-31 (`idd`, `rd`; `min`/`max` am Feld, Meldung neuer Text `e_date`, Speichern gesperrt).
- Alle Prüfungen laufen zusätzlich beim Speichern (`sv()`, `rsv()`, `nrs()`, `cfs()`, `ac()`, `ecv()`, `pns()`, `ktoSave()`, `od()`).

**B. Speichern-Knopf (Skill 5b), Entscheidungen des Nutzers:**
- Zustände `idle` / `dirty` / `bad` / `done` (`data-s` am Knopf), sofort beim Tippen; nach dem Speichern 2 Sekunden grün „✓ Gespeichert“ (Konten, ohne Toast), Masken, die sich schließen, behalten den Toast.
- Zeile „Nicht gespeicherte Änderung“ über dem Knopf (Masken: `.dhint` in `.stkb`; Konten: `#st_h_<k>`).
- Verwerfen-Rückfrage „Änderungen verwerfen?“ (Verwerfen / Weiter bearbeiten, gestapelt) beim Schließen mit ungespeicherten Änderungen (✕, Abbrechen, Escape, Zurück-Geste, Tipp daneben). Ohne Änderung schließt die Maske direkt.
- Bearbeiten-Masken und Einzelfeld-Dialoge starten `idle`; neue Masken lassen „Speichern“ aktiv.
- Umsetzung: `svb(sx, cx, lb, mk)`, `svr()`, `kSt(k)`, `kDone(k)`, `SN`/`CUR`, `dirtyNow()`, `dcl(fn)`, `dscAsk(fn)`; `sheet(h, cls, mk)` merkt das Masken-Kürzel (`x` Buchung, `n` Kategorie, `r` wiederkehrend, `c` Betrag ändern, `p` PIN).

### Schritt 1 – Tastatur- und Eingabe-Test auf echten Geräten [Punkt D, erweitert in 1.37.0]
- iOS und Android: Der Speichern-Knopf (`.stkb`) darf in allen Masken nicht von der Tastatur verdeckt werden. Neu: Auch die Speichern-Knöpfe neben den Kontofeldern (Einstellungen → Konten, `.ks`) müssen bei offener Tastatur erreichbar bleiben.
- Besonders prüfen: Bezeichnung (Kategorie), Betrag und Notiz (Buchung), Suchfelder der Auswahl-Ansichten.
- Neu in 1.37.0 mitprüfen: Die Hinweiszeile „Nicht gespeicherte Änderung“ (`.dhint`) macht die feste Knopfzeile (`.stkb`) höher; die Meldungen am Feld (`evis()`) müssen bei offener Tastatur weiter ganz sichtbar bleiben.
- iOS: Die Dezimaltastatur (`inputmode=decimal`) hat kein Minus. Für Bank im Minus prüfen, ob ein Minus eingegeben werden kann; falls nicht, für die Kontofelder auf `inputmode=text` mit Filter (`amc(el, true)`) umstellen (Entscheidung beim Nutzer).
- Einfügen aus der Zwischenablage auf dem Gerät testen (Beträge mit Währungszeichen, Tausenderpunkt, Buchstaben). `amc()` erkennt das Einfügen über `event.inputType`; Tastaturen ohne `inputType` verhalten sich wie Tippen.
- Ergebnis als Rückmeldung an den Nutzer. Nur bei Mängeln eine Korrekturversion bauen.

## 4. Offene Punkte und optionales Aufräumen

- Nach Rückmeldung des Nutzers zu 1.37.0 (Test am Handy) zuerst eventuelle Korrekturen einbauen.
- Entscheidung 1.37.0: Der grüne Zustand „✓ Gespeichert“ gilt nur für Knöpfe, die nach dem Speichern sichtbar bleiben (Konten). Masken, die sich beim Speichern schließen, bestätigen mit dem Toast. Falls der Nutzer auch dort den grünen Knopf sehen will: Schließen um etwa 600 ms verzögern (`sv()`, `ecv()`, `ac()`, `rsv()`, `nrs()`, `pns()`, `cfs()`), nur auf Wunsch.
- Notizlänge `ino` ist jetzt auf 100 Zeichen begrenzt (vorhandene längere Notizen bleiben erhalten und bearbeitbar).

- Nach Rückmeldung des Nutzers zu 1.29.0 bis 1.36.0 (Test am Handy) zuerst eventuelle Korrekturen einbauen.
- Bekannte Eigenheit: Wählt der Nutzer für eine Standardkategorie im Emoji-Reiter genau ihr Standard-Emoji,
  wird in der Anzeige weiterhin das Linien-Icon gezeigt. Falls das stört: `CATD`-Zuordnung zusätzlich an ein
  Merkmal knüpfen (z. B. nur anwenden, wenn die Kategorie nie bearbeitet wurde).
- Optionales Aufräumen: Die CSS-Regel `.stk` (Zeile mit `position:sticky;bottom:calc(76px …`) wird seit 1.36.0 nicht mehr benutzt; vor dem Löschen per Suche in `js/*.js` bestätigen.
- Bei jeder Lieferung: `APP_VERSION` und `CACHE_VERSION` gleichzeitig erhöhen, neue Dateien in `ASSETS`
  (`service-worker.js`) eintragen, ZIP nach der Version benennen (`money_app_<x_y_z>.zip`).

## 5. Prüfliste nach jeder Lieferung

- [ ] 1.44.0 am Handy (iOS und Android): Einstellungen → Buchungen, Suchfeld antippen: es rutscht unter die Kopfleiste und den Bereichskopf „Buchungen“, über der Tastatur stehen Kategorie, Ergebniszeile (Anzahl und Summe) und der Anfang der Treffer; Tippen ändert die Position nicht; ✕ leert die Suche, Feld bleibt oben; Tastatur schließen: Seite springt nicht unruhig; bei sehr wenigen Treffern keine große Leerfläche nach dem Schließen; andere Felder (Konten, Masken) verhalten sich wie vorher; Deutsch und Englisch?
- [ ] 1.43.0 am Handy: Neue wiederkehrende Buchung: Leiste zeigt zwei Reihen („Monatlich | Wöchentlich“, „Vierteljährlich | Jährlich“), voller Text auch bei kleinem Handy; „Vierteljährlich“ wählen, Hinweiszeile „… danach vierteljährlich“; speichern, in den Einstellungen erscheint „Vierteljährlich“ in der Liste; Fälligkeit nach 3 Monaten; bearbeiten und Rhythmus wechseln; in der Buchungsmaske unter „Weitere Angaben“ „Vierteljährlich“ wählbar; Deutsch und Englisch?
- [ ] 1.40.0 am Handy: Buchung antippen (Bearbeiten): Knopf unten heißt „Speichern“ (grau), nach einer Änderung aktiv mit „Nicht gespeicherte Änderung“, auch bei offener Tastatur sichtbar (iOS und Android); Startseite: Monatsleiste unter „Start“ sichtbar, Tipp auf einen Monat öffnet ihn und klappt die anderen zu, Leiste bleibt beim Scrollen und ganz oben; Monatszeile klebt direkt unter der Leiste; Einstellungen ohne Leiste; Notch/Statusleiste (iPhone) überdeckt nichts; Deutsch und Englisch?
- [ ] 1.39.0 am Handy: Home oben sieht aus wie „Start“ unten; anderen Monat wählen, dann Home oben und „Start“ unten antippen: aktueller Monat erscheint, Ansicht springt nach oben; aus den Einstellungen ebenso; Deutsch und Englisch?
- [ ] 1.38.0 am Handy: Home-Symbol oben links auf Start und in Einstellungen, bleibt beim Scrollen; in Einstellungen → Konten bei offener Tastatur (Bar, Bank, Gespart) sichtbar und antippbar; Tipp führt zur Startseite; Monat aufklappen, mitlaufende Überschriften und Auswertungs-Umschalter kleben unter der Leiste (nicht dahinter); Notch/Statusleiste (iPhone) überdeckt nichts; Dialoge zeigen keine Leiste; Deutsch und Englisch?
- [ ] 1.37.2 am Handy: Startseite, Monat antippen: Monatszeile steht oben, Buchungen sofort sichtbar; Zuklappen springt nicht; mehrere Monate nacheinander; Filter über die Kacheln (Ausgaben/Einnahmen/Umbuchung) und Sortierung ändern die Position nicht; Deutsch und Englisch?
- [ ] 1.37.1 am Handy: Neue Installation ohne Daten (alles 0): In der Monatsbilanz stehen Bar, Bank, Gespart und Gesamtguthaben; Buchungsmaske und Umbuchung zeigen Kontostände 0,00 €; Deutsch und Englisch?

- [ ] 1.37.0 am Handy: In Konten, Buchung, wiederkehrender Buchung, „Betrag ändern“ und PIN Buchstaben tippen und einfügen (nichts kommt an), „1.234,56 €“ einfügen (ergibt 1234,56), Wert ändern und zurückändern (Knopf und Zeile „Nicht gespeicherte Änderung“ wechseln mit), Konto speichern (2 Sekunden grün, dann grau „Gespeichert“), Maske mit Änderung schließen (Rückfrage „Änderungen verwerfen?“, beide Knöpfe), Zurück-Geste mit Änderung, ohne Änderung schließt direkt, Deutsch und Englisch?

- [ ] Einstellungen → Konten am Handy: Knopf „Speichern“ (Haken plus Text) neben jedem Feld sichtbar ohne Scrollen, auch bei 320 px Breite noch genug Platz zum Tippen, gut treffbar, speichert nur das eigene Konto, Eingaben in anderen Feldern bleiben stehen, Meldung bei Bar/Gespart unter 0 und bei ungültiger Zahl, Texte Deutsch und Englisch?
- [ ] Fehlermeldungen am Handy mit offener Tastatur: Kategorie (Name leer, Name doppelt), Betrag ändern (0), PIN (zu kurz) – Meldung ganz sichtbar über der Knopfzeile, ohne selbst zu scrollen? Auch auf kleinen Handys und im Querformat.
- [ ] Nach dem CSS-Aufräumen (1.35.0) am Handy kurz alle Masken ansehen: Buchung, Umbuchung, Kategorie neu/bearbeiten, Symbol-Auswahl (Symbole und Emoji), wiederkehrende Buchung, PIN, Löschen-Rückfrage – sieht alles aus wie in 1.34.0?
- [ ] Knopfzeile am Handy (Buchung, Umbuchung, Kategorie neu/bearbeiten, wiederkehrende Buchung neu/bearbeiten, Betrag ändern, PIN setzen): „Abbrechen“ und „Speichern“ in einer Zeile, beide gut treffbar, Texte auf Deutsch und Englisch ohne Umbruch, Tastatur verdeckt die Zeile nicht, „Abbrechen“ schließt ohne Speichern (Kategorie aus der Buchung: zurück in die Buchung)?
- [ ] Kategorien am Handy: gleicher Name in derselben Art (auch „ESSEN “ statt „Essen“) wird mit einzeiliger Meldung abgelehnt (bei geöffneter Tastatur voll sichtbar), in der anderen Art erlaubt; Umbenennen auf vorhandenen Namen wird abgelehnt; Symbol ändern bei bestehender Dublette funktioniert?
- [ ] Alle Masken gleicher Aufbau (Titel + ✕, Beschriftungen oben, Knopfzeile „Abbrechen | Speichern“ in einer Zeile fest unten)?
- [ ] Alle Speichern-Knöpfe beschriftet (Haken plus Text), nirgends nur ein Symbol?
- [ ] Texte in Deutsch und Englisch?
- [ ] Service Worker aktualisiert (neue Dateien, neue `CACHE_VERSION`)?
- [ ] Alte Backups weiter importierbar (Datenformat unverändert)?
- [ ] Bestehende Prüfungen unverändert (Betrag 0, gleiches Konto, Konto-Minus, Doppelbuchung)?
- [ ] Buchungsmaske unverändert, falls nicht Teil der Aufgabe?
- [ ] Wiederkehrende Buchung am Handy: neu anlegen, bearbeiten, löschen, Fehlermeldungen bei leerem Betrag, Speichern nicht von Tastatur verdeckt?
- [ ] Kleine Dialoge am Handy: Löschen-Rückfrage, PIN setzen und eingeben, Backup-Karte (Symbol, „Später“), Import-Dialog?
- [ ] Umbuchung am Handy: sechs Knöpfe gut treffbar, Tauschen, gleiches Konto, Warnung bei Minus, Speichern nicht von Tastatur verdeckt?
