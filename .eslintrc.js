const pkg = require('./package')
const webpack = require('webpack')
global.HTMLElement = typeof window === 'undefined' ? Object : window.HTMLElement

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: 'standard',
  plugins: [
    'html',
    'js'
  ],
  // add your custom rules here
  rules: {}
}
