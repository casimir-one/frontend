import { objectPath } from '@deip/toolbox';

const mainPattern = /^{{\s*([\w\d.:,()'"\s]*?)\s*}}$/g;
const fnSubPattern = /^\(([\w\d.,_\s'"]*)\)(::[\w\d]+)+/g;

const isSingleMatch = (str, matches) => {
  if (matches.length === 1) {
    return str
      .replace(matches[0][0], '')
      .replace(/ /g, '') === '';
  }
  return false;
};

const isFunctionMatch = (str) => !![...str.matchAll(fnSubPattern)].length;

class TemplateStringParser {
  constructor(ctx) {
    this.ctx = ctx;
  }

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
        .replace(mainPattern, (matched, match) => this.parseMatch(match));
    }

    return str;
  }

  getValueFromContext(prop) {
    return objectPath.get(this.ctx, prop);
  }

  isCtxHas(prop) {
    return objectPath.has(this.ctx, prop);
  }

  parseChainMatch(chain, match, ...params) {
    if (!chain.length) {
      throw new Error('Chain not exist');
    }

    const fn = chain.pop();

    const isFnExist = this.isCtxHas(fn);
    const result = isFnExist ? this.getValueFromContext(fn)(...params) : `{{${match}}}`;

    if (chain.length && isFnExist) {
      return this.parseChainMatch(
        chain, match, ...[result]
      );
    }

    return result;
  }

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
    return this.getValueFromContext(match);
  }
}

export { TemplateStringParser };
