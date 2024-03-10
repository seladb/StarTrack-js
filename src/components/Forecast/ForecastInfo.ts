import moment from "moment";
import { ForecastProps } from "../../utils/StargazerStats";
export type TimeUnit = "weeks" | "months" | "years";

export type ForecastTimeInfo = {
  count: number;
  unit: TimeUnit;
};

export class ForecastInfo {
  timeBackward: ForecastTimeInfo;
  timeForward: ForecastTimeInfo;
  pointCount: number;

  constructor(timeBackward: ForecastTimeInfo, timeForward: ForecastTimeInfo, pointCount: number) {
    this.timeBackward = timeBackward;
    this.timeForward = timeForward;
    this.pointCount = pointCount;
  }

  toForecastProps(): ForecastProps {
    const currentDate = moment();
    const dateBackward = moment(currentDate).subtract(
      this.timeBackward.count,
      this.timeBackward.unit,
    );
    const daysBackward = moment(currentDate).diff(dateBackward, "days");

    const dateForward = moment(currentDate).add(this.timeForward.count, this.timeForward.unit);
    const daysForward = moment(dateForward).diff(currentDate, "days");

    return {
      daysBackwards: daysBackward,
      daysForward: daysForward,
      numValues: this.pointCount,
    };
  }
}
