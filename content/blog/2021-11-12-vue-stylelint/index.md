---
title: "Integrar stylelint en un proyecto con Vue"
date: 2021-11-12
author: javi
type: post
img: img/stylelint.png
altImg: Logos de Vue y Stylelint
tags:
    - css
    - vscode
    - vue
---
[Stylelint][1] es a CSS el equivalente a [ESLint](https://eslint.org/) para Javascript. Hasta hoy, estaba utilizando las validaciones que provee VSCode por defecto en CSS, pero si queremos ir un paso más allá a la hora de prevenir errores y tener una mejor consistencia en el estilo, un linter para CSS es la mejor opción.

## Dependencias
Veamos como podemos configurar Stylelint para tener validaciones y desactivar las advertencias por defecto del validador de VSCode.

El primer paso será añadir algunas dependencias a nuestro proyecto:
* `stylelint`: El linter.
* `stylelint-config-standard`: Configuración base. También podemos proporcionar nuestra configuración desde cero o elegir otra opción de base como `stylelint-config-recommended`.
* `stylelint-config-recommended-vue`: Configuración base para Vue, añade soporte para algunos selectores CSS de Vue como por ejemplo `::v-slotted`. Además **añade automáticamente un override para archivos `.vue` utilizando `postcss-html` como sintáxis personalizada**.
* `postcss-html`: Dependencia necesaria para validar CSS en ficheros `.vue`.

Por lo tanto, las instalamos:
{{< highlight shell >}}
npm install stylelint stylelint-config-standard stylelint-config-recommended-vue postcss-html --save-dev
{{< / highlight >}}

## Stylelint en VSCode
El siguiente paso es instalar [la extensión oficial de Stylelint para VSCode](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint).

Añadiremos algunas entradas a las settings de nuestro workspace en VSCode (o globalmente) para poder **deshabilitar el lint por defecto de VSCode**. Si estamos utilizando [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), también necesitaremos deshabilitar las validaciones de estilo en la extensión.

Además, desde la versión 14 de Stylelint, **es necesario especificar los diferentes estilos de lenguaje que van a ser validados,** en nuestro caso `vue`.

Adicionalmente, tengo `fixAll` que se ejecuta automáticamente al guardar un archivo.

{{< highlight jsonc >}}
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
{{< / highlight >}}

## Fichero de configuración Stylelint
Por último pero no menos importante, debemos crear un fichero de configuración en la raíz de nuestro proyecto.`.stylelintrc`:

{{< highlight json >}}
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recommended-vue"
   ],
  "rules": {

  }
}
{{< / highlight >}}

En caso de no extender `stylelint-config-recommended-vue`, tendremos que añadir manualmente el override para validar archivos `vue`:

{{< highlight json >}}
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
{{< / highlight >}}

Con todas estas configuraciones, nuestro proyecto está listo para comenzar a utilizar Stylelint para linting de CSS.

## Añadiendo nuestras propias reglas
Podemos especificar reglas personalizadas. Por ejemplo, en un proyecto en el que estemos utilizando Tailwind CSS, podemos evitar el siguiente warning al utilizar `@apply`:  `Unknown at rule @applycss(unknownAtRules)`. Esto es clave si queremos trabajar con plugins de PostCSS y evitar mensajes de advertencia. Ejemplo para Tailwind CSS:

{{< highlight json >}}
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
{{< / highlight >}}

Enlacés de interés:
* [Stylelint][1]
* [stylelint-config-recommended-vue](https://github.com/ota-meshi/stylelint-config-recommended-vue)
* [PostCSS HTML Syntax](https://github.com/ota-meshi/postcss-html)

[1]: https://stylelint.io/
