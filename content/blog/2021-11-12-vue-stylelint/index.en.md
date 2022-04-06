---
title: "Integrate stylelint in Vue project"
date: 2021-11-12
author: javi
type: post
img: img/stylelint.png
altImg: Vue and Stylelint logos
tags:
    - css
    - vscode
    - vue
---

[Stylelint][1] is to CSS the equivalent to [ESLint](https://eslint.org/) to Javascript. Until today, I was using CSS validation integrated in VSCode, but if we want to go further preventing errors or getting a better style consistency, a linter to CSS is the best option.

## Dependencies
Let's see how we can configure Stylelint to get validations and turn off default warnings from VSCode.

First, we will need adding some dependencies to our project:
* `stylelint`: The linter.
* `stylelint-config-standard`: Base config. We can configure our own base from scratch or choosing another option as `stylelint-config-recommended`.
* `stylelint-config-recommended-vue`: Vue config with some rules, it adds support for some vue custom CSS selectors, for example `::v-slotted`. It automatically **adds an override for vue files using `postcss-html` as custom syntax**.
* `postcss-html`: Necessary to be able to lint `.vue` files.

Therefore, we install them:
```bash
npm install stylelint stylelint-config-standard stylelint-config-recommended-vue postcss-html --save-dev
```

## Stylelint in VSCode
The next step is installing [official Stylelint extension for VSCode](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint).

We will add the following settings in our VSCode workspace settings (or global) in order to **disable CSS built-in lint**. If we are using [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), we also need to disable style validation.

Moreover, since Stylelint version 14, **we must specify different styling languages to be linted**, in our case `vue`.

Additionally, I have `fixAll` to be executed on save.

```json
{
  "css.validate": false, // Disable built-in lint
  "less.validate": false, // Disable built-in lint
  "scss.validate": false, // Disable built-in lint
  "stylelint.enable": true, // Enable stylelint
  "stylelint.validate": ["css", "less", "postcss", "vue"], // Add vue files
  "vetur.validation.style": false, // Disable vetur style validation
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
}
```

## Stylelint config file
Last but not least, we must create Stylelint config file at our project root. `.stylelintrc`:

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recommended-vue"
   ],
  "rules": {

  }
}
```

If we don't add `stylelint-config-recommended-vue`, we will have to put the override to lint `vue` files:

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recommended-vue"
  ],
  "overrides": [
    {
      "files": [
        "**/*.vue"
      ],
      "customSyntax": "postcss-html"
    }
  ],
  "rules": {

  }
}
```

With all this configuration, our project is ready to use Stylelint for CSS linting.

## Adding own rules
We can specify our custom rules. For example, in a project where we are using Tailwind CSS, we avoid the following warning when using @apply: `Unknown at rule @applycss(unknownAtRules)`. This crucial if we are working with PostCSS plugins and want to avoid some warnings. Example for Tailwind CSS syntax:

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recommended-vue"
  ],
  "rules": {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen"
        ]
      }
    ],
    "block-no-empty": null,
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null
  }
}
```

Useful links:
* [Stylelint][1]
* [stylelint-config-recommended-vue](https://github.com/ota-meshi/stylelint-config-recommended-vue)
* [PostCSS HTML Syntax](https://github.com/ota-meshi/postcss-html)

Happy CSS linting!


[1]: https://stylelint.io/
