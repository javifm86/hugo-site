---
title: Raspberry Pi, primeros pasos
author: javi
type: post
date: 2016-11-24T10:41:20+00:00
tags:
  - raspberry pi

---
{{< img src="img/497149-raspberry-pi-3-model-b-ports.jpg" alt="Raspberry Pi, fuente de alimentación, tarjeta SD y carcasa" >}}

Recientemente me he animado a adquirir el mini ordenador más famoso actualmente, la archiconocida [Raspberry Pi][1]. Seguramente hayas oído hablar de ella, lleva muchos años y dispone de varios modelos. Hay multitud de información en la red, yo actualmente no conozco mucho, pero buscando por internet puedes encontrar de todo, y cada persona va adaptando su Raspberry Pi a sus necesidades. En mi caso tan solo quiero trastear, automatizar ciertas tareas cotidianas y poner en marcha cualquier idea que se me pase por la mente.

Hay multitud de distribuciones, tanto oficiales como no oficiales, yo en mi caso me he decantado por la más completa, **Raspbian**.  Vamos a ver una serie de pasos básicos para instalar Raspbian y arrancar nuestra Raspberry.

Si aún no tienes tu Raspberry, vamos a repasar brevemente el material necesario.



  * **Raspberry Pi 3 B**, el último modelo. Su precio puede oscilar en función de donde la adquieras, siendo más barata en sitios como Aliexpress, y un poco más cara en tiendas como Amazon. Entre los **25-40€** puedes encontrarla. Este último modelo cuenta con antena Wifi incorporada y Bluetooth, características no disponibles en modelos anteriores.
  * Fuente de alimentación. Recomiendo la oficial, pero si no lo es, asegurate de que sea buena y que cuente con salida de **5.1V a 2.5A**.
  * Caja para Raspberry. Es opcional, las hay de distintos tipos, la oficial, transparentes, con hueco para un ventilador, con espacio para incorporar una pantalla y poder convertir tu Raspberry en una tablet, etc.
  * Tarjeta **MicroSD**. Versiones anteriores de la raspberry funcionan con una tarjeta SD, pero el último modelo ya funciona con MicroSD. Este será el disco duro, recomendable un adaptador de MicroSD a SD para introducirla en el ordenador y grabar la imagen del sistema operativo. A tener en cuenta, la capacidad, yo recomendaría **16 GB mínimo y de clase 10**, cuanto mejor sea la velocidad de escritura, mejor será el rendimiento de nuestro mini ordenador.
  * **Cable HDMI**, para conectarla a la televisión o cualquier monitor. Será necesario para el primer arranque, posteriormente se puede acceder por remoto o SSH.

En mi caso elegí la opción más rápida y cómoda, que es comprar [un kit en Amazon][2] con todos los componentes oficiales. Puedes ahorrar algunos euros comprando los componentes por separado.

{{< img src="img/71MWyMoYdBL._SL1500_-768x446.jpg" alt="Raspberry Pi, fuente de alimentación, tarjeta SD y carcasa" >}}

## Instalando Raspbian

Vamos a ver como instalar Raspbian en la tarjeta MicroSD en unos sencillos pasos:

  1. Descargamos [Raspbian desde la página web oficial][3]. Raspbian es el sistema operativo oficial y el que mayor soporte tiene. Hay una versión ligera y una full, yo me he decantado por instalar la completa.
  2. Insertamos la tarjeta MicroSD en el adaptador SD, y este último a su vez en nuestra tarjeta lectora de SD de nuestro ordenador. Abrimos el explorador y nos aseguramos de la letra que corresponde con la tarjeta.
  3. Para escribir la imagen disponemos de dos programas. El primero (el que recomiendo y he usado) es [Etcher][4], es multiplataforma y dispone de la capacidad de grabar la imagen sin necesidad de descomprimirla. Además comprueba al finalizar que se grabó correctamente. La otra opción es [Win32 Disk Imager][5]. Simplemente seleccionamos la imagen, la unidad (asegurate de no equivocarte y elegir la de la tarjeta) y flasheamos.{{< img src="img/etcher.png" alt="Interfaz de Etcher con los pasos a seguir, seleccionar imagen, seleccionar unidad y flashear" class="my-4" >}}
  4. Una vez termine (tardará un rato), y compruebe que se ha grabado correctamente, ya dispondremos de la tarjeta lista para insertarla en nuestra raspberry.

## Primer arranque de la Raspberry

Ahora solo toca ensamblar todo el hardware antes de arrancar. Si disponemos de caja, **en la parte posterior** encontramos la ranura para introducir fácilmente nuestra tarjeta MicroSD. Una vez insertada, hacemos uso de los puertos USB para conectar ratón y teclado, conectamos el cable HDMI de la raspberry al monitor/televisión, y por último conectamos la fuente de alimentación. Con esto se encenderá nuestra raspberry y deberíamos ver en pantalla el arranque de Raspbian.

{{< img src="img/splash-1024x768.jpg" alt="Pantalla de bienvenida a Pixel, sistema operativo Raspbian" >}}

Hasta aquí la primera parte de primeros pasos con Raspberry. En posteriores artículos describiré como configurar algunos aspectos básicos como Wifi, teclado, idioma, conectarnos remotamente, etc.

Amplía información sobre [Raspberry en su página web oficial][1].

 [1]: https://www.raspberrypi.org/
 [2]: https://www.amazon.es/gp/product/B01CI5879A/
 [3]: https://www.raspberrypi.org/downloads/raspbian/
 [4]: https://www.etcher.io/
 [5]: https://sourceforge.net/projects/win32diskimager/
