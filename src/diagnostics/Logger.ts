/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* @if ENVIRONMENT!='production' */
import debug, { Debugger } from 'debug';
/* @endif */

export class Logger {
    /* @if ENVIRONMENT!='production' */
    private _debugger: Debugger;
    /* @endif */

    constructor(namespace: string) {
        /* @if ENVIRONMENT!='production' */
        this._debugger = debug(namespace);
        /* @endif */
    }

    log(formatter: any, ...args: any[]): void {
        /* @if ENVIRONMENT!='production' */
        this._debugger.apply(this._debugger, [formatter, ...args]);
        /* @endif */
    }
}