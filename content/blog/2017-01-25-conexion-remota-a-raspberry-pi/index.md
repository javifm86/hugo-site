---
title: Conexión remota a Raspberry Pi
img: img/raspberry-logo.jpg
altImg: Logo raspberry pi
author: javi
type: post
date: 2017-01-25T15:41:09+00:00
tags:
  - raspberry pi

---
Una vez finalizada la configuración básica, vamos a ver la manera de **conectarnos remotamente**, sin necesidad de tener enchufado ratón y teclado a la Raspberry, ni tan siquiera un monitor HDMI (si no quieres). Por defecto raspbian Pixel trae instalado el paquete **RealVNC** para conexiones remotas. Este paquete es incompatible con **xrdp**, que es el protocolo que utiliza la herramienta de _Conexión a Escritorio remoto_ que trae instalada Windows por defecto.

Si no dispones de Windows no te preocupes, vamos a ver varias maneras distintas de conexión en remoto. Para continuar con la configuración instalaremos el paquete **tightvncserver**, que se encarga automáticamente de desinstalar RealVNC . Para instalar, desde la terminal simplemente ejecutamos:

```bash
sudo apt install -y tightvncserver
```

La opción _**-y**_ simplemente responde que sí a cualquier pregunta planteada. Finalmente instalamos xrdp:

```bash
sudo apt install -y xrdp
```

Para poder acceder fácilmente a nuestra Raspberry desde Windows, podemos instalar **Samba**. Así en lugar de recordar la IP, podemos recordar solamente el nombre que le hayamos puesto en el apartado **hostname** de la pestaña Sistema dentro de la configuración de la raspberry. Especialmente útil si tiene IP dinámica y no fija. En mi caso mi Raspberry se llama _**"rasp"**_. Para instalar samba:

```bash
sudo apt install -y samba
```

Desde ahora, en una máquina Windows podremos acceder fácilmente al mini ordenador. Probamos desde cmd de Windows a hacer ping:

```bash
ping rasp
```

Para conectar remotamente, disponemos de 2 opciones:

**Desde Windows** no es necesario ningún paso adicional, simplemente abriremos la herramienta de _Conexión a Escritorio remoto_. Pondremos la IP o el hostname que le hayamos dado, podremos configurar una serie de opciones como Pantalla (tamaño del escritorio remoto, calidad del color&#8230;), y una vez esté a nuestro gusto pulsamos en Conectar.

{{< img src="img/xrdp.png" alt="Conexión a escritorio remoto de Windows" >}}
  


Es posible que salte un aviso informando de que no se puede comprobar la identidad del equipo remoto, pulsaremos _Sí_ para establecer la conexión. Si todo ha ido bien, veremos una pantalla donde introducir nuestras credenciales de acceso a la Raspberry.  Usuario pi y contraseña raspberry, si es que no la has cambiado aún(¡deberías!).

{{< img src="img/login.png" alt="Login con xrdp" >}}

Después de escribir usuario y password, al dar OK veremos el escritorio de nuestra Raspberry, y podremos interactuar con ella desde la interfaz gráfica.

{{< img src="img/conexion_remota.png" alt="Interfaz gráfica de Raspbian" >}}

Para **conectar desde cualquier plataforma**, podemos utilizar **VNC**. Yo lo utilizo desde mi móvil android, con la aplicación _VNC Viewer_. Hay distintas aplicaciones para las distintas plataformas, incluso [hay una extensión para Google Chrome.][1] Para ello deberemos dar algún paso más, nada complicado.

En la consola de nuestra Raspberry, ejecutaremos el comando `vncpasswd`, y nos pedirá establecer una contraseña que será solicitada en el momento que accedamos por remoto. Además nos dará la posibilidad de crear una contraseña unicamente para ver la Raspberry pero sin manipular, le decimos que no pues no nos interesa.

Ahora crearemos un escritorio remoto simplemente ejecutando `vncserver`, y en consola veremos **el número de escritorio creado**, la primera vez será _:1_, la siguiente _:2_, etc. Desde nuestra red local simplemente en nuestra herramienta VNC, ponemos la IP de la Raspberry, seguido del número de escritorio. Si es el escritorio 1, y nuestra IP es 192.168.1.50, deberemos conectar a 192.168.1.50:1.

Si estamos conectando desde fuera de nuestra red, a través de internet, el número de escritorio correspondería con el puerto 5901 para el escritorio 1. 5902 para el 2, etc., ya que el puerto de VNC es el 5900. Pero esto lo explicaré con mayor detalle en otras entradas, para conectar remotamente desde fuera de casa.

Tras pulsar conectar, nos solicitará la password y después de introducirla conectaremos remotamente. Puedes crear distintos tipos de escritorios remotos con VNC, para ver las distintas opciones lo mejor es consultar la ayuda con `vncserver --help`.

{{< img src="img/vnc_android.png" alt="VNC desde Android" >}}

Hasta aquí la manera de conectar a través de interfaz gráfica, si bien no es la conexión que más a menudo uso, puntualmente me viene bien. La manera más habitual de conectar, como hacen muchos usuarios de Linux es a través de [SSH][2], conectaremos a la consola de nuestra Raspberry y dispondremos de la línea de comandos para ejecutar lo que queramos.

Para ello se puede hacer uso de una herramienta llamada [Putty][3], o de cualquier línea de comandos. En Putty simplemente ponemos la dirección IP de la máquina a la que nos vamos a conectar, elegimos ssh y dejamos el puerto por defecto que es el 22. En consola normal, ejecutaremos el comando ssh seguido de la dirección IP: `ssh 192.168.1.50`.

{{< img src="img/putty.png" alt="Configuración de Putty" >}}

Elegimos Open, introducimos nuestras credenciales y ya estaremos en nuestra máquina.

NOTA: Antes de intentar conectar por SSH o VNC, es importante **comprobar en la configuración de la raspberry que dichos servicios están habilitados**, recientemente Raspbian ha cambiado y por defecto trae ssh deshabilitado.

 [1]: https://chrome.google.com/webstore/detail/vnc%C2%AE-viewer-for-google-ch/iabmpiboiopbgfabjmgeedhcmjenhbla
 [2]: https://es.wikipedia.org/wiki/Secure_Shell
 [3]: http://www.putty.org/
