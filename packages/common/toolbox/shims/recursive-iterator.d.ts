declare module 'recursive-iterator' {
  class RecursiveIterator {
    constructor(root: any | any[], bypassMode?: number, ignoreCircular?: boolean, maxDeep?: number);

    next(): any;

    destroy(): void;

    isNode(any: any): boolean;

    isLeaf(any: any): boolean;

    isCircular(any: any): boolean;

    getStatesOfChildNodes(node: any, path: any[], deep: number): Array<any>;

    getState(parent?: any, node?: any, key?: string, path?: any[], deep?: number): any;

    onStepInto(state: any): boolean;

    [Symbol.iterator](): RecursiveIterator;

    __bypassMode: number;

    __ignoreCircular: boolean;

    __maxDeep: number;

    __cache: any[];

    __queue: any[];

    __state: any;
  }

  export = RecursiveIterator;
}
