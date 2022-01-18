import { equal } from '../lib/rules';

import { checkTwoParamsFunction } from './helpers';

const forTrue = [
  [
    '1', {
      target: '1'
    }
  ],
  [
    11, {
      target: 11
    }
  ]
];
const forFalse = [
  [
    '1', {
      target: 1
    }
  ],
  [
    'hello', {
      target: 'hell'
    }
  ],
  [
    3, {
      target: 1
    }
  ]
];

describe('equal', () => {
  checkTwoParamsFunction(
    equal.validate,
    forFalse,
    forTrue
  );
});
