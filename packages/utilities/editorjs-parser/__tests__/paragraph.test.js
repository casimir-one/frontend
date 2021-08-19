import { paragraph } from '../lib/parsers/paragraph';

describe('paragraph editorjs block parser', () => {
  it('should return empty paragraph', () => {
    const expectedResult = '<p class="de-paragraph"></p>';
    const block = { };
    const result = paragraph(block);
    expect(result).toEqual(expectedResult);
  });

  it('should return paragraph', () => {
    const expectedResult = '<p class="de-paragraph">Text</p>';
    const block = {
      text: 'Text'
    };
    const result = paragraph(block);
    expect(result).toEqual(expectedResult);
  });
});
