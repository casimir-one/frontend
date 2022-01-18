import { dateAfter } from '../lib/rules';

import { checkTwoParamsFunction } from './helpers';

const forTrue = [
  [
    new Date('December 17, 1995 03:25:00'), {
      target: new Date('December 17, 1995 03:24:00')
    }
  ],
  [
    new Date('December 19, 1995 03:24:00'), {
      target: new Date('December 18, 1995 03:24:00')
    }
  ],
  [
    new Date('May 17, 1995 03:24:00'), {
      target: new Date('April 17, 1995 03:24:00')
    }
  ]
];
const forFalse = [
  [
    new Date('February 17, 1995 03:24:00'), {
      target: new Date('December 17, 1995 03:24:00')
    }
  ],
  [
    new Date('December 17, 1995 03:24:00'), {
      target: new Date('December 17, 1995 03:24:00')
    }
  ],
  [
    new Date('December 16, 1995 03:24:00'), {
      target: new Date('December 17, 1995 03:24:00')
    }
  ]
];

describe('dateAfter', () => {
  checkTwoParamsFunction(
    dateAfter.validate,
    forFalse,
    forTrue
  );
});
