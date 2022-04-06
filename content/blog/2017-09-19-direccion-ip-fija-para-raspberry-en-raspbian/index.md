---
title: Dirección IP fija para Raspberry en Raspbian
img: img/raspberry-board.jpg
altImg: Placa raspberry pi
author: javi
type: post
date: 2017-09-19T12:38:28+00:00
tags:
  - raspberry pi

---
Por comodidad a la hora de disfrutar de nuestra Raspberry **lo más conveniente es asignarle una IP fija.** De esa manera siempre podremos conectarnos a la misma dirección y no dependeremos de que el servidor DHCP nos dé una distinta cada vez. Esta configuración es muy básica, sencilla y muy necesaria a la hora de conectarnos remotamente o configurar otra serie de servicios.

Vamos a ver como en unos sencillos pasos lo hacemos en Raspbian. Los pasos son para la interfaz ethernet, ya que en mi caso es la que veo que tiene mayor sentido, pues tengo conectada la raspberry al lado del router por cable.

Editaremos el fichero `dhcpcd.conf` con nano u otro cualquier editor.

```bash
sudo nano /etc/dhcpcd.conf
```

Y añadiremos al final del fichero las siguientes líneas (asegurate de poner una dirección dentro de tu red y la IP de tu router):

```text
interface eth0
static ip_address=192.168.1.50
static routers=192.168.1.1
static domain_name_servers=8.8.8.8
static domain_search=8.8.4.4
```

Guardamos y salimos, para comprobar el fichero `interfaces`, que tendrá este aspecto:

```text
# interfaces(5) file used by ifup(8) and ifdown(8)

# Please note that this file is written to be used with dhcpcd
# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'

# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d

auto lo
iface lo inet loopback

iface eth0 inet manual

allow-hotplug wlan0
iface wlan0 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf

allow-hotplug wlan1
iface wlan1 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
```

La parte importante es iface `eth0 inet manual`, donde indicamos que la IP sea manual. Lo más probable es que ya esté bien y no tengas que tocarlo. Guardando y reiniciando ya deberíamos disponer de nuestra IP fija.
