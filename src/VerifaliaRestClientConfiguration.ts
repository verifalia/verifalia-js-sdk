/* @if TARGET='node' */
import { KeyObject } from "tls";
/* @endif */

export interface VerifaliaRestClientConfiguration {
    /**
     * The username to use while authenticating to the Verifalia API. While using your Verifalia
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
     * The base API endpoints for the Verifalia service: do not set these unless you are instructed
     * to do so by the Verifalia support team.
     */
    baseUris: string[];

    /* @if TARGET='node' */

    /**
     * Cert chains in PEM format. One cert chain should be provided per private key. Each cert chain should
     * consist of the PEM formatted certificate for a provided private key, followed by the PEM formatted
     * intermediate certificates (if any), in order, and not including the root CA (the root CA must be
     * pre-known to the peer, see ca). When providing multiple cert chains, they do not have to be in the
     * same order as their private keys in key. If the intermediate certificates are not provided, the peer
     * will not be able to validate the certificate, and the handshake will fail.
     */
    cert: string | Buffer | (string | Buffer)[];

    /**
     * Private keys in PEM format. PEM allows the option of private keys being encrypted. Encrypted keys will
     * be decrypted with options.passphrase. Multiple keys using different algorithms can be provided either
     * as an array of unencrypted key strings or buffers, or an array of objects in the form {pem: <string|buffer>[, passphrase: ]}.
     * The object form can only occur in an array. object.passphrase is optional. Encrypted keys will be
     * decrypted with object.passphrase if provided, or options.passphrase if it is not.
     */
    key: string | Buffer | (Buffer | KeyObject)[];

    /**
     * Shared passphrase used for a single private key and/or a PFX.
     */
    passphrase: string
    
    /* @endif */
}