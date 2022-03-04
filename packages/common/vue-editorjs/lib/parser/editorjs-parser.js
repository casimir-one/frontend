import { parsers } from './parsers';

export default class EditorjsParser {
  /**
   * @param {Object} additionalParsers
   */
  constructor(additionalParsers) {
    this.parsers = { ...parsers, additionalParsers };
  }

  /**
   * @param {string} name
   * @param {Function} func
   */
  addParser(name, func) {
    this.parsers[name] = func;
  }

  /**
   * @param {Object} block
   * @param {string} block.type
   * @returns {Function}
   */
  getParser({ type }) {
    if (!this.parsers[type]) {
      throw new Error(`No parser for block with type "${type}"`);
    }
    return this.parsers[type];
  }

  /**
   * @param {Object} block
   * @param {Object} block.data
   * @param {string} block.type
   * @returns {string}
   */
  parseBlock(block) {
    const blockParser = this.getParser(block);
    const parsedBlock = blockParser(block.data);

    return `<div class="de-block">${parsedBlock}</div>`;
  }

  /**
   * @param {Object} source source for parsing
   * @returns {string}
   */
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
