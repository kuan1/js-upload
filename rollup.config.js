import path from 'path'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'

const isDev = process.env.NODE_ENV === 'development'

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: `public/js-upload.js`,
      format: 'iife',
      name: 'jsUpload',
    },
  ],
  plugins: [
    alias({
      resolve: ['.js'],
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    }),
    resolve(),
    commonjs({ exclude: 'node_modules' }),
    json(),
    typescript(),
  ],
}

if (!isDev) {
  config.output = [
    {
      file: 'lib/index.js',
      format: 'esm',
    },
    {
      file: `lib/js-upload.js`,
      format: 'iife',
      name: 'jsUpload',
    },
  ]
  config.plugins.push(terser())
}

export default [config]
