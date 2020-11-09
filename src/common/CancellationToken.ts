import { OperationCanceledError } from "../errors/OperationCanceledError";

export class CancellationToken {
    private _isCanceled = false;
    private _callbacks: (() => void)[] = [];

    public isCanceled(): boolean {
        return this._isCanceled;
    }

    public register(callback: () => void) {
        if (this._isCanceled) {
            callback();
            return;
        }

        this._callbacks.push(callback);
    }

    public unregister(callback: () => void) {
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