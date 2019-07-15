---
title: Depuración remota en Smart TV con console.io
author: javi
type: post
date: 2014-11-05T16:03:56+00:00
url: /depuracion-remota-en-smart-tv-con-console-io.html
categories:
  - HTML5
  - Javascript
  - Smart TV
  - Utilidades
tags:
  - debug
  - smart TV
  - javascript
  - console.io

---
Hace algún tiempo hablé de [Weinre,][1] como opción para **depurar de forma remota nuestras aplicaciones Javascript.** Era una opción bastante buena para dispositivos Android y Smarts TV de LG, pero cuando fuí a depurar la aplicación que estamos desarrollando en una Smart TV de Samsung, me llevé la sorpresa de que las televisiones Samsung, deben hacer algo por dentro que sobreescribe el método console del navegador, y con Weinre no podía ver ninguno de los logs que había puesto en el código.

Rapidamente mis compañeros y yo pensamos en elaborar un propio debugger muy simple con un script en PHP, pero pronto comenzaron a surgir los inconvenientes y desechamos la idea. Fue de esta manera como nos topamos con [Console.io,][2] una consola web remota que cumplía de largo con todas nuestras necesidades. Además **es totalmente compatible con diferentes modelos de Smart TV** de distintos años, entre ellos la mencionada Samsung que usamos para pruebas. Según su página web:

  * Toshiba TV (2011, 2012, 2013)
  * LG NetCast TV (2011, 2012, 2013)
  * Philips NetTV (2011, 2012, 2013)
  * Samsung TV (2010, 2011, 2012, 2013)
  * Panasonic TV (2012, 2013)
  * Technika Avtrex STB
  * Sony (BDP-S4100)
  * Hopper Dish (Hopper)
  * Firefox, Safari, Opera, Chrome, Maple, PhantomJS and IE
  * iPhone, iPod, iPad, Android browser, windows 8 phone etc

<!--more-->Vamos a ver en unos sencillos pasos como instalar Console.io rapidamente. Se instala como un módulo de 

[Node.js][3], así que deberemos [instalar Node.js][4] si no lo tenemos ya instalado. Antes de nada, vamos a descargar todos los archivos necesarios, podéis descargarlo en formato [TAR][5], [ZIP][6] o descargarlo vía git desde la [página web de github del proyecto. ][7] En principio no serán necesarios los archivos, ya que con el siguiente paso debería ser suficiente, pero por si acaso no lo es, luego explico como hacerlo funcionar. Una vez descargado, abrimos la consola e instalamos Console.io como paquete npm mediante el siguiente comando:

{{< highlight bash >}}
npm install -g xconsole.io
{{< / highlight >}}

De esta manera una vez terminen de realizarse todas las operaciones en la consola, se habrá instalado correctamente y podremos comenzar a usarlo. Para ello simplemente abriremos la consola, y ejecutaremos el siguiente comando:

{{< highlight bash >}}
consoleio
{{< / highlight >}}

Y aparecerá en consola el siguiente mensaje:

`Starting Console.IO<br />
Console.IO is run at http://localhost:8082`

Con esto ya estaría instalado, simplemente abrimos la dirección del servidor y comprobamos que todo cargue correctamente. Deberíamos ver algo así:

[<img class="aligncenter wp-image-43 size-large" src="/img/2014/11/consoleio1-1024x363.png" alt="" width="676" height="239" srcset="https://blog.javifm.com/wp-content/uploads/2014/11/consoleio1-1024x363.png 1024w, https://blog.javifm.com/wp-content/uploads/2014/11/consoleio1-300x106.png 300w, https://blog.javifm.com/wp-content/uploads/2014/11/consoleio1-676x240.png 676w, https://blog.javifm.com/wp-content/uploads/2014/11/consoleio1.png 1362w" sizes="(max-width: 676px) 100vw, 676px" />][8]

En mi portátil personal fue suficiente con estos pasos, en el del trabajo por alguna razón que no he investigado, no debió añadirse correctamente la ruta hasta el Console.io, y al abrir la url del servidor, me apareció un error de este tipo:

`Error: ENOENT, stat 'C:\Users\dist\app\index.html'`

