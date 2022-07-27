'use strict'

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    // Creating a project makes ESlint run from ~5sec to ~2min
    // project: './tsconfig.json',
    createDefaultProgram: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'google',
    'eslint:recommended',
  ],
  rules: {
    /* COMMON RULES (JS and TS) */

    // No logging / no debugging :-) Use our wrappers
    'no-console': 'warn',
    'no-debugger': 'warn',

    // Always have spaces around arrays and objects
    'array-bracket-spacing': [ 'error', 'always' ],
    'object-curly-spacing': [ 'error', 'always' ],

    // Always have newline character at the end of the file
    'eol-last': [ 'error', 'always' ],

    // Constraints for the max line length
    // 'max-len': [ 'error', { 'code': 120, 'comments': 80 } ],
    'max-len': [ 'off' ],

    // No more than 2 blank lines
    'no-multiple-empty-lines': [ 'error', { 'max': 2, 'maxBOF': 0, 'maxEOF': 1 } ],

    // Srings: either '...' or `... ${...} ...`, and no 'ab' + 'cd'
    'no-template-curly-in-string': [ 'error' ],
    'quotes': [ 'error', 'single', { 'allowTemplateLiterals': false } ],
    'no-useless-concat': [ 'error' ],

    // One variable per declaration, no "const x, y, ..."
    'one-var': [ 'error', 'never' ],

    // No semicolons
    'semi': [ 'error', 'never' ],

    // Remember our TODOs and FIXMEs
    'no-warning-comments': [ 'warn' ],

    // Allow TypeScript triple-slash comments
    'spaced-comment': [ 'error', 'always', { 'markers': [ '/ <reference' ] } ],

    // Restricted imports
    'no-restricted-imports': [ 'error', {
      'name': 'vue',
      'message': 'Please use "@vue/runtime-core',
    } ],

    /* OFF RULES */
    'camelcase': [ 'off' ], // do not require camelCase variables
    'guard-for-in': [ 'off' ], // allow unchecked for-in loops
    'no-dupe-class-members': [ 'off' ], // redefined below
    'no-invalid-this': [ 'off' ], // redefined below
    'no-redeclare': [ 'off' ], // redefined below
    'no-undef': [ 'off' ], // it'll mark global types as undefs
    'no-unused-vars': [ 'off' ], // redefined below
    'require-jsdoc': [ 'off' ], // nope!
    'valid-jsdoc': [ 'off' ], // nope as well!
  },
  overrides: [ {
    /* SPECIFIC TYPESCRIPT RULES */
    files: [ '*.ts', '*.vue' ],
    rules: {
      '@typescript-eslint/no-redeclare': [ 'error' ],
      '@typescript-eslint/no-unused-vars': [ 'error' ],
      '@typescript-eslint/no-dupe-class-members': [ 'error' ],
      '@typescript-eslint/no-invalid-this': [ 'error' ],

      '@typescript-eslint/camelcase': [ 'off' ], // do not require camelCase variables (TS)
      // This requires a project (see above) but the tradeoffs are too big!
      // '@typescript-eslint/no-floating-promises': [ 'error' ], // don't let promises hanging

      // explicit return types
      '@typescript-eslint/explicit-function-return-type': [ 'error', {
        'allowExpressions': true,
        'allowDirectConstAssertionInArrowFunctions': true,
        'allowConciseArrowFunctionExpressionsStartingWithVoid': true,
      } ],
    },
  }, {
    /* SPECIFIC JAVASCRIPT RULES */
    files: [ '*.js' ],
    rules: {
      'no-redeclare': [ 'error' ],
      'no-unused-vars': [ 'error' ],
      'no-dupe-class-members': [ 'error' ],
      'no-invalid-this': [ 'error' ],

      'strict': [ 'error', 'global' ],
    },
  }, {
    files: [ '*.vue' ],
    extends: [ 'plugin:vue/vue3-recommended' ],
    rules: {
      // We don't care about "multiple words" in components
      'vue/multi-word-component-names': [ 'off' ],
      // Either 3 attributes on a single line, or all attributes on newlines!
      'vue/max-attributes-per-line': [ 'warn', { 'singleline': 3 } ],
      // Indent body of "<script ... />" like we normally should
      'vue/script-indent': [ 'error', 2, { 'baseIndent': 1, 'switchCase': 1 } ],
      // No unused variables, ever
      'vue/no-unused-vars': 'error',

      // We use arguments in "emit" to define types (e.g. emits: { foo(x: string) => true })
      '@typescript-eslint/no-unused-vars': [ 'error', { 'args': 'none' } ],

      /* OFF RULES */
      'indent': [ 'off' ], // use vue/script-indent instead
    },
  } ],
}
