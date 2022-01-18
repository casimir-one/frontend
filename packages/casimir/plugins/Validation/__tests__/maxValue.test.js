import { maxValue } from '../lib/rules';

import { checkTwoParamsFunction } from './helpers';

const forFalse = [
  [
    1.1, {
      target: 1
    }
  ],
  [
    11, {
      target: 10
    }
  ]
];
const forTrue = [
  [
    10, {
      target: 10.5
    }
  ],
  [
    5.5, {
      target: 5.5
    }
  ]
];

describe('maxValue', () => {
  checkTwoParamsFunction(
    maxValue.validate,
    forFalse,
    forTrue
  );
});
