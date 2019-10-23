---
title: Trim trailing white space en un shortcut en Sublime
author: javi
type: post
date: 2014-12-02T16:14:31+00:00
tags:
  - sublime
---
Sublime permite definir por medio de sus ficheros de configuración, una opción que cuando trabajo solo suelo tener activada, pero que en ocasiones trabajando en equipo no es muy recomendable.

La opción es la de **eliminar los espacios sobrantes en un archivo.** Por defecto en sublime viene desactivada, pero es posible activarla para que Sublime se encargue de eliminar esos innecesarios espacios al guardar un archivo. Si esto es lo que buscas, simplemente abre tu archivo de _**Settings &#8211; User,**_ y añade la siguiente opción: `"trim_trailing_white_space_on_save": true`

¿Por qué no tenerlo siempre activado? Actualmente estoy trabajando en equipo, y cada persona trabaja con su editor favorito configurado a su gusto. De hecho en nuestro proyecto cada uno usamos un editor distinto (NetBeans, Brackets, Notepad++, Eclipse). Puede resultar bastante confuso tocar el fichero de un compañero, guardar y subir con los espacios en blancos eliminados. Quizás cuando ese compañero vaya a hacer commit de sus cambios y necesite mergear, no le haga mucha gracia ver cambios por todos lados y tener que revisar todas las líneas para ver si hay cambios. Hay mecanismos para que al comparar no salten esas diferencias, pero no todo el mundo las conoce ni las quiere conocer.

Por eso me propuse poder ejecutar el limpiado de espacios, pero en lugar de al guardar, en un atajo de teclado, así podría limpiar mis archivos sin interferir en los del resto. La opción más fácil era instalar una extensión ([Trailing Spaces][1]), pero ya tengo Sublime cargado de extensiones y me parecía innecesario cargarlo con una más, con muchas opciones que probablemente no use y un gasto innecesario de recursos.

La solución es sencilla, Sublime tiene un plugin por default que realiza la acción, asi que solamente hay que modificarlo para que ejecute la acción en un atajo de teclado en lugar de al guardar el archivo. Podemos ver el plugin en la siguiente ruta: `\Sublime\Data\Packages\Default`

El archivo es _**trim\_trailing\_white_space.py.**_

{{< highlight python >}}
import sublime, sublime_plugin

class TrimTrailingWhiteSpace(sublime_plugin.EventListener):
    def on_pre_save(self, view):
        if view.settings().get("trim_trailing_white_space_on_save") == True:
            trailing_white_space = view.find_all("[\t ]+$")
            trailing_white_space.reverse()
            edit = view.begin_edit()
            for r in trailing_white_space:
                view.erase(edit, r)
            view.end_edit(edit)

class EnsureNewlineAtEof(sublime_plugin.EventListener):
    def on_pre_save(self, view):
        if view.settings().get("ensure_newline_at_eof_on_save") == True:
            if view.size() > 0 and view.substr(view.size() - 1) != '\n':
                edit = view.begin_edit()
                view.insert(edit, view.size(), "\n")
                view.end_edit(edit)
{{< / highlight >}}

<!--more-->Podéis modificar ese mismo fichero, yo preferí crearme otro distinto, por no tocar nada de lo que trae Sublime por defecto, y le puse un nombre super original: 

_**trim\_trailing\_white_space2.py,**_ en la misma carpeta. El código es el siguiente:

{{< highlight python >}}
import sublime, sublime_plugin

def trim_trailing_white_space2(view):
    trailing_white_space2 = view.find_all("[\t ]+$")
    trailing_white_space2.reverse()
    edit = view.begin_edit()
    for r in trailing_white_space2:
        view.erase(edit, r)
    view.end_edit(edit)

class TrimTrailingWhiteSpace2Command(sublime_plugin.TextCommand):
    def run(self, edit):
        trim_trailing_white_space2(self.view)
{{< / highlight >}}

Para terminar, abrimos el archivo _**Key Bindings &#8211; User**_ y añadimos el siguiente shortcut:

{{< highlight JavaScript >}}
{ "keys": ["ctrl+alt+shift+t"], "command": "trim_trailing_white_space2" }
{{< / highlight >}}

Con la combinación de teclas que os sea más cómoda. Et voilà! Eso es todo.

Lo anterior para la versión 2 de Sublime, si lo queremos funcionando en la 3 el código es el siguiente:

{{< highlight python >}}
import sublime, sublime_plugin

    class TrimTrailingWhiteSpace2Command(sublime_plugin.TextCommand):
        def run(self, edit):
            trailing_white_space = self.view.find_all("[\t ]+$")
            trailing_white_space.reverse()
            for r in trailing_white_space:
                self.view.erase(edit, r)

    class TrimTrailingWhiteSpace2(sublime_plugin.EventListener):
        def run(self, view):
            view.run_command("trim_trailing_white_space2")
{{< / highlight >}}

Solución encontrada en: [Stackoverflow (3ª respuesta)][2]

 [1]: https://github.com/SublimeText/TrailingSpaces "Trailing Spaces"
 [2]: http://stackoverflow.com/questions/12297169/sublime-text-2-trim-trailing-white-space-on-demand "Stackoverflow"
