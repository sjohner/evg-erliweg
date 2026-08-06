import { isPartyActiveForQuarter, isPartyProducerForQuarter } from "./quarter-utils.js";

const ENERGY_DATA_URL = "data/energy-data.json";

let cachedDataPromise;

function parseJsonDate(value) {
  return new Date(value);
}

function formatQuarterLabel(year, quarter) {
  return `Q${quarter} ${year}`;
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
    cachedDataPromise = fetch(ENERGY_DATA_URL).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Daten konnten nicht geladen werden (${response.status}).`);
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

export function getPartiesCatalog(data) {
  return [...(data.partiesCatalog ?? [])];
}

export function getActivePartiesForQuarter(data, quarterRecord) {
  return getPartiesCatalog(data).filter((party) => isPartyActiveForQuarter(party, quarterRecord));
}

export function getActiveProducingPartiesForQuarter(data, quarterRecord) {
  return getActivePartiesForQuarter(data, quarterRecord)
    .filter((party) => isPartyProducerForQuarter(party, quarterRecord.id));
}

export function normalizeQuarterPartyRecords(data, quarterRecord) {
  const catalogById = new Map(
    getPartiesCatalog(data).map((party) => [party.partyId, party])
  );

  return (quarterRecord.partyRecords ?? []).map((partyRecord) => {
    const catalogParty = catalogById.get(partyRecord.partyId);

    return {
      ...partyRecord,
      partyLabel: catalogParty?.partyLabel ?? partyRecord.partyId
    };
  });
}

function getNormalizedQuarterRecords(data) {
  return sortRecords(data.quarterlyRecords ?? []).map((record) => {
    const normalizedPartyRecords = normalizeQuarterPartyRecords(data, record);
    return buildQuarterTotalsRecord({
      ...record,
      partyRecords: normalizedPartyRecords
    });
  });
}

export function deriveEnergyOverview(data) {
  const records = getNormalizedQuarterRecords(data);

  const latestQuarterRecord = records.length > 0 ? records[records.length - 1] : null;
  const referenceYear = latestQuarterRecord?.year ?? null;
  const yearRecords = referenceYear === null
    ? []
    : records.filter((record) => record.year === referenceYear);
  const cumulativeRecords = records.filter((record) => {
    return parseJsonDate(record.endDate).getTime() >= parseJsonDate(data.reportingStartDate).getTime();
  });
  const latestUpdatedRecord = records.reduce((latest, record) => {
    if (!latest) {
      return record;
    }

    return getRecordUpdatedAtMs(record) > getRecordUpdatedAtMs(latest) ? record : latest;
  }, null);

  return {
    latestQuarter: {
      label: latestQuarterRecord
        ? formatQuarterLabel(latestQuarterRecord.year, latestQuarterRecord.quarter)
        : "Noch keine Daten",
      id: latestQuarterRecord?.id ?? null,
      record: latestQuarterRecord,
      totals: latestQuarterRecord ? {
        producedKwh: latestQuarterRecord.producedKwh,
        consumedKwh: latestQuarterRecord.consumedKwh
      } : null
    },
    latestYear: {
      label: referenceYear === null ? "Noch keine Daten" : String(referenceYear),
      totals: sumRecords(yearRecords),
      hasData: yearRecords.length > 0
    },
    cumulative: {
      label: `Seit ${formatGermanDate(data.reportingStartDate)}`,
      totals: sumRecords(cumulativeRecords)
    },
    lastUpdated: latestUpdatedRecord ? {
      at: latestUpdatedRecord.updatedAt,
      label: formatGermanDate(latestUpdatedRecord.updatedAt)
    } : null,
    reportingPeriod: latestUpdatedRecord
      ? `${formatQuarterLabel(latestUpdatedRecord.year, latestUpdatedRecord.quarter)} · Stand ${formatGermanDate(latestUpdatedRecord.endDate)}`
      : "Kein Berichtszeitraum verfügbar"
  };
}

export function getCommunitySummary(data) {
  const records = sortRecords(data.quarterlyRecords ?? []);
  const latestQuarterRecord = records.length > 0 ? records[records.length - 1] : null;
  const activeParties = latestQuarterRecord
    ? getActivePartiesForQuarter(data, latestQuarterRecord)
    : [];
  const producingParties = latestQuarterRecord
    ? getActiveProducingPartiesForQuarter(data, latestQuarterRecord).length
    : 0;

  return {
    totalParties: activeParties.length,
    producingParties
  };
}

export function getHistoryComparisonSeries(data, mode) {
  const records = getNormalizedQuarterRecords(data);

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
