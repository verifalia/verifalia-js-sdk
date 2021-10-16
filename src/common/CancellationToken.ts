/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 * 
 * Copyright (c) 2005-2021 Cobisi Research
 * 
 * Cobisi Research
 * Via Della Costituzione, 31
 * 35010 Vigonza
 * Italy - European Union
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { OperationCanceledError } from "../errors/OperationCanceledError";

export class CancellationToken {
    private _isCanceled = false;
    private _callbacks: (() => void)[] = [];

    public isCanceled(): boolean {
        return this._isCanceled;
    }

    public register(callback: () => void): void {
        if (this._isCanceled) {
            callback();
            return;
        }

        this._callbacks.push(callback);
    }

    public unregister(callback: () => void): void {
        const index = this._callbacks.indexOf(callback);

        if (index >= 0) {
            this._callbacks.splice(index, 1);
        }
    }

    public cancel(): void {
        this._isCanceled = true;

        for (const callback of this._callbacks) {
            callback();
        }

        this._callbacks = [];
    }

    public throwIfCancellationRequested(): void {
        if (this.isCanceled()) {
            throw new OperationCanceledError();
        }
    }
}