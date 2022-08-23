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

      <span class="highlights-group">
        &#x2630;
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

        const last = code.substring(start, codeCoverage.length)
        if (last) {
          const clazz =
            coverage <= -2 ? 'coverage-skipped' :
            coverage == -1 ? 'coverage-ignored' :
            coverage == 0 ? 'coverage-missing' :
            'coverage-covered'
          const span = document.createElement('span')
          const text = document.createTextNode(last)

          span.setAttribute('class', clazz)
          span.appendChild(text)
          spans.push(span)
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
        // eslint-disable-next-line no-console
        console.log('Error mounting highlight', error)
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
          // eslint-disable-next-line no-console
          console.log('Error saving preferences', error)
        }
      },
    },
  })
</script>

<style scoped lang="pcss">
  /* Checkboxes for higlighting the coverage result */
  div.highlights {
    display: flex;

    margin-top: 1em;
    margin-bottom: -33px;
    margin-right: 1px;
    height: 32px;

    /* Keep the highlights sticky on top */
    position: sticky;
    z-index: 999;
    top: 0;

    /* Wrap the check boxes with a nice (rounded) border */
    div.highlights-groups {
      margin-left: auto;
      border-left: 1px solid #999;
      border-bottom: 1px solid #999;
      border-radius: 0px 5px 0px 5px;
      background-color: #fff;
      padding: 0.125em;

      /* Each highlight group is invisible (apart from the last one) */
      .highlights-group {
        display: none;
        user-select: none;
        font-size: 0.65em;
        padding: 0 0.5em;

        border-right: 1px solid #999;
        margin-right: 0.25em;

        &:last-child {
          border-right: none;
          display: inline-block;
          position: relative;
          top: -0.2em;
          margin-right: 0em;
        }
      }

      /* Show highlights groups when hovering */
      &:hover .highlights-group {
        display: inline-block;
      }


      /* Nicer checkboxes (doubling as legends with colors) */
      input[type="checkbox"] {
        visibility: hidden;
        position: relative;

        &:before {
          content: '\00A0';
          visibility: visible;
          border: 1px solid #666;
          border-radius: 3px;
          width: 0.75em;
          height: 0.75em;
          position: absolute;
          background-color: transparent;
        }

        /* Show higlight colors as the "check" of the checkbox */
        &#covered:checked:before { background-color: #9f9; }
        &#missing:checked:before { background-color: #f99; }
        &#ignored:checked:before { background-color: #ee0; }
        &#skipped:checked:before { background-color: #ccc; }
      }

      /* Labels for check boxes */
      label {
        position: relative;
        padding-left: 0.25em;
        top: -0.2em;
      }
    }
  }

  /* Basic modifications to PrismJS default theme */
  pre[class*=language-],
  code[class*=language-] {
    font-family: 'Source Code Pro',monospace;
    font-size: 18px;
    background-color: transparent;
    line-height: normal;
    text-shadow: none;
  }

  /* Styling of our code highlight box */
  pre[class*=language-] {
    border-radius: 5px;
    border: 1px solid #999;
    padding: 0.5em 0;
    margin: 0;

    & :deep(.line-numbers-rows) {
      background-color: rgba(0, 0, 0, 0.125);
      border-right: 1px solid #999;
      padding: 0.5em 0;
      top: -0.5em;
    }

    & :deep(.token) {
      background-color: transparent;
    }

    /* Only higlight the code when the checkbox is selected */
    &.highlight-covered :deep(.coverage-covered) { background-color: rgba(153, 255, 153, 0.25); }
    &.highlight-missing :deep(.coverage-missing) { background-color: rgba(255, 153, 153, 0.25) }
    &.highlight-ignored :deep(.coverage-ignored) { background-color: rgba(238, 238, 0, 0.25); }
    &.highlight-skipped :deep(.coverage-skipped) { background-color: rgba(204, 204, 204, 0.25); }
  }
</style>
