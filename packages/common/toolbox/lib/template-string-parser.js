import objectPath from 'object-path';
import { isNil } from 'lodash';

const mainPattern = /{{\s*([\w\d.:,()'"\s]*?)\s*}}/g;
const fnSubPattern = /^\(([\w\d.,_\s'"]*)\)(::[\w\d]+)+/g;

/**
 * Check if has single match
 * @param {string} str
 * @param {Array.<Array.<string>>} matches
 * @returns {boolean}
 */
export const isSingleMatch = (str, matches) => {
  if (matches.length === 1) {
    return str
      .replace(matches[0][0], '')
      .replace(/ /g, '') === '';
  }
  return false;
};

/**
 * Check for function
 * @param {string} str
 * @returns {boolean}
 */
export const isFunctionMatch = (str) => !![...str.matchAll(fnSubPattern)].length;

export class TemplateStringParser {
  constructor(ctx, options = { isTemplateShown: false }) {
    this.ctx = ctx;
    const { isTemplateShown } = options;
    this.isTemplateShown = isTemplateShown;
  }

  /**
 * Set context
 * @param {Object} ctx
 */
  setCtx(ctx) {
    this.ctx = ctx;
  }

  /**
 * Parse string
 * @param {*} str
 * @returns {string}
 */
  parse(str) {
    if (typeof str !== 'string') {
      throw new Error('The argument must be a string type');
    }

    const matches = [...str.matchAll(mainPattern)];
    if (matches && matches.length) {
      if (isSingleMatch(str, matches)) {
        return this.parseMatch(matches[0][1]);
      }

      return str
        .replace(mainPattern, (matched, match) => {
          const parsedMatch = this.parseMatch(match);
          return !isNil(parsedMatch) ? parsedMatch : '';
        });
    }

    return str;
  }

  /**
 * Get value from context
 * @param {string} prop
 * @returns {*}
 */
  getValueFromContext(prop) {
    return objectPath.get(this.ctx, prop);
  }

  /**
 * Check for property in context
 * @param {string} prop
 * @returns {boolean}
 */
  isCtxHas(prop) {
    return objectPath.has(this.ctx, prop);
  }

  /**
 * Parse chain match
 * @param {Array} chain
 * @param {string} match
 * @param {...Array.<string>} params
 * @returns {string}
 */
  parseChainMatch(chain, match, ...params) {
    if (!chain.length) {
      throw new Error('Chain not exist');
    }

    const fn = chain.pop();

    const isFnExist = this.isCtxHas(fn);
    let result;
    if (isFnExist) {
      result = this.getValueFromContext(fn)(...params);
    } else if (this.isTemplateShown) {
      result = `{{${match}}}`;
    }

    if (chain.length && isFnExist) {
      return this.parseChainMatch(
        chain, match, ...[result]
      );
    }

    return result;
  }

  /**
 * Parse match
 * @param {string} match
 * @returns {string}
 */
  parseMatch(match) {
    if (isFunctionMatch(match)) {
      const [params, ...fns] = match.split('::');
      const chain = fns.reverse();
      const chainParams = [
        ...params.matchAll(/\(([\w\d.,_\s'"]*)\)/g)
      ]?.[0]?.[1];
      const parsedParams = chainParams
        ? chainParams.split(/,\s*/)
          .map((p) => {
            const s = [...p.matchAll(/(?:['"])(.*)(?:['"])/g)]?.[0]?.[1];
            return s || this.getValueFromContext(p);
          })
        : [];

      return this.parseChainMatch(chain, match, ...parsedParams);
    }

    const value = this.getValueFromContext(match);

    return !isNil(value) || !this.isTemplateShown ? value : `{{${match}}}`;
  }
}
