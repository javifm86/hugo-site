---
title: "Vue 3 con Typescript, ESLint y Prettier"
date: 2021-08-05
author: javi
type: post
img: img/vue-typescript-eslint-prettier.jpg
altImg: Logotipos de Vue, Typescript, ESLint, Prettier
tags:
    - vue
---
A principios de este año comencé a aprender **Vue 3**, ya había trabajado con la versión 2 y la verdad es que esta nueva versión
te permite seguir utilizando la misma sintaxis, además de incorporar la nueva **Composition API**, mucho más potente y personalizable
a la hora de crear elementos reutilizables. En este artículo voy a escribir sobre cómo crear un nuevo proyecto con Vue 3 + Typescript,
y configurar ESLint y Prettier para que funcionen correctamente en Visual Studio Code.

## Vue CLI
Para crear un nuevo proyecto la opción más rápida y sencilla es utilizar [Vue CLI][1]. Nos permitirá configurar nuestro proyecto
con diferentes workflows predefinidos. El primer paso es instalar Vue CLI:

{{< highlight shell >}}
yarn global add @vue/cli
# OR
npm install -g @vue/cli
{{< / highlight >}}

Y una vez instalado ya podemos crear un nuevo proyecto:

{{< highlight shell >}}
vue create hello-world
{{< / highlight >}}

Nos saldrá un listado de opciones donde seleccionaremos la última opción:
<pre>
Vue CLI v4.5.13
? Please pick a preset: (Use arrow keys)
  Default ([Vue 2] babel, eslint)
  Default (Vue 3) ([Vue 3] babel, eslint)
> Manually select features
</pre>

Y podremos configurar nuestro proyecto con las opciones que aparecen. Yo elegí estas, no marco testing para no desviarme
del tema:

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

A continuación nos irá preguntando más cosas, elegimos versión 3 y al final ESLint + Prettier.

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

Después de responder a todo lo que nos pregunta comenzará a instalar las dependencias. Una vez finalizado, podremos ejecutar
`npm run serve` para que se lance en modo desarrollo nuestra nueva aplicación.

## ESLint + Prettier
El equipo de Vue ha hecho un buen trabajo a la hora de evitarnos los quebraderos de cabeza de configurar ESLint y Prettier
de manera que no haya conflicto entre ellos. Si abrimos el fichero `.eslintrc.js` vemos que tenemos instalados estos plugins:

{{< highlight js "linenos=table,hl_lines=6-12 19-20" >}}
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
{{< / highlight >}}

De esta manera Prettier no entrará en conflicto con las reglas de ESLint. En las líneas 19-20 hay unas reglas que he
añadido yo. Se puede añadir todo lo que deseemos para personalizarlo a nuestro gusto.

## VSCode
Como último paso, vamos a ver lo que tenemos que configurar para que todo funcione correctamente en
VSCode. Lo más importante es tener instalada la extensión [Vetur][2], que mejora la experiencia a la hora de desarrollar
con Vue en VSCode, y permite que podamos disfrutar de **autoformateo de código en los Single File Components**, es decir
los ficheros con extensión `.vue`.

Una vez instalado, iremos a la configuración de Vetur, y en la sección de `Format -> Default Formatter` podremos elegir
con qué queremos que se formatee nuestro HTML, CSS, JS, Sass, Typescript, etc. Es muy importante que en JS tengamos
marcado **prettier-eslint**, en el resto yo tengo la opción por defecto, incluso en Typescript tengo solo Prettier, ya que
**prettier-tslint** es una opción que está en desuso.

{{< img src="img/vetur.png" alt="Configuración de formateadores en Vetur" >}}

En la configuración de VSCode tenemos que decir que los ficheros de tipo Vue utilicen
como formateador por defecto Vetur:
{{< highlight js >}}
"[vue]": {
  "editor.defaultFormatter": "octref.vetur"
}
{{< / highlight >}}

De esta manera VSCode delega en Vetur, y es Vetur el que a cada parte que encuentre en los ficheros `.vue` aplicará el
formateador adecuado. Tan solo hay una cosa que Vetur no hace correctamente en el autoformateo de los ficheros `.vue`, y
es el **insertar una línea en blanco al final del archivo**. Si tienes esta opción, la única forma que he encontrado es
delegar esa tarea en VSCode mediante esta configuración:
{{< highlight js >}}
"files.insertFinalNewline": false
{{< / highlight >}}

En ocasiones tener [la última versión de Vetur puede ser problemático][3], recientemente en un proyecto me he encontrado
que Vetur comenzaba a formatear el HTML de manera distinta. Después de unas horas volviéndome loco, instalé una
versión anterior de Vetur y todo volvió a funcionar correctamente. [He reportado el bug][4] y he aprovechado a comentar 
lo de la línea en blanco al final del archivo, aún estoy a la espera de la respuesta. Quizás sea un error mío, pero he 
pasado muchas horas dándole vueltas y de ser así no he sido capaz de encontrarlo.

Con estos pasos ya estamos listos para comenzar nuestros proyectos con Vue 3 + Typescript + ESLint + Prettier en VSCode.

[1]: https://cli.vuejs.org/guide/creating-a-project.html#vue-create
[2]: https://marketplace.visualstudio.com/items?itemName=octref.vetur
[3]: https://vuejs.github.io/vetur/guide/FAQ.html#install-an-old-version-of-vetur
[4]: https://github.com/vuejs/vetur/issues/3067
