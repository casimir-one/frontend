import { dateAfterNow } from '../lib/rules';

import { checkFunction } from './helpers';

const forTrue = [
  new Date(new Date(Date.now()).getTime() + (24 * 60 * 60 * 1000))
];
const forFalse = [
  new Date('December 19, 1995 03:24:00'),
  new Date(Date.now())
];

describe('dateAfterNow', () => {
  checkFunction(
    dateAfterNow.validate,
    forFalse,
    forTrue
  );
});
