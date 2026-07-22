const DATA_URL = "data/energy-data.json";

let cachedDataPromise;

function parseJsonDate(value) {
  return new Date(value);
}

function getQuarterFromDate(date) {
  return Math.floor(date.getMonth() / 3) + 1;
}

function formatQuarterLabel(year, quarter) {
  return `Q${quarter} ${year}`;
}

function formatQuarterId(year, quarter) {
  return `${year}-Q${quarter}`;
}

function parseQuarterId(quarterId) {
  const match = /^(\d{4})-Q([1-4])$/.exec(quarterId);

  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    quarter: Number(match[2])
  };
}

function quarterToNumber(quarterId) {
  const parsed = parseQuarterId(quarterId);

  if (!parsed) {
    return null;
  }

  return parsed.year * 10 + parsed.quarter;
}

function isPartyActiveForQuarter(party, quarterId) {
  const target = quarterToNumber(quarterId);

  if (target === null) {
    return false;
  }

  const activeFrom = party.activeFromQuarterId ? quarterToNumber(party.activeFromQuarterId) : null;
  const inactiveAfter = party.inactiveAfterQuarterId ? quarterToNumber(party.inactiveAfterQuarterId) : null;

  if (activeFrom !== null && target < activeFrom) {
    return false;
  }

  if (inactiveAfter !== null && target > inactiveAfter) {
    return false;
  }

  if (party.isActive === false && inactiveAfter === null) {
    return false;
  }

  return true;
}

