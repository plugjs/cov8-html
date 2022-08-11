import fs from 'node:fs'
import url from 'node:url'
import path from 'node:path'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const file = path.resolve(__dirname, 'dist', 'index.html')
export const html = fs.readFileSync(file, 'utf8')
export const initFunction = 'window.__initCoverage__'
