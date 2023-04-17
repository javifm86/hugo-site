---
title: "Literals management in react with react-intl"
date: 2023-03-24
author: javi
type: post
img: img/react-intl.png
altImg: React and FormatJS logos
toc: true
tags:
    - react
---

In this post, we are going to dive into an approach for literals management in a React project using [react-intl][1].

## Setting up a new project with create-react-app

Let's initialize a new react project with [CRA][2], one of the easiest ways without having to deal with webpack configuration.

```bash
npx create-react-app react-intl-example --template typescript
cd react-intl-example
npm start
```

## Installing `react-intl`

The next step is installing `react-intl` as a dependency:

```bash
npm i react-intl
```

We will also need one dev dependency for extracting and compiling the literals:

```bash
npm i -D @formatjs/cli
```

## Using `react-intl` in a React app

Let's start using `react-intl` in our dummy React app.

Create a folder `lang` at `src` with an empty JSON file called `en.json`. This file will contain later the result of the compilation for every literal in the app. We will explain later in detail how to achieve this.
```json
{}
```

Edit `index.tsx` in the `src` folder. We have to import `IntlProvider` from `react-intl` and wrap our app with it. We are creating some components for default rich elements that will be used globally in the literals in the app.

```tsx {linenos=table,hl_lines=["6-7", "9-19", "24-37"]}
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { IntlProvider } from "react-intl";
import literals from "./lang/en.json";

interface Props {
  children?: React.ReactNode;
}

const Bold = (props: Props) => {
  return (
    <div>
      <strong>{props.children}</strong>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <IntlProvider
    locale="en"
    defaultLocale="en"
    messages={literals}
    defaultRichTextElements={{
      bold: (chunks) => <Bold>{chunks}</Bold>,
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </IntlProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

The next step is creating a new folder with a file `example.ts` where we will define some literals. For example, one using the global rich element defined early (used like an HTML tag, `<bold></bold>` in this example), and one simple regular literal. We will do that using the `defineMessages` function from `react-intl`.

```ts
import { defineMessages } from "react-intl";

export default defineMessages({
  hello: {
    id: "a.hello",
    defaultMessage: "<bold>hello</bold>",
  },
  world: {
    id: "a.world",
    defaultMessage: "world",
  },
});
```

We can create another literals file called `other.ts` inside `messages` folder. This is just an example, you can create as many literals files as you want and put it wherever you want, that decision is up to you and is opinionated.

```ts
import { defineMessages } from "react-intl";

export default defineMessages({
  other: {
    id: "a.richtext",
    defaultMessage: "I have <test>{num}</test>",
  },
});
```

Now we can start importing our literals into the app, for simplicity, I will show it editing directly `App.tx` file on this way:

```tsx
import React from "react";
import { FormattedMessage } from "react-intl";
import exampleMessages from "./messages/example";
import otherMessages from "./messages/other";

function App() {
  return (
    <div className="App">
      <FormattedMessage {...exampleMessages.hello} />{" "}
      <FormattedMessage {...exampleMessages.world} />
      <FormattedMessage
        id={otherMessages.other.id}
        defaultMessage={otherMessages.other.defaultMessage}
        values={{ num: 99, test: (chunks: any) => <strong>{chunks}!!</strong> }}
      />
    </div>
  );
}