function uniqueBy(items, selector) {
  const seen = new Set();

  return items.filter((item) => {
    const key = selector(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function formatGermanDate(value) {
  const date = value instanceof Date ? value : parseJsonDate(value);
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function formatGermanNumber(value) {
  return new Intl.NumberFormat("de-CH", {
    maximumFractionDigits: 0
  }).format(value);
}

export function formatKwh(value) {
  return `${formatGermanNumber(value)} kWh`;
}

export async function loadSiteData() {
  if (!cachedDataPromise) {
    cachedDataPromise = fetch(DATA_URL).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Energiedaten konnten nicht geladen werden (${response.status}).`);
      }

      return response.json();
    });
  }

  return cachedDataPromise;
}

function sortRecords(records) {
  return [...records].sort((left, right) => {
    return parseJsonDate(left.startDate).getTime() - parseJsonDate(right.startDate).getTime();
  });
}

function sumRecords(records) {
  return records.reduce(
    (totals, record) => ({
      producedKwh: totals.producedKwh + record.producedKwh,
      consumedKwh: totals.consumedKwh + record.consumedKwh
    }),
    { producedKwh: 0, consumedKwh: 0 }
  );
}

function sumPartyRecords(partyRecords) {
  return (partyRecords ?? []).reduce(
    (totals, partyRecord) => ({
      producedKwh: totals.producedKwh + (partyRecord.producedKwh ?? 0),
      consumedKwh: totals.consumedKwh + (partyRecord.consumedKwh ?? 0)
    }),
    { producedKwh: 0, consumedKwh: 0 }
  );
}

function getQuarterLastUpdated(record) {
  return (record.partyRecords ?? []).reduce((latest, partyRecord) => {
    if (!partyRecord.updatedAt) {
      return latest;
    }

    if (!latest) {
      return partyRecord.updatedAt;
    }

    return parseJsonDate(partyRecord.updatedAt).getTime() > parseJsonDate(latest).getTime()
      ? partyRecord.updatedAt
      : latest;
  }, null);
}

function getRecordUpdatedAtMs(record) {
  if (!record.updatedAt) {
    return Number.NEGATIVE_INFINITY;
  }

  return parseJsonDate(record.updatedAt).getTime();
}

function buildQuarterTotalsRecord(record) {
  const totals = sumPartyRecords(record.partyRecords ?? []);

  return {
    ...record,
    producedKwh: totals.producedKwh,
    consumedKwh: totals.consumedKwh,
    updatedAt: getQuarterLastUpdated(record)
  };
}

export function getProducingPartiesCatalog(data) {
  return [...(data.energy.producingPartiesCatalog ?? [])];
}

export function getActivePartiesForQuarter(data, quarterId) {
  return getProducingPartiesCatalog(data).filter((party) => isPartyActiveForQuarter(party, quarterId));
}

export function normalizeQuarterPartyRecords(data, quarterRecord) {
  const catalogById = new Map(
    getProducingPartiesCatalog(data).map((party) => [party.partyId, party])
  );

  return (quarterRecord.partyRecords ?? []).map((partyRecord) => {
    const catalogParty = catalogById.get(partyRecord.partyId);

    return {
      ...partyRecord,
      partyLabel: catalogParty?.partyLabel ?? partyRecord.partyLabel
    };
  });
}

export function deriveEnergyOverview(data, now = new Date()) {
  const records = sortRecords(data.energy.quarterlyRecords).map((record) => {
    const normalizedPartyRecords = normalizeQuarterPartyRecords(data, record);
    return buildQuarterTotalsRecord({
      ...record,
      partyRecords: normalizedPartyRecords
    });
  });
  const currentYear = now.getFullYear();
  const currentQuarter = getQuarterFromDate(now);
  const currentQuarterId = formatQuarterId(currentYear, currentQuarter);
  const quarterRecord = records.find((record) => {
    return record.year === currentYear && record.quarter === currentQuarter;
  }) ?? null;
  const yearRecords = records.filter((record) => record.year === currentYear);
  const cumulativeRecords = records.filter((record) => {
    return parseJsonDate(record.endDate).getTime() >= parseJsonDate(data.community.startDate).getTime();
  });
  const latestUpdatedRecord = records.reduce((latest, record) => {
    if (!latest) {
      return record;
    }

    return getRecordUpdatedAtMs(record) > getRecordUpdatedAtMs(latest) ? record : latest;
  }, null);

  return {
    currentQuarter: {
      label: formatQuarterLabel(currentYear, currentQuarter),
      id: currentQuarterId,
      record: quarterRecord,
      totals: quarterRecord ? {
        producedKwh: quarterRecord.producedKwh,
        consumedKwh: quarterRecord.consumedKwh
      } : null
    },
    currentYear: {
      label: String(currentYear),
      totals: sumRecords(yearRecords),
      hasData: yearRecords.length > 0
    },
    cumulative: {
      label: `Seit ${formatGermanDate(data.community.startDate)}`,
      totals: sumRecords(cumulativeRecords)
    },
    lastUpdated: latestUpdatedRecord ? {
      at: latestUpdatedRecord.updatedAt,
      label: formatGermanDate(latestUpdatedRecord.updatedAt)
    } : null,
    reportingPeriod: latestUpdatedRecord
      ? `${formatQuarterLabel(latestUpdatedRecord.year, latestUpdatedRecord.quarter)} · Stand ${formatGermanDate(latestUpdatedRecord.endDate)}`
      : "Kein Berichtszeitraum verfuegbar"
  };
}

export function getCommunitySummary(data) {
  return {
    totalParties: data.community.totalParties,
    producingParties: data.community.producingParties,
    location: `${data.community.city}, ${data.community.country}`
  };
}

export function getAboutContent(data) {
  return {
    summary: data.aboutContent.summary,
    termsUrl: data.aboutContent.termsUrl,
    lastReviewedAt: data.aboutContent.lastReviewedAt,
    contactLabel: data.contact.label,
    contactTarget: data.contact.target
  };
}

export function getHistoryOptions(data) {
  const records = sortRecords(data.energy.quarterlyRecords).map((record) => {
    const normalizedPartyRecords = normalizeQuarterPartyRecords(data, record);
    return buildQuarterTotalsRecord({
      ...record,
      partyRecords: normalizedPartyRecords
    });
  });
  const quarterOptions = records.map((record) => ({
    value: record.id,
    label: formatQuarterLabel(record.year, record.quarter)
  }));
  const yearOptions = uniqueBy(records, (record) => record.year)
    .map((record) => record.year)
    .sort((left, right) => right - left)
    .map((year) => ({
      value: String(year),
      label: String(year)
    }));

  return {
    quarterOptions: quarterOptions.toReversed(),
    yearOptions
  };
}

export function getHistoryComparisonSeries(data, mode) {
  const records = sortRecords(data.energy.quarterlyRecords).map((record) => {
    const normalizedPartyRecords = normalizeQuarterPartyRecords(data, record);
    return buildQuarterTotalsRecord({
      ...record,
      partyRecords: normalizedPartyRecords
    });
  });

  if (mode === "year") {
    const yearMap = new Map();

    for (const record of records) {
      const year = String(record.year);
      const existing = yearMap.get(year) ?? {
        value: year,
        label: year,
        producedKwh: 0,
        consumedKwh: 0
      };

      existing.producedKwh += record.producedKwh;
      existing.consumedKwh += record.consumedKwh;
      yearMap.set(year, existing);
    }

    return Array.from(yearMap.values()).sort((left, right) => Number(right.value) - Number(left.value));
  }

  return [...records].toReversed().map((record) => ({
    value: record.id,
    label: formatQuarterLabel(record.year, record.quarter),
    producedKwh: record.producedKwh,
    consumedKwh: record.consumedKwh
  }));
}

export function deriveHistorySelection(data, mode, selectedValue) {
  const records = sortRecords(data.energy.quarterlyRecords).map((record) => {
    const normalizedPartyRecords = normalizeQuarterPartyRecords(data, record);
    return buildQuarterTotalsRecord({
      ...record,
      partyRecords: normalizedPartyRecords
    });
  });
  const latestUpdatedRecord = records.reduce((latest, record) => {
    if (!latest) {
      return record;
    }

    return getRecordUpdatedAtMs(record) > getRecordUpdatedAtMs(latest) ? record : latest;
  }, null);

  if (mode === "year") {
    const year = Number(selectedValue);
    const yearRecords = records.filter((record) => record.year === year);

    return {
      label: String(year),
      hasData: yearRecords.length > 0,
      totals: sumRecords(yearRecords),
      note: yearRecords.length > 0
        ? `${yearRecords.length} Quartal(e) in diesem Jahr vorhanden.`
        : "Fuer dieses Jahr sind keine Daten vorhanden.",
      chartItems: [
        { label: "Produktion", value: sumRecords(yearRecords).producedKwh },
        { label: "Verbrauch", value: sumRecords(yearRecords).consumedKwh }
      ],
      lastUpdated: latestUpdatedRecord ? formatGermanDate(latestUpdatedRecord.updatedAt) : "Noch keine Daten"
    };
  }

  const quarterRecord = records.find((record) => record.id === selectedValue) ?? null;

  return {
    label: quarterRecord ? formatQuarterLabel(quarterRecord.year, quarterRecord.quarter) : selectedValue,
    hasData: Boolean(quarterRecord),
    totals: quarterRecord ? {
      producedKwh: quarterRecord.producedKwh,
      consumedKwh: quarterRecord.consumedKwh
    } : { producedKwh: 0, consumedKwh: 0 },
    note: quarterRecord
      ? `Berichtszeitraum ${formatGermanDate(quarterRecord.startDate)} bis ${formatGermanDate(quarterRecord.endDate)}.`
      : "Fuer dieses Quartal sind keine Daten vorhanden.",
    chartItems: [
      { label: "Produktion", value: quarterRecord?.producedKwh ?? 0 },
      { label: "Verbrauch", value: quarterRecord?.consumedKwh ?? 0 }
    ],
    lastUpdated: latestUpdatedRecord ? formatGermanDate(latestUpdatedRecord.updatedAt) : "Noch keine Daten"
  };
}
