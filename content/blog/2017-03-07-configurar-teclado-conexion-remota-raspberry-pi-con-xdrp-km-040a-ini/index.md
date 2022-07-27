---
title: Configurar teclado conexión remota Raspberry Pi con XDRP – km-040a.ini
img: img/raspberry.jpg
altImg: Placa raspberry pi
author: javi
type: post
date: 2017-03-07T10:24:28+00:00
tags:
  - raspberry pi
  - xdrp

---
Si te conectas de manera remota a tu raspberry, a través de la aplicación de **Conexión a escritorio remoto de Windows** por ejemplo, tarde o temprano te darás cuentas que si no utilizas un teclado inglés, muchos de los símbolos y teclas están cambiados. Puede convertirse en una odisea el simple hecho de introducir el password de conexión si este tiene algún carácter especial.

¿Pero cómo es esto posible? Si al configurar mi raspberry me preocupé de cambiar la configuración de teclado a español (o el idioma que sea). Bien esto  sucede por tener el teclado conectado físicamente, pero si desconectas teclado y ratón y te conectas remotamente, **la raspberry tomará por defecto que utilizas un teclado inglés americano.** Veamos como solucionarlo.

Si estás conectado en remoto, ten en cuenta que **te deberás conectar físicamente (con un teclado)** a la raspberry, de lo contrario los comandos necesarios para iniciar la configuración no funcionarán. Una vez conectado físicamente, veamos paso a paso como proceder:

1. Ejecuta el siguiente comando, con el cual indicamos que queremos usar un teclado español de España.
    ```bash
    setxkbmap -layout 'es,es'
    ```
1. Navega al directorio _/etc/xrdp_, haz `ls` y comprueba que no haya un fichero **km-040a.ini**, que es el correspondiente al teclado español. Si lo hay, no está de más de hacer un backup por si acaso. Lo normal es que no lo haya, asi que a través del siguiente comando lo crearemos.
    ```bash
    xrdp-genkeymap /etc/xrdp/km-040a.ini
    ```
1. Este es el fichero que se encarga de establecer los mapeos a las teclas. Crearemos un backup de él antes de modificarlo. Desde la consola, con sudo ejecutaremos:
    ```bash
    sudo cp km-040a.ini km-040a.ini.backup
    ```
1. Con esto tendríamos ya funcionando el teclado, pero no del todo. Seguramente muchos símbolos ya se hayan corregido, pero combinaciones con la tecla _AltGr_, y las flechas arriba, abajo, derecha, izquierda puede que no funcionen. Si este es el caso, hay que editar el fichero **km-040a.ini** y terminar de mapear todo correctamente. Por suerte [pude encontrar por internet un fichero que funcionaba bien](https://github.com/javifm86/km-041a.ini/blob/master/km-040a.ini) con mi teclado, y simplemente lo sobrescribí.

Si estás buscando algún otro fichero de configuración para otro teclado, puedes probar a ver si lo encuentras desde [este repositorio][2]. Si no está, deberás averiguar el nombre de fichero para tu teclado en función del país, y seguramente buscando en Google alguien haya encontrado la solución.

Yo pude solucionarlo gracias a dos artículos en inglés:

  * [Conexión escritorio remoto en Ubuntu.][3]
  * [Teclas especiales en XDRP.][4]

 [1]: https://github.com/javifm86/km-041a.ini/blob/master/km-040a.ini
 [2]: https://github.com/neutrinolabs/xrdp/tree/master/instfiles
 [3]: http://c-nergy.be/blog/?p=2879
 [4]: http://c-nergy.be/blog/?p=3858
