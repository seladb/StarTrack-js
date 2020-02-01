class StargazerStats {

  calcStats(stargazerData) {
    let firstStarDate = new Date(stargazerData[0].x);
    let lastStarDate = new Date(stargazerData[stargazerData.length-1].x);
    let numOfDays = Math.floor((new Date(lastStarDate - firstStarDate))/1000/60/60/24);

    let daysWithoutStars = 0;
    let maxStarsPerDay = 0;
    let dayWithMostStars = stargazerData[0].x;
    let curSameDays = 1;
    let startDate = Math.floor(new Date(0)/1000/60/60/24);
    let prevDate = startDate;
    stargazerData.forEach(xyData => {
      let curDate = Math.floor(new Date(xyData.x)/1000/60/60/24);
  
      if (curDate === prevDate) {
        curSameDays += 1;
      }
      else {
        if (prevDate !== startDate) {
          daysWithoutStars += curDate - prevDate - 1;
        }
  
        if (curSameDays > maxStarsPerDay) {
          maxStarsPerDay = curSameDays;
          dayWithMostStars = new Date(xyData.x);
        }
  
        curSameDays = 1;
      }
  
      prevDate = curDate;
    });

    return {
      'Number of stars': stargazerData.length,
      'Number of days': numOfDays,
      'Average stars per day': (stargazerData.length / numOfDays).toFixed(3),
      'Average days per star': (numOfDays / stargazerData.length).toFixed(3),
      'Days with stars': numOfDays - daysWithoutStars,
      'Max stars in one day': maxStarsPerDay,
      'Day with most stars': dayWithMostStars.toISOString().slice(0, 10)
    }
  }
}

const stargazerStats = new StargazerStats();
Object.freeze(stargazerStats);

export default stargazerStats;
