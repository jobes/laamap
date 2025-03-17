export function barDefinition(val: {
  minShownValue: number;
  maxShownValue: number;
  alertLower: number;
  alertUpper: number;
  cautionLower: number;
  cautionUpper: number;
  position: { x: number; y: number };
  bgColor: string;
  textColor: string;
}) {
  const absoluteAlertLowerPercentage = Math.min(
    100,
    ((val.alertLower - val.minShownValue) /
      (val.maxShownValue - val.minShownValue)) *
      100,
  );
  const absoluteCautionLowerPercentage = Math.min(
    100,
    ((val.cautionLower - val.minShownValue) /
      (val.maxShownValue - val.minShownValue)) *
      100,
  );
  const absoluteCautionUpperPercentage = Math.min(
    100,
    ((val.cautionUpper - val.minShownValue) /
      (val.maxShownValue - val.minShownValue)) *
      100,
  );
  const absoluteAlertUpperPercentage = Math.min(
    100,
    ((val.alertUpper - val.minShownValue) /
      (val.maxShownValue - val.minShownValue)) *
      100,
  );
  const alertLowerPercentage = absoluteAlertLowerPercentage;
  const cautionLowerPercentage =
    absoluteCautionLowerPercentage - absoluteAlertLowerPercentage;
  const goodPercentage =
    absoluteCautionUpperPercentage - absoluteCautionLowerPercentage;
  const cautionUpperPercentage =
    absoluteAlertUpperPercentage - absoluteCautionUpperPercentage;
  const alertUpperPercentage = 100 - absoluteAlertUpperPercentage;
  return {
    alertLowerPercentage,
    cautionLowerPercentage,
    goodPercentage,
    cautionUpperPercentage,
    alertUpperPercentage,
    position: val.position,
    bgColor: val.bgColor,
    textColor: val.textColor,
  };
}

export function barExtraValues(
  currentValue: number | null,
  settings: {
    alertLower: number;
    alertUpper: number;
    cautionLower: number;
    cautionUpper: number;
    minShownValue: number;
    maxShownValue: number;
    show: boolean;
  },
  instrumentsConnected: boolean,
) {
  if (
    !instrumentsConnected ||
    !settings.show ||
    currentValue === null ||
    currentValue === undefined
  ) {
    return {
      alert: false,
      caution: false,
      currentValue: 0,
      valuePercentage: 0,
      show: false,
    };
  }
  const percentage =
    ((currentValue - settings.minShownValue) /
      (settings.maxShownValue - settings.minShownValue)) *
    100;
  return {
    show: true,
    alert:
      currentValue < settings.alertLower || currentValue > settings.alertUpper,
    caution:
      currentValue < settings.cautionLower ||
      currentValue > settings.cautionUpper,
    currentValue: currentValue,
    valuePercentage: percentage < 0 ? 0 : percentage > 100 ? 100 : percentage,
  };
}
