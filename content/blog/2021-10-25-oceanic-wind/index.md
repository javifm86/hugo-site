---
title: "Oceanic Wind para VSCode"
date: 2021-11-02
author: javi
type: post
img: img/oceanic-wind.png
altImg: Oceanic Wind theme para VSCode
tags:
    - vscode
    - theme
---
{{< img src="img/logo.png" alt="Oceanic Wind logo." class="mx-auto md:float-left pr-2" >}}
He creado un theme oscuro para VSCode llamado **Oceanic Wind**, pero, ¿por qué? Bueno, he estado usando el tema Oceanic Next durante años, la primera vez que lo utilicé fue con Sublime Text, y quería modificarlo.


Está basado en las combinaciones de color de [Oceanic Next](https://github.com/voronianski/oceanic-next-color-scheme) pero reemplazando y personalizando con [la paleta de colores de Tailwind CSS](https://tailwindcss.com/docs/customizing-colors).

Soy una persona que necesita tiempo para adaptarse a los cambios, y, desde que cambié a VSCode no había demasiados temas basados en Oceanic Next (ahora parece que hay bastantes más). Sentía que el que estaba usando no me terminaba de convencer asi que pensé que crear un tema basado en esos colores pero con buen contraste podría ser divertido.

Cuando empecé a crear el tema no sabía que existían tantas posibilidades y colores para personalizar VSCode. Decidí que personalizaría cada color que pudiera encontrar, en la mayoría de los casos simplemente reemplazaba el color por defecto de VSCode por uno de la paleta de Tailwind.

## Creando tu propio theme
Si quieres crear tu propio tema puedes seguir [los pasos de la guía oficial de Visual Studio Code](https://code.visualstudio.com/api/extension-guides/color-theme#create-a-new-color-theme). Esto es lo que hice:

Primero, instalar la extensión para Yeoman para generar extensiones de VSCode, y ejecutarla:

{{< img src="img/yo.png" alt="Opciones del generador de Yeoman." >}}

```bash
npm install -g yo generator-code
yo code
```

Selecciona `New color theme` y `No, start fresh`. Rellena los campos que te pide como nombre e identificador, y selecciona un punto de partida para crear tu theme, en mi caso **Dark theme**. Ya puedes abrir el directorio con VSCode:

```bash
cd your-theme
code .
```

Para probar el tema, simplemente pulsa `F5` y se abrirá una nueva ventana en la que puedes ver el resultado.

La [documentación oficial](https://code.visualstudio.com/api/references/theme-color) es la perfecta guía de referencia. Como podrás comprobar, hay montones de colores disponibles, en ocasiones encontrar el color al que se refieren puede ser difícil a pesar de la descripción. Hay unos cuantos que no pude encontrar.

## Encontrando colores
Pulsa `Ctrl + Shift + P` y teclea `Inspect Editor Tokens and Scopes`. Ahora puedes pulsar en cualquier parte del código y aparecerá un pop-up donde aparece información útil como tipo de fuente y scope de la regla seleccionada. También puedes consultar el ratio de contraste del color, **yo siempre intento obtener 4.5 como mínimo**.

{{< img src="img/scopes.png" alt="VSCode información del scope del nodo seleccionado: lenguaje, tipo de token, color foreground, background, ratio de contraste." >}}

VSCode dispone de developer tools que puedes utilizar para inspeccionar elementos. Pulsa `Ctrl + Shift + P` y teclea `Toggle Developer Tools` para abrirlas.

{{< img src="img/devtools.png" alt="Inspeccionando con VSCode devtools para obtener un color." >}}

Muy útil si quieres obtener rápidamente un color de algún tema que estás consultando para obtener inspiración. Al comenzar a crear el tema éste era el método que utilizaba para obtener el color por defecto de cualquier cosa en VSCode, pero hay algunos elementos que son difíciles de inspeccionar como el mini mapa.

Finalmente, opté por buscar los colores por defecto en el [repositorio de VSCode en Github](https://github.com/microsoft/vscode). Simplemente busca el color que quieras en el buscador (sin poner el punto), por ejemplo `activityBar inactiveForeground`, e indaga entre los distintos resultados hasta obtener el color que usan.

He creado un [gist con todos los colores oscuros por defecto en VSCode](https://gist.github.com/javifm86/073d8e05942a8849dd11fa6996955fc0), algunos valores no son 100% exactos ya que en el código fuente se ve que usan las funciones `darken` o `lighten`, o también pueden aplicar transparencia a un color que ya tenía transparencia. Te ahorrará mucho tiempo, no encontré en un ningún sitio un listado con los colores por defecto utilizados.

## Color de acento
Se pueden sobrescribir colores para un tema en las settings de VSCode. He creado differentes esquemas de colores para cambiar el color de acento en VSCode. Si alguien desea probar con otro color en lugar del azul por defecto, puede utilizar estas combinaciones:

- [Indigo](https://github.com/javifm86/oceanic-wind/blob/main/customize/indigo.md)
- [Green](https://github.com/javifm86/oceanic-wind/blob/main/customize/green.md)
- [Rose](https://github.com/javifm86/oceanic-wind/blob/main/customize/rose.md)
- [Teal](https://github.com/javifm86/oceanic-wind/blob/main/customize/teal.md)
- [Fuchsia](https://github.com/javifm86/oceanic-wind/blob/main/customize/fuchsia.md)
- [Amber](https://github.com/javifm86/oceanic-wind/blob/main/customize/amber.md)
- [Esmerald](https://github.com/javifm86/oceanic-wind/blob/main/customize/esmerald.md)
- [Sky](https://github.com/javifm86/oceanic-wind/blob/main/customize/sky.md)

He realizado pruebas de contraste de color para los distintos esquemas, no debería haber ningún gran problema de contraste. Tengo pendiente revisarlo porque no he comprobado con las versiones **Warm** y **Cool** del tema.

## Creando a partir de una paleta de colores definida
Una vez terminé el tema, **podía fácilmente generar numerosas variantes**. Simplemente reemplazando el gris con los 5 distintos tipos de gris de Tailwind, podría generar 40 distintas variantes (8 colores de acento x 5 tipos de gris = 40). Esto es solo una posibilidad, decidí utilizar el gris neutro para la versión por defecto, el gris cálido para la versión cálida y el gris azul para la fría.

He querido evitar ensuciar el selector de themes de VSCode con más de 40 distintas versiones, había que elegir asi que finalmente dejé 3 versiones con el azul como color de acento, y si alguien desea personalizar más puede copiar y pegar la configuración de los distintos colores de acento. ¡Es tan fácil generar variantes cuando dispones de una paleta de colores!


## Testeando
La forma por defecto de testear un theme puede resultar insuficiente en algunos casos. Para ello puedes utilizar un truco: **Copia tu directorio con todos los archivos de la extensión en el directorio `.vscode`**. Por ejemplo en Windows:
```
C:\Users\your-user\.vscode
```
De esta forma puedes activar localmente tu tema y probarlo en el workspace que desees.

Puedes hacer cambios directamente en el directorio del tema, pero **necesitarás reiniciar la instancia de VSCode** para poder ver los cambios (puedes pulsar `Ctrl + Shift + P` y escribir `Reload window`).

Además puedes modificar las settings de usuario, y sobrescribir los colores de tu tema para poder ver en caliente los cambios realizados. ¡Esto ahorra mucho tiempo!

## Conclusión
Cuando termines puedes [seguir la guía oficial](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) para publicar tu theme.

He basado y probado este tema en mi workflow diario, con HTML, CSS, Javascript, Typescript y desarrollando con los principales frameworks, Angular, Vue y React. Adicionalmente he probado con los ficheros que se pueden encontrar en el [directorio demo](https://github.com/javifm86/oceanic-wind/tree/main/demo) (gracias a [Wes Bos](https://twitter.com/wesbos) y [Sarah Drasner](https://twitter.com/sarah_edo)).

Si encuentras algo raro, tienes una sugerencia o mejora, por favor siéntete libre de abrir una [issue](https://github.com/javifm86/oceanic-wind/issues). Estoy seguro de que me he dejado alguna cosa.

No soy diseñador así que cualquier feedback recibido sería genial.

* [Oceanic Wind en Marketplace](https://marketplace.visualstudio.com/items?itemName=javifm.oceanic-wind)
* [Repositorio Github](https://github.com/javifm86/oceanic-wind)
* [Colores oscuros por defecto en VSCode](https://gist.github.com/javifm86/073d8e05942a8849dd11fa6996955fc0)
