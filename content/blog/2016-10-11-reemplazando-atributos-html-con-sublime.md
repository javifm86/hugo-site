---
title: Reemplazando atributos HTML con Sublime
author: javi
type: post
date: 2016-10-11T13:35:14+00:00
url: /reemplazando-atributos-html-con-sublime.html
categories:
  - Sublime Text
tags:
  - sublime

---
Un tip rápido y fácil aplicable con Sublime o cualquier otro editor de texto que permita **reemplazar con expresiones regulares.** Me encontraba copiando a una entrada de Wordpess una tabla desde un fichero excel, en el cual había modificado el ancho de algunas celdas. Es una manera fácil de insertar una tabla sin necesidad de estar construyendo todo el código html.

El problema era que había un montón de atributos width, cada uno con un número distinto. Corregirlas a mano no es una opción cuando eres vago, y para ello las expresiones regulares acuden al rescate.

Simplemente pulsando _Ctrl + H_ (o en el menú _Find-> Replace_), nos aseguramos de marcar la opción de expresiones regulares, y buscamos la siguiente expresión regular.

`width=".*?"`

Vemos como se seleccionan todas las ocurrencias (en rojo la opción de búsqueda con expresiones regulares).

<img class="aligncenter size-full wp-image-103" src="/img/2016/10/Screenshot_2.png" alt="screenshot_2" width="694" height="544" srcset="https://blog.javifm.com/wp-content/uploads/2016/10/Screenshot_2.png 694w, https://blog.javifm.com/wp-content/uploads/2016/10/Screenshot_2-300x235.png 300w, https://blog.javifm.com/wp-content/uploads/2016/10/Screenshot_2-676x530.png 676w" sizes="(max-width: 694px) 100vw, 694px" />

Simplemente va a buscar todas las coincidencias en el fichero del atributo width con contenido entre comillas. Seleccionamos reemplazar por nada, y en un momento ya hemos eliminado todos los artributos width del texto. Fácil y sencillo.
