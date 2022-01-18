import { email } from '../lib/rules';

import { checkFunction } from './helpers';

const forTrue = ['ivanov@paralect.com', 'nobody@example.com', '0123456789@mail.ru', 'john.smith@example.com', 'test.email.with+symbol@gmail.com', 'a@domain.com'];
const forFalse = ['', 'hello', 'mymail@paralect', 'mymail@paralect.c', 'mysuper,mail@gmail.com', 'mysuper@mail@gmail.com',
  '.test@gmail.com', 'mymail.ru', 'a”b(c)d,e:f;gi[jk]l@gmail.com', 'test@gmail..com'
];

describe('email', () => {
  checkFunction(
    email.validate,
    forFalse,
    forTrue
  );
});
