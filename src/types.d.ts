type CoveredFile = string & { __brand_covered_file: never }


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
  coverage: number,
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
  minimumCoverage: number,
  minimumFileCoverage: number,
  optimalCoverage: number,
  optimalFileCoverage: number,
}


/** Aggregation of {@link CoverageResult} over all files */
type CoverageResults = Record<CoveredFile, CoverageResult>

/** Our coverage report, per file */
interface CoverageReport {
  results: CoverageResults,
  thresholds: CoverageThresholds,
  nodes: NodeCoverageResult,
  tree: CoverageTree,
  date: string,
}


declare module '*.vue' {
  import { DefineComponent } from '@vue/runtime-core'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare function __initCoverage__(data: CoverageReport): void

declare namespace Prism {
  export function highlightElement(element: Element, async?: boolean, callback?: (element: Element) => void): void;
}
