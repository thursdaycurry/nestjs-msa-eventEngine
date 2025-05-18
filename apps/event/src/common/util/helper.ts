import * as moment from 'moment';
import { EventStatusType } from '../constants/event';

export const calcStatus = (startDate: Date, endDate: Date): EventStatusType => {
  const now = new Date();
  const isTodayInEventPeriod: boolean = moment(now).isBetween(
    moment(startDate),
    moment(endDate),
  );
  return isTodayInEventPeriod ? EventStatusType.ON : EventStatusType.OFF;
};
