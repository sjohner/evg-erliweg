import {
  deriveEnergyOverview,
  getHistoryComparisonSeries,
  deriveHistorySelection,
  formatKwh,
  formatGermanDate,
  getAboutContent,
  getCommunitySummary,
  getHistoryOptions,
  loadSiteData
} from "./data-loader.js";
import { renderComparisonBars } from "./charts.js";

const THEME_STORAGE_KEY = "evg-erliweg-theme";

function setTheme(theme) {
  document.body.dataset.theme = theme;
}

function getPreferredTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setupThemeToggle() {
  const toggle = document.querySelector("#theme-toggle");

  if (!toggle) {
    return;
  }

  const updateButtonLabel = () => {
    const isDark = document.body.dataset.theme === "dark";
    toggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    toggle.setAttribute("aria-pressed", String(isDark));
  };

  setTheme(getPreferredTheme());
  updateButtonLabel();

  toggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    updateButtonLabel();
  });
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function renderMissing(selector, message) {
  setText(selector, message);
}

function renderHomePage(data) {
  const overview = deriveEnergyOverview(data);
  const community = getCommunitySummary(data);

  setText("#last-updated", overview.lastUpdated ? overview.lastUpdated.label : "Noch keine Daten");
  setText("#reporting-period", overview.reportingPeriod);

  setText("#quarter-label", overview.currentQuarter.label);
  if (overview.currentQuarter.totals) {
    setText("#quarter-produced", formatKwh(overview.currentQuarter.totals.producedKwh));
    setText("#quarter-consumed", formatKwh(overview.currentQuarter.totals.consumedKwh));
    setText("#quarter-note", "Werte fuer das laufende Quartal.");
  } else {
    renderMissing("#quarter-produced", "Noch keine Daten");
    renderMissing("#quarter-consumed", "Noch keine Daten");
    setText("#quarter-note", "Fuer das laufende Quartal liegt noch kein Datensatz vor.");
  }

  setText("#year-label", overview.currentYear.label);
  if (overview.currentYear.hasData) {
    setText("#year-produced", formatKwh(overview.currentYear.totals.producedKwh));
    setText("#year-consumed", formatKwh(overview.currentYear.totals.consumedKwh));
    setText("#year-note", "Summe aller vorhandenen Quartale im laufenden Jahr.");
  } else {
    renderMissing("#year-produced", "Noch keine Daten");
    renderMissing("#year-consumed", "Noch keine Daten");
    setText("#year-note", "Fuer das laufende Jahr wurden noch keine Daten erfasst.");
  }

  setText("#total-label", overview.cumulative.label);
  setText("#total-produced", formatKwh(overview.cumulative.totals.producedKwh));
  setText("#total-consumed", formatKwh(overview.cumulative.totals.consumedKwh));
  setText("#total-note", "Gesamtsumme seit dem Start der EVG am 01.10.2025.");

  setText("#community-total", String(community.totalParties));
  setText("#community-producers", String(community.producingParties));
  setText("#community-location", community.location);
}

function renderError(message) {
  const target = document.querySelector("#metric-grid");

  if (target) {
    target.innerHTML = `<article class="metric-card"><h3>Daten derzeit nicht verfuegbar</h3><p>${message}</p></article>`;
  }

  setText("#last-updated", "Nicht verfuegbar");
  setText("#reporting-period", "Bitte spaeter erneut versuchen.");
}

function populateSelect(select, options) {
  if (!select) {
    return;
  }

  select.innerHTML = options.map((option) => {
    return `<option value="${option.value}">${option.label}</option>`;
  }).join("");
}

function renderHistoryPage(data) {
  const modeSelect = document.querySelector("#history-mode");
  const periodSelect = document.querySelector("#history-period");
  const emptyState = document.querySelector("#history-empty");
  const options = getHistoryOptions(data);

  if (!modeSelect || !periodSelect) {
    return;
  }

  const syncSelection = () => {
    const mode = modeSelect.value;
    const modeOptions = mode === "year" ? options.yearOptions : options.quarterOptions;
    const previousValue = periodSelect.value;

    populateSelect(periodSelect, modeOptions);

    if (modeOptions.some((option) => option.value === previousValue)) {
      periodSelect.value = previousValue;
    }

    const selectedValue = periodSelect.value || modeOptions[0]?.value;
    const selection = deriveHistorySelection(data, mode, selectedValue);
    const comparisonSeries = getHistoryComparisonSeries(data, mode);
    const defaultValue = comparisonSeries.at(-1)?.value ?? selectedValue;

    if (!comparisonSeries.some((item) => item.value === selectedValue)) {
      periodSelect.value = defaultValue;
    }

    const activeSelection = deriveHistorySelection(data, mode, periodSelect.value || defaultValue);

    setText("#history-selection-label", activeSelection.label);
    setText("#history-produced", activeSelection.hasData ? formatKwh(activeSelection.totals.producedKwh) : "Noch keine Daten");
    setText("#history-consumed", activeSelection.hasData ? formatKwh(activeSelection.totals.consumedKwh) : "Noch keine Daten");
    setText("#history-note", activeSelection.note);
    setText("#history-last-updated", activeSelection.lastUpdated);
    setText("#history-reporting-period", mode === "year" ? "Ansicht: alle verfuegbaren Jahre" : "Ansicht: letzte 4 Quartale");

    if (emptyState) {
      emptyState.hidden = activeSelection.hasData;
    }

    renderComparisonBars("#history-chart", comparisonSeries, periodSelect.value || defaultValue);
  };

  populateSelect(periodSelect, options.quarterOptions);
  syncSelection();

  modeSelect.addEventListener("change", syncSelection);
  periodSelect.addEventListener("change", syncSelection);
}

function renderAboutPage(data) {
  const about = getAboutContent(data);

  setText("#about-summary", about.summary);
  setText("#about-reviewed", `Zuletzt inhaltlich geprueft am ${formatGermanDate(about.lastReviewedAt)}.`);
  setText("#contact-label", about.contactLabel);
  setText("#contact-link", about.contactTarget.replace("mailto:", ""));

  const aboutLink = document.querySelector("#about-link");
  const contactLink = document.querySelector("#contact-link");

  if (aboutLink) {
    aboutLink.setAttribute("href", about.termsUrl);
  }

  if (contactLink) {
    contactLink.setAttribute("href", about.contactTarget);
  }
}

async function bootstrap() {
  setupThemeToggle();

  try {
    const data = await loadSiteData();
    const page = document.body.dataset.page;

    if (page === "home") {
      renderHomePage(data);
      return;
    }

    if (page === "history") {
      renderHistoryPage(data);
      return;
    }

    if (page === "about") {
      renderAboutPage(data);
    }
  } catch (error) {
    if (document.body.dataset.page === "home") {
      renderError(error instanceof Error ? error.message : "Unbekannter Fehler");
      return;
    }

    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `<section class="placeholder-card"><p class="eyebrow">Fehler</p><h2>Daten derzeit nicht verfuegbar</h2><p>${error instanceof Error ? error.message : "Unbekannter Fehler"}</p></section>`;
    }
  }
}

void bootstrap();
