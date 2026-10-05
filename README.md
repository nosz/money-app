# MoneyApp

**Einfaches Haushaltsbuch als Web-App: Einnahmen und Ausgaben erfassen, Konten im Blick behalten, alle Daten bleiben auf deinem Gerät.**

*A simple household budget app for the web: track income and expenses, keep an eye on your accounts, and keep all data on your own device.*

---

## Überblick

Die MoneyApp ist eine Progressive Web App (PWA) für das Handy. Sie lässt sich im Browser nutzen oder wie eine App auf dem Startbildschirm installieren und funktioniert danach auch offline. Es gibt kein Konto, keine Anmeldung, keine Werbung und kein Tracking.

Das Design ist ruhig und klassisch, angelehnt an Banking-Apps. Bedient wird sie zuerst mit dem Daumen (Mobile-First), Tablet und Desktop werden mit unterstützt.

## Funktionen

- **Buchungen:** Ausgaben, Einnahmen und Umbuchungen zwischen Konten, mit Betrag, Kategorie, Datum und Notiz
- **Konten:** Bank, Bar und Gespart mit jeweils eigenem Kontostand
- **Kategorien:** Standardkategorien und eigene Kategorien mit Symbol (Bootstrap Icons oder Emoji)
- **Wiederkehrende Buchungen:** monatlich, wöchentlich, vierteljährlich oder jährlich, mit Anzeige der Fälligkeit
- **Auswertung und Filter:** Monats- und Gesamtansicht, Suche nach Notiz, Kategorie, Betrag, Datum, Tag oder Jahr (mehrere Wörter, Umlaute egal, Treffer in Datum und Betrag markiert) mit Trefferzahl im Suchfeld, Summe der Treffer; Suche auch in der Kategorienliste und direkt auf der Startseite (über alle Monate, auch nach Konto, mit „Zuletzt gesucht“)
- **Backup:** Komplett-Sicherung als Datei erstellen und wieder importieren, mit Backup-Erinnerung
- **CSV-Export:** Buchungen als Tabelle für Excel, LibreOffice und Co.
- **PIN-Sperre:** optionaler Schutz mit 4 bis 6 Ziffern
- **Darstellung:** Farbschema und Schriftgröße einstellbar
- **Sprachen:** Deutsch und Englisch
- **Offline-fähig:** Service Worker, nach dem ersten Laden ohne Internet nutzbar
- **Aktuelles Datum:** Der heutige Tag steht unter dem Monatsnamen; die App zieht Datum, Monat und fällige Buchungen selbst nach, wenn der Tag bei offener App wechselt
- **Geprüfte Eingaben:** Beträge, Texte, Daten und PIN werden beim Tippen und Einfügen geprüft

## Datenschutz

Alle Daten werden **ausschließlich lokal auf deinem Gerät** gespeichert (IndexedDB im Browser). Die App sendet keine Daten an einen Server und benötigt keine Anmeldung.

Weil nichts online gesichert wird, gilt: Wer Browserdaten löscht oder das Gerät wechselt, verliert die Daten, wenn kein Backup vorhanden ist. Bitte regelmäßig ein Backup erstellen (Einstellungen → Daten & Sicherheit → Backup erstellen).

## Installation und Nutzung

Die App besteht nur aus statischen Dateien (HTML, CSS, JavaScript). Es gibt keinen Build-Schritt und keine Abhängigkeiten.

**Online nutzen:** Die Dateien auf einen beliebigen Webserver mit HTTPS legen (zum Beispiel GitHub Pages) und die Adresse im Handy-Browser öffnen.

**Auf dem Handy installieren:**

- *Android (Chrome):* Menü → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“
- *iOS (Safari):* Teilen-Symbol → „Zum Home-Bildschirm“

**Lokal ausprobieren:**

```bash
git clone https://github.com/nosz/money-app.git
cd money-app
python3 -m http.server 8080
```

Danach `http://localhost:8080` im Browser öffnen. Der Service Worker und die Installation brauchen HTTPS oder `localhost`.

## Projektstruktur

```
index.html          Einstiegsseite
manifest.json       PWA-Manifest (Symbole getrennt als any und maskable)
service-worker.js   Offline-Cache (CACHE_VERSION bei jedem Release hochzählen)
tools/check.js      Automatische Prüfung vor jeder Lieferung (node tools/check.js)
og-image.png        Vorschaubild für geteilte Links (1200 × 630)
css/                Eigenes Design, Bootstrap (nur CSS)
js/core.js          Hilfsfunktionen, Version (APP_VERSION), Icons
js/store.js         Speicherung (IndexedDB) und Fälligkeitslogik
js/render.js        Ansichten und Einstellungen
js/app.js           Masken, Eingabeprüfung, Aktionen
js/i18n.js          Texte in Deutsch und Englisch
js/theme.js         Farbschema und Schriftgröße
img/                Icon-Quelldateien (Bootstrap Icons)
```

## Hinweise für Entwickler

- Bei jedem Release `APP_VERSION` in `js/core.js` und `CACHE_VERSION` in `service-worker.js` auf denselben Wert setzen.
- Alle sichtbaren Texte gehören in `js/i18n.js`, immer in Deutsch und Englisch.
- Backup-Format und Datenformat bleiben abwärtskompatibel, damit alte Sicherungen lesbar bleiben.
- Vor jeder Lieferung `node tools/check.js` ausführen (Version, Texte in Deutsch und Englisch, Service Worker, Manifest, Betragsfelder; mit `node tools/check.js <ZIP>` auch den ZIP-Inhalt).
- Die Regeln für die Masken stehen in `money_app_skill.md` (Kern) und `money_app_referenz.md` (Aufbau der einzelnen Masken und Bereiche), der Arbeitsstand in `NAECHSTE_SCHRITTE.md`.

## Mitmachen

Fehler und Wünsche gerne als [Issue](https://github.com/nosz/money-app/issues) melden. Pull Requests sind willkommen. Bitte vorher kurz ein Issue anlegen, wenn die Änderung größer ist.

## Lizenz

Noch nicht festgelegt. Bis eine Lizenzdatei (`LICENSE`) im Projekt liegt, gelten die gesetzlichen Standardrechte des Urhebers.

---

## English summary

MoneyApp is an offline-capable progressive web app for tracking income, expenses and transfers between accounts (bank, cash, savings). It supports custom categories, recurring entries, search and filters, full backup and import, CSV export, an optional PIN lock, and German and English. **All data stays on your device** (IndexedDB). There is no account, no cloud and no tracking. Create backups regularly, because clearing browser data deletes your entries.

The project is plain HTML, CSS and JavaScript with no build step. Serve the files over HTTPS (for example GitHub Pages) or run `python3 -m http.server` and open `http://localhost:8080`.
