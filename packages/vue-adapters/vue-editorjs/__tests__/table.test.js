// eslint-disable-next-line import/no-extraneous-dependencies
import serializer from 'jest-serializer-html';
import { table } from '../lib/parser/parsers/table';

expect.addSnapshotSerializer(serializer);

describe('table editorjs block parser', () => {
  it('should return empty table', () => {
    const expectedResult = '';
    const block = {
      content: []
    };
    const result = table(block);
    expect(result).toEqual(expectedResult);
  });

  it('should return table without heading', () => {
    const block = {
      content: [
        ['a', 'b'],
        ['c', 'd']
      ]
    };
    const result = table(block);
    expect(result).toMatchSnapshot();
  });

  it('should return table with heading', () => {
    const block = {
      withHeadings: true,
      content: [
        ['a', 'b'],
        ['c', 'd']
      ]
    };
    const result = table(block);
    expect(result).toMatchSnapshot();
  });
});
