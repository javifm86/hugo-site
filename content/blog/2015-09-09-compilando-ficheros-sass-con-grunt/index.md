---
title: Compilando ficheros Sass con grunt
author: javi
type: post
date: 2015-09-09T13:50:35+00:00
tags:
  - css
  - grunt
  - node
  - sass

---

{{< img src="img/grunt-sass.png" alt="Grunt y Sass" >}}

A lo largo de los 2 últimos años, he ido poco a poco **mejorando mi nivel de productividad** en el trabajo. Primero cambié mi editor de toda la vida, [Notepad++][1] por [Sublime Text][2]. Y posteriormente, he ido añadiendo diferentes herramientas que proporciona **Node.js**, para automatizar distintos procesos y tareas, como ejecución de tests, linters de código, minimizado de Javascript y CSS, etc&#8230;

Para automatizar más aún todos estos procesos, está [Grunt][3], que dispone de plugins fáciles de integrar en nuestros proyectos, para realizar todo tipo de tareas que precisemos en nuestro proyecto. En mi proyecto actual, surgió una necesidad a un compañero de proyecto, que se encarga de la maquetación de la aplicación que estamos desarrollando.

Para ello está utilizando [Sass][4], uno de los preprocesadores CSS más populares actualmente. Por motivos de simplicidad de código y maximizar la compatibilidad con navegadores no muy modernos (mantenemos soporte a navegadores webKit antiguos, que usan algunas Smart TV anteriores a 2013), a la hora de hacer los elementos reutilizables de la aplicación con Javascript, decidimos que en lugar de que cada widget cargue su hoja de estilos, **tener todo el CSS de todos los widgets unificados en un mismo fichero que esté cargado desde el principio** (controlar cuando se ha cargado una hoja de estilos, de manera simple y compatible con todos los navegadores es una tarea que [ni RequireJS ha incluido en su cargador de módulos][5]).

Grunt y sus plugins son instalados y gestionados a través de **NPM**, el gestor de paquetes por consola para [Node.js][6]. Asi que si no lo tienes ya, el primer paso es instalar [Node.js][7]. Acto seguido, nos dirigiremos a la consola, e instalaremos Grunt globalmente (seguramente necesites sudo en Linux):

```bash
npm install -g grunt-cli
```

Ya podemos ir a la carpeta donde está nuestro proyecto (`cd ruta/proyecto/`). Deberemos tener nuestro fichero `package.json` creado, con el nombre del proyecto, descripción y otros datos importantes. Si no lo tienes creado, desde consola, estando en el directorio raíz del proyecto, puedes ejecutar `npm init`, y se irán pidiendo datos para crear el fichero, o puedes crearlo directamente con tu editor de texto, con esto bastaría a priori:

```js
{
  "name": "Nombre del proyecto",
  "version": "1.0.0"
}
```

Una vez hecho esto, ya podemos proceder a instalar grunt de manera local en nuestro proyecto. Simplemente iremos a la carpeta de nuestro proyecto, y en ella ejecutaremos el siguiente comando:

```bash
npm install grunt --save-dev
```

Observaremos que se instala correctamente, y veremos que en el fichero `package.json` aparece una nueva clave llamada `devDependencies`, y aparece grunt:

```js
{
  "name": "Nombre del proyecto",
  "version": "1.0.0",
  "devDependencies": {
    "grunt": "^0.4.5"
  }
}
```

Además, en la raíz, está la carpeta `node_modules`, donde se irán instalando todos los módulos que tenemos como dependencias para nuestro proyecto. Esto facilita que si nos llevamos el proyecto a otro ordenador, o se lo enviamos a alguien, simplemente situándonos en consola en la raíz del proyecto, podremos ejecutar `npm` e inmediatamente se instalarán todas las dependencias necesarias para el proyecto. ¿Interesante no?

Una vez aclarado como instalar grunt, y como funcionan de manera básica las dependencias, procederemos a instalar dos plugins para grunt, [grunt-contrib-sass][8], para compilar Sass y [grunt-contrib-watch][9], que nos permite tener una tarea activa, vigilando que determinados ficheros (en este caso los que tienen extensión `.scss`) cambien, para, en ese momento, ejecutar una determinada tarea. Ejecutamos, sin importar el orden estos comandos para instalar las nuevas dependencias:

```bash
npm install grunt-contrib-sass --save-dev
npm install grunt-contrib-watch --save-dev
```

