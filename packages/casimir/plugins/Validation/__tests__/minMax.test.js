import { minMax } from '../lib/rules';

import { checkTwoParamsFunction } from './helpers';

const forTrue = [
  [
    [1, 2, 3, 4, 5], {
      min: 3,
      max: 6
    }
  ],
  [
    [1, 2, 3, 4, 5], {
      min: 5,
      max: 6
    }
  ],
  [
    [1, 2, 3, 4, 5], {
      min: 3,
      max: 5
    }
  ]
];
const forFalse = [
  [
    [1, 2, 3, 4, 5], {
      min: 6,
      max: 6
    }
  ],
  [
    [1, 2, 3, 4, 5], {
      min: 1,
      max: 2
    }
  ]
];

describe('minMax', () => {
  checkTwoParamsFunction(
    minMax.validate,
    forFalse,
    forTrue
  );
});
