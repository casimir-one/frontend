import { unique } from '../lib/rules';

import { checkTwoParamsFunction } from './helpers';

const forFalse = [
  [
    'a', {
      list: ['d', 'a', 'b'],
      caseSensitive: false
    }
  ],
  [
    'abc', {
      list: ['abc', 'abcd', 'b'],
      caseSensitive: false
    }
  ],
  [
    'D', {
      list: ['d', 'D', 'b'],
      caseSensitive: true
    }
  ]
];
const forTrue = [
  [
    'a', {
      list: ['b', 'c', 'd'],
      caseSensitive: false
    }
  ],
  [
    'abc', {
      list: ['ab', 'abcd', 'b'],
      caseSensitive: false
    }
  ],
  [
    'A', {
      list: ['a', 'b', 'c'],
      caseSensitive: true
    }
  ]
];

describe('unique', () => {
  checkTwoParamsFunction(
    unique.validate,
    forFalse,
    forTrue
  );
});
