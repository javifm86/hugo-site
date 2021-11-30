---
title: Restaurar grub después de instalar Windows
date: 2021-11-25
author: javi
type: post
img: img/boot-repair-cover.jpg
altImg: Windows, Linux y Boot repair logos
tags:
    - windows
    - linux
---
En este artículo, vamos a ver como podemos restaurar grub después de instalar Windows. Tenía Windows 7 aún en mi portátil junto con Ubuntu, asi que después de mucho tiempo posponiéndolo, finalmente me he decidido a actualizar a Windows 10. Lo más recomendable al instalar un ordenadfor, es instalar Windows y después Linux. De esta manera, Linux se preocupará de dejar grub listo para posibilitar el arranque dual.

Si por cualquier motivo tienes que instalar Windows después de Linux, Windows eliminará grub, pondrá por defecto que cargue Windows y será necesario restaurar grub. A continuación la opción más sencilla para recuperar grub.

## Boot repair al rescate
[Boot repair disk](https://sourceforge.net/projects/boot-repair-cd/files/) es una herramienta de rescate que permite de una manera muy sencilla restaurar grub. Tan sólo hay que descargar la iso y crear un USB con ella, por ejemplo con [Rufus](https://rufus.ie/en/). Reinicia el sistema y asegurate de que la opción USB está al principio de la lista de dispositivos de arranque en la BIOS.

Una vez Boot repair se haya cargado, puedes conectarte a internet para descargar la última versión, hacer click en la opción "Recommended repair" y reiniciar.

{{< img src="img/boot-repair.png" alt="Pantalla de Boot repair mostrando dos botones: \"Recommended repair\" aynd \"Create a BootInfo summary\"" >}}

¡Y eso es todo! Al reiniciar, deberías ver la pantalla para seleccionar el sistema operativo que quieras cargar.
