## mzkmnk-lab/eslint-custom-rules

This repository provides custom ESLint rules.

### Installation

```bash
npm i @mzkmnk-lab/eslint-custom-rules
```

### `effect-dependency-check`

#### Overview

A rule that forces explicit declaration of dependencies in Angular’s effect.
By enabling this rule, you can clearly see the dependencies, thus improving code readability.

#### Configuration

```javascript
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

// add
import mzkmnkLabRules from '@mzkmnk-lab/eslint-custom-rules';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // add
  {
    files: ["**/*.ts"],
    plugins: {
      mzkmnkLabRules
    },
    rules: {
      "mzkmnkLabRules/effect-dependency-check": "error"
    }
  }
];

```

#### Example

```typescript
export class AppComponent {
  title = 'mzkmnk-lab-eslint-custom-rules';

  num = signal<number>(0);

  constructor() {
    effect(() => { // error
      console.log(this.num());
    });

    effect(() => { // error
      console.log(this.num());
    });

    effect(() => ((num) => { // ok
      console.log(num)
    })(this.num()))
  }
}
```