/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 * 
 * Copyright (c) 2005-2024 Cobisi Research
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