---
title: Activar https con Let’s Encrypt
author: javi
type: post
date: 2019-06-26T17:43:44+00:00
categories:
  - Linux
  - Servidor
tags:
  - vps
  - linux

---
[Let&#8217;s Encrypt][1] es un proveedor gratuito de **certificados TLS/SSL** que nos brinda la posibilidad de activar **https** en nuestro servidor para nuestros dominio.s El proceso está automatizado tanto para Apache como Nginx, en mi caso voy a utilizar **Cerbot** para instalarlo en mi servidor Nginx.

Certbot es un software que es actualizado bastante amenudo por sus desarrolladores. Si queremos disfrutar de la versión más actualizada, deberemos añadir su repositorio ya que si tiramos de los de Ubuntu, lo más normal es que tengan versiones más antiguas. Para ello:

{{< highlight bash >}}
sudo add-apt-repository ppa:certbot/certbot
{{< / highlight >}}

Aceptaremos las condiciones del servicio para poder actualizar los repositorios del sistema operativo.

{{< highlight bash >}}
sudo apt-get update
{{< / highlight >}}

Y finalmente instalaremos Certbot.

{{< highlight bash >}}
sudo apt-get install python-certbot-nginx
{{< / highlight >}}

Certbot ya está listo, ahora simplemente comprobaremos que tenemos definido en nuestro fichero de configuración de Nginx la clave `server_name` con el dominio que vamos a utilizar.

Veremos la configuración del servidor por defecto en el fichero default, o si está en otro dominio configurado, iremos a ese fichero.

{{< highlight bash >}}
sudo nano /etc/nginx/sites-available/default
{{< / highlight >}}

<pre class="crayon:false">server_name <strong>example.com www.example.com</strong>;</pre>

Si ya está configurado, no es necesario hacer nada. En caso contrario añadimos nuestro dominio y ejecutamos los siguientes comandos para comprobar que la configuración de Nginx introducida no da problemas, y si es así recargamos para refrescar la nueva configuración:

{{< highlight bash >}}
sudo nginx -t
    sudo systemctl reload nginx
{{< / highlight >}}

Por último antes de obtener el certificado, vamos a añadir en nuestro firewall ufw que permita el trafico https. Para ello podemos ejecutar los siguientes comandos para añadir el perfil **Nginx full**, que incorporta tanto http como https y eliminaremos el http que sobra una vez añadido el anterior:

{{< highlight bash >}}
sudo ufw allow 'Nginx Full'
    sudo ufw delete allow 'Nginx HTTP'
{{< / highlight >}}

Comprobamos:

{{< highlight bash >}}
sudo ufw status
{{< / highlight >}}

<pre class="crayon:false">
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
</pre>

Finalmente lanzaremos el proceso para obtener el certificado y que se renueve automaticamente.

{{< highlight bash >}}
sudo certbot --nginx -d example.com -d www.example.com
{{< / highlight >}}

Se nos pedirá una dirección de correo electrónico y, si todo va bien, nos saldrá una pregunta solicitandonos elegir entre si queremos redireccionar el tráfico http a https o no. Elegimos la deseada, en mi caso elegí la segunda y pulsamos enter.

<pre class="crayon:false">
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
-------------------------------------------------------------------------------
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
-------------------------------------------------------------------------------
Select the appropriate number [1-2] then [enter] (press 'c' to cancel):
</pre>

<pre class="crayon:false">
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at
   /etc/letsencrypt/live/example.com/fullchain.pem. Your cert will
   expire on 2017-10-23. To obtain a new or tweaked version of this
   certificate in the future, simply run certbot again with the
   "certonly" option. To non-interactively renew *all* of your
   certificates, run "certbot renew"
 - Your account credentials have been saved in your Certbot
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Certbot so
   making regular backups of this folder is ideal.
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
</pre>

De esta manera ya se han descargado e instalado los certificados para el dominio, puedes ir al navegador e introducir el dominio para comprobar si se ha actualizado el indicador de seguridad.

Si no todo fue correctamente y has obtenido un error como el siguiente:

<pre class="crayon:false">Error: duplicate listen options for [::]:443</pre>

Hay una solución, que consiste en abrir el fichero de configuración de Nginx para el dominio y eliminar **listen [::]:80** pero dejando **listen 80;**

Al volver a ejecutar de nuevo y eligiendo la opción de reinstalar los certificados debería de funcionar. Los certificados son válidos durante 90 días, certbot se encarga de lanzar un proceso que comprueba automáticamente 2 veces por día si quedan menos de 30 días para la expiración, de ser así los certificados serán renovados. Podemos comprobar que todo funciona correctamente ejecutando:

{{< highlight bash >}}sudo certbot renew --dry-run{{< / highlight >}}

Puedes comprobar en el directorio **/etc/cron.d** que hay un script llamado **certbot** que se encarga de ello. Referencias interesantes:

  * [Certbot][2]
  * [Error al obtener certificados][3]
  * [Tutorial en inglés en Digital Ocean][4]

Ya puedes disfrutar de conexión https para tu dominio.

 [1]: https://letsencrypt.org/
 [2]: https://certbot.eff.org/docs/
 [3]: https://github.com/certbot/certbot/issues/5550
 [4]: https://www.digitalocean.com/community/tutorials/how-to-set-up-let-s-encrypt-with-nginx-server-blocks-on-ubuntu-16-04
