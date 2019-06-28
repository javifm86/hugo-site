---
title: Depurar remotamente aplicaciones HTML con Weinre
author: javi
type: post
date: 2014-06-15T17:43:44+00:00
url: /weinre-depurar-remotamente-aplicaciones.html
categories:
  - HTML5
  - Utilidades

---
Nunca me había visto en la necesidad de hacer uso de esta funcionalidad, normalmente desarrollo aplicaciones y páginas web y las pruebo directamente en el navegador, para **depurar el código Javascript** suelo utilizar las herramientas de desarrollador de Chrome. ¿En qué casos podemos necesitar **depurar remotamente**? La respuesta es sencilla, en dispositivos en los cuales no podemos acceder a herramientas de depuración del navegador. Desde la llegada de HTML5 y sus funcionalidades, es posible desarrollar aplicaciones para móviles, Smart TV&#8230; Actualmente estoy trabajando en desarrollo de aplicaciones para **Smart TV,** y me ví en la necesidad de depurar remotamente al realizar pruebas en las teles directamente.

¿Como depurar remotamente? Para ellos podemos utilizar [Weinre,][1] que se instala como un módulo de [Node.js.][2] Lo primero de todo, como es lógico será [instalar Node.js][3] si no lo tenemos ya instalado. Una vez lo tenemos, podremos instalar Weinre a través de [npm,][4] tan solo debemos ir a la consola y ejecutar el siguiente comando:

{{< highlight bash >}}
npm -g install weinre
{{< / highlight >}}

<!--more-->Yo utilizo Windows, aunque también tengo Ubuntu, en sistemas Linux deberemos ejecutar el comando precedido de sudo probablemente. Así de simple y así de fácil, ya tenemos instalado weinre. Weinre ejecutará un servidor en nuestra máquina, que será la interfaz a través de la cual depuraremos nuestro aplicación HTML5, que se ejecutará en otro dispositivo (móvil, tablet, Smart TV, etc.)

**. La interfaz es practicamente la misma que las developer tools de Chrome,** asi que si sueles usarla te desenvolverás con soltura en ella, aunque tiene algunas limitaciones.

Para ejecutar el servidor de weinre, vamos a la consola y ejecutamos:

{{< highlight bash >}}
weinre --boundHost 192.168.1.2
{{< / highlight >}}

En en este caso he utilizado la IP que tengo asignada en mi ordenador en mi red local, 192.168.1.2. Podríamos ejecutar en localhost, pero en ese caso solo podríamos hacer pruebas desde nuestro ordenador, que podría ser util quizás para depurar desde algún emulador. De esta manera, podremos depurar aplicaciones de otros dipositivos que se ejecuten en nuestra misma red local. El comando es el más simple, puedes _teclear weinre &#8211;help_ y ver otro tipo de opciones, como el puerto por el que se lanza, pero en mi caso la configuración por defecto me vale. Si es la primera vez que ejecutas weinre, y estás en windows, probablemente el Firewall pida permisos para que weinre acceda a la red. Veremos un mensaje que confirma que se lanza el servidor:

[<img class="alignnone wp-image-19 size-full" src="/img/2014/06/consola.png" alt="consola" width="677" height="282" srcset="https://blog.javifm.com/wp-content/uploads/2014/06/consola.png 677w, https://blog.javifm.com/wp-content/uploads/2014/06/consola-300x124.png 300w" sizes="(max-width: 677px) 100vw, 677px" />][5]

Ya podemos abrir en el navegador la url, en mi caso: **http://192.168.1.2:8080/** El siguiente paso es muy simple, tan solo deberemos incluir un script en nuestra aplicación, para que podamos depurar remotamente. Para el ejemplo en concreto, nuestra SmartTV está conectada en la misma red local, por lo que simplemente añadimos la siguiente línea en nuestra aplicación:

{{< highlight html >}}
<script src="http://192.168.1.2:8080/target/target-script-min.js#instancia"></script>
{{< / highlight >}}

Observemos que se ha concatenado **#instancia,** ¿Qué quiere decir esto? Que podemos crear distintas instancias para depurar remotamente, podríamos montar weinre en un ordenador, y conectarnos varias personas a él, y no sufriremos interferencias en los logs si cada uno tenemos un hashtag diferente. Siguiendo con el ejemplo, para poder conectar con la interfaz desde la que depuraremos, iremos a la siguiente url: **http://192.168.1.2:8080/client/#instancia** Y nos encontraremos con una interfaz bastante familiar:

[<img class="alignnone size-full wp-image-20" src="/img/2014/06/weinre.png" alt="weinre" width="967" height="623" srcset="https://blog.javifm.com/wp-content/uploads/2014/06/weinre.png 967w, https://blog.javifm.com/wp-content/uploads/2014/06/weinre-300x193.png 300w" sizes="(max-width: 967px) 100vw, 967px" />][6]

