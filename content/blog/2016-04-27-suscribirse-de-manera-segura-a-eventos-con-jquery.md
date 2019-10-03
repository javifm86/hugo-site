---
title: Suscribirse de manera segura a eventos con jQuery
author: javi
type: post
date: 2016-04-27T14:54:10+00:00
categories:
  - Javascript
  - jQuery
tags:
  - jQuery

---
Un truco del que me acabo de enterar, que seguro será de gran utilidad a la hora de desarrollar aplicaciones con Javascript. Sobre todo aplicaciones [SPA][1] (Single Page Application).  A la hora de suscribirnos a eventos de manera global en nuestras ventanas, escenas,  vistas (hay multitud de forma de llamarlas según el framework o el entorno en que trabajes) es algo muy normal suscribirnos a eventos en `window`.

Un ejemplo sería el evento `resize`.

{{< highlight JavaScript >}}
$( window ).on( "resize", _handleResize );
{{< / highlight >}}

Muy simple, nos suscribimos al evento resize del navegador para que se ejecute la función _handleResize cada vez que se produce un redimensionado del navegador. Al salir de nuestra vista, para ahorrar en consumo de memoria, es altamente recomendable eliminar todos los listeners que hayamos creado, si no van a ser necesarios, y crearlos nuevamente cuando vayamos a necesitarlos. La duda es, ¿Cómo eliminar nuestra llamada unicamente sin afectar al resto?

{{< highlight JavaScript >}}
$( window ).off( "resize" );
{{< / highlight >}}

Si hacemos el off directamente, **eliminaríamos todos los callbacks asociados al evento resize,** algo que probablemente no es lo que buscamos. Para solucionar este problema, **podemos hacer uso de namespaces** que nos permitan suscribirnos y desuscribirnos al evento `resize` dado un namespace. Para ello simplemente escribiremos `resize.nombreNameSpace`. Así creamos el listener:

{{< highlight JavaScript >}}
$( window ).on( "resize.config", _handleResize );
{{< / highlight >}}

Y de la misma forma, aplicamos el off.

{{< highlight JavaScript >}}
$( window ).off( "resize.config" );
{{< / highlight >}}

El mismo truco funciona para otros eventos como `keydown`. Asi que si no conocías esta valiosa información de jQuery, ya puedes comenzar a utilizarla para evitar &#8220;desuscribir&#8221; más de la cuenta.

 [1]: https://es.wikipedia.org/wiki/Single-page_application
