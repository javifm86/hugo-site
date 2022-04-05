---
title: "Monorepo simple starter workflow"
date: 2022-04-05
author: javi
type: post
img: img/monorepo-react-nestjs.jpg
altImg: React and NestJS logos
toc: true
tags:
    - git
    - hook
    - react
    - nestJS
---

In my current job, I have had to configure a monorepo with git hooks, ESLint, Prettier and some custom actions. I want to register the process, for future reference. This is the use case:

- `backend` folder, with [NestJS][1] project. NestJS is a backend framework for Node, it uses Typescript.
- `frontend` folder, with **React + Typescript** project.
- Global **Prettier** config, shared between both projects.
- **ESLint** for linting, each project will have its own config.
- In addition to ESLint, **tsc** for type check.
- Git **pre-commit** hook: will run `eslint --fix` and `prettier --write` on files committed. If ESLint or tsc reports any error, **commit will be aborted**.
- Git **pre-push hook**: will run unit testing, if any file was changed on backend project, it will run just backend tests. Same for frontend, and if there are changes on both projects, it will run both. **Git push will be aborted if tests fail**.

Let's start explaining step by step.

## Bootstrapping backend folder with NestJS

As mentioned at the beginning, we will use NestJS for backend. First step will be installing Nest CLI to scaffold the project. Thereafter, we will create a new project:
```bash
npm i -g @nestjs/cli
nest new backend
```
As this will be backend part of the monorepo, we will remove the `.git` folder created inside backend folder.

## Bootstrapping frontend folder

Once backend is created, we will proceed creating frontend with React + Typescript using create-react-app:

```bash
npx create-react-app frontend --template typescript
```

## Install prettier

Both projects will use Prettier. We will install it inside frontend and backend folder.

```bash
cd backend
npm install --save-dev --save-exact prettier

cd ../frontend
npm install --save-dev --save-exact prettier
```

