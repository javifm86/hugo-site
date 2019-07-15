---
title: Width() de jQuery sin redondeo
author: javi
type: post
date: 2015-02-26T10:36:01+00:00
url: /width-de-jquery-sin-redondeo.html
categories:
  - Javascript
  - jQuery
tags:
  - jQuery
  - javascript

---
Un tip muy rápido y muy sencillo, pero que no conocía. Por defecto si haces uso de los métodos `.width()` y `.height()` de jQuery, los valores devueltos se encuentran redondeados. Si en alguna ocasión necesitas con precisión conocer los decimales, puedes utilizar el método **`getBoundingClientRect()` incorporado en ES4 y soportado por todos los navegadores.** Por ejemplo el width se obtendría de la siguiente manera:

{{< highlight JavaScript >}}
$("#selector")[0].getBoundingClientRect().width
{{< / highlight >}}
