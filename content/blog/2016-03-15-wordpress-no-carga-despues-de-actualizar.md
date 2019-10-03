---
title: WordPress no carga después de actualizar
author: javi
type: post
date: 2016-03-15T16:15:04+00:00
categories:
  - Wordpress
tags:
  - wordpress
  - actualización
  - error
  - plugin

---
Después de meses sin publicar ni tan siquiera una entrada, me dirigí a abrir el blog para escribir algo, realizar actualizaciones, plugins, temas, traducciones&#8230; Tenía la versión de WordPress desactualizada, el propio WordPress te avisa que **antes de actualizar realices un respaldo de la base de datos.**

Le dí a actualizar sin más, y de repente el blog comenzó a dar **error 500,** no cargaba. Comienza el pánico, a pesar de que tengo varios backups hechos del blog, tanto de manera manual desde el panel de administración del hosting, como con un plugin que os animo y recomiendo a probar, [Updraftplus][1], que realiza backups y los envío a alojamientos externos como **Dropbox** o **Google Drive**. La versión básica cumple perfectamente mis expectativas, pero para parámetros avanzados y mayores ventajas disponen de una versión premium. Nunca está de más tener distintos backups.

Os cuento como he resuelto el problema, por si os lo encontráis alguna vez:

  * En primer lugar, intenté ejecutar de nuevo el script encargado de lanzar la actualización, `/wp-admin/upgrade.php`. En mi caso me apareció el mensaje de que ya estaba actualizado.
  * Como segunda opción, pensé que podía ser el tema que estoy usando. Fui vía FTP a la carpeta `/wp-content/themes`, y renombré el directorio del theme que estoy usando añadiendo **.old** al final (hemingway a hemingway.old), y renombré la carpeta de uno de los themes por defecto de WordPress, (se puede probar con uno o con todos, twentytwelve, twentythirteen, twentyfourteen, twentyfifteen) con el nombre del theme que estaba activado (twentytwelve a hemingway). Seguía fallando asi que pensé que podía tratarse de un plugin desactualizado, antes de pensar en restaurar el último backup o seguir buscando.
  * Finalmente **desactivé los plugins,** para ello fuí a la carpeta `wp-content/plugins`, y la renombré a **plugins.old**. Luego puse en la barra de direcciones del navegador la url de plugins, `/wp-admin/plugins.php`, al detectar que no había plugins (pues estaba renombrada la carpeta), **WordPress por defecto desactiva todos.** Me salió el mensaje de que no se habían encontrado plugins para mi sitio, un alivio pues ya veía el panel de administración, y si navegaba a la página principal ya me salía.

En mi caso creo que el causante era el plugin **Crayon Syntax Highlighter**, que utilizo para que el código que publico aparezca con sintáxis coloreada. Como ya tenía acotado el problema, actualicé todos los plugins, los fuí activando y ya funcionaba todo correctamente. Si alguna vez os ocurre, probad esta pequeña guía, es un comienzo antes de volveros locos buscando soluciones vía Google.

 [1]: http://updraftplus.com/
