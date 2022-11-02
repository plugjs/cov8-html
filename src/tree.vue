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
        <span v-for="(result, i) of coverage(value)" :key="i" :class="[ 'coverage', result.clazz ]">
          {{ result.percentage }}
        </span>
      </span>

      <tree
        v-if="isTree(value)"
        :class="{ open: isOpen(key) }"
        :tree="value"
        :report="report"
      />
    </li>
  </ul>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import { FolderAdd24Regular, Folder24Regular, DocumentText24Regular } from '@vicons/fluent'
  import { Icon } from '@vicons/utils'

  export default defineComponent({
    name: 'Tree',
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
      coverage(value: CoverageTree | CoveredFile): { clazz: string, percentage: string }[] {
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

        return [ { percentage, clazz } ]
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
