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

import {
    CaptchaProvider_HCaptcha,
    CaptchaProvider_ReCaptchaV2,
    CaptchaProvider_ReCaptchaV3,
    CaptchaProvider_Turnstile
} from "../constants";

export const CaptchaProvider = {
    /**
     * hCaptcha. See https://docs.hcaptcha.com/
     */
    HCaptcha: CaptchaProvider_HCaptcha,

    /**
     * Google reCAPTCHA v2. See https://developers.google.com/recaptcha/intro
     */
    ReCaptchaV2: CaptchaProvider_ReCaptchaV2,

    /**
     * Google reCAPTCHA v3. See https://developers.google.com/recaptcha/intro
     */
    ReCaptchaV3: CaptchaProvider_ReCaptchaV3,

    /**
     * Cloudflare Turnstile. See https://developers.cloudflare.com/turnstile/
     */
    Turnstile: CaptchaProvider_Turnstile,
}