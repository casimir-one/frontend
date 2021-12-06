import path from 'path';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import scss from 'rollup-plugin-scss';
import vue from 'rollup-plugin-vue';
// import vueJsx from 'rollup-plugin-vue-jsx-compat';
// import esbuild from 'rollup-plugin-esbuild';

/**
 * @param {object?} options
 * @param {string} options.distPath output folder for all emitted files.
 * @param {string} options.mainFileName primary entry point to your program
 * @param {string} options.moduleFileName pkg.module entry point to ECMAScript
 * @returns {object}
 */
export default function config(options) {
  const opts = {
    distPath: 'lib',
    mainFileName: 'index.js',
    moduleFileName: 'index.esm.js',
    ...options
  };

  return {
    input: 'src/index.ts',
    output: [
      {
        format: 'cjs',
        file: path.join(opts.distPath, opts.mainFileName),
        sourcemap: true
      },
      {
        format: 'esm',
        file: path.join(opts.distPath, opts.moduleFileName),
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        check: false
      }),
      // vueJsx(),
      // esbuild({
      //   jsxFactory: 'vueJsxCompat',
      //   jsxFragment: 'Fragment'
      // }),
      vue(),
      resolve(),
      peerDepsExternal(),
      commonjs(),
      scss()
    ]
  };
}
