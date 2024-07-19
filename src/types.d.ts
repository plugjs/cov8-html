/* ========================================================================== *
 * COVERAGE REPORT FILE STRUCTURE                                             *
 * ========================================================================== */

/**
 * Differentiate between keys in the tree nad reference to covered files
 * in report results
 */
type CoveredFile = string & { __brand_covered_file: never }

/** Our coverage tree (one path component per level) */
interface CoverageTree {
  [ key: string ]: CoveredFile | CoverageTree
}

/** Node coverage summary */
interface NodeCoverageResult {
  /** Number of _covered_ nodes (good!) */
  coveredNodes: number,
  /** Number of nodes with _no coverage_ (bad!) */
  missingNodes: number,
  /** Number of nodes ignored by comments like `coverage ignore xxx` */
  ignoredNodes: number,
  /** Total number of nodes (sum of `covered`, `missing` and `ignored`) */
  totalNodes: number,
  /** Percentage of code coverage (covered as a % of total - ignored nodes)*/
  coverage: number | null,
}

/** Per-file coverage result */
interface CoverageResult {
  /** The actual code this coverage is for */
  code: string,
  /**
   * Per _character_ coverage report:
   * - `-2`: coverage skipped (comments, typescript declarations, ...)
   * - `-1`: coverage ignored (when using `coverage ignore xxx`)
   * - `0`: no coverage collected for this character
   * - _any number greater than zero_: number of times this was covered
   */
  codeCoverage: number[],
  /** Node coverage summary */
  nodeCoverage: NodeCoverageResult,
}

/** Coverage thresholds */
interface CoverageThresholds {
  /** Minimum overall coverage */
  minimumCoverage: number,
  /** Minimum per-file coverage */
  minimumFileCoverage: number,
  /** Optimal overall coverage */
  optimalCoverage: number,
  /** Optimal per-file coverage */
  optimalFileCoverage: number,
}

/** Aggregation of {@link CoverageResult} over all files */
type CoverageResults = Record<CoveredFile, CoverageResult>

/** Our coverage report, per file */
interface CoverageReport {
  /** Coverage results for all files */
  results: CoverageResults,
  /** Thresholds for warnings and errors */
  thresholds: CoverageThresholds,
  /** Overall per-node coverage stats */
  nodes: NodeCoverageResult,
  /** Tree of all coverage results (one path component per level) */
  tree: CoverageTree,
  /** Date (in ISO format) when the report was created */
  date: string,
}

/** Callback function for our JSONP-formatted report */
declare function __initCoverage__(data: CoverageReport): void

/* ========================================================================== *
 * VUE JS FILE TYPE DECLARATION                                               *
 * ========================================================================== */

declare module '*.vue' {
  import type { DefineComponent } from '@vue/runtime-core'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/* ========================================================================== *
 * MINIMALISTIC PRISM TYPES                                                   *
 * ========================================================================== */

declare namespace Prism {
  export function highlightElement(element: Element, async?: boolean, callback?: (element: Element) => void): void
}
