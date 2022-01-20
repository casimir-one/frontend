import { wrapInArray } from '@deip/toolbox';

export const normalizeDates = (curr, prev, next) => ({
  currentDate: new Date(curr),
  prevDates: prev ? wrapInArray(prev).map((d) => new Date(d)) : [],
  nextDates: next ? wrapInArray(next).map((d) => new Date(d)) : []
});
