import { dateBefore } from '../lib/rules';

import { checkTwoParamsFunction } from './helpers';

const forTrue = [
  [
    new Date('December 17, 1995 03:24:00'), {
      target: new Date('December 17, 1995 04:24:00')
    }
  ],
  [
    new Date('December 17, 1995 03:24:00'), {
      target: new Date('December 18, 1995 03:24:00')
    }
  ],
  [
    new Date('June 17, 1995 03:24:00'), {
      target: new Date('July 16, 1995 03:24:00')
    }
  ]
];
const forFalse = [
  [
    new Date('July 17, 1995 03:24:00'), {
      target: new Date('June 16, 1995 03:24:00')
    }
  ],
  [
    new Date('December 17, 1995 03:24:00'), {
      target: new Date('December 16, 1995 03:24:00')
    }
  ],
  [
    new Date('December 17, 1995 03:24:00'), {
      target: new Date('December 17, 1995 03:24:00')
    }
  ]
];

describe('dateBefore', () => {
  checkTwoParamsFunction(
    dateBefore.validate,
    forFalse,
    forTrue
  );
});