Now we can create a `.prettierrc` config file in the root folder (config will be shared with both projects). We can configure with our preferred rules, for example:

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "all",
  "singleQuote": true,
  "semi": true
}
```

And now we will create npm scripts for running prettier. In `frontend/package.json`:

```json
"scripts": {
  // ...
  "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,json,css,scss,md}'"
},
```

In `backend/package.json`:

```json
"scripts": {
  // ...
  "format": "prettier --write 'src/**/*.ts\' 'test/**/*.ts'",
},
```

## Configuring ESLint

Presently, we will configure ESLint for linting. We are using Prettier, so we will install a package that will turn off rules that are unnecessary or might conflict with Prettier. Thereafter, we will install a plugin for auto ordering imports, but let's see the basic configuration first.

We will go with frontend first:

```bash
cd frontend
npm i -D eslint eslint-config-prettier @typescript-eslint/parser
```

Besides, we will create a `.eslintrc.js` file inside frontend folder:

```js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-alert': 'warn',
  },
};
```

This is the most basic configuration for React with Typescript. Conflicts with Prettier are avoided, it's a great starting point for customizing or extending with any config you like.

As a bonus, in our project we introduced [eslint-plugin-import][3] plugin for sorting the imports following the same criteria. If you are not interested, you can skip this config. We must install these packages:

```bash
npm i -D eslint-import-resolver-typescript eslint-plugin-import 
```

And the final config (you can customize a dozen of rules):

```js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: ['import'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: 'react**',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: '*.scss',
            patternOptions: { matchBase: true },
            group: 'index',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        warnOnUnassignedImports: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
```

Now, when `eslint --fix` is executed, all the imports should be auto-formatted.

> **NOTE:** No named imports can be auto-ordered because, in this kind of imports, the order matters. These imports will be marked as error, but **must be reordered manually**.
>
> **Example**: import './App.scss';

Finally, we can remove from `package.json` the ESLint config that was created by create-react-app:

```json
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
```

Once ESLint is running in frontend, let's dig into the backend. NestJS comes with a default config, which is a great starting point. We will tweak it, and install [eslint-plugin-import][3].

```bash
cd backend
npm i -D eslint-import-resolver-typescript eslint-plugin-import 
```

And the final `.eslintrc.js` config file, with prettier plugin and imports config:

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '@nestjs**',
            group: 'builtin',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['@nestjs'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        warnOnUnassignedImports: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
```

## Git pre-commit hook
We want to perform some operations on files committed, such as **format with prettier and lint with `eslint --fix`**. To achieve this, we will use [Husky][6] to run this actions with git hooks.

### Installing husky

We must create a `package.json` file in the root folder, to install husky dependency. We will run:

```bash
npm init -y
```

Thereafter, we can fill the fields we want, and now, **we will install husky and create and run the `prepare` script**:

```bash
npm i -D husky
npm set-script prepare "husky install"
npm run prepare
```

`prepare` is a lifecycle script, and will be executed after we execute `npm install` in a repository. If we are using **Yarn**, maybe **husky** is not installed automatically after install. In that case, we should manually run:

```bash
npm run prepare
```

Finally, we can add `pre-commit` hook. We will run `npm run lint` on pre-commit (we will define this script in a while).

```bash
npx husky add .husky/pre-commit "npm run lint"
```

A file named `pre-commit` under `.husky` folder will appear with this content:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
```

> **NOTE:** If you run Git from an app like Sourcetree, and get an error about `command not found`, you must create a `~/.huskyrc` file to load the necessary before running hooks (described [here](https://typicode.github.io/husky/#/?id=command-not-found)). For example, for `nvm`:
>
> ```bash
> # ~/.huskyrc
> # This loads nvm.sh and sets the correct PATH before running hook
> export NVM_DIR="$HOME/.nvm"
> [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
> ```


### Adding npm scripts in root package.json

Once defined the hook, we must create `lint` script in the root `package.json`. This script will run 2 scripts, one for backend linting, and the other for frontend. These are the lines added:
```json
"scripts": {
  // ...
  "lint": "npm-run-all lint:backend lint:frontend",
  "lint:backend": "cd backend && npm run lint:staged",
  "lint:frontend": "cd frontend && npm run lint:staged",
},
```

We are using [npm-run-all][7] on lint script for executing the other 2 scripts, so we will install this dependency in root package.json:

```bash
npm i -D npm-run-all
```

The next step, is defining `lint:staged` script in `backend/package.json` and in `frontend/package.json` as well, but before that, we will install another dependency for linting.

### Installing tsc-files
[tsc-files][10] is a tiny tool to run `tsc` on specific files without ignoring `tsconfig.json`. This package was created [because passing specific files][11] like `tsc --noEmit file1.ts file2.ts` will cause TypeScript to simply ignore the `tsconfig.json`.

We install tsc-files, which will be needed in the following step:

```bash
cd backend
npm i -D tsc-files
cd ../frontend
npm i -D tsc-files
```

### lint-staged in backend and frontend
[lint-staged][8] is a package that allows us to run linters on staged git files. This way, we won't let bugs slip into our code base, and we will take the opportunity to format committed files.

We will install this development dependency in backend and frontend:

```bash
cd backend
npm i -D lint-staged
cd ../frontend
npm i -D lint-staged
```

Now, we will [define lint-staged config][9] for running our tasks. We can define config inside `package.json` or in a separate file. For both projects, we will run `eslint --fix`, `tsc` for type check and `prettier` for format.

Furthermore, we have to add a script called `lint:staged`, which is called from root `package.json`.

We will go with the first one, so:

`backend/package.json`

```json
"scripts": {
  // ...
  "lint:staged": "lint-staged",
  // ...
}
// ...
"lint-staged": {
  "src/**/*.+(ts)": [
    "eslint --fix",
    "tsc-files --noEmit"
  ],
  "src/**/*.{ts,json,md}": [
    "prettier --write"
  ]
}
```

`frontend/package.json`
```json
"scripts": {
  // ...
  "lint:staged": "lint-staged",
  // ...
}
// ...
"lint-staged": {
  "src/**/*.+(ts|tsx)": [
    "eslint --fix",
    "tsc-files --noEmit"
  ],
  "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
    "prettier --write"
  ],
  "*.js": "eslint --cache --fix"
}
```

### pre-commit summary
Once we have completed these steps, **we have finished the configuration for pre-commit hook**. This is the flow that will be triggered when we make a git commit:

1. `pre-commit` husky script will execute `npm run lint` defined in root `package.json`.
1. `lint` script will go to both **backend** and **frontend** folder, and will execute `npm run lint:staged`.
1. **lint-staged** will be called and will receive the list of files involved in the commit. If no file match, no action will be executed. If any error is found, commit will be aborted until solved.

## Git pre-push hook
With this hook, we want to make sure that we don't push any code that can break our unit testing. We will use husky for this purpose too, using the same strategy as pre-commit hook. Let's get right into it. In the root folder:

```bash
npx husky add .husky/pre-push "npm run pre-push"
```

A file named `pre-push` under `.husky` folder will appear with this content:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run pre-push
```

### Adding npm scripts in root package.json

Once defined the hook, we must create `pre-push` script in the root `package.json`. This script will run 2 scripts, , one for backend, and the other for frontend. These are the lines added:

```json
"scripts": {
  // ...
  "pre-push": "npm-run-all pre-push:backend pre-push:frontend",
  "pre-push:frontend": "cd frontend && npm run pre-push",
  "pre-push:backend": "cd backend && npm run pre-push",
},
```

The next step, is defining `pre-push` script in `backend/package.json` and in `frontend/package.json` as well.

### prepush-if-changed in backend and frontend
[prepush-if-changed][12] is a package similar to `lint-staged` but for git push. It is not as popular as lint-staged, but I tested it, and it works properly. **We want to launch unit testing and linting**, but only if any file related to backend or frontend is involved in files pushed.

For example, if we are pushing changes for frontend, only frontend tests and linting will be launched. Same for backend, and in case both projects have changes, both will be checked.

We will install this development dependency in backend and frontend:

```bash
cd backend
npm i -D prepush-if-changed
cd ../frontend
npm i -D prepush-if-changed
```

Now, we will [define prepush-if-changed config][13] for running our tasks. We can define config inside `package.json` or in a separate file.

Besides, we have to add a script called `pre-push` (and some other dependents for the task), which is called from root `package.json`. **If any test or linting process fails, git push will be aborted**.

We will go with the first one, so:

`backend/package.json`

```json
"scripts": {
  // ...
  "pre-push": "npm-run-all pre-push:test lint",
  "pre-push:test": "prepush-if-changed",
  "lint": "npm-run-all lint:eslint lint:tsc",
  "lint:eslint": "eslint 'src/**/*.ts'",
  "lint:tsc": "tsc -p tsconfig.json",
  "test": "npm run test:unit && npm run test:e2e",
  "test:unit": "jest --runInBand",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  // ...
}
// ...
  "prepush-if-changed": {
    "src/**/*.+(ts)": "echo 'Files changed on backend. Launching tests.' && npm run test"
  },
```

A brief explanation of the process:
- `pre-push` script will launch `pre-push:test` that runs `prepush-if-changed` with the shown config, and after that, `lint`.
- If `prepush-if-changed` config finds any match, will launch `test` script.
- `test` script will launch `test:unit` and `test:e2e`.
- Finally, `lint` script executes `lint:eslint` and `lint:tsc`.

`frontend/package.json`

```json
"scripts": {
  // ...
  "pre-push": "npm-run-all pre-push:test lint",
  "pre-push:test": "prepush-if-changed",
  "lint": "npm-run-all lint:eslint lint:tsc",
  "lint:eslint": "eslint 'src/**/*.{ts,tsx}'",
  "lint:tsc": "tsc -p tsconfig.json",
  "test": "react-scripts test",
  // ...
}
// ...
  "prepush-if-changed": {
    "src/**/*.+(ts|tsx)": "echo 'Files changed on frontend. Launching tests.' && npm run test -- --watchAll=false"
  },
```

Note for frontend:
- `pre-push` script will launch `pre-push:test` that runs `prepush-if-changed` with the shown config, and after that, `lint`.
- If `prepush-if-changed` config finds any match, will launch `npm run test -- --watchAll=false`.
- Finally, `lint` script executes `lint:eslint` and `lint:tsc`. 

Wow this was a huge post, very interesting for future reference. A lot of topics, I published [the final result in Github][14]. In my team we have been using this config for the last 3 months, and we are pleased with the result. Thanks for reading.

[1]: https://nestjs.com/
[2]: https://prettier.io/
[3]: https://github.com/import-js/eslint-plugin-import
[4]: https://eslint.org/
[5]: https://languagetool.org/
[6]: https://github.com/typicode/husky
[7]: https://github.com/mysticatea/npm-run-all
[8]: https://github.com/okonet/lint-staged
[9]: https://github.com/okonet/lint-staged#configuration
[10]: https://github.com/gustavopch/tsc-files
[11]: https://github.com/microsoft/TypeScript/issues/27379
[12]: https://github.com/dprovodnikov/prepush-if-changed
[13]: https://github.com/dprovodnikov/prepush-if-changed#configuration
[14]: https://github.com/javifm86/monorepo-starter-react-nest
