# evg-erliweg

Statische Website fuer die EVG Erliweg auf GitHub Pages.

## Projektstruktur

- `index.html`: Startseite mit aktuellen Kennzahlen, Jahressumme, Gesamtsumme und letztem Aktualisierungsdatum
- `history.html`: Platzhalter fuer historische Auswertungen (spaeterer Ausbauschritt)
- `about.html`: Platzhalter fuer Informationen zur EVG und Kontakt (spaeterer Ausbauschritt)
- `assets/css/styles.css`: Gemeinsame Styles, Responsive Layout und Dark Mode
- `assets/js/data-loader.js`: Laden und Aggregieren der Energiedaten
- `assets/js/app.js`: Gemeinsames Verhalten und Seiteninitialisierung
- `assets/js/charts.js`: Platzhalter fuer spaetere Diagramm-Logik
- `data/energy-data.json`: Quartalsdaten sowie statische Inhalte

## Lokale Vorschau

Option 1:

```powershell
python -m http.server 4173
```

Option 2:

```powershell
npx serve .
```

Anschliessend im Browser `http://localhost:4173` oder die von `serve` ausgegebene Adresse aufrufen.

## GitHub Pages

- Veroeffentlichung ueber den Workflow `.github/workflows/deploy-pages.yml`
- Standardziel ist die GitHub-Pages-Domain des Repositories
- Der Workflow kopiert nur die statischen Website-Dateien in das Deploy-Artefakt

## Quartalsupdate

1. `data/energy-data.json` im privaten Repository oeffnen.
2. Gewuenschtes Quartal und die Werte fuer `producedKwh`, `consumedKwh` und `updatedAt` anpassen.
3. Aenderung manuell pruefen.
4. In den Standard-Branch mergen.
5. GitHub Pages veroeffentlicht die aktualisierte Website ueber den Deploy-Workflow.

## Technische Leitplanken

- Benutzeroberflaeche in deutscher Sprache
- Vanilla HTML, CSS und JavaScript
- Dark Mode und WCAG 2.1 AA als Ziel
- Kennzahlen werden dynamisch aus `data/energy-data.json` berechnet