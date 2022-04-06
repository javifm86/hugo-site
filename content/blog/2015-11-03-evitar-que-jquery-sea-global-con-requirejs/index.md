---
title: Evitar que jQuery sea global con RequireJS
author: javi
type: post
date: 2015-11-03T12:56:17+00:00
tags:
  - RequireJS
  - jQuery
  - javascript

---
El popular framework de Javascript [jQuery][1], es utilizado ampliamente en el mundo del desarrollo web. Por defecto se instancia en la variable global `$`, además de `jQuery`. Esto puede entrar en conflicto con otras librerías que hayan decidido utilizar el $ también. Si estás utilizando el popular cargador de módulos [RequireJS][2], hay una manera muy fácil para **evitar que jQuery se instancie globalmente.**

Por ejemplo, desarrollando para las televisiones SmartTV de Samsung, me encontré con ese problema, ya que **Samsung incluye internamente su propia versión de jQuery**, sobrescribiendo la que añadas. De manera que haciendo uso del método `noConflict` de jQuery, junto con la opción `map` de RequireJS, podemos hacer que se guarde la referencia a jQuery, y que solo tengan acceso a ella los módulos que declaren nuestra versión de jQuery como dependencia.

Veamos como quedaría nuestra configuración de RequireJS:

```js
require.config( {

    baseUrl: "./",

    paths: {
        "jquery": "lib/jquery-1.11.2.min",
        "noConflict": "lib/no-conflict",
    },

    map: {
        "*": {
            "jquery": "noConflict"
        },
        "noConflict": {
            "jquery": "jquery"
        }
    }

} );
```

Y luego simplemente añadiríamos el siguiente código en el módulo **noConflict**:

```js
define( [ "jquery" ], function( $ ) {
    return $.noConflict( true );
} );
```

Pasándole true al método noConflict de jQuery, además de eliminar jQuery de la variable global `$`, se elimina además de la global `jQuery`. De esta manera, podríamos tener varias versiones de jQuery de manera privada, o una pública y otra solo usada como dependencia en los módulos que se necesite.

Para usarlo, se require jQuery como una dependencia, y se le asigna a la variable que solo estará disponible en ese módulo el nombre que queramos:

```js
define(

    // Módulos requeridos
    [ "jquery", ],

    function( jQueryPrivado ) {

    }
    
);
```

Si aún no conoces RequireJS, o no utilizas un cargador de módulos en tus desarrollos Javascript, te recomiendo que aprendas, ya que ayuda a mantener separadas las distintas funcionalidades de una aplicación, evitando crear un monstruo que a la larga sea difícil de mantener.

[1]: https://jquery.com/ "jQuery"
[2]: http://requirejs.org/ "RequireJS"
