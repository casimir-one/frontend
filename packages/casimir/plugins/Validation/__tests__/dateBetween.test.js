import { dateBetween } from '../lib/rules';

import { checkTwoParamsFunction } from './helpers';

const forTrue = [
  [
    new Date('December 15, 1995 03:25:00'), {
      prev: new Date('December 15, 1995 02:25:00'),
      next: new Date('December 15, 1995 04:25:00')
    }
  ],
  [
    new Date('December 17, 1995 03:25:00'), {
      prev: new Date('December 16, 1995 03:24:00'),
      next: new Date('December 17, 1995 04:27:00')
    }
  ],
  [
    new Date('December 11, 1994 03:24:00'), {
      prev: new Date('December 11, 1993 03:24:00'),
      next: new Date('December 17, 1995 03:24:00')
    }
  ]
];
const forFalse = [
  [
    new Date('December 19, 1995 03:24:00'), {
      prev: new Date('December 17, 1995 03:24:00'),
      next: new Date('December 18, 1995 03:24:00')
    }
  ],
  [
    new Date('December 19, 1995 03:24:00'), {
      prev: new Date('December 11, 1996 03:24:00'),
      next: new Date('December 17, 1997 03:24:00')
    }
  ],
  [
    new Date('December 16, 1995 03:24:00'), {
      prev: new Date('December 16, 1995 03:25:00'),
      next: new Date('December 17, 1995 03:24:00')
    }
  ]
];

describe('dateBetween', () => {
  checkTwoParamsFunction(
    dateBetween.validate,
    forFalse,
    forTrue
  );
});
