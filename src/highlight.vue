<template>
  <div class="highlights">
    <div class="highlights-groups">
      <span class="highlights-group">
        <input id="covered" v-model="highlightCovered" type="checkbox">
        <label for="covered">covered</label>
      </span>

      <span class="highlights-group">
        <input id="missing" v-model="highlightMissing" type="checkbox">
        <label for="missing">missing</label>
      </span>

      <span class="highlights-group">
        <input id="ignored" v-model="highlightIgnored" type="checkbox">
        <label for="ignored">ignored</label>
      </span>

      <span class="highlights-group">
        <input id="skipped" v-model="highlightSkipped" type="checkbox">
        <label for="skipped">skipped</label>
      </span>
    </div>
  </div>

  <pre
    class="language-typescript line-numbers"
    :class="{
      'highlight-covered': highlightCovered,
      'highlight-missing': highlightMissing,
      'highlight-ignored': highlightIgnored,
      'highlight-skipped': highlightSkipped,
    }"
  ><code ref="code" /></pre>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'

  export default defineComponent({
    name: 'Highlight',
    props: {
      result: {
        type: Object as PropType<CoverageResult>,
        default: undefined,
        required: false,
      },
    },
    data: () => ({
      highlightCovered: false,
      highlightMissing: true,
      highlightIgnored: true,
      highlightSkipped: false,
    }),
    watch: {
      highlightCovered() {
        this.savePreferences()
      },
      highlightMissing() {
        this.savePreferences()
      },
      highlightIgnored() {
        this.savePreferences()
      },
      highlightSkipped() {
        this.savePreferences()
      },

      result(result: CoverageResult | undefined): void {
        /* Wipe the element's children */
        const element = this.$refs['code'] as Element
        while (element.firstChild) element.lastChild?.remove()

        /* Check whether have some coverage result */
        if (! result) return

        /* Calculate all our spans */
        const { code, codeCoverage } = result
        const spans: Element[] = []
        let coverage = codeCoverage[0] // > 1 ? 1 : codeCoverage[0]
        let start = 0

        for (let end = 1; end < codeCoverage.length; end ++) {
          const currentCoverage = codeCoverage[end] // > 1 ? 1 : codeCoverage[end]
          if (currentCoverage == coverage) continue

          const clazz =
            coverage <= -2 ? 'coverage-skipped' :
            coverage == -1 ? 'coverage-ignored' :
            coverage == 0 ? 'coverage-missing' :
            'coverage-covered'

          const span = document.createElement('span')
          const text = document.createTextNode(code.substring(start, end))

          span.setAttribute('class', clazz)
          span.appendChild(text)
          spans.push(span)

          coverage = currentCoverage
          start = end
        }

        /* Append the spans and highlight */
        element.append(...spans)

        Prism.highlightElement(element)
      },
    },

    mounted() {
      try {
        const preferences = localStorage.getItem('__coverageHighlights__')
        const highlights = JSON.parse(preferences || '{}')
        if (highlights.covered !== undefined) this.highlightCovered = !!highlights.covered
        if (highlights.missing !== undefined) this.highlightMissing = !!highlights.missing
        if (highlights.ignored !== undefined) this.highlightIgnored = !!highlights.ignored
        if (highlights.skipped !== undefined) this.highlightSkipped = !!highlights.skipped
      } catch (error) {
        // swallow
      }
    },

    methods: {
      savePreferences() {
        try {
          localStorage.setItem('__coverageHighlights__', JSON.stringify({
            covered: this.highlightCovered,
            missing: this.highlightMissing,
            ignored: this.highlightIgnored,
            skipped: this.highlightSkipped,
          }))
        } catch (error) {
          // swallow
        }
      },
    },
  })
</script>

<style scoped lang="pcss">
  pre {
    border-radius: 5px 0 5px 5px;
  }

  div.highlights {
    display: flex;

    div.highlights-groups {
      margin-left: auto;
      border-top: 1px solid #666;
      border-left: 1px solid #666;
      border-right: 1px solid #666;
      border-radius: 5px 5px 0 0;

      padding: 0.125em;

      .highlights-group {
        font-size: 0.75em;
        padding: 0 0.5em;

        &:nth-child(n+2) {
          border-left: 1px solid #666;
          margin-left: 0.25em;
        }
      }

      checkbox {
        scale: 0.75;
      }
      label {
        position: relative;
        top: -0.1em;
        padding-left: 0.5em;
      }
    }
  }
</style>
