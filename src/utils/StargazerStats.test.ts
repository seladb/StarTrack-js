import StarData from "./StarData";
import * as stargazerStats from "./StargazerStats";

const daysToMS = (days: number) => days * 1000 * 60 * 60 * 24;
const calculateTimestampsFromDaysList = (curDate: Date, daysList: Array<number>) => {
  return daysList.map((n) => new Date(curDate.getTime() + daysToMS(n)).toISOString());
};

describe(stargazerStats.calcLeastSquares, () => {
  it("returns the correct result", () => {
    const xaxis = [1, 2, 3, 4];
    const yaxis = [6, 5, 7, 10];

    const result = stargazerStats.calcLeastSquares(xaxis, yaxis);
    expect(result(3.6)).toBe(8.54);
  });
});

describe(stargazerStats.calcStats, () => {
  it("returns zeros if no data", () => {
    expect(stargazerStats.calcStats({ timestamps: [], starCounts: [] })).toStrictEqual({
      "Number of stars": 0,
      "Number of days": 0,
      "Average stars per day": "0",
      "Days with stars": 0,
      "Max stars in one day": 0,
      "Day with most stars": 0,
    });
  });

  it("returns stats without date range", () => {
    const curDate = new Date();

    const inputData: StarData = {
      timestamps: calculateTimestampsFromDaysList(curDate, [-4, -3, -3, -2, 0]),
      starCounts: [1, 2, 3, 4, 5],
    };

    expect(stargazerStats.calcStats(inputData)).toStrictEqual({
      "Number of stars": 5,
      "Number of days": 4,
      "Average stars per day": "1.250",
      "Days with stars": 3,
      "Max stars in one day": 2,
      "Day with most stars": new Date(curDate.getTime() - daysToMS(3)).toISOString().slice(0, 10),
    });
  });

  it("returns stats with date range", () => {
    const curDate = new Date();

    const inputData: StarData = {
      timestamps: calculateTimestampsFromDaysList(curDate, [-4, -3, -3, -2, 0]),
      starCounts: [1, 2, 3, 4, 5],
    };

    const dateRange = {
      min: new Date(curDate.getTime() - daysToMS(3)).toISOString(),
      max: new Date(curDate.getTime() - daysToMS(1)).toISOString(),
    };

    expect(stargazerStats.calcStats(inputData, dateRange)).toStrictEqual({
      "Number of stars": 3,
      "Number of days": 1,
      "Average stars per day": "3.000",
      "Days with stars": 1,
      "Max stars in one day": 2,
      "Day with most stars": new Date(curDate.getTime() - daysToMS(3)).toISOString().slice(0, 10),
    });
  });
});

describe(stargazerStats.calcForecast, () => {
  const curDate = new Date();

  it.each([
    [0, 2, 2],
    [2, 0, 2],
    [2, 2, 0],
  ])(
    "throws exception for invalid forecast props",
    (daysBackwards: number, daysForward: number, numValues: number) => {
      const inputData: StarData = {
        timestamps: calculateTimestampsFromDaysList(curDate, [-1]),
        starCounts: [1],
      };

      expect(() => {
        stargazerStats.calcForecast(inputData, {
          daysBackwards: daysBackwards,
          daysForward: daysForward,
          numValues: numValues,
        });
      }).toThrow(stargazerStats.InvalidForecastProps);
    },
  );

  it("throws exception if data doesn't match forecast props", () => {
    const inputData: StarData = {
      timestamps: calculateTimestampsFromDaysList(curDate, [-100]),
      starCounts: [1],
    };

    expect(() => {
      stargazerStats.calcForecast(inputData, {
        daysBackwards: 99,
        daysForward: 10,
        numValues: 10,
      });
    }).toThrow(stargazerStats.NotEnoughDataError);
  });

  it("calculates forecast data, props cover the full data", () => {
    jest
      .spyOn(stargazerStats, "calcLeastSquares")
      .mockReturnValue((val) => 2 * ((val - curDate.getTime()) / daysToMS(1)));
    const timestamps = calculateTimestampsFromDaysList(curDate, [-4, -3, -2, -1, 0]);
    const inputData: StarData = {
      timestamps: timestamps,
      starCounts: [1, 2, 3, 4, 5],
    };

    expect(
      stargazerStats.calcForecast(inputData, { daysBackwards: 10, daysForward: 5, numValues: 5 }),
    ).toStrictEqual({
      timestamps: calculateTimestampsFromDaysList(curDate, [0, 1, 2, 3, 4, 5]),
      starCounts: [5, 7, 9, 11, 13, 15],
    });
  });

  it("calculates forecast data, props cover part of the data", () => {
    const calcLeastSquaresMock = jest
      .spyOn(stargazerStats, "calcLeastSquares")
      .mockReturnValue((x) => x);
    const inputData: StarData = {
      timestamps: calculateTimestampsFromDaysList(curDate, [-4, -3, -2, -1, 0]),
      starCounts: [1, 2, 3, 4, 5],
    };

    stargazerStats.calcForecast(inputData, { daysBackwards: 2, daysForward: 5, numValues: 5 });
    expect(calcLeastSquaresMock).toHaveBeenCalledWith(
      calculateTimestampsFromDaysList(curDate, [-1, 0]).map((d) => new Date(d).getTime()),
      [4, 5],
    );
  });
});
