---
title: Raspberry pi, primeros pasos (2)
author: javi
type: post
date: 2016-12-21T15:07:46+00:00
tags:
  - raspberry pi

---
Una vez tenemos arrancada nuestra Raspberry con Raspbian aparece el escritorio. Lo primero que deberemos hacer será aplicar una configuración básica, para ello la última versión de Raspbian cuenta con una herramienta visual llamada _&#8220;Configuración de Raspberry pi&#8221;_, que encuentras en `Menú / Preferencias`.

{{< img src="img/Screenshot_1.png" alt="Selección de menu en interfaz visual de Raspbian: Preferencias - Configuración de Raspberry Pi" >}}

**NOTA:** He tomado los pantallazos después de configurar mi raspberry, inicialmente todo se encuentra en inglés.

Una vez arrancamos la aplicación, nos aparecerá la siguiente pantalla:

{{< img src="img/Screenshot_2.png" alt="Configuración de Raspberry Pi - Sistema" >}}

Dentro de la pestaña sistema.

  * **Clave:** Muy importante **cambiar la contraseña por defecto** para el usuario **pi**, que es _**raspberry**_. Cabe destacar que hace poco los desarrolladores de Raspbian optaron por deshabilitar SSH por defecto, ya que se producen bastantes ataques que logran acceder a raspberries que no han cambiado la contraseña por defecto. Parece de sentido común por seguridad cambiar esta contraseña por otra. Puedes ampliar la información sobre gestión de usuarios en la [documentación oficial][1].
  * **Hostname:** Para acceder remotamente, en lugar de teclear la ip. Puedes poner lo que más te guste, en mi caso acorté a rasp.
  * **Iniciar en:** Poco que explicar, para arrancar en escritorio o línea de comandos. Si arrancas en consola siempre puedes iniciar la interfaz gráfica con el comando `startx`. Como para casi todo me conecto desde remoto, yo he elegido consola.
  * **Red al iniciar:** Lo he marcado, inicialmente no es necesario, pero para algunos servicios como el servidor web que inicia Transmission (cliente de torrent), es necesario.
  * El resto de parámetros no necesitan explicación.
  * En la imagen no aparece la opción **Expandir sistema de ficheros**, supongo que es porque ya lo hice. Esta opción es para que se utilice toda la capacidad de la tarjeta microSD en el sistema, si cambias de tarjeta por una de mayor capacidad, no olvides aplicar la expansión para aprovechar todo el espacio.

<!--more-->

En **Interfaces** podemos activar/desactivar una serie de servicios, yo activé ssh, que es lo que uso el 90% del tiempo para manejar la raspberry.

{{< img src="img/Screenshot_3.png" alt="Configuración de Raspberry Pi: Interfaces" >}}

**Rendimiento**

{{< img src="img/Screenshot_4.png" alt="Configuración de Raspberry Pi: Rendimiento" >}}

Memoria GPU, viene por defecto con 64MB, si vas a utilizar Kodi para reproducir HD y/o emuladores de consola, será necesario aumentar este valor. Yo he puesto 128MB para Kodi, no descarto aumentarlo un poco más. Si no tienes estos requerimientos, 64MB es más que suficiente. El **valor máximo para Raspberry Pi 3 es de 944**, según la [documentación oficial][2] (buscar **gpu_mem**).

Por último encontramos la pestaña **Localización**, donde configurar la zona horaria, locale, teclado y país de la Wifi. Puse todo en español. Para configurar el teclado es necesario que esté enchufado físicamente.

{{< img src="img/Screenshot_5.png" alt="Configuración de Raspberry Pi: Localización" >}}

Una vez configurado todo a nuestro gusto, pulsamos Aceptar para que se apliquen los cambios.

### Configuración de Internet

Para obtener salida a Internet tenemos 2 opciones, conectar por cable ethernet o a través de Wifi. Yo tengo el router al lado de la raspberry, asi que está conectada por cable. Si en tu caso no tienes cerca para enchufar por cable, puedes acceder a través de Wifi, en el icono de al lado de Bluetooth puedes configurar tu red Wifi.

{{< img src="img/Screenshot_7.png" alt="Wifi en Raspbian" >}}

Una vez conectado, puedes abrir el navegador y comprobar la conexión a internet. También puedes abrir una terminal y hacer ping: `ping google.com`

Configurada la salida a Internet, el siguiente paso es **actualizar el sistema**. Estos comandos deberían ejecutarse de vez en cuando, para estar al día en actualizaciones de seguridad.

{{< highlight bash >}}
sudo apt-get update
sudo apt-get dist-upgrade
{{< / highlight >}}

El primero actualiza el listado de paquetes, el segundo instala las actualizaciones. Si quieres ejecutar ambos y que conteste sí a las preguntas, puedes poner en una sola línea:

{{< highlight bash >}}
sudo apt-get update && sudo apt-get -y dist-upgrade
{{< / highlight >}}

Con todo esto ya tenemos la configuración básica inicial. Las posibilidades que brinda este mini ordenador son enormes, a partir de aquí hay que adpatarla a nuestras necesidades. Los usos más comunes son para servidores de descarga, servidor de contenido multimedia, domótica, etc. En próximas entradas explicaré configuración de algunos servicios que estoy usando.

 [1]: https://www.raspberrypi.org/documentation/linux/usage/users.md
 [2]: https://www.raspberrypi.org/documentation/configuration/config-txt.md
