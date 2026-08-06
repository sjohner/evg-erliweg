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

export function getQuarterDateRange(quarter) {
  if (quarter && typeof quarter === "object" && quarter.startDate && quarter.endDate) {
    return {
      startDate: quarter.startDate,
      endDate: quarter.endDate
    };
  }

  const parsed = typeof quarter === "string" ? parseQuarterId(quarter) : null;

  if (!parsed) {
    return null;
  }

  const startMonth = (parsed.quarter - 1) * 3;
  const endMonth = startMonth + 3;
  const startDate = new Date(Date.UTC(parsed.year, startMonth, 1));
  const endDate = new Date(Date.UTC(parsed.year, endMonth, 0));

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10)
  };
}

function dateOnlyToTime(value) {
  return new Date(`${value}T00:00:00Z`).getTime();
}

export function isPartyActiveForQuarter(party, quarter) {
  const range = getQuarterDateRange(quarter);

  if (!range || !party?.joinedOn) {
    return false;
  }

  const joinedOn = dateOnlyToTime(party.joinedOn);
  const leftOn = party.leftOn ? dateOnlyToTime(party.leftOn) : null;
  const quarterStart = dateOnlyToTime(range.startDate);
  const quarterEnd = dateOnlyToTime(range.endDate);

  return joinedOn <= quarterEnd && (leftOn === null || leftOn >= quarterStart);
}

export function getProducerConfigurationsForQuarter(party, quarterId) {
  const target = quarterToNumber(quarterId);

  if (target === null) {
    return [];
  }

  return (party?.producerConfigurations ?? []).filter((configuration) => {
    const activeFrom = configuration.activeFromQuarterId
      ? quarterToNumber(configuration.activeFromQuarterId)
      : null;
    const inactiveAfter = configuration.inactiveAfterQuarterId
      ? quarterToNumber(configuration.inactiveAfterQuarterId)
      : null;

    return activeFrom !== null
      && target >= activeFrom
      && (inactiveAfter === null || target <= inactiveAfter);
  });
}

export function getProducerConfigurationForQuarter(party, quarterId) {
  const configurations = getProducerConfigurationsForQuarter(party, quarterId);
  return configurations.length === 1 ? configurations[0] : null;
}

export function isPartyProducerForQuarter(party, quarterId) {
  return getProducerConfigurationForQuarter(party, quarterId)?.isProducer === true;
}
