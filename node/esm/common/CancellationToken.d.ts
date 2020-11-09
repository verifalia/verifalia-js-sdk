export declare class CancellationToken {
    private _isCanceled;
    private _callbacks;
    isCanceled(): boolean;
    register(callback: () => void): void;
    unregister(callback: () => void): void;
    cancel(): void;
    throwIfCancellationRequested(): void;
}
//# sourceMappingURL=CancellationToken.d.ts.map