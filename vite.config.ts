import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

import viteEslint from 'vite-plugin-eslint'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [ vue(), viteEslint(), viteSingleFile() ],
})
