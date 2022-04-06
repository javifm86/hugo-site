---
title: Integrar TailwindCSS con Hugo
img: img/hugo-tailwindcss.png
altImg: Hugo + TailwindCSS
author: javi
type: post
date: 2020-01-21T13:08:01+01:00
tags:
    - hugo
    - tailwindcss
---

Vamos a ver como configurar nuestro sitio construido con Hugo para que integre [TailwindCSS][1]. Hugo es muy flexible y te
permite de una manera sencilla configurar tu sitio a tu gusto. En mi caso en particular, tengo el fichero `baseof.html`
como esqueleto de todo mi sitio, y en el tengo un partial (que viene a ser un include) llamado `head.html`.

```go-html-template

<!doctype html>
<html lang="es">
<head>
    {{ partial "head.html" . }}
</head>
<body></body>
</html>
```

Realizamos la importación del fichero `styles.css` de la carpeta css y le pasamos la función `absURL` de Hugo, de manera
que nos devuelve la ruta absoluta.

```go-html-template
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
{{ $css := "css/styles.css" | absURL }}
<link rel="stylesheet" href="{{ $css }}">
```

Los archivos estáticos en Hugo se guardan por defecto en la carpeta `static`, así que ya tenemos el primer paso, tener un
fichero `styles.css` en la ruta `/static/css/`. Como este fichero va a ser generado, lo que he hecho ha sido crearme una
carpeta llamada `static-src` donde tener los fuentes de mis ficheros estáticos que posteriormente voy a procesar.

Antes de continuar, vamos a instalar las dependencias que vamos a necesitar con npm.

```bash
npm install tailwindcss --save
npm install postcss postcss-cli @fullhuman/postcss-purgecss autoprefixer watch cross-env cssnano --save-dev
```

Veamos qué son estas dependencias:

-   **tailwindcss**: El framework CSS.
-   **postcss postcss-cli**: PostCSS se utiliza para compilar Tailwind y además añadiremos algunos plugins para el resultado
    final de nuestro CSS.
-   **@fullhuman/postcss-purgecss**: Tailwind genera muchísimas clases, utilizaremos este plugin para eliminar las clases que
    no utilicemos de Tailwind y reducir el tamaño final de nuestro CSS.
-   **autoprefixer**: Opcional, para poner prefijos a nuestra hoja de estilos.
-   **watch**: Paquete de node que nos permite ejecutar tareas cuando algún fichero sea modificado. Viene con un cli que
    utilizaremos en un script npm.
-   **cross-env**: Paquete multiplataforma para dar valor a la variable de entorno `NODE_ENV`.
-   **cssnano**: Minimizador para CSS.

Con todas estas dependencias ya disponemos de las piezas del puzzle necesarias para generar un fichero CSS con Tailwind
y solo con las clases que utilicemos, no todo el framework. Generamos un fichero de configuración de Tailwind vacío,
para en caso de querer [personalizar las opciones que vienen por defecto][2] en el framework podamos. Tan solo ejecutaremos:

```bash
npx tailwind init
```

Y nos generará un fichero `tailwind.config.js` vacío en el raíz:
```js
module.exports = {
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
}
```

Ya podemos crear nuestro fichero `/static-src/styles.css` invocando a las directivas de Tailwind. Además podremos añadir
otros estilos CSS que queramos, utilicen Tailwind o no.

```css
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
```

Tailwind es compilado utilizando PostCSS, por lo que puedes integrar fácilmente otros plugins. En nuestro caso vamos
a meter `autoprefixer`, para que se generen automáticamente los prefijos de las propiedades que lo necesiten y además,
cuando compilemos para producción vamos a utilizar `purgecss` y `cssnano` para reducir al máximo el tamaño de nuestra 
hoja de estilos. Veamos el fichero de configuración de PostCSS (`postcss.config.js`, ubicado en el directorio raíz):

```js
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
```

A la hora de purgar el CSS, buscaremos en todos nuestros ficheros con extensión `.md` en la carpeta `content` y `.html` en
`layouts`. Si trabajas con ficheros javascript u otras rutas donde añadas clases CSS, deberás ajustar el array de rutas.
Este snippet considera que estamos trabajando con un theme dentro de la carpeta `/themes/nombretheme/`, si
trabajamos directamente desde la carpeta `layouts` de Hugo (como he hecho yo en este blog) habría que ajustar las rutas:

```js
const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./content/**/*.md', './layouts/**/*.html', './static/**/*.js'],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});
```

Con todo esto ya podemos generar nuestros scripts npm en el fichero `package.json`:

```json
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

```
Tenemos principalmente 3 tareas:
- **css:build:dev**: Compila el fichero CSS en modo desarrollo, para mayor agilidad tendremos todo Tailwind por defecto sin
necesidad de minimizar y purgar clases.
- **css:build:prod**: Compila, purga y minimiza el fichero CSS para obtener la hoja de estilos optimizada para producción.
- **css:watch**: Observa la carpeta `./static-src/css` para en caso de cambios volver a compilar el fichero. Muy útil para no
lanzar manualmente la tarea `css:build:dev` cada vez que hagamos cambios.

Con estas tareas ya podemos generar nuestra hoja de estilos. He creado un [repositorio en Github][3] con un theme que incorpora
estos scripts como punto de partida para poder crear tu propio theme para Hugo. Puedes probarlo con [algo de contenido de
prueba][4] que he creado en otro repositorio para verlo en acción.

**NOTA**: Es posible integrar todo el proceso gracias al [pipe postCSS][5] de Hugo. Te 
obliga a tener instalado globalmente `postcss-cli` además de los plugins que uses. Yo personalmente prefiero no tener
instalados globalmente paquetes y poder personalizar todo el proceso, pero es una opción a tener en cuenta que nos brinda Hugo.

 [1]: https://tailwindcss.com/
 [2]: https://tailwindcss.com/docs/configuration/#app
 [3]: https://github.com/javifm86/hugo-tailwindcss-starter
 [4]: https://github.com/javifm86/hugo-tailwindcss
 [5]: https://gohugo.io/hugo-pipes/postcss/
