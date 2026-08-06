export function parseQuarterId(quarterId) {
  const match = /^(\d{4})-Q([1-4])$/.exec(quarterId);

  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    quarter: Number(match[2])
  };
}

export function quarterToNumber(quarterId) {
  const parsed = parseQuarterId(quarterId);
  return parsed ? parsed.year * 10 + parsed.quarter : null;
}

export function isPartyActiveForQuarter(party, quarterId) {
  const target = quarterToNumber(quarterId);

  if (target === null) {
    return false;
  }

  const activeFrom = party.activeFromQuarterId ? quarterToNumber(party.activeFromQuarterId) : null;
  const inactiveAfter = party.inactiveAfterQuarterId ? quarterToNumber(party.inactiveAfterQuarterId) : null;

  return (activeFrom === null || target >= activeFrom)
    && (inactiveAfter === null || target <= inactiveAfter);
}
