---
title: "Configurando StandardJS"
date: 2021-08-10
author: javi
type: post
img: img/standardjs-vscode.png
altImg: Logotipos de StandardJS y VSCode
tags:
    - vue
---
En este post vamos a ver como configurar [StandardJS][1] en VSCode para poder corregir todos los errores al guardar
un archivo automáticamente.

## ¿Qué es StandardJS?

A simple vista podría parecer que es el estándar a la hora de escribir código Javascript, y esa es la intención de
StandardJS, proporcionar una **guía de estilos, linter y formateador para código Javascript**. En realidad no lo es, el
ecosistema Javascript ya sabemos cómo es y para gustos los colores. La idea es buena, lo instalas
y te despreocupas de definir reglas, siempre y cuando te guste lo que trae. Yo había oído hablar de él pero nunca lo
había probado.

Personalmente soy un poco maniático con algunas cosas y estoy acostumbrado a utilizar **Prettier** como
formateador, pero todo es acostumbrarse. Las ventajas son:

- Evitar configuración de estilo.
- Formateado automático del código con `standard --fix`.
- Identifica errores de estilo y programación en el código.

StandardJS utiliza una configuración de reglas fijas definidas con [ESLint][2].

## Instalar y configurar StandardJS

El primer paso será como no, instalar el paquete. Lo puedes hacer de manera global o local para un proyecto, yo siempre
que puedo elijo esta última opción, para poder tener las dependencias controladas y no depender de un paquete global.

{{< highlight shell >}}
npm install standard --save-dev
{{< / highlight >}}

En cualquier momento puedes solucionar automáticamente los problemas que encuentre (los que se puedan arreglar
automáticamente) con:

{{< highlight shell >}}
standard --fix
{{< / highlight >}}

Puedes crearte un script npm para ejecutarlo automáticamente, pero la opción más cómoda es integrarlo en el editor.

## Formateo automático en VSCode

He utilizado StandardJS por primera vez en un proyecto de un compañero, y de primeras me volví loco. Tengo configurado
**Prettier** como formateador por defecto, y me encontraba constantemente distintos formatos al guardar, pues Prettier
formateaba violando reglas de StandardJS.

Le pregunte a mi compañero que como formateaba el código al guardar un fichero, y me dijo que no lo hacía, simplemente
al detectar un error le da a la bombilla y seleccionaba **Fix all**. Este tipo de tareas manuales no van conmigo,
asi que investigué como formatear cada vez que se guarda un archivo en VSCode y a continuación describo la solución.

En primer lugar, instalaremos [la extensión de StandardJS para VSCode][3]. Como StandardJS utiliza ESLint, instalaremos
[la extensión de ESLint][4] también.

En mi caso, como suelo utilizar Prettier lo más recomendable es desactivar el formateador en lenguaje Javascript en el 
workspace del proyecto. También a nivel de workspace, utilizaremos la siguiente configuración, que aparece en la
documentación de la extensión para formateo y resolución automática de problemas, pero a la que he tenido que añadir las
líneas que aparecen remarcadas, porque sino no me funcionaba.

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

Para probar que todo funciona, vamos a un fichero Javascript y comprobamos que al guardar desaparecen todos los errores
que marcaba StandardJS. Eso es todo, por mi parte prefiero Prettier a la hora de formatear, ya que puedo usarlo también
para HTML y CSS, y aplicar reglas directamente con ESLint.

[1]: https://standardjs.com/
[2]: https://eslint.org/
[3]: https://marketplace.visualstudio.com/items?itemName=standard.vscode-standard
[4]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
