---
title: Reemplazando atributos HTML con Sublime
author: javi
type: post
date: 2016-10-11T13:35:14+00:00
tags:
  - sublime

---
Un tip rápido y fácil aplicable con Sublime o cualquier otro editor de texto que permita **reemplazar con expresiones regulares.** Me encontraba copiando a una entrada de Wordpess una tabla desde un fichero excel, en el cual había modificado el ancho de algunas celdas. Es una manera fácil de insertar una tabla sin necesidad de estar construyendo todo el código html.

El problema era que había un montón de atributos width, cada uno con un número distinto. Corregirlas a mano no es una opción cuando eres vago, y para ello las expresiones regulares acuden al rescate.

Simplemente pulsando _Ctrl + H_ (o en el menú _Find-> Replace_), nos aseguramos de marcar la opción de expresiones regulares, y buscamos la siguiente expresión regular.

`width=".*?"`

Vemos como se seleccionan todas las ocurrencias (en rojo la opción de búsqueda con expresiones regulares).

{{< img src="img/Screenshot_2.png" alt="Editor sublime text marcando el selector de expresiones regulares y mostrando seleccionados todos los atributos width de un documento HTML" >}}

Simplemente va a buscar todas las coincidencias en el fichero del atributo width con contenido entre comillas. Seleccionamos reemplazar por nada, y en un momento ya hemos eliminado todos los atributos width del texto. Fácil y sencillo.
