import { delimiter } from '../lib/parsers/delimiter';

describe('delimiter editorjs block parser', () => {
  it('should return delimiter', () => {
    const expectedResult = '<div class="de-delimiter"></div>';
    expect(delimiter()).toEqual(expectedResult);
  });
});
