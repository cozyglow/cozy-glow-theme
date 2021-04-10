'use strict';

const path = require('path');
const {babel} = require('@rollup/plugin-babel');
const {nodeResolve} = require('@rollup/plugin-node-resolve');

const BUNDLE = process.env.BUNDLE === 'true';

let fileDestination = 'main.js';
const external = ['jquery', 'lodash', 'popper.js'];
const plugins = [
  babel({
    // Only transpile our source code
    exclude: 'node_modules/**',
    // Include the helpers in the bundle, at most one copy of each
    babelHelpers: 'bundled'
  })
];
const globals = {
  jquery: 'jQuery', // Ensure we use jQuery which is always available even in noConflict mode
  lodash: '_',
  'popper.js': 'Popper'
};

if (BUNDLE) {
  fileDestination = 'main.bundle.js';
  // Remove last entry in external array to bundle Popper
  external.pop();
  delete globals['popper.js'];
  plugins.push(nodeResolve());
}

module.exports = {
  input: path.resolve(__dirname, '../js/index.js'),
  output: {
    file: path.resolve(__dirname, `../dist/js/${fileDestination}`),
    format: 'umd',
    globals,
    name: 'main'
  },
  external,
  plugins
};
