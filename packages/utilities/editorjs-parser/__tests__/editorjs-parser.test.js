// eslint-disable-next-line import/no-extraneous-dependencies
import serializer from 'jest-serializer-html';
import EditorjsParser from '../lib/editorjs-parser';

expect.addSnapshotSerializer(serializer);

describe('editorjs-parser', () => {
  const parser = new EditorjsParser();

  it('should throw error', () => {
    expect(() => {
      parser.parse('text');
    }).toThrow();
  });

  it('should return empty string', () => {
    const result = parser.parse(null);
    expect(result).toEqual('');
  });

  it('should return parsed html', () => {
    const editorData = {
      time: 1629376009755,
      blocks: [
        {
          id: 'OipISyQbWZ',
          type: 'header',
          data: {
            text: 'header',
            level: 2
          }
        },
        {
          id: '6Uz542s55a',
          type: 'paragraph',
          data: {
            text: 'text'
          }
        }
      ],
      version: '2.22.2'
    };

    const result = parser.parse(editorData);
    expect(result).toMatchSnapshot();
  });
});
