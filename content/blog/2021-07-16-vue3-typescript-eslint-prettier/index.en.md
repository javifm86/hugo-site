---
title: "Vue 3 with Typescript, ESLint and Prettier"
date: 2021-08-05
author: javi
type: post
img: img/vue-typescript-eslint-prettier.jpg
altImg: Vue, Typescript, ESLint, Prettier logos
tags:
    - vue
---
At the beginning of this year I started learning **Vue 3**, I had worked with version 2 before and the new version
allows us to still use the same syntax, besides we can use the new **Composition API**, which is more powerful and
customizable when creating reusable elements. In this post I will show how to create a new project with Vue 3 +
Typescript and setting up ESLint and Prettier for working properly together in Visual Studio Code.

## Vue CLI
The easiest and fastest way for creating a new project is using [Vue CLI][1]. It will allow us to set up the project
using different predefined workflows. First of all we will install Vue CLI:

```bash
yarn global add @vue/cli
# OR
npm install -g @vue/cli
```

Once installed we can create a new project:

```bash
vue create hello-world
```

We will select the last option from the list:
<pre>
Vue CLI v4.5.13
? Please pick a preset: (Use arrow keys)
  Default ([Vue 2] babel, eslint)
  Default (Vue 3) ([Vue 3] babel, eslint)
> Manually select features
</pre>

And we can customize our project with the options present in the list. I chose the next ones, I didn't select testing 
in order to focus on the topic:

<pre>
Vue CLI v4.5.13
? Please pick a preset: Manually select features
? Check the features needed for your project: 
 (*) Choose Vue version
 (*) Babel
 (*) TypeScript
 ( ) Progressive Web App (PWA) Support        
>(*) Router
 ( ) Vuex
 ( ) CSS Pre-processors
 (*) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing
</pre>

At the next step we will have to select more things, we choose version 3 and ESLint + Prettier at the end.

<pre>
Vue CLI v4.5.13
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, TS, Router, Linter
? Choose a version of Vue.js that you want to start the project with 3.x
? Use class-style component syntax? No
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a linter / formatter config: 
  ESLint with error prevention only 
  ESLint + Airbnb config
  ESLint + Standard config
> ESLint + Prettier
  TSLint (deprecated)
</pre>

After selection Vue CLI will start installing the dependencies. Once finished we can run `npm run serve` so that our
new application will launch in development mode.

## ESLint + Prettier
The Vue team has done a great job in order to avoid us headaches setting up ESLint and Prettier. If we open
`.eslintrc.js` file we will see these plugins installed:

```js {linenos=table,hl_lines=["6-12", "19-20"]}
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "arrow-parens": "off",
    "eol-last": "error",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
```

This way Prettier won't conflict with ESLint rules. At lines 19-20 there are custom rules added by me, we can add what
we want in order to customize it.

## VSCode
Last but not least, we will configure VSCode in order to have everything working properly. The most important thing
is having installed the [Vetur][2] extension, which gives us a great development experience with Vue in VSCode. It will
give us **auto formatting code in Single File Components** (files with `.vue` extension).

Once installed, we will go to Vetur settings and in `Format -> Default Formatter` section we will select the formatters
for HTML, CSS, JS, Sass, Typescript... It is very important to select **prettier-eslint** for JS, I have the default
option in the rest including Typescript, with just Prettier instead of **prettier-tslint** which is deprecated.

{{< img src="img/vetur.png" alt="Formatter settings in Vetur" >}}

In VSCode settings we must add Vetur as default formatter for Vue:

```js
"[vue]": {
  "editor.defaultFormatter": "octref.vetur"
}
```

This way VSCode delegates in Vetur, and Vetur will format each different language that finds inside `.vue` files with
a proper formatter. In my experience, there is only one thing wrong with auto format in `.vue` files,
**inserting the final new line at the end of the file**. If you use this rule (which is the default), the only way I
could find is delegating this task in VSCode with this setting:

```js
"files.insertFinalNewline": false
```

Sometimes using [the last version of Vetur can be problematic][3], recently in a project Vetur started formatting HTML
in a different way. After struggling for some hours I realized Vetur had been updated and after downgrading Vetur version
everything started working as expected. [I reported the bug][4] and took the opportunity to comment on the problem with 
the final new line. Maybe I made a mistake, but I couldn't find the problem after several hours.

After completing all the steps we are now ready to begin new projects with Vue 3 + Typescript + ESLint + Prettier
in VSCode.

[1]: https://cli.vuejs.org/guide/creating-a-project.html#vue-create
[2]: https://marketplace.visualstudio.com/items?itemName=octref.vetur
[3]: https://vuejs.github.io/vetur/guide/FAQ.html#install-an-old-version-of-vetur
[4]: https://github.com/vuejs/vetur/issues/3067
