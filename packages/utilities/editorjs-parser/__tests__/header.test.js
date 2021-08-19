import { header } from '../lib/parsers/header';

describe('header editorjs block parser', () => {
  it('should return empty header', () => {
    const expectedResult = '<h1 class="de-header"></h1>';
    const block = {
      level: 1
    };
    const result = header(block);
    expect(result).toEqual(expectedResult);
  });

  it('should return h5 tag', () => {
    const expectedResult = '<h5 class="de-header">Header</h5>';
    const block = {
      level: 5,
      text: 'Header'
    };
    const result = header(block);
    expect(result).toEqual(expectedResult);
  });
});
