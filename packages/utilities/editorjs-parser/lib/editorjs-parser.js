import { parsers } from './parsers';

export default class EditorjsParser {
  constructor(additionalParsers) {
    this.parsers = { ...parsers, additionalParsers };
  }

  addParser(name, func) {
    this.parsers[name] = func;
  }

  getParser({ type }) {
    if (!this.parsers[type]) {
      throw new Error(`No parser for block with type "${type}"`);
    }
    return this.parsers[type];
  }

  parseBlock(block) {
    const blockParser = this.getParser(block);
    const parsedBlock = blockParser(block.data);

    return `<div class="de-block">${parsedBlock}</div>`;
  }

  parse(source) {
    if (!source) {
      return '';
    }
    if (!(source instanceof Object)) {
      throw new Error('Source for parsing must be an object');
    }

    const blocks = source.blocks.map((block) => this.parseBlock(block));

    return blocks.join('');
  }
}
