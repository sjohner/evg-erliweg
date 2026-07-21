export function renderComparisonBars(selector, items) {
  const target = document.querySelector(selector);

  if (!target) {
    return;
  }

  const maxValue = items.reduce((currentMax, item) => {
    return Math.max(currentMax, item.producedKwh, item.consumedKwh);
  }, 0);

  const escapeHtml = (value) => {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  target.innerHTML = items.map((item) => {
    const producedWidth = maxValue > 0 ? Math.max((item.producedKwh / maxValue) * 100, 4) : 0;
    const consumedWidth = maxValue > 0 ? Math.max((item.consumedKwh / maxValue) * 100, 4) : 0;
    const producedValue = new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(item.producedKwh);
    const consumedValue = new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(item.consumedKwh);
    const safeLabel = escapeHtml(item.label);

    return `
      <article class="history-period-row" aria-label="Vergleich fuer ${safeLabel}">
        <div class="history-period-row__head">
          <p class="history-period-row__label">${safeLabel}</p>
        </div>
        <div class="history-bar-stack">
          <div class="history-bar-row">
            <div class="history-bar-label">Produktion</div>
            <div class="history-bar-track" aria-hidden="true">
              <div class="history-bar-fill history-bar-fill--produced" style="width:${producedWidth}%"></div>
            </div>
            <div class="history-bar-value">${producedValue} kWh</div>
          </div>
          <div class="history-bar-row">
            <div class="history-bar-label">Verbrauch</div>
            <div class="history-bar-track" aria-hidden="true">
              <div class="history-bar-fill history-bar-fill--consumed" style="width:${consumedWidth}%"></div>
            </div>
            <div class="history-bar-value">${consumedValue} kWh</div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}
