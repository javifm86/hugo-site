---
title: JSHint y formateo de código al hacer commit con git (Git hooks)
author: javi
type: post
date: 2015-07-02T08:15:08+00:00
tags:
  - git
  - hook
  - JSHint
  - script

---
A la hora de trabajar en equipo, tener una guía de estilos definida es de vital importancia. Estoy trabajando en un proyecto en el cual por diversos motivos que no vienen al caso, se podría mejorar bastante en ese aspecto, y mediante el uso de [Node.js][1] disponemos de herramientas que nos pueden ayudar a tener en un equipo un código más uniforme y estándar.

Para nuestro proyecto he elegido un linter, en este caso [JSHint][2], y un formateador para el código Javascript, que representa el grueso de los desarrollos de nuestra aplicación, [js-beautify][3]. Podría incorporarse además una tercera herramienta, muy potente a la hora de definir exactamente los estilos que deseamos aplicar de manera muy minuciosa, [JSCS][4], que se ocupa de muchas opciones de estilo que actualmente mantiene JSHint, pero que pronto **pasarán a estar deprecadas.**  (Actualización: Parece que [ESLint][5] es una alternativa equilibrada a JSHint y JSCS, tengo que probarlo más a fondo). Por el momento me limitaré a las 2 mencionadas.

Como control de versiones, utilizamos [Git][6], y aunque la consola es muy completa, en el día a día para según que tareas, es mucho mejor a la hora de seguir un historial de commits, ver cambios y hacer mergeos una herramienta gráfica como [SourceTree][7], que es la que uso y recomiendo.

Para estandarizar nuestro código, he decidido crear una serie de reglas a la hora de validar el código Javascript, y una vez validado, el archivo deberá ser formateado de acuerdo a otra serie de reglas, de manera que en el repositorio siempre dispongamos de archivos libres de errores, con un mismo formato y siguiendo el mismo estilo.

La idea es simple, quiero que cada vez que alguien vaya a hacer commit de sus cambios al repositorio, se validen los ficheros Javascript de acuerdo a unas reglas comunes de JSHint, y si el archivo no contiene errores será formateado automáticamente antes del commit al repositorio. La idea es hacerlo automático, así nadie tiene ninguna excusa. Veamos primero como instalar a nivel de proyecto las 2 herramientas.



En primer lugar vamos a <a href="http://jshint.com/install/" target="_blank">instalar JSHint.</a> Podemos instalarlo a nivel global, o a nivel de proyecto, me quedaré con esta última opción, de esa manera podemos disponer en cada proyecto de una configuración especifica de JSHint con las reglas que deseemos aplicar a cada proyecto. Iremos a la consola, y estando en el directorio raíz de nuestro proyecto, ejecutaremos el siguiente comando:

```bash
npm install --save-dev jshint
```

Se creará un directorio llamado `node_modules` donde se instalará JSHint para nuestro proyecto específico. A la hora de definir las reglas para el proyecto, lo mejor será tener un fichero `.jshintrc`, que contenga todas las reglas y esté también en el repositorio, para que si se modifica alguna cosa, todos se actualicen al hacer pull. Hay muchas opciones, están todas explicadas en la <a href="http://jshint.com/docs/options/" target="_blank">documentación oficial</a>, pongo como ejemplo el archivo que he creado para nuestro proyecto:

```js
{
    "evil"      : true,
    "regexdash" : true,
    "browser"   : true,
    "wsh"       : true,
    "trailing"  : true,
    "multistr"  : true,
    "sub"       : true,
    "loopfunc"  : true, 
    "expr"      : true, 
    "jquery"    : true, 
    "newcap"    : true, 
    "plusplus"  : false,
    "curly"     : true, 
    "eqeqeq"    : true, 
    "undef"     : true,
    "eqnull"    : true,
    "globals"   : {
        "jQuery": true,
        "console": true
    }
}
```

A continuación instalaremos js-beautify, también localmente en el proyecto, desde la consola en la raíz del proyecto:

```bash
npm install --save-dev js-beautify
```

Igual que en el caso anterior, crearemos un fichero `.beautifyrc` con las opciones que queremos que se utilicen a nivel de proyecto para formatear los ficheros javascript. Este es el nuestro:

```js
{
    "indent_size": 4,
    "indent_char": " ",
    "indent_level": 0,
    "indent_with_tabs": false,
    "preserve_newlines": true,
    "max_preserve_newlines": 10,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "brace_style": "end-expand",
    "keep_array_indentation": false,
    "keep_function_indentation": true,
    "space_before_conditional": true,
    "break_chained_methods": false,
    "eval_code": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "wrap_attributes": "auto",
    "wrap_attributes_indent_size": 4,
    "end_with_newline": true
}
```

Puedes <a href="https://www.npmjs.com/package/js-beautify" target="_blank">consultar el listado</a> de opciones para añadir/modificar según tus preferencias. Ya está todo listo, ahora simplemente hemos de hacer que automáticamente **al hacer commit, se pase el JSHint a todos los ficheros javascript automáticamente,** y si detecta algún error en alguno de los archivos, no será posible hacer commit, ya que git dará error hasta que no se solucionen. ¿Cómo puede automatizarse este proceso?

