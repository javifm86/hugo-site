---
title: Configuración servidor VPS en Digital Ocean I
img: img/digital-ocean.png
altImg: Logo Digital Ocean
author: javi
type: post
date: 2018-05-01T10:10:39+00:00
tags:
  - vps
  - linux

---
Me he decidido a contratar un VPS en Digital Ocean, a ver si de una vez por todas en mi escaso tiempo libre, puedo ir desarrollando un portfolio y aprendiendo cosas nuevas. Vamos a ver un listado de la configuración de un VPS desde cero, partiendo de una instalación limpia de Ubuntu 16.04. Vayamos por partes:

## Configuración inicial del servidor

En este apartado hablaremos de la configuración incial básica para que nuestro VPS sea más seguro. Lo primero de todo es conectarnos a nuestro servidor, para ello utilizaremos ssh para establecer conexión remota por consola, con el usuario root, hasta que creemos otro usuario. Podemos conectarnos desde la consola de nuestro sistema operativo (Mac, Linux), o utilizar alguna utilidad como [Putty][1], que es un cliente SSH gratuito y archiconocido para Windows. Para conectarnos deberemos saber la dirección IP pública de nuestro servidor y ejecutar el siguiente comando:

{{< highlight bash >}}
ssh root@your_server_ip
{{< / highlight >}}

Al ser la primera conexión, veremos un mensaje informándonos que no se puede asegurar la autenticidad de la conexión, escribiremos yes para establecer conexión:

<pre>The authenticity of host '1XX.XXX.XXX.XXX' can't be established.
ECDSA key fingerprint is SHA256:71mD5o12895hg7tu85lPFDY1khktRcuPnsfCQFrTaK0.
Are you sure you want to continue connecting (yes/no)?</pre>

Y se nos solicitará cambiar la contraseña root por seguridad. El usuario root tiene todos los privilegios y no es una buena idea hacer un uso regular de él ya que por accidente podemos ejecutar acciones destructivas e irreversibles. Por este motivo, el siguiente paso será crear otro usuario para conectarnos normalmente con él, para ello ejecutamos el siguiente comando y contestamos unas sencillas preguntas:

{{< highlight bash >}}
adduser mike
{{< / highlight >}}

Tras crear nuestro nuevo usuario, le otorgaremos permisos de superusuario para poder ejecutar comandos con privilegios de root anteponiendo la palabra sudo.

{{< highlight bash >}}
usermod -aG sudo mike
{{< / highlight >}}

Abriremos una nueva terminal, y probaremos a conectar con nuestro nuevo usuario para verificar que podemos hacer login correctamente:

{{< highlight bash >}}
ssh mike@your_server_ip
{{< / highlight >}}

Todo servidor web que se precie debe contar con un Firewall, hay muchas opciones, una de las más sencillas y que viene ya incluida en Ubuntu es UFW. Con UFW podremos controlar qué servicios tienen acceso a la conexión. Para ver la lista de aplicaciones registradas en el firewall, ejecutamos el siguiente comando:

{{< highlight bash >}}
sudo ufw app list
{{< / highlight >}}

Obteniendo como resultado:

<pre>
Available applications:
  OpenSSH
</pre>

Es muy importante que permitamos el acceso a OpenSSH, de lo contrario la próxima vez que vayamos a conectarnos no podremos, algo que no debe ocurrir. Para ello añadimos OpenSSH:

{{< highlight bash >}}
sudo ufw allow OpenSSH
{{< / highlight >}}

Y sólo después de esto activaremos el firewall:

{{< highlight bash >}}sudo ufw enable{{< / highlight >}}

En cualquier momento podemos comprobar los aplicaciones que hemos permitido o denegado a través del comando:

{{< highlight bash >}}sudo ufw status{{< / highlight >}}

<pre>
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
</pre>

A partir de ahora será necesario que en futuras aplicaciones y/o servicios instalados, permitamos que realice conexiones añadiendolas a ufw.

## Instalación de LEMP

LEMP son las siglas que indican un servidor con sistema operativo Linux, Nginx como servidor web, PHP como procesador dinámico y MySQL como base de datos para el backend. Algo muy común por ejemplo a la hora de tener una página en WordPress. Vamos a ver como instalar en nuestro VPS estos paquetes:

## Instalar Nginx

Nginx es un servidor web de código abierto, uno de los más usados en el mundo junto con Apache. Cada uno tiene sus pros y sus contras, yo he optado por Nginx. Antes de nada, actualizaremos el repositorio apt de nuestro servidor, y posteriormente instalaremos nginx:

