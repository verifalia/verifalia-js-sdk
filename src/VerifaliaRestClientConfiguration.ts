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

/* @if TARGET='node' */
import { KeyObject } from "tls";
/* @endif */

export interface VerifaliaRestClientConfiguration {
    /**
     * The username or the browser app key to use while authenticating to the Verifalia API, if
     * you are authenticating using a Verifalia browser app. While using your Verifalia
     * main account credentials is possible, it is strongly advised to create one or more users
     * (formerly known as sub-accounts) with just the required permissions, for improved security.
     * To create a new user or manage existing ones, please visit https://verifalia.com/client-area#/users
     */
    username: string;

    /**
     * The password to use while authenticating to the Verifalia API. While using your Verifalia
     * main account credentials is possible, it is strongly advised to create one or more users
     * (formerly known as sub-accounts) with just the required permissions, for improved security.
     * To create a new user or manage existing ones, please visit https://verifalia.com/client-area#/users
     */
    password: string;

    /**
     * The base API endpoints for the Verifalia service: do NOT set these unless you are instructed
     * to do so by the Verifalia support team.
     */
    baseUris?: string[];

    /* @if TARGET='node' */

    /**
     * This field is used only for client-certificate authentication.
     * Cert chains in PEM format. One cert chain should be provided per private key. Each cert chain should
     * consist of the PEM formatted certificate for a provided private key, followed by the PEM formatted
     * intermediate certificates (if any), in order, and not including the root CA (the root CA must be
     * pre-known to the peer, see ca). When providing multiple cert chains, they do not have to be in the
     * same order as their private keys in key. If the intermediate certificates are not provided, the peer
     * will not be able to validate the certificate, and the handshake will fail.
     */
    cert?: string | Buffer | (string | Buffer)[];

    /**
     * This field is used only for client-certificate authentication.
     * Private keys in PEM format. PEM allows the option of private keys being encrypted. Encrypted keys will
     * be decrypted with options.passphrase. Multiple keys using different algorithms can be provided either
     * as an array of unencrypted key strings or buffers, or an array of objects in the form {pem: <string|buffer>[, passphrase: ]}.
     * The object form can only occur in an array. object.passphrase is optional. Encrypted keys will be
     * decrypted with object.passphrase if provided, or options.passphrase if it is not.
     */
    key?: string | Buffer | (Buffer | KeyObject)[];

    /**
     * This field is used only for client-certificate authentication.
     * Shared passphrase used for a single private key and/or a PFX.
     */
    passphrase?: string
    
    /* @endif */
}
