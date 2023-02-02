const lsq = require("least-squares");

class StargazerStats {
  calcStats(stargazerData, dateRange) {
    let stargazerDates = stargazerData.map((cur) => new Date(cur.x));
    if (
      dateRange &&
      dateRange.min !== undefined &&
      dateRange.max !== undefined
    ) {
      const minDate = new Date(dateRange.min);
      const maxDate = new Date(dateRange.max);
      stargazerDates = stargazerDates.filter(
        (cur) => cur >= minDate && cur <= maxDate
      );
    }

    if (stargazerDates.length === 0) {
      return {
        "Number of stars": 0,
        "Number of days": 0,
        "Average stars per day": 0,
        "Average days per star": 0,
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
        : Math.floor(
            (lastStarDate.getTime() - firstStarDate.getTime()) /
              1000 /
              60 /
              60 /
              24
          );
    let daysWithoutStars = 0;
    let maxStarsPerDay = 0;
    let dayWithMostStars = stargazerDates[0];
    let curSameDays = 1;
    const startDate = Math.floor(stargazerDates[0] / 1000 / 60 / 60 / 24 - 1);
    let prevDate = startDate;
    stargazerDates.forEach((stargazerDate) => {
      const curDate = Math.floor(stargazerDate / 1000 / 60 / 60 / 24);

      if (curDate === prevDate) {
        curSameDays += 1;
      } else {
        if (prevDate !== startDate) {
          daysWithoutStars += curDate - prevDate - 1;
        }

        if (curSameDays > maxStarsPerDay) {
          maxStarsPerDay = curSameDays;
          dayWithMostStars = new Date(prevDate * 1000 * 60 * 60 * 24);
        }

        curSameDays = 1;
      }

      prevDate = curDate;
    });

    return {
      "Number of stars": stargazerDates.length,
      "Number of days": numOfDays,
      "Average stars per day": (stargazerDates.length / numOfDays).toFixed(3),
      "Average days per star": (numOfDays / stargazerDates.length).toFixed(3),
      "Days with stars": numOfDays - daysWithoutStars,
      "Max stars in one day": maxStarsPerDay,
      "Day with most stars": dayWithMostStars.toISOString().slice(0, 10),
    };
  }

  calcForecast(
    stargazerData,
    basedOnLastDays,
    forecastDaysForward,
    forecastPoints
  ) {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - basedOnLastDays);
    const stargazerFilteredData = stargazerData
      .filter((cur) => new Date(cur.x) >= minDate)
      .map((cur) => ({ x: new Date(cur.x).getTime(), y: cur.y }));
    if (stargazerFilteredData.length <= 1) {
      return null;
    }
    const ret = {};
    const leastSquaresFun = lsq(
      stargazerFilteredData.map((cur) => cur.x),
      stargazerFilteredData.map((cur) => cur.y),
      ret
    );

    // This makes sure the forecast starts from the recent star count
    const mostRecentData = stargazerFilteredData.at(-1);
    const delta =
      mostRecentData.y - Math.round(leastSquaresFun(mostRecentData.x));

    const forecastData = [...Array(forecastPoints + 1).keys()]
      .map((i) => (forecastDaysForward * i) / forecastPoints)
      .map((daysFromNow) => {
        const dateFromNow = new Date();
        dateFromNow.setDate(dateFromNow.getDate() + daysFromNow);
        return {
          x: dateFromNow.toISOString(),
          y: Math.round(delta + leastSquaresFun(dateFromNow.getTime())),
        };
      });
    return forecastData;
  }
}

const stargazerStats = new StargazerStats();
Object.freeze(stargazerStats);

export default stargazerStats;
