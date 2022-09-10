export function Interface(interfaceName: string, interfaceMembers: any): Interface;
export class Interface {
    constructor(interfaceName: string, interfaceMembers: any);
    name: string;
}
export namespace Interface {
    function interfaceError(interfaceName: string, interfaceMember: string, argsCount: number): never;
    function implement(obj: any, ...list: any[][]): boolean;
}
