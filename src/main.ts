/* Import PrismJS styles and scripts, they'll hook to window.Prism */
import 'prismjs/themes/prism.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/keep-markup/prism-keep-markup'
import { createApp } from '@vue/runtime-dom'

/* Our CSS and app */
import './main.css'
import App from './app.vue'

/* Callback for our JSONP-formatted report */
window.__initCoverage__ = function(report: CoverageReport) {
  createApp(App, { report }).mount('#app')
  // window.__coverageData__ = report
}

/** Hack to load our JSONO-formatted report (we use files...) */
document.addEventListener('DOMContentLoaded', () => {
  const coverageScript = document.createElement('script')
  coverageScript.setAttribute('src', 'report.js')
  document.body.appendChild(coverageScript)
})
