import { minValue } from '../lib/rules';

import { checkTwoParamsFunction } from './helpers';

const forTrue = [
  [
    5.5, {
      target: 4
    }
  ],
  [
    5.5, {
      target: 5.5
    }
  ]
];
const forFalse = [
  [
    5.5, {
      target: 10
    }
  ],
  [
    5.5, {
      target: 5.6
    }
  ]
];

describe('minValue', () => {
  checkTwoParamsFunction(
    minValue.validate,
    forFalse,
    forTrue
  );
});
