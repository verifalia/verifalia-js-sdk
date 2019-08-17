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
    // // browser-friendly IIFE build, with everything external
    // {
    // 	input: 'src/main.ts',
    // 	output: {
    // 		name: 'VerifaliaRestClient',
    // 		file: pkg.browser,
    // 		format: 'iife',
    // 		globals: {
    // 			'axios': 'axios',
    // 			'rxjs': 'rxjs',
    // 			'rxjs/operators': 'rxjs.operators'
    // 		}
    // 	},
    // 	external: [
    // 		// axios-observable does not (yet) have a ready-made redistributable module and is super small,
    // 		// so we are embedding it into the Verifalia SDK and not referring to it as an "external" module.
    // 		'axios',
    // 		'rxjs',
    // 		'rxjs/operators',
    // 		'tslib'
    // 	],
    // 	plugins: [
    // 		resolve({
    // 			jsnext: true,
    // 			main: true,
    // 			browser: true
    // 		}),
    // 		commonjs({
    // 			include: 'node_modules/**'
    // 		}),
    // 		json(),
    // 		typescript() // so Rollup can convert TypeScript to JavaScript
    // 	]
    // },

    // ES module
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
            }),
            typescript({
                target: 'es2019'
            }),
        ],
        output: [{
            file: pkg.module,
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
            }),
            typescript({
                target: "es5"
            }),
        ],
        output: [{
            file: pkg.main,
            format: 'umd',
            name: 'Verifalia',
            esModule: false
        },]
    },

    // browser-friendly IIFE build, with no external dependencies
    {
        input: 'src/index.ts',
        output: {
            name: 'Verifalia',
            file: pkg.browser,
            format: 'iife'
        },
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
            }),
            typescript({
                target: 'es5'
            }),
            terser({
                compress: {
                    passes: 2,
                },
            }),
        ]
    },
];