---
title: Depurar remotamente aplicaciones HTML con Weinre
author: javi
type: post
date: 2014-06-15T17:43:44+00:00
tags:
  - debug
  - smart TV
  - javascript

---
Nunca me había visto en la necesidad de hacer uso de esta funcionalidad, normalmente desarrollo aplicaciones y páginas web y las pruebo directamente en el navegador, para **depurar el código Javascript** suelo utilizar las herramientas de desarrollador de Chrome. ¿En qué casos podemos necesitar **depurar remotamente**? La respuesta es sencilla, en dispositivos en los cuales no podemos acceder a herramientas de depuración del navegador. Desde la llegada de HTML5 y sus funcionalidades, es posible desarrollar aplicaciones para móviles, Smart TV&#8230; Actualmente estoy trabajando en desarrollo de aplicaciones para **Smart TV,** y me ví en la necesidad de depurar remotamente al realizar pruebas en las teles directamente.

¿Como depurar remotamente? Para ellos podemos utilizar [Weinre,][1] que se instala como un módulo de [Node.js.][2] Lo primero de todo, como es lógico será [instalar Node.js][3] si no lo tenemos ya instalado. Una vez lo tenemos, podremos instalar Weinre a través de [npm,][4] tan solo debemos ir a la consola y ejecutar el siguiente comando:

```bash
npm -g install weinre
```

Yo utilizo Windows, aunque también tengo Ubuntu, en sistemas Linux deberemos ejecutar el comando precedido de sudo probablemente. Así de simple y así de fácil, ya tenemos instalado weinre. Weinre ejecutará un servidor en nuestra máquina, que será la interfaz a través de la cual depuraremos nuestro aplicación HTML5, que se ejecutará en otro dispositivo (móvil, tablet, Smart TV, etc).

**La interfaz es practicamente la misma que las developer tools de Chrome,** asi que si sueles usarla te desenvolverás con soltura en ella, aunque tiene algunas limitaciones.

Para ejecutar el servidor de weinre, vamos a la consola y ejecutamos:

```bash
weinre --boundHost 192.168.1.2
```

En en este caso he utilizado la IP que tengo asignada en mi ordenador en mi red local, 192.168.1.2. Podríamos ejecutar en localhost, pero en ese caso solo podríamos hacer pruebas desde nuestro ordenador, que podría ser util quizás para depurar desde algún emulador. De esta manera, podremos depurar aplicaciones de otros dipositivos que se ejecuten en nuestra misma red local. El comando es el más simple, puedes _teclear weinre &#8211;help_ y ver otro tipo de opciones, como el puerto por el que se lanza, pero en mi caso la configuración por defecto me vale. Si es la primera vez que ejecutas weinre, y estás en windows, probablemente el Firewall pida permisos para que weinre acceda a la red. Veremos un mensaje que confirma que se lanza el servidor:

{{< img src="img/consola.png" alt="Consola con mensaje de confirmación de que el servidor de Weinre se ha iniciado correctamente" >}}

Ya podemos abrir en el navegador la url, en mi caso: http://192.168.1.2:8080/ El siguiente paso es muy simple, tan solo deberemos incluir un script en nuestra aplicación, para que podamos depurar remotamente. Para el ejemplo en concreto, nuestra SmartTV está conectada en la misma red local, por lo que simplemente añadimos la siguiente línea en nuestra aplicación:

```html
<script src="http://192.168.1.2:8080/target/target-script-min.js#instancia"></script>
```

Observemos que se ha concatenado **#instancia,** ¿Qué quiere decir esto? Que podemos crear distintas instancias para depurar remotamente, podríamos montar weinre en un ordenador, y conectarnos varias personas a él, y no sufriremos interferencias en los logs si cada uno tenemos un hashtag diferente. Siguiendo con el ejemplo, para poder conectar con la interfaz desde la que depuraremos, iremos a la siguiente url: http://192.168.1.2:8080/client/#instancia Y nos encontraremos con una interfaz bastante familiar:

{{< img src="img/weinre.png" alt="Consola de visualización de Weinre" >}}

Ya solo nos queda realizar pruebas, ejecutaremos nuestra aplicación con el script incluido, y donde pone Target comenzaremos a ver las ejecuciones. Al igual que en Chrome, podemos ir a la pestaña Elements, ver el código fuente cargado, editarlo, añadir o quitar estilos css. También disponemos de Resources, Network, Timeline y Console, desde donde podremos visualizar los console.log. Por lo que he probado weinre tarda un poco en inicializarse, por lo que **es conveniente que ejecutes los console.log con un timeout,** de lo contrario puede que no aparezcan:

```js
setTimeout(function() { console.log("Hola Mundo"); }, 2000);
```

En este caso lo he ejecutado desde mi mismo ordenador, pero en el trabajo pruebo sin problemas con un televisor LG. Así vemos que hay una conexión, una vez ejecutamos la aplicación:

{{< img src="img/test.png" alt="Consola de Weinre mostrando conexión satisfactoria" >}}

Este es el ejemplo, un simple Hola Mundo con un console.log al cargar la página:

{{< img src="img/hola_mundo.png" alt="Hola mundo" >}}

En la pestaña consola observamos que recibimos el console.log:

{{< img src="img/consola_prueba.png" alt="Prueba de console.log mostrando Hola mundo" >}}

Desde la pestaña Elements, podemos modificar la página, los estilos, en este caso cambiamos el color de fondo para el body:

{{< img src="img/elements.png" alt="Consola de weinre en atributo styles para cambiar el color de fondo de la etiqueta body" >}}

Y efectivamente, vemos que se cambia correctamente:

{{< img src="img/rojo.png" alt="Página con el fondo cambiado a color rojo" >}}

Desde la consola podemos inspeccionar el valor de las variables javascript. **¿Qué limitaciones tiene?** Por ejemplo, al editar estilos CSS, y al escribir, no te va sugiriendo para autocompletar las propiedades. Tampoco podemos ejecutar debugger, para depurar y añadir puntos de parada e ir inspeccionando paso por paso nuestros scripts. Eso sería ya simplemente increíble, pero con todo lo expuesto, weinre parece una de las mejores herramientas a la hora de hacer remote debugging. Toda esta información y más está en la página web de Weinre, asi que si se te queda corta esta entrada, no dudes en consultar toda la información en su web.

Enlaces: [Web oficial de Weinre][1]

 [1]: http://people.apache.org/~pmuellr/weinre/docs/latest/Home.html "Weinre"
 [2]: http://nodejs.org/ "Node.js"
 [3]: http://nodejs.org/download/ "Descarga Node.js"
 [4]: https://www.npmjs.org/doc/README.html "Node Package Manager"
