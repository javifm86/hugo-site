---
title: Depurar maquetación CSS con una línea de código
author: javi
type: post
date: 2014-10-13T11:03:44+00:00
url: /depurar-maquetacion-css-con-una-linea-de-codigo.html
categories:
  - Javascript
tags:
  - css
  - javascript
  - truco

---
Llevo aproximadamente 8 años trabajando como desarrollador Javascript principalmente, y la verdad es que cada día uno sigue descubriendo cosas que no dejan de sorprenderle. En este caso, un código de una línea, que sirve para visualizar el layout de todos los elementos CSS de una página.

Es un código ideal para depurar, ver donde se te descuadra un div, donde se te ha colado un margen, controlar al milímetro todo. El código en cuestión es el siguiente. Versión para consolas, que cuentan con el siguiente alias: `$$('*')` equivalente a `document.querySelectorAll('*')`

{{< highlight JavaScript >}}
[].forEach.call($$("*"),function(a){
  a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)
})
{{< / highlight >}}

Asi que si deseas incorporarlo desde código, en lugar de desde la consola, simplemente:

{{< highlight JavaScript >}}
[].forEach.call(document.querySelectorAll("*"),function(a){
  a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)
})
{{< / highlight >}}

Podemos ver como con solo este código, podemos tener un generador de colores aleatorio en formato hexadecimal: `(~~(Math.random()*(1<<24))).toString(16)`

De este tipo de código en una línea, se puede aprender bastante Javascript. Recomiendo la lectura del [artículo creado por Arqex en su blog,][1] pues me parece interesante y yo al menos aprendí cosas.

Enlace: [Código original de Addy Osmani][2]

 [1]: http://arqex.com/939/learning-much-javascript-one-line-code "Arqex - Learning much javascript from one line of code"
 [2]: https://gist.github.com/addyosmani/fd3999ea7fce242756b1 "One line code for CSS debugger"
