---
title: "Setting up StandardJS"
date: 2021-08-10
author: javi
type: post
img: img/standardjs-vscode.png
altImg: Vue, Typescript, ESLint and, Prettier logos
tags:
    - javascript
---
In this post, we will cover the setup of [StandardJS][1] in VSCode to fix all the errors when saving a file automatically.


## What is StandardJS?

Initially, you could think that StandardJS is the standard used for Javascript code, and, that is its main goal: provide
a **style guide, linter and, formatter for Javascript**. Really, it's not, we know about the different opinions about
all concerning to Javascript ecosystem. The idea behind StandardJS is good, you install it, and you don't worry about
defining rules anymore. I had heard about it, but I had never given it a try (personally, I am used to Prettier as
formatter). Here are some of the advantages:

- Avoid setting up rules for style decisions.
- Code auto formatting running `standard --fix`.
- Error and incorrect style detection  in code.

StandardJS uses a fixed set of rules defined with [ESLint][2].


## Setting up StandardJS

The first is step is installing the package. You can do it globally or locally in a project. I always try using the last
one in order to have under control all the dependencies.

{{< highlight shell >}}
npm install standard --save-dev
{{< / highlight >}}

You can fix at any moment all the problems founds automatically (some errors can't be auto-fixed, you must fix it on
your own) with:

{{< highlight shell >}}
standard --fix
{{< / highlight >}}

You can create a npm script to run the command, but in my opinion integrating into the editor is much better.

## Autoformat in VSCode

I have used StandardJS for the first time in a job mate project, and at the beginning it was driving me crazy. I had
**Prettier** as default formatter and when I was saving a file I had different kind of formats because Prettier was
violating StandardJS rules.

Is asked my teammate how did he format the code when saving a file, and he answered me that he didn't do it. Simply
when he saw an error in a file he clicked the bubble  and selected **Fix all**. I hate this kind of repetitive tasks,
so I investigated the solution in VSCode which I proceed to describe in the next lines.

First, we have to install [StandardJS extension for VSCode][3]. As StandardJs is using ESLint under the hood, we
will also install [ESLint extension][4].

If you use Prettier as default formatter for Javascript as I do, you should disable it on the workspace of your project.
At workspace level we will use the following setting which appears in the extension documentation. This way we are
enabling auto-fix, but it's necessary adding the highlighted lines to make work everything properly.

{{< highlight JSON "linenos=table,hl_lines=12-14" >}}
{
  "standard.enable": true,
  "standard.run": "onSave",
  "standard.autoFixOnSave": true,
  "standard.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "javascript.validate.enable": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": null
  }
}
{{< / highlight >}}

Let's check that everything is working as expected. We just have to open a Javascript file and save it. File must be
auto-formatted and all the error should disappear.

As conclusion, I prefer Prettier for formatting because I can use the same tool as well for HTML and CSS. I can define and apply rules
directly with ESLint, but StandardJS is a superb tool that can avoid long discussions about opinionated things.

[1]: https://standardjs.com/
[2]: https://eslint.org/
[3]: https://marketplace.visualstudio.com/items?itemName=standard.vscode-standard
[4]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
