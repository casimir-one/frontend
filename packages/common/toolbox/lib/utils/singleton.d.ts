export function makeSingletonInstance(createInstance: any): (...args: [any][]) => any;
export class Singleton {
    static instance: any;
    static getInstance(...params: any[]): Singleton;
}
