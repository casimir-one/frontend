import { number } from '../lib/rules';

import { checkFunction } from './helpers';

const forTrue = [1, 255, 12.111, -956.1007, '1'];
const forFalse = ['', 'a', null, undefined];

describe('number', () => {
  checkFunction(
    number.validate,
    forFalse,
    forTrue
  );
});
