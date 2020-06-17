---
title: Using TailwindCSS with Angular
img: img/tailwind-angular.png
altImg: Angular + TailwindCSS
author: javi
type: post
date: 2020-05-29
tags:
    - angular
    - tailwindcss
---

In this article we are going to explain how to set up an Angular application with Angular CLI in order to integrate [TailwindCSS][1]. With this
approach the CSS written in our components will be very little because most of the time we will be using Tailwind classes.

## Angular CLI

Angular CLI is the recommended command line interface for generating Angular applications. It uses webpack under the hood, but we can´t
access directly to webpack settings so if we want to customize any behaviour we can use a package called [@angular-builders/custom-webpack][2].
This package will allow us extend webpack config.

## Setting up TailwindCSS

TailwindCSS works regardless of CSS preprocessor we use in our application (if we use one). To make the development experience as 
productive as possible, we will run PurgeCSS just when building for production. Let´s see step by step guide for adding Tailwind:

First of all we will install dependencies:

{{< highlight shell >}}
npm install tailwindcss --save
npm install --save-dev @angular-builders/custom-webpack @fullhuman/postcss-purgecss
{{< / highlight >}}

Generate an empty Tailwind config file:

{{< highlight shell >}}
npx tailwind init
{{< / highlight >}}

Create a new file, and give it the extension depending on the preprocessor you are using. In my case `scss`, so the file
will be `src/tailwind.scss` where we will insert Tailwind directives. We can also add custom styles using Tailwind directives 
in this file.

{{< highlight CSS >}}
@tailwind base;
@tailwind components;

/* Custom CSS */
a.tag {
    @apply bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700;
}
a.tag:hover {
    @apply underline;
}
/* Custom CSS end */

@tailwind utilities;
{{< / highlight >}}

Next step is creating `extra-webpack.config.js` file on folder root with this content:

{{< highlight JavaScript >}}
const purgecss = require('@fullhuman/postcss-purgecss')({
  // Specify the paths to all of the template files in your project
  content: ['./src/**/*.html', './src/**/*.component.ts'],
  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

module.exports = (config, options) => {
  console.log(`Using '${config.mode}' mode`);
  config.module.rules.push({
    test: /tailwind\.scss$/,
    use: [
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('tailwindcss')('./tailwind.config.js'),
            require('autoprefixer'),
            ...(config.mode === 'production' ? [purgecss] : [])
          ]
        }
      }
    ]
  });
  return config;
};
{{< / highlight >}}

## angular.json
Now we need to edit `angular.json` config file so that we can customize `ng serve` and `ng build` commands. We must search
`projects.architect.build.builder` key and replace `@angular-devkit/build-angular:browser` with
`@angular-builders/custom-webpack:browser`. It´s neccessary add a new object `customWebpackConfig` at `architect.build.options`
with key `path` and `extra-webpack.config.js` as its value.

We must do same changes in `projects.architect.serve.builder` replacing `@angular-devkit/build-angular:dev-server` with
`@angular-builders/custom-webpack:dev-server`.  It´s neccessary again adding a new object `customWebpackConfig` at `architect.serve.options`
with key `path` and `extra-webpack.config.js` as its value.

Finally we will add our `src/tailwind.scss` stylesheet to the array in `architect.build.options.styles`. Let´s see all the changes together:

{{< highlight JSON "hl_lines=3 5-7 10 17 19-21" >}}
"architect": {
  "build": {
    "builder": "@angular-builders/custom-webpack:browser",
    "options": {
      "customWebpackConfig": {           
        "path": "extra-webpack.config.js"
      },                                 
      // ...
      "styles": [
        "src/tailwind.scss",             
        "src/styles.css"
      ],
    // ...
    }
  },
  "serve": {
    "builder": "@angular-builders/custom-webpack:dev-server",
    "options": {
      "customWebpackConfig": {           
        "path": "extra-webpack.config.js"
      },                                 
    // ...
    }
  }
}
{{< / highlight >}}

Once these changes are applied we can init server in development mode with `ng serve` as usual. All the Tailwind classes will
be available. When compiling for production with `ng build --prod` we can check in `dist` folder that styles files is generated
with only classes that are used in our application.

{{< highlight plaintext >}}
chunk {4} styles.847663bf210845648553.css (styles) 5.51 kB [initial] [rendered]
{{< / highlight >}}

## PurgeCSS with Tailwind
From Tailwind 1.4.0 PurgeCSS is integrated into Tailwind config file. This way we can remove `@fullhuman/postcss-purgecss`
dependency in our project and leave `extra-webpack.config.js` with this content:

{{< highlight JavaScript >}}

module.exports = (config, options) => {
  console.log(`Using '${config.mode}' mode`);
  config.module.rules.push({
    test: /tailwind\.scss$/,
    use: [
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('tailwindcss')('./tailwind.config.js')
          ]
        }
      }
    ]
  });
  return config;
};
{{< / highlight >}}

We just move routes to `tailwind.config.js` file:

{{< highlight JavaScript >}}
module.exports = {
  purge: ['./src/**/*.html', './src/**/*.component.ts'],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
{{< / highlight >}}

We must compile with `NODE_ENV` variable set to `production` so that Tailwind automatically purges unused
styles. To achieve this with a multiplatform solution I like using `cross-env` package. We just install it:

{{< highlight shell >}}
npm install cross-env --save-dev
{{< / highlight >}}

After the installation we can create a script in `package.json` to launch the build:

{{< highlight JSON "hl_lines=10" >}}
{
  // ...
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "build:prod": "cross-env NODE_ENV=production ng build --prod"
  },
  // ...
}
{{< / highlight >}}

Now we run the script and check that everything is working as expected:

{{< highlight shell >}}
npm run build:prod
{{< / highlight >}}

{{< highlight plaintext >}}
chunk {4} styles.847663bf210845648553.css (styles) 5.51 kB [initial] [rendered]
{{< / highlight >}}

With these simple steps you are ready to go with Tailwind in your Angular projects.

[1]: https://tailwindcss.com/
[2]: https://www.npmjs.com/package/@angular-builders/custom-webpack
