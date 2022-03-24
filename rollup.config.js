import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import replace from '@rollup/plugin-replace';
import RollupPluginPreprocess from "rollup-plugin-preprocess";
import sourcemaps from 'rollup-plugin-sourcemaps';
import banner from 'rollup-plugin-banner';

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';

// Input definitions

const mainInputFile = 'src/index.ts';

const treeshakeAwareInput = {
    'index': mainInputFile,
    // Additional modules for consumers caring about the final bundle size
    'email-validations/functions': 'src/email-validations/functions/index.ts',
    'email-validations/constants': 'src/email-validations/constants/index.ts',
    'credits/functions': 'src/credits/functions/index.ts',
};

export default [
    // ESM2015 for browser
    {
        input: treeshakeAwareInput,
        external: [
            'tslib',
            ...isProduction
                ? []
                : ['debug']
        ],
        plugins: [
            RollupPluginPreprocess({
                include: ['**/*.js', '**/*.ts'],
                context: {
                    TARGET: 'browser',
                    ENVIRONMENT: environment,
                    FORMAT: 'es',
                }
            }),
            resolve(),
            sourcemaps(),
            builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(environment),
                './environments/environment': './environments/environment.' + environment
            }),
            typescript({
                tsconfig: 'tsconfig.esm2015.json'
            }),
            banner('(c) Verifalia - email verification service - https://verifalia.com')
        ],
        output: [{
            dir: 'browser/esm',
            format: 'es',
            sourceMap: true
        }]
    },

    // ESM2015 for Node
    {
        input: treeshakeAwareInput,
        external: [
            'tslib',
            'form-data',
            'fs',
            // node-fetch dependencies
            'stream',
            'http',
            'url',
            'https',
            'zlib',
            'whatwg-url', // Bogus dependency, used in node v0.x (but node-fetch v2.x does not support that old node version, as per its package.json!)
            ...isProduction
                ? []
                : ['debug']
        ],
        plugins: [
            RollupPluginPreprocess({
                include: ['**/*.js', '**/*.ts'],
                context: {
                    TARGET: 'node',
                    ENVIRONMENT: environment,
                    FORMAT: 'es',
                }
            }),
            resolve({
                preferBuiltins: true
            }),
            sourcemaps(),
            // builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(environment),
                './environments/environment': './environments/environment.' + environment
            }),
            typescript({
                tsconfig: 'tsconfig.esm2015.json'
            }),
            banner('(c) Verifalia - email verification service - https://verifalia.com')
        ],
        output: [{
            dir: 'node/esm',
            format: 'es',
            sourceMap: true,
            chunkFileNames: '[name]-[hash].mjs',
            entryFileNames: '[name].mjs'
        }]
    },    

    // CommonJS for browser
    {
        input: mainInputFile,
        external: [
            'tslib',
            ...isProduction
                ? []
                : ['debug']
        ],
        plugins: [
            RollupPluginPreprocess({
                include: ['**/*.js', '**/*.ts'],
                context: {
                    TARGET: 'browser',
                    ENVIRONMENT: environment,
                    FORMAT: 'cjs',
                }
            }),
            resolve(),
            sourcemaps(),
            builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(environment),
                './environments/environment': './environments/environment.' + environment
            }),
            typescript({
                tsconfig: 'tsconfig.cjs.json'
            }),
            banner('(c) Verifalia - email verification service - https://verifalia.com')
        ],
        output: [{
            file: 'browser/cjs/index.js',
            format: 'cjs',
            name: 'verifalia',
            exports: 'named',
            sourceMap: true,
            amd: {
                id: 'verifalia'
            }
        },]
    },

    // CommonJS for Node
    {
        input: mainInputFile,
        external: [
            'tslib',
            'form-data',
            'fs',
            // node-fetch dependencies
            'stream',
            'http',
            'url',
            'https',
            'zlib',
            'whatwg-url', // Bogus dependency, used in node v0.x (but node-fetch v2.x does not support that old node version, as per its package.json!)
            ...isProduction
                ? []
                : ['debug']
        ],
        plugins: [
            RollupPluginPreprocess({
                include: ['**/*.js', '**/*.ts'],
                context: {
                    TARGET: 'node',
                    ENVIRONMENT: environment,
                    FORMAT: 'cjs',
                }
            }),
            resolve(),
            sourcemaps(),
            builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(environment),
                './environments/environment': './environments/environment.' + environment
            }),
            typescript({
                tsconfig: 'tsconfig.cjs.json'
            }),
            banner('(c) Verifalia - email verification service - https://verifalia.com')
        ],
        output: [{
            file: 'node/cjs/index.js',
            format: 'cjs',
            name: 'verifalia',
            exports: 'named',
            sourceMap: true,
            amd: {
                id: 'verifalia'
            }
        },]
    },    

    // UMD (browser-only)
    {
        input: mainInputFile,
        external: [
            'tslib',
            ...isProduction
                ? []
                : ['debug']
        ],
        plugins: [
            RollupPluginPreprocess({
                include: ['**/*.js', '**/*.ts'],
                context: {
                    TARGET: 'browser',
                    ENVIRONMENT: environment,
                    FORMAT: 'umd',
                }
            }),
            resolve(),
            sourcemaps(),
            builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(environment),
                './environments/environment': './environments/environment.' + environment
            }),
            typescript({
                tsconfig: 'tsconfig.umd.json'
            }),
            banner('(c) Verifalia - email verification service - https://verifalia.com')
        ],
        output: [{
            file: 'browser/umd/verifalia.js',
            format: 'umd',
            name: 'verifalia',
            exports: 'named',
            sourceMap: true,
            amd: {
                id: 'verifalia'
            },
            globals: {
                'tslib': 'tslib',
                'debug': 'debug'
            }
        }]
    },

    // AMD (browser only)
    {
        input: mainInputFile,
        external: [
            'tslib',
            ...isProduction
                ? []
                : ['debug']
        ],
        plugins: [
            RollupPluginPreprocess({
                include: ['**/*.js', '**/*.ts'],
                context: {
                    TARGET: 'browser',
                    ENVIRONMENT: environment,
                    FORMAT: 'amd',
                }
            }),
            resolve(),
            sourcemaps(),
            builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(environment),
                './environments/environment': './environments/environment.' + environment
            }),
            typescript({
                tsconfig: 'tsconfig.amd.json'
            }),
            banner('(c) Verifalia - email verification service - https://verifalia.com')
        ],
        output: [{
            file: 'browser/amd/verifalia.js',
            format: 'amd',
            name: 'verifalia',
            exports: 'named',
            sourceMap: true,
            amd: {
                id: 'verifalia'
            }
        }]
    },

    // System.js (browser-only)
    {
        input: mainInputFile,
        external: [
            'tslib',
            ...isProduction
                ? []
                : ['debug']
        ],
        plugins: [
            RollupPluginPreprocess({
                include: ['**/*.js', '**/*.ts'],
                context: {
                    TARGET: 'browser',
                    ENVIRONMENT: environment,
                    FORMAT: 'system',
                }
            }),
            resolve(),
            sourcemaps(),
            builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(environment),
                './environments/environment': './environments/environment.' + environment
            }),
            typescript({
                tsconfig: 'tsconfig.system.json'
            }),
            banner('(c) Verifalia - email verification service - https://verifalia.com')
        ],
        output: [{
            file: 'browser/system/verifalia.js',
            format: 'system',
            name: 'verifalia',
            exports: 'named',
            sourceMap: true
        }]
    },

    // browser-friendly IIFE build, with no external dependencies
    {
        input: mainInputFile,
        plugins: [
            RollupPluginPreprocess({
                include: ['**/*.js', '**/*.ts'],
                context: {
                    TARGET: 'browser',
                    ENVIRONMENT: environment,
                    FORMAT: 'iife',
                }
            }),
            resolve({
                jsnext: true,
                main: true,
                browser: true
            }),
            commonjs({
                include: 'node_modules/**'
            }),
            json(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(environment),
                'environments/environment': 'environments/environment.' + environment
            }),
            typescript({
                tsconfig: 'tsconfig.iife.json'
            }),
            banner('(c) Verifalia - email verification service - https://verifalia.com')
        ],
        output: [
            {
                name: 'Verifalia',
                file: 'browser/iife/verifalia.js',
                format: 'iife',
                exports: 'named'
            },
            {
                name: 'Verifalia',
                file: 'browser/iife/verifalia.min.js',
                format: 'iife',
                exports: 'named',
                plugins: [
                    terser({
                        compress: {
                            passes: 2,
                        },
                    }),
                ]
            },
        ],
    },
];