export default App;
```

In this example, we are loading our literals from two different files and using the `FormattedMessage` component from `react-intl` library. You can check in [the official documentation different ways of declaring messages][3].

Therefore, whenever you want to use a literal in your app, you can define it in a separate file and import it to use it. If no literal is found at the compiled file `lang/en.json`, the value provided in `defaultMessage` will be used. This is very useful because it is not necessary to compile literals each time you need a new literal while developing.

## Extracting and compiling literals with `formatJS`

We will create some scripts in the `package.json` to automatize the process for extracting and compiling literals. You can take a look at [the official documentation for further details][4]. We will use a very long command from the documentation and split it into some scripts for better readability. Let's see the scripts and thereafter the explanation for the commands executed:

```json
// ---- scripts section from package.json
"scripts": {
    "literals:extract": "formatjs extract 'src/**/*.ts*' --ignore='**/*.d.ts' --out-file temp.json --flatten --id-interpolation-pattern '[sha512:contenthash:base64:6]'",
    "literals:compile": "formatjs compile 'temp.json'",
    "postliterals:compile": "rm temp.json",
}
// ----
```

The first command will extract each of the literals defined in the app under `src` folder to a temp file called `temp.json`.

```bash
formatjs extract 'src/**/*.ts*' --ignore='**/*.d.ts' --out-file temp.json --flatten --id-interpolation-pattern '[sha512:contenthash:base64:6]'
```

> **Cautions:** The command includes an option for generating ids, but with `create-react-app` config, this feature will not work because it is necessary to edit webpack and babel configuration.

Once extracted to a file, we will compile it, specifying the destination file (notice the extra params used in the command, they are not present in the previous script, we will add more scripts at the end):

```bash
formatjs compile 'temp.json' --out-file src/lang/en.json
```

With this command, the file generated (`src/lang/en.json`) will be this one:

```json
{
  "a.hello": "<bold>hello</bold>",
  "a.richtext": "I have <test>{num}</test>",
  "a.world": "world"
}
```

> If we wanted to translate our literals to another language, this should be the source file used as starting point, and translating every literal. Then we should add a new file, for example `es.json` and add logic in the `index.tsx` to load `en.json` or `es.json` file depending on the language selected in the app.

If we start our application with this file, everything will be working as expected, but in the DevTools you can see this warning:

`[@formatjs/intl] "defaultRichTextElements" was specified but "message" was not pre-compiled. 
Please consider using "@formatjs/cli" to pre-compile your messages for performance.
For more details see https://formatjs.io/docs/getting-started/message-distribution`.

This is because we are using the option `defaultRichTextElements` globally for literals, and each time a literal is loaded, the library doesn't know whether the literal is using that `defaultRichTextElements` or not. For that reason, we should compile using the `ast` flag option:

```bash
formatjs compile 'temp.json' --ast --out-file src/lang/en.json
```

After this, the result file will be different:
```json
{
  "a.hello": [
    {
      "children": [
        {
          "type": 0,
          "value": "hello"
        }
      ],
      "type": 8,
      "value": "bold"
    }
  ],
  "a.richtext": [
    {
      "type": 0,
      "value": "I have "
    },
    {
      "children": [
        {
          "type": 1,
          "value": "num"
        }
      ],
      "type": 8,
      "value": "test"
    }
  ],
  "a.world": [
    {
      "type": 0,
      "value": "world"
    }
  ]
}
```

And if we start the app with this file, the warning will be gone. Finally, we can add more scripts with the flags necessaries for each case. Final excerpt from scripts:

```json
// ---- scripts section from package.json
"scripts": {
    "literals:extract": "formatjs extract 'src/**/*.ts*' --ignore='**/*.d.ts' --out-file temp.json --flatten --id-interpolation-pattern '[sha512:contenthash:base64:6]'",
    "literals:compile": "formatjs compile 'temp.json'",
    "postliterals:compile": "rm temp.json",
    "literals:en": "npm run literals:compile -- --out-file src/lang/en.json",
    "literals:en:ast": "npm run literals:compile -- --ast --out-file src/lang/en.json",
    "literals:extract:compile": "npm-run-all literals:extract literals:en",
    "literals:extract:compile:ast": "npm-run-all literals:extract literals:en:ast"
}
// ----
```

> The last 2 scripts are using `npm-run-all` as dev dependency, you can install it using: `npm i -D npm-run-all`.

For generating the literals in the app, we can execute `literals:extract:compile` for generating a file ready to be translated or `literals:extract:compile:ast` for a production-ready file.

You can check a repository with this simple example app [in my Github account][5].

[1]: https://formatjs.io/docs/react-intl/
[2]: https://create-react-app.dev/
[3]: https://formatjs.io/docs/getting-started/message-declaration
[4]: https://formatjs.io/docs/getting-started/message-extraction
[5]: https://github.com/javifm86/react-intl-example
