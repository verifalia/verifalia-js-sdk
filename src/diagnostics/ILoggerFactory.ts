import { ILogger } from "./ILogger";

export interface ILoggerFactory {
    build(namespace: string): ILogger;
}