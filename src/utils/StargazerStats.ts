import StarData from "./StarData";
import * as StargazerStats from "./StargazerStats";

export const calcLeastSquares = (xaxis: Array<number>, yaxis: Array<number>) => {
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXSq = 0;
  const N = xaxis.length;

  for (let i = 0; i < N; ++i) {
    sumX += xaxis[i];
    sumY += yaxis[i];
    sumXY += xaxis[i] * yaxis[i];
    sumXSq += xaxis[i] * xaxis[i];
  }

  const m = (sumXY - (sumX * sumY) / N) / (sumXSq - (sumX * sumX) / N);
  const b = sumY / N - (m * sumX) / N;

  return (x: number) => {
    return m * x + b;
  };
};

interface DateRange {
  min: string;
  max: string;
}

export const calcStats = (
  stargazerData: StarData,
  dateRange?: DateRange,
): Record<string, string | number> => {
  const timestampToDays = (ts: number) => Math.floor(ts / 1000 / 60 / 60 / 24);
  const daysToTimestamp = (days: number) => days * 1000 * 60 * 60 * 24;

  let stargazerDates = stargazerData.timestamps.map((cur) => new Date(cur));
  if (dateRange) {
    const minDate = new Date(dateRange.min.replace(/ /g, "T"));
    const maxDate = new Date(dateRange.max.replace(/ /g, "T"));
    stargazerDates = stargazerDates.filter((cur) => cur >= minDate && cur <= maxDate);
  }

  if (stargazerDates.length === 0) {
    return {
      "Number of stars": 0,
      "Number of days": 0,
      "Average stars per day": "0",
      "Days with stars": 0,
      "Max stars in one day": 0,
      "Day with most stars": 0,
    };
  }

  const firstStarDate = stargazerDates[0];
  const lastStarDate = stargazerDates[stargazerDates.length - 1];
  const numOfDays =
    stargazerDates.length === 1
      ? 1
      : timestampToDays(lastStarDate.getTime() - firstStarDate.getTime());
  let daysWithoutStars = 0;
  let maxStarsPerDay = 0;
  let dayWithMostStars = stargazerDates[0];
  let curSameDays = 1;
  const startDate = timestampToDays(stargazerDates[0].getTime()) - 1;
  let prevDate = startDate;
  stargazerDates.forEach((stargazerDate) => {
    const curDate = timestampToDays(stargazerDate.getTime());

    if (curDate === prevDate) {
      curSameDays += 1;
    } else {
      if (prevDate !== startDate) {
        daysWithoutStars += curDate - prevDate - 1;
      }

      if (curSameDays > maxStarsPerDay) {
        maxStarsPerDay = curSameDays;
        dayWithMostStars = new Date(daysToTimestamp(prevDate));
      }

      curSameDays = 1;
    }

    prevDate = curDate;
  });

  return {
    "Number of stars": stargazerDates.length,
    "Number of days": numOfDays,
    "Average stars per day": (stargazerDates.length / numOfDays).toFixed(3),
    "Days with stars": numOfDays - daysWithoutStars,
    "Max stars in one day": maxStarsPerDay,
    "Day with most stars": dayWithMostStars.toISOString().slice(0, 10),
  };
};

export interface ForecastProps {
  daysBackwards: number;
  daysForward: number;
  numValues: number;
}

export class InvalidForecastProps extends RangeError {}
export class NotEnoughDataError extends RangeError {}

export const calcForecast = (
  stargazerData: StarData,
  { daysBackwards, daysForward, numValues }: ForecastProps,
) => {
  if (daysBackwards < 1 || daysForward < 1 || numValues < 1) {
    throw new InvalidForecastProps();
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - daysBackwards);

  const filteredTimestamps: Array<number> = [];
  const filteredStarCount: Array<number> = [];

  stargazerData.timestamps.forEach((timestamp, index) => {
    const tsDate = new Date(timestamp);
    if (tsDate > minDate) {
      filteredTimestamps.push(tsDate.getTime());
      filteredStarCount.push(stargazerData.starCounts[index]);
    }
  });

  if (filteredTimestamps.length <= 1 || filteredStarCount.length <= 1) {
    throw new NotEnoughDataError();
  }

  const leastSquaresFun = StargazerStats.calcLeastSquares(filteredTimestamps, filteredStarCount);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const lastDate = filteredTimestamps.at(-1)!;

  // This makes sure the forecast starts from the recent star count
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const delta = filteredStarCount.at(-1)! - Math.round(leastSquaresFun(lastDate));

  const forecastData = Array.from(Array(numValues + 1).keys())
    .map((i) => (daysForward * i) / numValues)
    .map((daysFromNow) => {
      const dateFromNow = new Date(lastDate);
      dateFromNow.setDate(dateFromNow.getDate() + daysFromNow);
      return {
        timestamp: dateFromNow.toISOString(),
        starCount: Math.round(delta + leastSquaresFun(dateFromNow.getTime())),
      };
    });

  const resultStarData: StarData = {
    timestamps: forecastData.map((x) => x.timestamp),
    starCounts: forecastData.map((x) => x.starCount),
  };

  return resultStarData;
};
