<template>
  <header>
    <h1 class="pointer" @click="selected()">
      <icon>
        <document-arrow-left24-regular v-if="result" />
        <document-bullet-list-multiple24-regular v-else />
      </icon>

      {{ result ? file : 'Coverage Report' }}

      <span class="coverage-group">
        <span :class="[ 'coverage', coverage.clazz ]">
          {{ coverage.percentage }}
        </span>
        <span v-if="coverage.percentageIgnored" class="coverage coverage-warning">
          {{ coverage.percentageIgnored }}
        </span>
      </span>
    </h1>
    <p class="details">
      <span class="group">Covered: <span class="number">{{ nodeCoverage.coveredNodes }}</span> nodes</span>
      <span class="group">Ignored: <span class="number">{{ nodeCoverage.ignoredNodes }}</span> nodes</span>
      <span class="group">Missing: <span class="number">{{ nodeCoverage.missingNodes }}</span> nodes</span>
      <span class="group">Total: <span class="number">{{ nodeCoverage.totalNodes }}</span> nodes</span>
    </p>
  </header>

  <nav :class="{ visible: !result }">
    <tree :tree="report.tree" :report="report" @selected="selected" />
  </nav>

  <main :class="{ visible: !!result }">
    <highlight :result="result" />
  </main>

  <footer>
    Generated with <a href="https://github.com/plugjs/cov8">PlugJS Cov8</a> on
    <span class="date">{{ reportDate }}</span>.
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DocumentBulletListMultiple24Regular, DocumentArrowLeft24Regular } from '@vicons/fluent'
import { Icon } from '@vicons/utils'

import Tree from './tree.vue'
import Highlight from './highlight.vue'

import type { PropType } from 'vue'

export default defineComponent({
  name: 'AppComponent',
  components: {
    DocumentArrowLeft24Regular,
    DocumentBulletListMultiple24Regular,
    Highlight,
    Icon,
    Tree,
  },
  props: {
    report: {
      type: Object as PropType<CoverageReport>,
      required: true,
    },
  },
  data: () => ({
    file: undefined as CoveredFile | undefined,
  }),

  computed: {
    thresholds(): { minimumCoverage: number, optimalCoverage: number } {
      return this.file ? {
        minimumCoverage: this.report.thresholds.minimumFileCoverage,
        optimalCoverage: this.report.thresholds.optimalFileCoverage,
      } : {
        minimumCoverage: this.report.thresholds.minimumCoverage,
        optimalCoverage: this.report.thresholds.optimalCoverage,
      }
    },

    nodeCoverage(): NodeCoverageResult {
      return this.result?.nodeCoverage || this.report.nodes
    },

    coverage(): { clazz: string, percentage: string, percentageIgnored?: string } {
      const coverage = this.nodeCoverage.coverage
      const clazz =
          coverage === null ? 'coverage-unavailable' :
          coverage < this.thresholds.minimumCoverage ? 'coverage-error' :
          coverage < this.thresholds.optimalCoverage ? 'coverage-warning' :
          'coverage-ok'
      const percentage = coverage == null ? 'N/A' : `${coverage}%`

      const percentageIgnored =
          this.nodeCoverage.ignoredNodes > 0 ?
            this.nodeCoverage.totalNodes ?
              `${Math.ceil(this.nodeCoverage.ignoredNodes / this.nodeCoverage.totalNodes * 100)}%` :
              undefined : // zero total nodes (infinity)
            undefined // zero ignored nodes

      return { percentage, percentageIgnored, clazz }
    },

    result(): CoverageResult | undefined {
      return this.file ? this.report.results[this.file] : undefined
    },

    reportDate(): string {
      const date = new Date(this.report.date)
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }).format(date)
    },
  },

  mounted() {
    window.addEventListener('hashchange', () => {
      this.selected(window.location.hash.substring(1))
    })
    this.selected(window.location.hash.substring(1))
  },

  methods: {
    selected(file: string = '') {
      if (file in this.report.results) {
        this.file = file as CoveredFile
        window.location.hash = file
      } else {
        this.file = undefined
        window.location.hash = ''
      }
    },
  },
})
</script>

<style scoped lang="pcss">
  h1 {
    padding-bottom: 0.25em;
    margin-bottom: 0.25em;
    border-bottom: 1px solid #666;

    .xicon {
      color: #999;
      position: relative;
      top: 0.2em;
    }
  }

  p.details {
    font-size: 0.75em;
    color: #666;

    .number {
      padding: 0 0.25em;
      font-weight: 600;
      color: #000;
    }

    .group:nth-child(n+2) {
      margin-left: 1em;
      padding-left: 1em;
      border-left: 1px solid #999;
    }
  }

  footer {
    padding-top: 0.25em;

    text-align: center;
    font-size: 0.75em;
    color: #666;

    a, span.date {
      color: #000;
      font-weight: 600;
    }
  }

  nav,
  main {
    opacity: 0;
    font-size: 0;

    transition: opacity 100ms ease-out, font-size 200ms ease-out 100ms;

    &.visible {
      opacity: 1;
      font-size: 1em;

      transition: opacity 100ms ease-out 200ms, font-size 200ms ease-out;
    }
  }

  main {
    margin-bottom: 1em;
  }

  nav {
    padding-bottom: 1em;
    border-bottom: 1px solid #666;
  }
</style>
