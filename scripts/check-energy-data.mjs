import { readFile } from "node:fs/promises";
import path from "node:path";
import { isPartyActiveForQuarter, quarterToNumber } from "../assets/js/quarter-utils.js";

const siteContentFilePath = path.resolve(process.cwd(), "data", "site-content.json");
const energyDataFilePath = path.resolve(process.cwd(), "data", "energy-data.json");

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonNegativeNumber(value) {
  return isFiniteNumber(value) && value >= 0;
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

function validateCommunity(siteContent, errors) {
  const community = siteContent?.community;

  if (!community || typeof community !== "object") {
    errors.push("Missing required object: community.");
    return;
  }

  const { totalParties, totalPeople, startDate } = community;

  if (!Number.isInteger(totalParties) || totalParties < 1) {
    errors.push("community.totalParties must be an integer >= 1.");
  }

  if (!Number.isInteger(totalPeople) || totalPeople < 1) {
    errors.push("community.totalPeople must be an integer >= 1.");
  }

  if (
    Number.isInteger(totalParties) &&
    Number.isInteger(totalPeople) &&
    totalPeople < totalParties
  ) {
    errors.push("community.totalPeople must be >= community.totalParties.");
  }

  if (!isValidDate(startDate)) {
    errors.push("community.startDate must be a valid date in YYYY-MM-DD format.");
  }
}

function validateSiteContent(siteContent, errors) {
  const aboutContent = siteContent?.aboutContent;
  const contact = siteContent?.contact;

  if (!aboutContent || typeof aboutContent !== "object") {
    errors.push("Missing required object: aboutContent.");
  } else {
    if (typeof aboutContent.summary !== "string" || aboutContent.summary.trim().length === 0) {
      errors.push("aboutContent.summary must be a non-empty string.");
    }
    if (aboutContent.termsUrl !== "https://www.elektra.ch/energiedienstleistungen/elektraeigenstrom/") {
      errors.push("aboutContent.termsUrl must be the official Elektra Eigenstrom URL.");
    }
    if (!isValidDate(aboutContent.lastReviewedAt)) {
      errors.push("aboutContent.lastReviewedAt must be a valid date in YYYY-MM-DD format.");
    }
  }

  if (!contact || typeof contact !== "object") {
    errors.push("Missing required object: contact.");
  } else {
    if (typeof contact.label !== "string" || contact.label.trim().length === 0) {
      errors.push("contact.label must be a non-empty string.");
    }
    if (!["email", "form-link"].includes(contact.type)) {
      errors.push("contact.type must be email or form-link.");
    }
    const validTarget = contact.type === "email"
      ? typeof contact.target === "string" && /^mailto:[^@\s]+@[^@\s]+$/.test(contact.target)
      : typeof contact.target === "string" && /^https:\/\//.test(contact.target);
    if (!validTarget) {
      errors.push("contact.target must match its contact.type.");
    }
  }
}

function validateProducingPartiesCatalog(energyData, errors) {
  const catalog = energyData?.producingPartiesCatalog;

  if (!Array.isArray(catalog) || catalog.length === 0) {
    errors.push("producingPartiesCatalog must be a non-empty array.");
    return new Map();
  }

  const catalogMap = new Map();

  for (let i = 0; i < catalog.length; i += 1) {
    const entry = catalog[i];
    const prefix = `producingPartiesCatalog[${i}]`;

    if (!entry || typeof entry !== "object") {
      errors.push(`${prefix} must be an object.`);
      continue;
    }

    const { partyId, partyLabel, activeFromQuarterId, inactiveAfterQuarterId } = entry;

    if (typeof partyId !== "string" || partyId.trim().length === 0) {
      errors.push(`${prefix}.partyId must be a non-empty string.`);
      continue;
    }

    if (catalogMap.has(partyId)) {
      errors.push(`${prefix}.partyId '${partyId}' is duplicated in producingPartiesCatalog.`);
    }

    if (typeof partyLabel !== "string" || partyLabel.trim().length === 0) {
      errors.push(`${prefix}.partyLabel must be a non-empty string.`);
    }

    if (typeof activeFromQuarterId !== "string") {
      errors.push(`${prefix}.activeFromQuarterId is required.`);
    }
    const activeFromNum = activeFromQuarterId ? quarterToNumber(activeFromQuarterId) : null;
    const inactiveAfterNum = inactiveAfterQuarterId ? quarterToNumber(inactiveAfterQuarterId) : null;

    if (activeFromQuarterId && activeFromNum === null) {
      errors.push(`${prefix}.activeFromQuarterId must match YYYY-QN when provided.`);
    }

    if (inactiveAfterQuarterId && inactiveAfterNum === null) {
      errors.push(`${prefix}.inactiveAfterQuarterId must match YYYY-QN when provided.`);
    }

    if (activeFromNum !== null && inactiveAfterNum !== null && activeFromNum > inactiveAfterNum) {
      errors.push(`${prefix}.activeFromQuarterId must be <= inactiveAfterQuarterId.`);
    }

    catalogMap.set(partyId, entry);
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
  let newestPartyUpdatedAt = null;

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
        errors.push(`${partyPrefix}.partyId '${partyId}' is not defined in producingPartiesCatalog.`);
      } else if (!isPartyActiveForQuarter(catalogParty, record.id)) {
        errors.push(`${partyPrefix}.partyId '${partyId}' is outside its active lifecycle window for quarter '${record.id}'.`);
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
    } else if (!newestPartyUpdatedAt || new Date(partyUpdatedAt).getTime() > new Date(newestPartyUpdatedAt).getTime()) {
      newestPartyUpdatedAt = partyUpdatedAt;
    }
  }

  if (isFiniteNumber(record.producedKwh) && Math.abs(record.producedKwh - producedTotal) > 0.000001) {
    errors.push(`${prefix}.producedKwh must equal the sum of partyRecords[].producedKwh when both are present.`);
  }

  if (isFiniteNumber(record.consumedKwh) && Math.abs(record.consumedKwh - consumedTotal) > 0.000001) {
    errors.push(`${prefix}.consumedKwh must equal the sum of partyRecords[].consumedKwh when both are present.`);
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

function validateData(siteContent, energyData) {
  const errors = [];

  validateCommunity(siteContent, errors);
  validateSiteContent(siteContent, errors);
  const catalogMap = validateProducingPartiesCatalog(energyData, errors);

  const records = energyData?.quarterlyRecords;

  if (!Array.isArray(records)) {
    errors.push("quarterlyRecords must be an array.");
    return errors;
  }

  const duplicateIds = new Set();

  for (let i = 0; i < records.length; i += 1) {
    validateQuarterRecord(records[i], i, errors, duplicateIds, catalogMap);
  }

  validateQuarterOrder(records, errors);

  return errors;
}

async function main() {
  try {
    const [siteContent, energyData] = await Promise.all([
      loadData(siteContentFilePath),
      loadData(energyDataFilePath)
    ]);
    const errors = validateData(siteContent, energyData);

    if (errors.length > 0) {
      console.error(`Site content and energy data validation failed with ${errors.length} issue(s):`);
      for (const error of errors) {
        console.error(`- ${error}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log("Site content and energy data validation passed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Site content and energy data validation failed: ${message}`);
    process.exitCode = 1;
  }
}

await main();