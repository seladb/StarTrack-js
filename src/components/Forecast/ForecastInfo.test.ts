import { ForecastInfo, TimeUnit } from "./ForecastInfo";

describe(ForecastInfo, () => {
  it.each([
    [
      {
        timeBackward: {
          count: 3,
          unit: "weeks" as TimeUnit,
        },
        timeForward: {
          count: 5,
          unit: "weeks" as TimeUnit,
        },
        pointCount: 50,
      },
      {
        daysBackwards: 21,
        daysForward: 35,
        numValues: 50,
      },
    ],
    [
      {
        timeBackward: {
          count: 5,
          unit: "months" as TimeUnit,
        },
        timeForward: {
          count: 10,
          unit: "months" as TimeUnit,
        },
        pointCount: 100,
      },
      {
        daysBackwards: 153,
        daysForward: 305,
        numValues: 100,
      },
    ],
    [
      {
        timeBackward: {
          count: 1,
          unit: "years" as TimeUnit,
        },
        timeForward: {
          count: 2,
          unit: "years" as TimeUnit,
        },
        pointCount: 1,
      },
      {
        daysBackwards: 365,
        daysForward: 731,
        numValues: 1,
      },
    ],
  ])("convert to ForecastInfo", (forecastInfoData, expectedForecastProps) => {
    jest.useFakeTimers().setSystemTime(new Date("2024-01-01"));

    const forecastInfo = new ForecastInfo(
      forecastInfoData.timeBackward,
      forecastInfoData.timeForward,
      forecastInfoData.pointCount,
    );

    expect(forecastInfo.toForecastProps()).toEqual(expectedForecastProps);
  });
});