Ya está todo listo, ahora solo tenemos que crear nuestras tareas grunt. Para ello, en el raíz del proyecto, junto al fichero `package.json`, crearemos un fichero llamado `gruntfile.js`, donde definiremos la configuración de las distintas tareas, luego cargaremos los paquetes a usar en las tareas y por último registraremos las tareas. Para nuestro propósito, el fichero quedaría así:</code>

```js
// Función contenedora
module.exports = function( grunt ) {

    // Configuración de las tareas
    grunt.initConfig( {

        /*
         *  Se observan dentro de la carpeta source,
         *  todos los ficheros con extensión scss.
         *  Cuando se produzca un cambio en alguno de
         *  ellos se ejecutará la tarea sass, definida
         *  más abajo.
         */
        watch: {
            scripts: {
                files: 'source/**/*.scss',
                tasks: [ 'sass' ],
                options: {
                    interrupt: true,

                    /*
                     *  Importante la opción spawn a false,
                     *  para permitir cambiar el contexto de
                     *  la tarea.
                     */
                    spawn: false
                },
            },
        },

        /*
         *  Dentro de la tarea sass, tenemos dos subtareas:
         *  - dist: compila el fichero main.scss siempre
         *    que se produzca un cambio en cualquier scss. El
         *    fichero main.scss, contiene imports del resto de
         *    ficheros, cada vez que se toca alguno debe de
         *    actualizarse este.
         *    
         *  - changed: Tal cual está definida, compilaría todos
         *    los ficheros del proyecto, pero posteriormente con
         *    un evento vamos a modificar el parámetro files, y
         *    es indiferente lo que contenga inicialmente.
         */
        sass: {
            dist: {
                files: {
                    'source/styles/main.css': 'source/styles/main.scss'
                },
                options: {
                    noCache: true
                }
            },
            changed: {
                files: [ {
                    src: [ 'source/**/*.scss' ],
                    ext: '.css'
                } ],
                options: {
                    noCache: true
                }
            }

        }

    } );

    /*
     *  A continuación, podemos escuchar el evento watch, que recibe
     *  información acerca del fichero que ha sido modificado.
     */
    grunt.event.on( 'watch', function( action, filepath, target ) {

        // Reemplazamos .scss por .css, para indicar el destino
        var _destiny = filepath.replace( ".scss", ".css" ),
            _file = {};

        /*
         *  Creamos un objeto, para sobrescribir el parámetro file de
         *  la subtarea changed.
         */
        _file[ _destiny ] = filepath;

        grunt.log.writeln( 'Compilando Sass del fichero cambiado: ' + filepath );

        /*
         *  Sobrescribimos el parámetro de configuración, para que solo
         *  se compile el fichero modificado.
         */
        grunt.config( 'sass.changed.files', _file );

    } );

    // Cargamos los plugins grunts necesarios
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-sass' );

    /*
     *  Registramos como tarea por defecto la tarea watch. Cuando en la
     *  consola, estando en el proyecto, pongamos grunt, por defecto se
     *  lanzará la tarea que registremos como default. Podríamos registrar
     *  otra, en cuyo caso tendríamos que poner el comando grunt watch,
     *  para decirle a grunt que ejecuta la tarea watch.
     */
    grunt.registerTask( 'default', [ 'watch' ] );

};
```

Ya simplemente hemos de dirigirnos a la consola, y ejecutar **`grunt`**, ya que la tarea watch ha sido añadida por defecto, o bien `grunt watch` y se lanzará el proceso que estará observando los cambios producidos en los ficheros scss de nuestro proyecto, para acto seguido lanzar la tarea.

De esta manera **nuestros ficheros Sass son compilados automáticamente**, muy útil si nuestro editor de texto no dispone de un plugin que automatice el proceso y queremos evitar tener que estar compilando manualmente desde la consola.

* [Primeros pasos con grunt][10]
* [Configurando tareas][11]

 [1]: https://notepad-plus-plus.org/
 [2]: http://www.sublimetext.com/
 [3]: http://gruntjs.com/
 [4]: http://sass-lang.com/
 [5]: http://requirejs.org/docs/faq-advanced.html#css
 [6]: https://nodejs.org/
 [7]: https://nodejs.org/en/download/
 [8]: https://github.com/gruntjs/grunt-contrib-sass
 [9]: https://github.com/gruntjs/grunt-contrib-watch
 [10]: http://gruntjs.com/getting-started
 [11]: http://gruntjs.com/configuring-tasks
