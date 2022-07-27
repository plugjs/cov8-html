'use strict'

const fs = require('node:fs')
const path = require('node:path')

const file = path.resolve(__dirname, 'dist', 'index.html')
const html = fs.readFileSync(file, 'utf8')

Object.defineProperties(exports, {
  default: { value: html, enumerable: true },
  __esModule: { value: true },
})
