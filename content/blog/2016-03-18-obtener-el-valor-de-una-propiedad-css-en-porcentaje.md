---
title: Obtener el valor de una propiedad CSS en porcentaje
author: javi
type: post
date: 2016-03-18T12:22:35+00:00
url: /obtener-el-valor-de-una-propiedad-css-en-porcentaje.html
categories:
  - Javascript
  - jQuery
tags:
  - truco
  - jQuery
  - css

---
Un tip rápido, trabajando con jQuery **no es posible obtener** de un nodo por ejemplo, el **valor del ancho en porcentaje.** Lo primero y más lógico que se nos ocurre sería invocar al método `css` y pedirle el `width` (equivalente sería a otras propiedades como top, left, height, etc):

{{< highlight JavaScript >}}
var $element = $("<div id='nodo' style='width: 50%'></div>");

$("body").append( $element );
console.log( $("#nodo").css("width") ); // 683px
{{< / highlight >}}

Si quisieramos obtener el valor en porcentaje, habría que hacerlo de otra manera, directamente sin jQuery. Los selectores de jQuery devuelven un array con los elementos del DOM, asi que si tomamos la posición 0 tendremos el elemento del DOM (no la instancia jQuery) y podremos acceder directamente a la clave style:

{{< highlight JavaScript >}}
var $element = $("<div id='nodo' style='width: 50%'></div>");

$("body").append( $element );
console.log( $("#nodo")[0].style.width ); // 50%
{{< / highlight >}}
