import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  getProducerConfigurationsForQuarter,
  isPartyActiveForQuarter,
  isPartyProducerForQuarter,
  quarterToNumber
} from "../assets/js/quarter-utils.js";

const energyDataFilePath = path.resolve(process.cwd(), "data", "energy-data.json");
const initialPartyIds = [
  "erliweg11",
  "erliweg13",
  "erliweg25",
  "erliweg27",
  "erliweg29",
  "erliweg31",
  "erliweg33",
  "erliweg35",
  "erliweg37",
  "erliweg39"
];
const validOrientations = new Set(["N", "NE", "E", "SE", "S", "SW", "W", "NW", "FLAT"]);

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonNegativeNumber(value) {
  return isFiniteNumber(value) && value >= 0;
}

function isPositiveNumber(value) {
  return isFiniteNumber(value) && value > 0;
}

function isValidDate(value) {
  if (typeof value !== "string") {
    return false;
  }

  // Date-only values must use YYYY-MM-DD format for data consistency.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime());
}

function isValidDateTime(value) {
  if (typeof value !== "string") {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

async function loadData(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function validateReportingStartDate(energyData, errors) {
  if (!isValidDate(energyData?.reportingStartDate)) {
    errors.push("reportingStartDate must be a valid date in YYYY-MM-DD format.");
  }
}

function dateToTime(value) {
  return new Date(`${value}T00:00:00Z`).getTime();
}

function validateProducerConfiguration(configuration, prefix, errors) {
  if (!configuration || typeof configuration !== "object") {
    errors.push(`${prefix} must be an object.`);
    return null;
  }

  const {
    isProducer,
    activeFromQuarterId,
    inactiveAfterQuarterId,
    pvSystem,
    peakPowerKwp,
    orientation,
    hasBattery
  } = configuration;

  if (typeof isProducer !== "boolean") {
    errors.push(`${prefix}.isProducer must be a boolean.`);
  }

  const trimmedActiveFromQuarterId = typeof activeFromQuarterId === "string" ? activeFromQuarterId.trim() : "";
  const trimmedInactiveAfterQuarterId = typeof inactiveAfterQuarterId === "string" ? inactiveAfterQuarterId.trim() : "";

  if (!trimmedActiveFromQuarterId) {
    errors.push(`${prefix}.activeFromQuarterId is required.`);
  }

  const activeFromNum = trimmedActiveFromQuarterId ? quarterToNumber(trimmedActiveFromQuarterId) : null;
  const inactiveAfterNum = trimmedInactiveAfterQuarterId ? quarterToNumber(trimmedInactiveAfterQuarterId) : null;

  if (trimmedActiveFromQuarterId && activeFromNum === null) {
    errors.push(`${prefix}.activeFromQuarterId must match YYYY-QN when provided.`);
  }

  if (trimmedInactiveAfterQuarterId && inactiveAfterNum === null) {
    errors.push(`${prefix}.inactiveAfterQuarterId must match YYYY-QN when provided.`);
  }

  if (activeFromNum !== null && inactiveAfterNum !== null && activeFromNum > inactiveAfterNum) {
    errors.push(`${prefix}.activeFromQuarterId must be <= inactiveAfterQuarterId.`);
  }

  if (isProducer === true) {
    if (!pvSystem || typeof pvSystem !== "object") {
      errors.push(`${prefix}.pvSystem is required when isProducer is true.`);
    } else {
      if (!isPositiveNumber(pvSystem.peakPowerKwp)) {
        errors.push(`${prefix}.pvSystem.peakPowerKwp must be a positive finite number.`);
      }

      if (!validOrientations.has(pvSystem.orientation)) {
        errors.push(`${prefix}.pvSystem.orientation must be one of ${Array.from(validOrientations).join(", ")}.`);
      }

      if (typeof pvSystem.hasBattery !== "boolean") {
        errors.push(`${prefix}.pvSystem.hasBattery must be a boolean.`);
      }
    }
  } else if (isProducer === false) {
    if (pvSystem !== undefined || peakPowerKwp !== undefined || orientation !== undefined || hasBattery !== undefined) {
      errors.push(`${prefix} must not include PV-specific fields when isProducer is false.`);
    }
  }

  return {
    activeFromNum,
    inactiveAfterNum: inactiveAfterNum ?? Number.POSITIVE_INFINITY
  };
}

function validateProducerConfigurations(entry, prefix, errors) {
  const { producerConfigurations } = entry;

  if (!Array.isArray(producerConfigurations) || producerConfigurations.length === 0) {
    errors.push(`${prefix}.producerConfigurations must be a non-empty array.`);
    return;
  }

  const ranges = [];

  for (let i = 0; i < producerConfigurations.length; i += 1) {
    const range = validateProducerConfiguration(producerConfigurations[i], `${prefix}.producerConfigurations[${i}]`, errors);

    if (range?.activeFromNum !== null) {
      ranges.push({
        ...range,
        index: i
      });
    }
  }

  ranges.sort((left, right) => left.activeFromNum - right.activeFromNum);

  for (let i = 1; i < ranges.length; i += 1) {
    const previous = ranges[i - 1];
    const current = ranges[i];

    if (current.activeFromNum <= previous.inactiveAfterNum) {
      errors.push(
        `${prefix}.producerConfigurations[${current.index}] overlaps with producerConfigurations[${previous.index}].`
      );
    }
  }
}

function validatePartiesCatalog(energyData, errors) {
  const catalog = energyData?.partiesCatalog;

  if (!Array.isArray(catalog) || catalog.length === 0) {
    errors.push("partiesCatalog must be a non-empty array.");
    return new Map();
  }

  if (energyData.producingPartiesCatalog !== undefined) {
    errors.push("producingPartiesCatalog is obsolete; use partiesCatalog.");
  }

  const catalogMap = new Map();

  for (let i = 0; i < catalog.length; i += 1) {
    const entry = catalog[i];
    const prefix = `partiesCatalog[${i}]`;

    if (!entry || typeof entry !== "object") {
      errors.push(`${prefix} must be an object.`);
      continue;
    }

    const { partyId, partyLabel, joinedOn, leftOn } = entry;

    if (typeof partyId !== "string" || partyId.trim().length === 0) {
      errors.push(`${prefix}.partyId must be a non-empty string.`);
      continue;
    }

    if (catalogMap.has(partyId)) {
      errors.push(`${prefix}.partyId '${partyId}' is duplicated in partiesCatalog.`);
    }

    if (typeof partyLabel !== "string" || partyLabel.trim().length === 0) {
      errors.push(`${prefix}.partyLabel must be a non-empty string.`);
    }

    if (!isValidDate(joinedOn)) {
      errors.push(`${prefix}.joinedOn must be a valid date in YYYY-MM-DD format.`);
    }

    if (leftOn !== undefined && !isValidDate(leftOn)) {
      errors.push(`${prefix}.leftOn must be a valid date in YYYY-MM-DD format when provided.`);
    }

    if (isValidDate(joinedOn) && isValidDate(leftOn) && dateToTime(leftOn) < dateToTime(joinedOn)) {
      errors.push(`${prefix}.leftOn must be on or after joinedOn.`);
    }

    if (initialPartyIds.includes(partyId) && joinedOn !== "2025-10-01") {
      errors.push(`${prefix}.joinedOn for initial party '${partyId}' must be 2025-10-01.`);
    }

    validateProducerConfigurations(entry, prefix, errors);
    catalogMap.set(partyId, entry);
  }

  for (const partyId of initialPartyIds) {
    if (!catalogMap.has(partyId)) {
      errors.push(`partiesCatalog must include initial party '${partyId}'.`);
    }
  }

  return catalogMap;
}

function validateQuarterRecord(record, index, errors, duplicateIds, catalogMap) {
  const prefix = `quarterlyRecords[${index}]`;

  if (!record || typeof record !== "object") {
    errors.push(`${prefix} must be an object.`);
    return;
  }

  const { id, year, quarter, startDate, endDate, producedKwh, consumedKwh, partyRecords } = record;

  if (typeof id !== "string" || !/^\d{4}-Q[1-4]$/.test(id)) {
    errors.push(`${prefix}.id must match YYYY-QN.`);
  }

  if (typeof id === "string") {
    if (duplicateIds.has(id)) {
      errors.push(`${prefix}.id duplicates quarter id '${id}'.`);
    }
    duplicateIds.add(id);
  }

  if (!Number.isInteger(year) || year < 2025) {
    errors.push(`${prefix}.year must be an integer >= 2025.`);
  }

  if (!Number.isInteger(quarter) || quarter < 1 || quarter > 4) {
    errors.push(`${prefix}.quarter must be an integer in range 1..4.`);
  }

  if (Number.isInteger(year) && Number.isInteger(quarter) && typeof id === "string") {
    const expectedId = `${year}-Q${quarter}`;
    if (id !== expectedId) {
      errors.push(`${prefix}.id '${id}' must match year/quarter as '${expectedId}'.`);
    }
  }

  if (!isValidDate(startDate)) {
    errors.push(`${prefix}.startDate must be a valid date in YYYY-MM-DD format.`);
  }

  if (!isValidDate(endDate)) {
    errors.push(`${prefix}.endDate must be a valid date in YYYY-MM-DD format.`);
  }

  if (isValidDate(startDate) && isValidDate(endDate)) {
    const startMs = new Date(`${startDate}T00:00:00Z`).getTime();
    const endMs = new Date(`${endDate}T00:00:00Z`).getTime();

    if (startMs > endMs) {
      errors.push(`${prefix}.startDate must be <= endDate.`);
    }
  }

  if (Array.isArray(partyRecords)) {
    validatePartyRecords(record, prefix, errors, catalogMap);
    return;
  }

  if (!isNonNegativeNumber(producedKwh)) {
    errors.push(`${prefix}.producedKwh must be a non-negative finite number.`);
  }

  if (!isNonNegativeNumber(consumedKwh)) {
    errors.push(`${prefix}.consumedKwh must be a non-negative finite number.`);
  }
}

function validatePartyRecords(record, prefix, errors, catalogMap) {
  const { partyRecords } = record;
  const seenPartyIds = new Set();
  let producedTotal = 0;
  let consumedTotal = 0;

  for (let i = 0; i < partyRecords.length; i += 1) {
    const party = partyRecords[i];
    const partyPrefix = `${prefix}.partyRecords[${i}]`;

    if (!party || typeof party !== "object") {
      errors.push(`${partyPrefix} must be an object.`);
      continue;
    }

    const { partyId, producedKwh, consumedKwh, updatedAt: partyUpdatedAt } = party;

    if (typeof partyId !== "string" || partyId.trim().length === 0) {
      errors.push(`${partyPrefix}.partyId must be a non-empty string.`);
    } else {
      if (seenPartyIds.has(partyId)) {
        errors.push(`${partyPrefix}.partyId '${partyId}' is duplicated within the same quarter.`);
      }
      seenPartyIds.add(partyId);

      const catalogParty = catalogMap.get(partyId);

      if (!catalogParty) {
        errors.push(`${partyPrefix}.partyId '${partyId}' is not defined in partiesCatalog.`);
      } else if (!isPartyActiveForQuarter(catalogParty, record)) {
        errors.push(`${partyPrefix}.partyId '${partyId}' is outside its membership window for quarter '${record.id}'.`);
      } else {
        const matchingConfigurations = getProducerConfigurationsForQuarter(catalogParty, record.id);

        if (matchingConfigurations.length !== 1) {
          errors.push(`${partyPrefix}.partyId '${partyId}' must resolve exactly one producer configuration for quarter '${record.id}'.`);
        } else if (!isPartyProducerForQuarter(catalogParty, record.id)) {
          errors.push(`${partyPrefix}.partyId '${partyId}' is not configured as a producer for quarter '${record.id}'.`);
        }
      }
    }

    if (!isNonNegativeNumber(producedKwh)) {
      errors.push(`${partyPrefix}.producedKwh must be a non-negative finite number.`);
    } else {
      producedTotal += producedKwh;
    }

    if (!isNonNegativeNumber(consumedKwh)) {
      errors.push(`${partyPrefix}.consumedKwh must be a non-negative finite number.`);
    } else {
      consumedTotal += consumedKwh;
    }

    if (!isValidDateTime(partyUpdatedAt)) {
      errors.push(`${partyPrefix}.updatedAt must be a valid ISO datetime string.`);
    }
  }

  if (isFiniteNumber(record.producedKwh) && Math.abs(record.producedKwh - producedTotal) > 0.000001) {
    errors.push(`${prefix}.producedKwh must equal the sum of partyRecords[].producedKwh when both are present.`);
  }

  if (isFiniteNumber(record.consumedKwh) && Math.abs(record.consumedKwh - consumedTotal) > 0.000001) {
    errors.push(`${prefix}.consumedKwh must equal the sum of partyRecords[].consumedKwh when both are present.`);
  }
}

function validateActivePartyConfigurations(record, index, errors, catalogMap) {
  if (!record || typeof record !== "object" || typeof record.id !== "string") {
    return;
  }

  for (const party of catalogMap.values()) {
    if (!isPartyActiveForQuarter(party, record)) {
      continue;
    }

    const matchingConfigurations = getProducerConfigurationsForQuarter(party, record.id);

    if (matchingConfigurations.length !== 1) {
      errors.push(
        `quarterlyRecords[${index}] active party '${party.partyId}' must resolve exactly one producer configuration for quarter '${record.id}'.`
      );
    }
  }
}

function validateQuarterOrder(records, errors) {
  const parsed = records
    .map((record, index) => ({
      index,
      id: record?.id,
      startDate: record?.startDate,
      endDate: record?.endDate
    }))
    .filter((item) => isValidDate(item.startDate) && isValidDate(item.endDate));

  parsed.sort((a, b) => new Date(`${a.startDate}T00:00:00Z`).getTime() - new Date(`${b.startDate}T00:00:00Z`).getTime());

  for (let i = 1; i < parsed.length; i += 1) {
    const prev = parsed[i - 1];
    const curr = parsed[i];

    const prevEnd = new Date(`${prev.endDate}T00:00:00Z`).getTime();
    const currStart = new Date(`${curr.startDate}T00:00:00Z`).getTime();

    if (currStart <= prevEnd) {
      errors.push(
        `quarterlyRecords[${curr.index}] overlaps with previous quarter (${prev.id ?? "unknown"} -> ${curr.id ?? "unknown"}).`
      );
    }
  }
}

function validateData(energyData) {
  const errors = [];

  validateReportingStartDate(energyData, errors);
  const catalogMap = validatePartiesCatalog(energyData, errors);

  const records = energyData?.quarterlyRecords;

  if (!Array.isArray(records)) {
    errors.push("quarterlyRecords must be an array.");
    return errors;
  }

  const duplicateIds = new Set();

  for (let i = 0; i < records.length; i += 1) {
    validateQuarterRecord(records[i], i, errors, duplicateIds, catalogMap);
    validateActivePartyConfigurations(records[i], i, errors, catalogMap);
  }

  validateQuarterOrder(records, errors);

  return errors;
}

async function main() {
  try {
    const energyData = await loadData(energyDataFilePath);
    const errors = validateData(energyData);

    if (errors.length > 0) {
      console.error(`Energy data validation failed with ${errors.length} issue(s):`);
      for (const error of errors) {
        console.error(`- ${error}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log("Energy data validation passed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Energy data validation failed: ${message}`);
    process.exitCode = 1;
  }
}

await main();
