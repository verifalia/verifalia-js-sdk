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

/**
 * JSON content-type.
 */
export const MimeContentType_ApplicationJson = 'application/json';

/**
 * RFC-9457 problem details (problem+json) content-type.
 */
export const MimeContentType_ApplicationProblemJson = 'application/problem+json';

/**
 * Plain-text files (.txt), with one email address per line.
 */
export const MimeContentType_TextPlain = 'text/plain';

/**
 * Comma-separated values (.csv).
 */
export const MimeContentType_TextCsv = 'text/csv';

/**
 * Tab-separated values (usually coming with the .tsv extension).
 */
export const MimeContentType_TextTsv = 'text/tab-separated-values';

/**
 * Microsoft Excel 97-2003 Worksheet (.xls).
 */
export const MimeContentType_ExcelXls = 'application/vnd.ms-excel';

/**
 * Microsoft Excel workbook (.xslx).
 */
export const MimeContentType_ExcelXlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * The problem+json type used to indicate the provided CAPTCHA token failed validation on the server side. 
 */
export const ProblemType_CaptchaValidationFailed = '/problems/captcha-validation-failed';