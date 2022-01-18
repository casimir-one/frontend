import { minMaxValue } from '../lib/rules';

import { checkTwoParamsFunction } from './helpers';

const forFalse = [
  [
    10, {
      min: 11,
      max: 14
    }
  ],
  [
    3, {
      min: 1,
      max: 2
    }
  ]
];
const forTrue = [
  [
    3, {
      min: 3,
      max: 6
    }
  ],
  [
    5.5, {
      min: 4,
      max: 6
    }
  ],
  [
    5, {
      min: 3,
      max: 5
    }
  ]
];

describe('minMaxValue', () => {
  checkTwoParamsFunction(
    minMaxValue.validate,
    forFalse,
    forTrue
  );
});
