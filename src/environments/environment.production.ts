import { ILoggerFactory } from "../diagnostics/ILoggerFactory";
import { ILogger } from "../diagnostics/ILogger";

export class LoggerFactory implements ILoggerFactory {
    build(namespace: string): ILogger {
        return {
            log: function() {}
        };
    }
}