export function isSingleMatch(str: string, matches: Array<Array<string>>): boolean;
export function isFunctionMatch(str: string): boolean;
export class TemplateStringParser {
    constructor(ctx: any, options?: {
        isTemplateShown: boolean;
    });
    ctx: any;
    isTemplateShown: boolean;
    setCtx(ctx: any): void;
    parse(str: any): string;
    getValueFromContext(prop: string): any;
    isCtxHas(prop: string): boolean;
    parseChainMatch(chain: any[], match: string, ...params: Array<string>[]): string;
    parseMatch(match: string): string;
}
