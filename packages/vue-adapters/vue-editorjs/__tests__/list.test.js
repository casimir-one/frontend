import { list } from '../lib/parser/parsers/list';

describe('list editorjs block parser', () => {
  it('should return empty list', () => {
    const expectedResult = '<ol class="de-list"></ol>';
    const block = {
      style: 'ordered',
      items: []
    };
    const result = list(block);
    expect(result).toEqual(expectedResult);
  });

  it('should return ordered list with nested items', () => {
    const expectedResult = '<ol class="de-list"><li class="de-list-item">item</li></ol>';
    const block = {
      style: 'ordered',
      items: [{ content: 'item' }]
    };
    const result = list(block);
    expect(result).toEqual(expectedResult);
  });

  it('should return ordered list', () => {
    const expectedResult = '<ol class="de-list"><li class="de-list-item">item</li></ol>';
    const block = {
      style: 'ordered',
      items: ['item']
    };
    const result = list(block);
    expect(result).toEqual(expectedResult);
  });

  it('should return unordered list', () => {
    const expectedResult = '<ul class="de-list"><li class="de-list-item">item</li></ul>';
    const block = {
      style: 'unordered',
      items: ['item']
    };
    const result = list(block);
    expect(result).toEqual(expectedResult);
  });
});
