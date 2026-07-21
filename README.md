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
- Deployment wird bei Push auf `main` nur fuer relevante Website-Dateien ausgelost
- Alternativ kann jederzeit ein manueller Lauf ueber `workflow_dispatch` gestartet werden

## Quartalsupdate und gepruefte Veroeffentlichung

1. `data/energy-data.json` im privaten Repository oeffnen.
2. Gewuenschtes Quartal und die Werte fuer `producedKwh`, `consumedKwh` und `updatedAt` anpassen.
3. Bei neuem Quartal einen neuen Eintrag in `energy.quarterlyRecords` mit eindeutigem `id` (`YYYY-QN`) und korrektem Zeitraum anlegen.
4. Manuelle Pruefung vor Merge:
	- `producingParties <= totalParties`
	- keine negativen kWh-Werte
	- `updatedAt` ist im ISO-Format und fuer die neueste Aenderung aktuell
	- Link und Kontaktinformationen bleiben gueltig
5. Pull Request erstellen und inhaltlich pruefen/freigeben.
6. In `main` mergen.
7. GitHub Pages veroeffentlicht die aktualisierte Website ueber den Deploy-Workflow.

## Sichtbare Wirkung eines Datenupdates

- Startseite und Historie zeigen das Datum "Letzte Aktualisierung" aus dem neuesten `updatedAt`-Wert aller Quartalsdatensaetze.
- Nach Deployment sollte dieses Datum auf `index.html` und `history.html` dem aktuellsten Datensatz entsprechen.

## Technische Leitplanken

- Benutzeroberflaeche in deutscher Sprache
- Vanilla HTML, CSS und JavaScript
- Dark Mode und WCAG 2.1 AA als Ziel
- Kennzahlen werden dynamisch aus `data/energy-data.json` berechnet