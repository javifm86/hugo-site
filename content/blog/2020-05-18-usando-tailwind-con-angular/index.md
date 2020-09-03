---
title: Usando TailwindCSS con Angular
img: img/tailwind-angular.png
altImg: Angular + TailwindCSS
author: javi
type: post
date: 2020-05-29
tags:
    - angular
    - tailwindcss
---

En este artículo vamos a explicar cómo configurar una aplicación Angular con Angular CLI para poder integrar [TailwindCSS][1]. Con esta
integración el CSS que tengamos que escribir en los componentes va a ser mínimo pues la mayoría de estilos definidos usarán clases
Tailwind.

## Angular CLI

Angular CLI es la interfaz de línea de comandos recomendada para generar aplicaciones Angular. Por debajo utiliza
webpack, pero no tenemos acceso directamente a la configuración utilizada, por lo que si queremos añadir/modificar algún comportamiento
podemos hacer uso de un paquete llamado [@angular-builders/custom-webpack][2], el cual nos permitirá extender la configuración de webpack.

## Configurando TailwindCSS

TailwindCSS va a funcionar independientemente del preprocesador que estemos utilizando en nuestra aplicación (si es que usamos alguno). Por
comodidad, configuraremos PurgeCSS para eliminar todas las clases que no estemos utilizando solo para el entorno de producción y no en desarrollo,
donde estarán todas las clases disponibles. Vamos a ver paso por paso como añadir Tailwind.

El primer paso será instalar las dependencias:

{{< highlight shell >}}
npm install tailwindcss --save
npm install --save-dev @angular-builders/custom-webpack @fullhuman/postcss-purgecss
{{< / highlight >}}

Generamos un fichero de configuración de Tailwind vacío:

{{< highlight shell >}}
npx tailwind init
{{< / highlight >}}

Creamos un nuevo fichero, con la extensión en función del preprocesador que estemos utilizando. En mi caso `scss`, por 
lo que el fichero será `src/tailwind.scss` e insertamos las directivas de Tailwind. En caso de querer generar clases
CSS este será el fichero donde añadirlas.
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

A continuación crearemos un fichero `extra-webpack.config.js` en la raíz del proyecto con el siguiente contenido:

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

Ahora necesitamos editar el fichero de configuración `angular.json` para poder personalizar los comandos `ng serve` y
`ng build`. Iremos a la clave `projects.architect.build.builder` y reemplazaremos `@angular-devkit/build-angular:browser` por
`@angular-builders/custom-webpack:browser`. Y en la ruta `architect.build.options`, añadiremos un objeto `customWebpackConfig` que tendrá
en una clave `path` el valor `extra-webpack.config.js`.

Haremos los mismos cambios en `projects.architect.serve.builder` reemplazando `@angular-devkit/build-angular:dev-server` por 
`@angular-builders/custom-webpack:dev-server`, y en la ruta `architect.serve.options` añadiremos nuevamente un objeto `customWebpackConfig` que tendrá
en una clave `path` el valor `extra-webpack.config.js`.

Por último añadiremos nuestra hoja de estilos `src/tailwind.scss` al array en la ruta `architect.build.options.styles`. Veamos todos los
cambios juntos:

{{< highlight JSON "linenos=table,hl_lines=3 5-7 10 17 19-21" >}}
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

Una vez aplicados estos cambios podremos desarrollar ejecutando `ng serve`, se lanzará nuestra aplicación en modo desarrollo
donde dispondremos de todas las clases de Tailwind, lo que nos permitirá ser más ágiles. Al compilar 
para producción con `ng build --prod` podremos ver que se generarán solo las clases que hemos utilizado en la carpeta `dist`.

{{< highlight plaintext >}}
chunk {4} styles.847663bf210845648553.css (styles) 5.51 kB [initial] [rendered]
{{< / highlight >}}

## PurgeCSS integrado en Tailwind
Desde la versión 1.4.0 Tailwind integra la opción de utilizar PurgeCSS directamente desde la propia configuración
de Tailwind. De esta manera el proceso puede simplificarse un poco, podríamos eliminar la dependencia
`@fullhuman/postcss-purgecss` de nuestro proyecto y dejar el fichero `extra-webpack.config.js` con el siguiente contenido:

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

Y pasaremos las rutas al fichero `tailwind.config.js`:

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

Para que puedan eliminarse las clases que no utiliza nuestro proyecto, debemos compilar con la variable
de entorno `NODE_ENV` con valor `production`. Para poder dar valor a esta variable y que funcione de manera
multiplataforma me gusta utilizar el paquete `cross-env`. Podemos instalarlo en nuestro proyecto:

{{< highlight shell >}}
npm install cross-env --save-dev
{{< / highlight >}}

Y posteriormente podemos crear un script en el `package.json` para lanzar el build:

{{< highlight JSON "linenos=table,hl_lines=10" >}}
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

Lo ejecutamos para comprobar que todo funciona correctamente:

{{< highlight shell >}}
npm run build:prod
{{< / highlight >}}

{{< highlight plaintext >}}
chunk {4} styles.847663bf210845648553.css (styles) 5.51 kB [initial] [rendered]
{{< / highlight >}}

Con estos sencillos pasos ya estás listo para utilizar Tailwind en tus proyectos Angular.

[1]: https://tailwindcss.com/
[2]: https://www.npmjs.com/package/@angular-builders/custom-webpack