Esto sucede porque se intenta buscar el Console.io en el directorio en el cual estoy situado actualmente en la consola, y no encuentra los archivos necesarios para ejecutarse. Lo que hice fue **copiarme todas las carpetas del Console.io en mi servidor wamp** (puede ser en cualquier directorio, Mis Documentos, en el escritorio). Y en la barra de tareas tengo un acceso directo a un .bat muy sencillo, que se coloca en dicha carpeta y una vez allí lanza el Console.io:

{{< highlight bash >}}
cd C:\wamp\www\jsconsole
consoleio
{{< / highlight >}}

Una vez funcionando de la manera que sea, ya solo nos queda añadir un script a nuestra aplicación, para poder recibir en Console.io los mensajes de depuración. Siendo 192.168.1.15, nuestra máquina con nuestra ip (en vuestro caso deberéis usar la IP que tenga vuestro ordenador), añadiríamos lo siguiente:

{{< highlight HTML >}}
<script type="text/javascript" src="http://192.168.1.15:8082/console.io.js"></script>
{{< / highlight >}}

Ya solo nos queda lanzar nuestra aplicación, desde el dispositivo que queramos, y podremos ver desde la url de Console.io todos los logs que van saliendo. Podemos ver la estructura de los objetos, y **utilizar los distintos método de la consola,** info, error, warning, hasta funciona `console.time` y `console.timeEnd`.

En la parte superior izquierda, veremos los dispositivos conectados (los que podemos debuggear), en este caso tenemos una ejecución de una televisión LG Smart TV de 2013, que hemos abierto para depurar, y otra ejecución desde un ordenador con un chrome versión 38, que aparece con una bolita verde. Para conectar con la ejecución de un dispositivo, simplemente hacemos doble click sobre la bolita verde, y empezaremos a ver y recibir logs del dispositivo seleccionado.

[<img class="aligncenter wp-image-44 size-full" src="/img/2014/11/devices.png" alt="devices" width="606" height="402" srcset="https://blog.javifm.com/wp-content/uploads/2014/11/devices.png 606w, https://blog.javifm.com/wp-content/uploads/2014/11/devices-300x199.png 300w" sizes="(max-width: 606px) 100vw, 606px" />][9]

Se pueden guardar los logs, pausar la ejecución, filtrar los tipos de logs que queremos ver, podemos ver el código fuente de la página, realizar capturas de pantalla, recargar la aplicación sin tener que lanzarla de nuevo, ver las características del dispositivo, objeto navigator&#8230;

En fin muchas cosas, es cuestión de investigar y trastear por su interfaz gráfica, que es  bastante intuitiva y nos iremos encontrando cosas que en un determinado momento pueden sernos de gran utilidad. En la siguiente imagen vemos algunos logs, un Hola mundo, el valor de un objeto, las propiedades de un array. Además **desde el editor podemos ejecutar código Javascript,** muy útil para conocer propiedades de elementos del DOM, manipularlos o lanzar cualquier función que nos haga falta de manera manual.

[<img class="aligncenter wp-image-45 size-full" src="/img/2014/11/logs.png" alt="logs" width="643" height="715" srcset="https://blog.javifm.com/wp-content/uploads/2014/11/logs.png 643w, https://blog.javifm.com/wp-content/uploads/2014/11/logs-269x300.png 269w" sizes="(max-width: 643px) 100vw, 643px" />][10]

En resumen Console.io es una herramienta muy potente, que nos puede arrojar luz cuando probamos en distintos tipos de dispositivo desde donde no es posible consultar una consola de errores, o en caso de poder consultarla ésta es muy limitada. A mí me ha sacado las castañas del fuego más de una vez, probando en las Smart TV. No dudéis en ampliar información en la documentación oficial.

Enlaces: [Console.io][2] | [Página en Github][11]

 [1]: http://javifm.com/blog/winre-depurar-remotamente-aplicaciones.html "Weinre"
 [2]: http://nkashyap.github.io/console.io/ "Console.io"
 [3]: http://nodejs.org/ "Node.js"
 [4]: http://nodejs.org/download/ "Descarga Node.js"
 [5]: https://github.com/nkashyap/console.io/tarball/master "Console.io en formato TAR"
 [6]: https://github.com/nkashyap/console.io/zipball/master "Console.io en formato ZIP"
 [7]: https://github.com/nkashyap/console.io "Console.io en github"
 [8]: /img/2014/11/consoleio1.png
 [9]: /img/2014/11/devices.png
 [10]: /img/2014/11/logs.png
 [11]: https://github.com/nkashyap/console.io "Console.io en Github"
