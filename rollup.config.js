import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import { terser } from "rollup-plugin-terser";
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';

export default [
    // ES2015 module
    {
        input: 'src/index.ts',
        external: [
            'axios',
            'tslib',
            'date-fns',
            'debug'
        ],
        plugins: [
            resolve(),
            builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                './environments/environment': './environments/environment.' + (process.env.NODE_ENV || 'development')
            }),
            typescript({
                tsconfig: 'tsconfig.' + (process.env.NODE_ENV || 'development') + '.json',
            }),
        ],
        output: [{
            file: pkg['module'],
            format: 'esm'
        }]
    },

    // ES5 module
    {
        input: 'src/index.ts',
        external: [
            'axios',
            'tslib',
            'date-fns',
            'debug'
        ],
        plugins: [
            resolve(),
            builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                './environments/environment': './environments/environment.' + (process.env.NODE_ENV || 'development')
            }),
            typescript({
                tsconfig: 'tsconfig.' + (process.env.NODE_ENV || 'development') + '.json',
                tsconfigOverride: {
                    compilerOptions: {
                        target: 'es5',
                    }
                }
            }),
        ],
        output: [{
            file: pkg['module:es5'],
            format: 'esm'
        }]
    },    

    // UMD
    {
        input: 'src/index.ts',
        external: [
            'axios',
            'tslib',
            'date-fns',
            'debug'
        ],
        globals: {
            'axios': 'axios',
        },
        plugins: [
            resolve(),
            builtins(),
            globals(),
            replace({
                exclude: 'node_modules/**',
                ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                './environments/environment': './environments/environment.' + (process.env.NODE_ENV || 'development')
            }),
            typescript({
                tsconfig: 'tsconfig.' + (process.env.NODE_ENV || 'development') + '.json',
                tsconfigOverride: {
                    compilerOptions: {
                        target: 'es5',
                    }
                }
            }),
        ],
        output: [{
            file: pkg['main'],
            format: 'umd',
            name: 'Verifalia',
            esModule: false
        },]
    },

    // browser-friendly IIFE build, with no external dependencies
    {
        input: 'src/index.ts',
        plugins: [
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
                ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                'environments/environment': 'environments/environment.' + (process.env.NODE_ENV || 'development')
            }),
            typescript({
                tsconfig: 'tsconfig.' + (process.env.NODE_ENV || 'development') + '.json',
                tsconfigOverride: {
                    compilerOptions: {
                        target: 'es5',
                    }
                }
            }),
            terser({
                compress: {
                    passes: 2,
                },
            }),
        ],
        output: {
            name: 'Verifalia',
            file: pkg['browser'],
            format: 'iife',
            exports: 'named'
        },
    },
];