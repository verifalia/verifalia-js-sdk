import { DebugLogger } from "../diagnostics/DebugLogger";
import { ILogger } from "../diagnostics/ILogger";
import { ILoggerFactory } from "../diagnostics/ILoggerFactory";

export class LoggerFactory implements ILoggerFactory {
    build(namespace: string): ILogger {
        return new DebugLogger(namespace);
    }
}