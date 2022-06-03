import { convertToUnit } from '../src';

describe('convertToUnit', () => {
  it.each([
    null,
    undefined,
    '',
    ' '
  ])('should return undefined for %s', (initial) => {
    expect(convertToUnit(initial)).toBeUndefined();
  });

  it.each([
    'hello',
    '1,8',
    true
  ])('should return initial string %s', (initial) => {
    expect(convertToUnit(initial)).toBe(String(initial));
  });

  it.each([
    ['1', '1px'],
    [-2, '-2px'],
    ['2.5', '2.5px']
  ])('should return $expected for $initial', (initial, expected) => {
    expect(convertToUnit(initial)).toBe(expected);
  });

  it('should add custom unit to result', () => {
    expect(convertToUnit(2, 'pt')).toBe('2pt');
  });
});
