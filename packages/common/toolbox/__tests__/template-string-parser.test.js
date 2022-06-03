import {
  TemplateStringParser,
  isSingleMatch,
  isFunctionMatch
} from '../src';

describe('TemplateStringParser', () => {
  describe('with no context and default options ', () => {
    const parser = new TemplateStringParser();

    it('should have isTemplateShown false', () => {
      expect(parser.isTemplateShown).toBe(false);
    });

    it.each([
      null,
      undefined,
      true,
      1,
      Date.now(),
      {}
    ])('should throw error when not string (%s) passed to parse', (value) => {
      expect(() => { parser.parse(value); })
        .toThrow(new Error('The argument must be a string type'));
    });

    it('should return initial text', () => {
      const initial = 'Test test.';
      expect(parser.parse(initial)).toBe(initial);
    });

    it.each([
      '{{test}}',
      '{{(param)::testFunc}}'
    ])('should return undefined for %s without value in context', (value) => {
      expect(parser.parse(value)).toBeUndefined();
    });

    it('should return empty strings instead not found templates in context', () => {
      const initial = 'test {{test}} {{(param)::testFunc}} test';
      const expected = 'test   test';
      expect(parser.parse(initial)).toBe(expected);
    });
  });

  describe('with no context and isTemplateShown true', () => {
    const parser = new TemplateStringParser(null, { isTemplateShown: true });

    it('should have isTemplateShown true', () => {
      expect(parser.isTemplateShown).toBe(true);
    });

    it('should return initial text', () => {
      const initial = 'Test test.';
      expect(parser.parse(initial)).toBe(initial);
    });

    it.each([
      '{{test}}',
      '{{(param)::testFunc}}'
    ])('should return %s for %s without value in context', (value) => {
      expect(parser.parse(value)).toBe(value);
    });

    it('should return text without found value in context', () => {
      const initial = 'Test test {{test}} {{(param)::testFunc}}';
      expect(parser.parse(initial)).toBe(initial);
    });
  });

  describe('with context', () => {
    const parser = new TemplateStringParser();

    beforeEach(() => {
      const ctx = {
        test: 'testValue',
        world: 'world',
        testFunc: (param) => `hello ${param}`,
        testFunc1: () => 1,
        toUpperCase: ((param) => param.toUpperCase())
      };
      parser.setCtx(ctx);
    });

    it('should set context ', () => {
      const setCtxSpy = jest.spyOn(parser, 'setCtx');
      const ctx = { hello: 'world' };

      parser.setCtx(ctx);

      expect(setCtxSpy).toHaveBeenCalledWith(ctx);
      expect(parser.ctx).toEqual(ctx);

      setCtxSpy.mockClear();
    });

    it.each([
      ['{{test}} {{test}} {{(world)::testFunc}}', 'testValue testValue hello world'],
      ['{{(test)::testFunc}}', 'hello testValue'],
      ['{{("test")::testFunc}}', 'hello test'],
      ['{{()::testFunc1}}', 1],
      ['test {{test1}} test', 'test  test'],
      ['{{(world)::testFunc::toUpperCase}}', 'HELLO WORLD']
    ])('should set values from context for %s', (initial, expected) => {
      expect(parser.parse(initial)).toBe(expected);
    });
  });
});

describe('isSingleMatch', () => {
  const pattern = /test/g;
  it('should return true', () => {
    const str = 'test';
    const matches = [...str.matchAll(pattern)];
    expect(isSingleMatch(str, matches)).toBe(true);
  });

  it.each([
    'hello test world',
    'hello test test',
    ''
  ])('should return false for %s', (str) => {
    const matches = [...str.matchAll(pattern)];
    expect(isSingleMatch(str, matches)).toBe(false);
  });
});

describe('isFunctionMatch', () => {
  it.each([
    '(param1)::testFunc',
    '()::testFunc',
    '(param1,)::testFunc'
  ])('should return true for %s', (str) => {
    expect(isFunctionMatch(str)).toBe(true);
  });

  it.each([
    'test',
    '{{test}}, ():testFunc',
    '{testFunc}',
    '::testFunc'
  ])('should return false for %s', (str) => {
    expect(isFunctionMatch(str)).toBe(false);
  });
});