{{< highlight bash >}}
sudo apt-get update
sudo apt-get install nginx
{{< / highlight >}}

Una vez instalado se inicia el servicio automaticamente, acto seguido deberemos registrar nginx en ufw:

{{< highlight bash >}}
sudo ufw allow 'Nginx HTTP'
sudo ufw status 
{{< / highlight >}}

<pre>Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere                  
Nginx HTTP                 ALLOW       Anywhere                  
OpenSSH (v6)               ALLOW       Anywhere (v6)             
Nginx HTTP (v6)            ALLOW       Anywhere (v6)
</pre>

Hecho esto, ya solo deberemos acceder a la dirección IP pública de nuestro VPS para ver la página de bienvenida de nginx.

{{< img src="img/nginx_default.png" alt="ágina de bienvenida de Nginx" >}}

## Instalar MySQL

Para instalarlo simplemente ejecutamos:

{{< highlight bash >}}
sudo apt-get install mysql-server
{{< / highlight >}}

Nos pedirá una contraseña para el usuario root. Una vez instalado es altamente recomendable ejecutar un script de seguridad para eliminar configuraciones inseguras, usuarios de ejemplo y bases de datos de prueba.

{{< highlight bash >}}
sudo mysql_secure_installation
{{< / highlight >}}

Tan sólo hay que seguir el asistente introduciendo el carácter **`y`** para contestar que sí.

## Instalar PHP

Nginx por defecto no cuenta con procesamiento para PHP. Para ello deberemos instalar `php-fpm`. Tecleamos en la terminal:

{{< highlight bash >}}
sudo apt-get install php-fpm php-mysql
{{< / highlight >}}

A continuación editaremos la configuración de PHP para hacerla más segura:

{{< highlight bash >}}
sudo nano /etc/php/7.0/fpm/php.ini
{{< / highlight >}}

Pulsando F6, buscaremos la siguiente cadena: &#8220;cgi.fix_pathinfo&#8221;. Pondremos su valor en 0 para desactivarlo, ya que con esta configuración activada podría permitirse a un usuario malintencionado ejecutar scripts a los que normalmente no debería tener acceso. Cerramos, guardamos y reiniciamos el servicio:

{{< highlight bash >}}
sudo systemctl restart php7.0-fpm
{{< / highlight >}}

## Habilitar PHP en Nginx
  
Con Nginx podemos tener distintas configuraciones de servidor para distintos sitios (dominios, subdominios&#8230;). Inicialmente solo tendremos un sitio, llamado default. Vamos a habilitar PHP editando el fichero default, además de algunas configuraciones de seguridad:

{{< highlight bash >}}
sudo nano /etc/nginx/sites-available/default
{{< / highlight >}}

Añadiremos `index.php` como posible entrada por defecto de un directorio, podremos modificar `server_name`, para poder acceder a través de dominio en lugar de nuestra IP pública, que es la que vendrá por defecto. Habilitaremos PHP con las líneas marcadas en rojo y evitaremos el procesamiento de archivos `.htaccess` por motivos de seguridad.

<pre>server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;

        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html <strong>index.php</strong>;

        <strong># server_name tudominio.com;
        server_name 1XX.XX.XX.XX;</strong>

        location / {
                try_files $uri $uri/ =404;
        }

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        <span style="color: #ff0000;"><strong>location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        }</strong></span>

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        <strong>location ~ /\.ht {
                deny all;
        }</strong>
}
</pre>

Cerramos, guardamos el fichero y haremos un test para verificar que no hay ningún error de sintáxis en la configuración de Nginx:

{{< highlight bash >}}sudo nginx -t{{< / highlight >}}

Si no hay errores, reiniciamos el servicio para que pueda aplicarse la nueva configuración:

{{< highlight bash >}}sudo systemctl reload nginx{{< / highlight >}}

Para finalizar, iremos a la carpeta /var/www/html y crearemos un fichero index.php, con el siguiente contenido:

{{< highlight php >}}
<?php
phpinfo();
?>
{{< / highlight >}}

Ahora simplemente accediendo a nuestra dirección IP pública o dominio, deberemos ver una página con toda la configuración de PHP. Cuando hayamos verificado que está funcionando, borraremos el fichero y ya tendremos nuestro servidor LEMP con la configuración inicial para poder hacer cosas.

 [1]: http://www.putty.org/
