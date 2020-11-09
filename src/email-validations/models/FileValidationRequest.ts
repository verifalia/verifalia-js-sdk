import { ValidationSettings } from "./ValidationSettings";

// Node-specific

/* @if TARGET='node' */
import { ReadStream } from "fs";
/* @endif */

/**
 * Represents an email validation request through a file import, to be submitted against the Verifalia API.
 * Verifalia offers support for the following file types:
 * - plain text files (.txt), with one email address per line (MIME type: text/plain)
 * - comma-separated values (.csv), tab-separated values (.tsv) and other delimiter-separated values files (MIME
 * types: text/csv and text/tab-separated-values)
 * - Microsoft Excel spreadsheets - .xls and .xlsx - (MIME types: application/vnd.ms-excel and
 * application/vnd.openxmlformats-officedocument.spreadsheetml.sheet).
 */

export interface FileValidationRequest extends ValidationSettings {
    file:
/* @if TARGET='browser' */
        Blob | File
/* @endif */
/* @if false */
        | // HACK: Keep the IDE's background compiler happy
/* @endif */
/* @if TARGET='node' */
        ReadStream | Buffer;
/* @endif */

    contentType: string;
    
    startingRow?: number;
    endingRow?: number;
    column?: number;
    sheet?: number;
    lineEnding?: string;
    delimiter?: string;
}