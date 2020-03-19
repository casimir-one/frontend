import Promise from 'bluebird';
import should from 'should';
import deip from '../src';
import pkg from '../package.json';

const username = process.env.DEIP_USERNAME || 'guest123';
const password = process.env.DEIP_PASSWORD;
const postingWif = password ?
    deip.auth.toWif(username, password, 'posting') :
    '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg';

describe('deip.broadcast:', () => {



});