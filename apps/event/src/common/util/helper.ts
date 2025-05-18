import * as moment from 'moment';
import { EventStatusType } from '../constants/event';

export const calcStatus = (startDate: Date, endDate: Date): EventStatusType => {
  const isTodayInEventPeriod = isTodayBetween(startDate, endDate);
  return isTodayInEventPeriod ? EventStatusType.ON : EventStatusType.OFF;
};

export const isTodayBetween = (startDate: Date, endDate: Date): boolean => {
  const now = new Date();
  const isTodayInEventPeriod: boolean = moment(now).isBetween(
    moment(startDate),
    moment(endDate),
  );
  return isTodayInEventPeriod;
};