A través de lo que se llaman <a href="https://git-scm.com/book/es/v2/Customizing-Git-Git-Hooks" target="_blank">hooks</a>, que no son más que scripts que lanza git automáticamente cuando determinadas acciones ocurren. Puedes ir al directorio .git de tu proyecto, y allí encontrarás una carpeta `hooks` en la que hay scripts de ejemplo con la extensión `.sample`. El que nos interesa para este ejemplo, es el script ejecutado antes de hacer commit, que realizará tareas en el momento que hagamos commit. Para ello simplemente crearemos un archivo llamado `pre-commit`, sin extensión, o bien editaremos el archivo `pre-commit.sample` y modificaremos su nombre. El script que he creado en cuestión es el siguiente:

```bash
#!/bin/sh

# Solo queremos validar y formatear los ficheros Javascript incluidos en el commit
files=$(git diff --cached --name-only --diff-filter=ACM | grep ".js$")

# Si no hay ficheros Javascript se continúa normalmente el commit
if [ "$files" = "" ]; then 
    exit 0 
fi

# Variable que comprueba si todas las validaciones fueron correctas
pass=true

echo "Validando Javascript con JSHint:"

# Recorremos todos los archivos
for file in $files; do

    excluded=false

    # Recorre las líneas del fichero exclude-hook.txt ubicado en el raíz del proyecto
    # en busca de ficheros o patrones a excluir. No interesa formatear y validar por
    # ejemplo, librerías externas como Jasmine, que no tienen por qué seguir la misma
    # guía de estilo de nuestro proyecto.
    while read line || [ -n "$line" ]
    do
        # Coincidencia encontrada. Se excluye el fichero.
        if [ "${file#*$line}" != "$file" ]; then
            echo "Excluido $file"
            excluded=true
            break
        fi

    # '< exclude-hook.txt' es el equivalente a 'cat exclude-hook.txt'
    done < exclude-hook.txt

    if [ "$excluded" = true ]; then
        continue
    fi

    result=$(jshint $file | egrep "error")
    echo $result

    if [ "$result" != "" ]; then
        echo "JSHint fallido: $file"
        echo "$(jshint $file)"
        pass=false
    else
        echo "JSHint validado: $file"
        beautify=$(js-beautify $file -r -P --config .beautifyrc)
        add=$(git add $file)
    fi
done

echo "Validación de Javascript completa"

if ! $pass; then
    echo "Es necesario corregir los errores mostrados por JSHint. Abortando commit."
    exit 1
else
    echo "Validación y formateado satisfactorios."
    exit 0
fi
```

En primer lugar filtraremos los archivos que se están commiteando, y nos quedaremos solo con **los que tienen extensión .js.** Además, en el raíz del repositorio, en un fichero llamado `exclude-hook.txt`, añadiremos patrones, que si son encontrados en las rutas del fichero, hará que se excluya al fichero del proceso. Ficheros que por ejemplo no queremos que sean validados y formateados, librerías externas de terceros, como Jasmine, jQuery, archivos minimizados, etc. Un ejemplo de fichero:

```text
.min.js
jasmine
source/lib
```

De esta manera ignoraremos todo lo que esté en `source/lib`, contenga la palabra `jasmine` o contenga los caracteres `.min.js`.

Iremos pasando fichero por fichero JSHint, si hay algún error se mostrará en la consola, si no hay ningún error en el fichero este se formatea automáticamente, y se hace git add para añadir los cambios hechos en el fichero. Una vez validados todos, comprobaremos si hubo algún error en alguno, si lo hubo saldremos con código 1, que impide que se haga el commit. En caso de que todo esté bien, se sale con código 0 y nuestro commit será enviado al repositorio correctamente.

Debo decir que formatear el código Javascript no es para lo que está pensado el hook `pre-commit`, en él, siendo estrictos, solo deberían llevarse a cabo tareas que no modificasen el código, como son validar el código, ejecución de pruebas unitarias, etc. Por ejemplo este script no funcionaría correctamente, en un caso más avanzado, como sería commitear sólo una parte de un fichero.

Lo ideal sería que cada desarrollador tuviese configurado su editor para formatear el código, pero bueno, en este caso, por el bien de que todos los ficheros tengan la misma guía de estilos, este aspecto representa un mal menor.

Un script de mucha utilidad, que evitará que subamos archivos con errores de sintaxis o de estilo. Puedes ampliar información sobre hooks en la [página de Git][8], o en [Git Hooks][9].

 [1]: https://nodejs.org/
 [2]: https://www.npmjs.com/package/jshint
 [3]: https://www.npmjs.com/package/js-beautify
 [4]: https://www.npmjs.com/package/jscs
 [5]: http://eslint.org/
 [6]: https://git-scm.com/
 [7]: https://www.sourcetreeapp.com/
 [8]: http://git-scm.com/docs/githooks
 [9]: http://githooks.com/
