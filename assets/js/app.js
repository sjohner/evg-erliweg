import {
  deriveEnergyOverview,
  getHistoryComparisonSeries,
  formatKwh,
  formatGermanDate,
  getAboutContent,
  getCommunitySummary,
  loadSiteData
} from "./data-loader.js";
import { renderComparisonBars } from "./charts.js";

const THEME_STORAGE_KEY = "evg-erliweg-theme";

function getThemeIconMarkup(icon) {
  if (icon === "sun") {
    return `
      <svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
        <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      </svg>
    `;
  }

  return `
    <svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14.5 2.2a1 1 0 0 0-1.2 1.2 8.5 8.5 0 0 1-10 10 1 1 0 0 0-1.2 1.2 10.5 10.5 0 1 0 12.4-12.4Z" fill="currentColor"></path>
    </svg>
  `;
}

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
    toggle.innerHTML = isDark ? getThemeIconMarkup("sun") : getThemeIconMarkup("moon");
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute(
      "aria-label",
      isDark ? "Hellmodus aktivieren" : "Dunkelmodus aktivieren"
    );
  };

  setTheme(getPreferredTheme());
  updateButtonLabel();

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQuery.addEventListener("change", (event) => {
    if (window.localStorage.getItem(THEME_STORAGE_KEY)) {
      return;
    }

    setTheme(event.matches ? "dark" : "light");
    updateButtonLabel();
  });

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
    element.classList.remove("is-loading");
    element.textContent = value;
  }
}

function renderMissing(selector, message) {
  setText(selector, message);
}

function renderHomePage(data) {
  const overview = deriveEnergyOverview(data);
  const community = getCommunitySummary(data);
  const lastUpdatedText = overview.lastUpdated
    ? `Letzte Aktualisierung der Daten am ${overview.lastUpdated.label}`
    : "Letzte Aktualisierung der Daten: Noch keine Daten";

  setText("#home-last-updated", lastUpdatedText);
  setText("#history-last-updated", lastUpdatedText);
  setText("#footer-last-updated", lastUpdatedText);

  setText("#quarter-label", overview.latestQuarter.label);
  if (overview.latestQuarter.totals) {
    setText("#quarter-produced", formatKwh(overview.latestQuarter.totals.producedKwh));
    setText("#quarter-consumed", formatKwh(overview.latestQuarter.totals.consumedKwh));
    setText("#quarter-note", "Werte für das zuletzt verfügbare Quartal.");
  } else {
    renderMissing("#quarter-produced", "Noch keine Daten");
    renderMissing("#quarter-consumed", "Noch keine Daten");
    setText("#quarter-note", "Für das zuletzt verfügbare Quartal liegt noch kein Datensatz vor.");
  }

  setText("#year-label", overview.latestYear.label);
  if (overview.latestYear.hasData) {
    setText("#year-produced", formatKwh(overview.latestYear.totals.producedKwh));
    setText("#year-consumed", formatKwh(overview.latestYear.totals.consumedKwh));
    setText("#year-note", "Summe aller vorhandenen Quartale im angezeigten Jahr.");
  } else {
    renderMissing("#year-produced", "Noch keine Daten");
    renderMissing("#year-consumed", "Noch keine Daten");
    setText("#year-note", "Für das angezeigte Jahr wurden noch keine Daten erfasst.");
  }

  setText("#total-label", overview.cumulative.label);
  setText("#total-produced", formatKwh(overview.cumulative.totals.producedKwh));
  setText("#total-consumed", formatKwh(overview.cumulative.totals.consumedKwh));
  setText("#total-note", "Gesamtsumme seit dem Start der EVG am 01.10.2025.");

  const communityTotalLabel = Number.isInteger(community.totalPeople)
    ? `${community.totalParties} (${community.totalPeople} Personen)`
    : String(community.totalParties);

  setText("#community-total", communityTotalLabel);
  setText("#community-producers", String(community.producingParties));
  setText("#community-location", community.location);
}

function renderError(message) {
  const target = document.querySelector("#metric-grid");

  if (target) {
    target.innerHTML = `<article class="metric-card error-alert" role="alert"><h3>Daten derzeit nicht verfügbar</h3><p>${message}</p></article>`;
  }

  setText("#home-last-updated", "Letzte Aktualisierung der Daten: Nicht verfügbar");
  setText("#history-last-updated", "Letzte Aktualisierung der Daten: Nicht verfügbar");
  setText("#footer-last-updated", "Letzte Aktualisierung der Daten: Nicht verfügbar");
}

function renderHistoryPage(data) {
  const modeSelect = document.querySelector("#history-mode");
  const emptyState = document.querySelector("#history-empty");

  if (!modeSelect) {
    return;
  }

  const syncView = () => {
    const mode = modeSelect.value;
    const comparisonSeries = getHistoryComparisonSeries(data, mode);

    if (emptyState) {
      emptyState.hidden = comparisonSeries.length > 0;
    }

    renderComparisonBars("#history-chart", comparisonSeries);
  };

  syncView();

  modeSelect.addEventListener("change", syncView);
}

function renderAboutPage(data) {
  const about = getAboutContent(data);

  setText("#about-summary", about.summary);
  setText("#about-reviewed", `Zuletzt inhaltlich geprüft am ${formatGermanDate(about.lastReviewedAt)}.`);
  setText("#contact-label", about.contactLabel);
  setText("#contact-link", about.contactTarget.replace("mailto:", ""));

  const aboutLink = document.querySelector("#about-link");
  const contactLink = document.querySelector("#contact-link");

  if (aboutLink) {
    aboutLink.classList.remove("is-loading");
    aboutLink.setAttribute("href", about.termsUrl);
  }

  if (contactLink) {
    contactLink.classList.remove("is-loading");
    contactLink.setAttribute("href", about.contactTarget);
  }
}

async function bootstrap() {
  setupThemeToggle();

  try {
    const data = await loadSiteData();

    if (document.querySelector("#metric-grid")) {
      renderHomePage(data);
    }

    if (document.querySelector("#history-mode")) {
      renderHistoryPage(data);
    }

    if (document.querySelector("#about-summary")) {
      renderAboutPage(data);
    }
  } catch (error) {
    if (document.querySelector("#metric-grid")) {
      renderError(error instanceof Error ? error.message : "Unbekannter Fehler");
      return;
    }

    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `<section class="placeholder-card error-alert" role="alert"><p class="eyebrow">Fehler</p><h2>Daten derzeit nicht verfügbar</h2><p>${error instanceof Error ? error.message : "Unbekannter Fehler"}</p></section>`;
    }
  }
}

void bootstrap();
