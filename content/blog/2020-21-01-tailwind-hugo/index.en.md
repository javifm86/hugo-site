---
title: Using Tailwind CSS with Hugo
img: img/hugo-tailwindcss.png
altImg: Hugo + TailwindCSS
author: javi
type: post
date: 2020-01-21T13:08:01+01:00
tags:
    - hugo
    - tailwindcss
---

In this article we are going to see how can we build our Hugo site with [TailwindCSS][1]. Hugo is very flexible and
allows us setting up our site easily as we want. In this web, y have a `baseof.html` file as template for the site. Inside
this file I have a partial (an include in Hugo) file, `head.html`.

{{< highlight go-html-template >}}

<!doctype html>
<html lang="es">
<head>
    {{ partial "head.html" . }}
</head>
<body></body>
</html>
{{< / highlight >}}

We import `styles.css` file from css folder and call `absURL` Hugo function, so it will return us the absolute path file.

{{< highlight go-html-template >}}
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
{{ $css := "css/styles.css" | absURL }}
<link rel="stylesheet" href="{{ $css }}">
{{< / highlight >}}

Static files in Hugo are saved by default in `static` folder so that is the first step, having `styles.css` in
`/static/css/`. This files is going to be generated

Los archivos estáticos en Hugo se guardan por defecto en la carpeta `static`, así que ya tenemos el primer paso, tener un
fichero `styles.css` en la ruta `/static/css/`. As this file is going to be generated, what I have done has been to create a
folder called `static-src` where to have sources of my static files that I will subsequently process.

Before continuing, we will install the dependencies that we will need with npm.

{{< highlight shell >}}
npm install tailwindcss --save
npm install postcss postcss-cli @fullhuman/postcss-purgecss autoprefixer watch cross-env cssnano --save-dev
{{< / highlight >}}

Let´s see what are these dependencies:

-   **tailwindcss**: CSS framework.
-   **postcss postcss-cli**: Tailwind uses PostCSS to get compiled and also we will add some plugins to CSS process.
-   **@fullhuman/postcss-purgecss**: Tailwind generates thousands of utility classes, most of which we probably don´t
use. We will use this plugin for removing CSS that we are not actually using in our project. 
-   **autoprefixer**: Optional, prefix for our stylesheets.
-   **watch**: Node package which allows us running tasks when any file is modified. It includes a cli that we will use
on npm script.
-   **cross-env**: Package that allow us setting and using environment variables across platforms. `NODE_ENV` in our case.
-   **cssnano**: CSS minifier.

With all these dependencies we are ready to generate a CSS file with just the utility classes used and not the whole
framework. Let´s generate an empty Tailwind config file so that [we can customize default settings][2] in the framework. We
just run:

{{< highlight shell >}}
npx tailwind init
{{< / highlight >}}

A `tailwind.config.js` file will be generated:

{{< highlight JavaScript >}}
module.exports = {
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
}
{{< / highlight >}}

Finally we can create our `/static-src/styles.css` file invoking Tailwind directives. Besides, we can add custom styles
we want, using Tailwind or not.

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

Tailwind is comiled using PostCSS, so adding new plugins is very easy. We are going to add `autoprefixer` in order to
auto generate prefixes for CSS properties that need them. Besides when compiling for production, we will use `purgecss`
and `cssnano` for reducing the file size for our stylesheet. Let´s see PostCSS config file (`postcss.config.js` in the
root folder):

{{< highlight JavaScript >}}
const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['../../content/**/*.md', './layouts/**/*.html'],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        ...(process.env.NODE_ENV === 'production' ? [purgecss, require('cssnano')] : [])
    ]
};
{{< / highlight >}}

When using purgecss, we will search for files with `.md` extension inside `content` folder and `.html` in `layouts`. If
you are working with javascript files or any other paths where you add CSS classes, you will have to adjust the array of
paths to suit your needs. In this snippet of code we are considering that we are working with a theme inside
`/themes/themename/` folder. If we are working directly in `layouts` folder (as I do in this blog), we should adjust the
paths:

{{< highlight JavaScript >}}
const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./content/**/*.md', './layouts/**/*.html', './static/**/*.js'],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});
{{< / highlight >}}

With all this we can generate our npm scripts in `package.json` file:

{{< highlight JSON >}}
{
  "name": "hugo-tailwindcss",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "css:watch": "node_modules/.bin/watch \"npm run css:build:dev\" ./static-src/css",
    "css:build:dev": "cross-env NODE_ENV=development npm run css:build",
    "css:build:prod": "cross-env NODE_ENV=production npm run css:build",
    "css:build": "node_modules/.bin/postcss static-src/css/styles.css -o static/css/styles.css"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "tailwindcss": "^1.1.4"
  },
  "devDependencies": {
    "@fullhuman/postcss-purgecss": "^2.0.5",
    "autoprefixer": "^9.7.4",
    "cross-env": "^6.0.3",
    "cssnano": "^4.1.10",
    "postcss": "^7.0.26",
    "postcss-cli": "^7.1.0",
    "watch": "^1.0.2"
  }
}

{{< / highlight >}}
There are 3 tasks:
- **css:build:dev**: Compile CSS in development mode, for greater agility we will have all Tailwind utilities by default
without need to minimize and purge classes.
- **css:build:prod**: Compile, purge and minify CSS file in order to get optimized stylesheet for production.
- **css:watch**: Watch `./static-src/css` folder. If it detects any change, it compiles CSS file again. It avoids tediously
launching manually `css:build:dev` task on each change we do in our CSS.

With these tasks we can finally generate our stylesheet. I have created a [Github repository][3] with a theme which 
incorporates these scripts as a starting point to create your own theme for Hugo. You can try it out with some [example
content][4] that I have created in other repository.

**NOTE**: It is possible to integrate the whole process thanks to Hugo [pipe postCSS][5]. You need to install globally
`postcss-cli` in addition to any other plugins you use. I personally prefer not having global packages installed and
being able to customize the process, but it´s an option that Hugo gives us.

 [1]: https://tailwindcss.com/docs/configuration/#app
 [2]: https://tailwindcss.com/
 [3]: https://github.com/javifm86/hugo-tailwindcss-starter
 [4]: https://github.com/javifm86/hugo-tailwindcss
 [5]: https://gohugo.io/hugo-pipes/postcss/
