<template>
  <ul>
    <li v-for="(value, key) in tree" :key="key" :class="isFile(key) ? 'file' : 'tree'">
      <span class="pointer" @click="click(key)">
        <icon>
          <document-text24-regular v-if="isFile(key)" />
          <folder24-regular v-else-if="isOpen(key)" />
          <folder-add24-regular v-else />
        </icon>
        {{ key }}
        <span v-for="(result, i) of coverage(value)" :key="i" class="coverage-group">
          <span :class="[ 'coverage', result.clazz ]">{{ result.percentage }}</span>
          <span v-if="result.percentageIgnored" class="coverage coverage-warning">
            {{ result.percentageIgnored }}
          </span>
        </span>
      </span>

      <tree-component
        v-if="isTree(value)"
        :class="{ open: isOpen(key) }"
        :tree="value"
        :report="report"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { DocumentText24Regular, Folder24Regular, FolderAdd24Regular } from '@vicons/fluent'
import { Icon } from '@vicons/utils'
import { defineComponent } from 'vue'

import type { PropType } from 'vue'

export default defineComponent({
  name: 'TreeComponent',
  components: { Icon, FolderAdd24Regular, Folder24Regular, DocumentText24Regular },
  props: {
    report: {
      type: Object as PropType<CoverageReport>,
      required: true,
    },
    tree: {
      type: Object as PropType<CoverageTree>,
      required: true,
    },
  },
  data() {
    return { collapsed: {} as Record<string | number, boolean> }
  },
  methods: {
    coverage(value: CoverageTree | CoveredFile): { clazz: string, percentage: string, percentageIgnored?: string }[] {
      if (typeof value !== 'string') return []
      const result = this.report.results[value]
      if (! result) return []

      const coverage = result.nodeCoverage.coverage
      const clazz =
        coverage === null ? 'coverage-unavailable' :
        coverage < this.report.thresholds.minimumFileCoverage ? 'coverage-error' :
        coverage < this.report.thresholds.optimalFileCoverage ? 'coverage-warning' :
        'coverage-ok'
      const percentage = coverage == null ? 'N/A' : `${coverage}%`

      const percentageIgnored =
        result.nodeCoverage.ignoredNodes > 0 ?
          result.nodeCoverage.totalNodes ?
            `${Math.ceil(result.nodeCoverage.ignoredNodes / result.nodeCoverage.totalNodes * 100)}%` :
            undefined : // zero total nodes (infinity)
          undefined // zero ignored nodes

      return [ { percentage, percentageIgnored, clazz } ]
    },
    isFile(key: string | number): boolean {
      return typeof this.tree[key] === 'string'
    },
    isTree(value: CoverageTree | CoveredFile): value is CoverageTree {
      return typeof value !== 'string'
    },
    isOpen(key: string | number): boolean {
      return this.isFile(key) ? false : ! this.collapsed[key]
    },
    click(key: string | number): void {
      const value = this.tree[key]
      if (typeof value === 'string') {
        window.location.hash = value
      } else {
        this.collapsed[key] = !this.collapsed[key]
      }
    },
  },
})
</script>

<style scoped lang="pcss">
  ul {
    margin: 0;
    padding: 0 0 0 1.2em;

    li {
      position: relative;
      list-style-type: none;
      padding: 0;
      margin: 0;

      .xicon {
        color: #999;
        position: absolute;
        top: 0.2em;
        left: -1.2em;
      }
    }

    li.tree > ul {
      opacity: 0;
      font-size: 0;

      transition: opacity 100ms ease-out, font-size 200ms ease-out 100ms;
    }

    li.tree > ul.open {
      opacity: 1;
      font-size: 1em;

      transition: opacity 100ms ease-out 200ms, font-size 200ms ease-out;
    }
  }
</style>
