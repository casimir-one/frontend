// eslint-disable-next-line import/no-extraneous-dependencies
import serializer from 'jest-serializer-html';
import { quote } from '../lib/parsers/quote';

expect.addSnapshotSerializer(serializer);

describe('quote editorjs block parser', () => {
  it('should return empty quote', () => {
    const block = { };
    const result = quote(block);
    expect(result).toMatchSnapshot();
  });

  it('should return quote', () => {
    const block = {
      caption: 'Author',
      text: 'Text'
    };
    const result = quote(block);
    expect(result).toMatchSnapshot();
  });

  it('should return quote with alignment', () => {
    const block = {
      alignment: 'center',
      caption: 'Author',
      text: 'Text'
    };
    const result = quote(block);
    expect(result).toMatchSnapshot();
  });
});
