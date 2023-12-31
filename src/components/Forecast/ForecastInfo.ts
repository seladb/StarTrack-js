export type TimeUnit = "weeks" | "months" | "years";

export type ForecastTimeInfo = {
  count: number;
  unit: TimeUnit;
};

export type ForecastInfo = {
  timeBackward: ForecastTimeInfo;
  timeForward: ForecastTimeInfo;
  pointCount: number;
};