Ya solo nos queda realizar pruebas, ejecutaremos nuestra aplicación con el script incluido, y donde pone Target comenzaremos a ver las ejecuciones. Al igual que en Chrome, podemos ir a la pestaña Elements, ver el código fuente cargado, editarlo, añadir o quitar estilos css. También disponemos de Resources, Network, Timeline y Console, desde donde podremos visualizar los console.log. Por lo que he probado weinre tarda un poco en inicializarse, por lo que **es conveniente que ejecutes los console.log con un timeout,** de lo contrario puede que no aparezcan:

{{< highlight JavaScript >}}
setTimeout(function() { console.log("Hola Mundo"); }, 2000);
{{< / highlight >}}

En este caso lo he ejecutado desde mi mismo ordenador, pero en el trabajo pruebo sin problemas con un televisor LG. Así vemos que hay una conexión, una vez ejecutamos la aplicación:

[<img class="alignnone size-full wp-image-22" src="/img/2014/06/test.png" alt="test" width="967" height="623" srcset="https://blog.javifm.com/wp-content/uploads/2014/06/test.png 967w, https://blog.javifm.com/wp-content/uploads/2014/06/test-300x193.png 300w" sizes="(max-width: 967px) 100vw, 967px" />][7]

Este es el ejemplo, un simple Hola Mundo con un console.log al cargar la página:

[<img class="alignnone size-full wp-image-23" src="/img/2014/06/hola_mundo.png" alt="hola_mundo" width="967" height="623" srcset="https://blog.javifm.com/wp-content/uploads/2014/06/hola_mundo.png 967w, https://blog.javifm.com/wp-content/uploads/2014/06/hola_mundo-300x193.png 300w" sizes="(max-width: 967px) 100vw, 967px" />][8]

En la pestaña consola observamos que recibimos el console.log:

[<img class="alignnone size-full wp-image-24" src="/img/2014/06/consola_prueba.png" alt="consola_prueba" width="967" height="623" srcset="https://blog.javifm.com/wp-content/uploads/2014/06/consola_prueba.png 967w, https://blog.javifm.com/wp-content/uploads/2014/06/consola_prueba-300x193.png 300w" sizes="(max-width: 967px) 100vw, 967px" />][9]

Desde la pestaña Elements, podemos modificar la página, los estilos, en este caso cambiamos el color de fondo para el body:

[<img class="alignnone size-full wp-image-25" src="/img/2014/06/elements.png" alt="elements" width="967" height="623" srcset="https://blog.javifm.com/wp-content/uploads/2014/06/elements.png 967w, https://blog.javifm.com/wp-content/uploads/2014/06/elements-300x193.png 300w" sizes="(max-width: 967px) 100vw, 967px" />][10]

Y efectivamente, vemos que se cambia correctamente:

[<img class="alignnone size-full wp-image-26" src="/img/2014/06/rojo.png" alt="rojo" width="967" height="623" srcset="https://blog.javifm.com/wp-content/uploads/2014/06/rojo.png 967w, https://blog.javifm.com/wp-content/uploads/2014/06/rojo-300x193.png 300w" sizes="(max-width: 967px) 100vw, 967px" />][11]

Desde la consola podemos inspeccionar el valor de las variables javascript. **¿Qué limitaciones tiene?** Por ejemplo, al editar estilos CSS, y al escribir, no te va sugiriendo para autocompletar las propiedades. Tampoco podemos ejecutar debugger, para depurar y añadir puntos de parada e ir inspeccionando paso por paso nuestros scripts. Eso sería ya simplemente increíble, pero con todo lo expuesto, weinre parece una de las mejores herramientas a la hora de hacer remote debugging. Toda esta información y más está en la página web de Weinre, asi que si se te queda corta esta entrada, no dudes en consultar toda la información en su web.

Enlaces: [Web oficial de Weinre][1]

 [1]: http://people.apache.org/~pmuellr/weinre/docs/latest/Home.html "Weinre"
 [2]: http://nodejs.org/ "Node.js"
 [3]: http://nodejs.org/download/ "Descarga Node.js"
 [4]: https://www.npmjs.org/doc/README.html "Node Package Manager"
 [5]: /img/2014/06/consola.png
 [6]: /img/2014/06/weinre.png
 [7]: /img/2014/06/test.png
 [8]: /img/2014/06/hola_mundo.png
 [9]: /img/2014/06/consola_prueba.png
 [10]: /img/2014/06/elements.png
 [11]: /img/2014/06/rojo.png
