import fs from 'node:fs'
import url from 'node:url'
import path from 'node:path'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const file = path.resolve(__dirname, 'dist', 'index.html')
const html = fs.readFileSync(file, 'utf8')

export default html
