import { ILogger } from "./ILogger";
import debug, { Debugger } from 'debug';

export class DebugLogger implements ILogger {
    private _debugger: Debugger;

    constructor(namespace: string) {
        this._debugger = debug(namespace);
    }

    log(formatter: any, ...args: any[]): void {
        this._debugger.apply(this._debugger, [formatter, ...args]);
    }
}