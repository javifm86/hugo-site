---
title: Concatenar llamadas a métodos en Javascript
author: javi
type: post
date: 2015-04-21T09:10:23+00:00
url: /concatenar-llamadas-a-metodos-en-javascript.html
categories:
  - Javascript
tags:
  - javascript
  - pattern

---
Vamos a ver de una manera rápida, como podemos **concatenar llamadas a distintos métodos** sobre un mismo objeto en Javascript (en inglés, _Method Chaining in JavaScript_). Este patrón, es utilizado en el popular framework jQuery, en el cual pueden llamarse a varios métodos sobre un selector jQuery. Por ejemplo:

{{< highlight JavaScript >}}
$("#selector").find(".square").css("height", "100px").show();

// En caso de concatenar muchos métodos
$("#selector")
    .find(".square")
    .css("height", "100px")
    .show();
    {{< / highlight >}}

Que es más corto, o más legible (para gustos los colores) que esto:

{{< highlight JavaScript >}}
var $selector = $("#selector");

$selector.find(".square");
$selector.css("height", "100px")
$selector.show();
{{< / highlight >}}

Bien, vamos a ver como **implementar este patrón** en Javascript puro, supongamos un objeto tonto, con 2 métodos sencillos como el siguiente:

{{< highlight JavaScript >}}
var Widget = function(param1, param2) {
    this.msg1 = param1;
    this.msg2 = param2;
};

Widget.prototype.method1 = function() {
    alert(this.msg1);
};

Widget.prototype.method2 = function() {
    alert(this.msg2);
};

var instancia = new Widget("Hola", "Mundo");
{{< / highlight >}}

Si quisieramos llamar a los 2 métodos, deberíamos hacerlo de la siguiente manera:

{{< highlight JavaScript >}}
instancia.method1();
instancia.method2();
{{< / highlight >}}

Y si intentamos concatenar directamente las llamadas, ejecutará el primer método, pero fallará el segundo:

{{< highlight JavaScript >}}
instancia.method1().method2();

// Uncaught TypeError: Cannot read property 'method2' of undefined
{{< / highlight >}}

¿Como hacerlo funcionar? Es sencillo, tan solo deberemos añadir en los métodos `return this;` , de esta manera cuando se llame a `method1` se devolverá el objeto, y al llamar al siguiente método ya no dará undefined, puesto que al haberse devuelto el objeto en el método anterior, ya encuentra la referencia para poder llamar a `method2`. Así queda el código:

{{< highlight JavaScript >}}
var Widget = function(param1, param2) {
    this.msg1 = param1;
    this.msg2 = param2;
};

Widget.prototype.method1 = function() {
    alert(this.msg1);
    return this;
};

Widget.prototype.method2 = function() {
    alert(this.msg2);
    return this;
};

var instancia = new Widget("Hola", "Mundo");

instancia.method1().method2();
{{< / highlight >}}

¿Sencillo verdad? Este patrón de diseño se conoce como [Fluent interface.][1] Usarlo o no ya es cuestión de gustos.

 [1]: http://en.wikipedia.org/wiki/Fluent_interface "Fluent Interface"
