---
title: 'Setup inicial para mac'
date: 2024-06-27
author: javi
type: post
img: img/apple.png
altImg: Logo de Apple
toc: false
tags:
  - mac
---

# Setup inicial para mac

Finalmente he decido comprarme Mac, concretamente el Mac Mini M2 Pro. Además, en el trabajo voy a cambiar a un MacBook Pro. NPor tanto es hora de adecuar el sistema operativo a mi gusto.

## Configuración del sistema

- `Mouse > Natural scrolling` deshabilitado.
- `Keyboard` Repetición de tecla a lo más rápido posible y y retardo hasta repetir a corto.
- `Keyboard > Keyboard shortcuts > Input sources` deshabilito ambos shortcuts, no los necesito y uno de ellos coincide con uno de VSCode.
- `Keyboard > Keyboard shortcuts > Services > Text` disable `Convert text to Simplified chinese and traditional`, quiero estas combinaciones para algo más útil.
- Deshabilitar ApplePressAndHoldEnabled, una configuración que impide que al mantener una tecla pulsada se repita ese carácter multiples veces. Para ello ejecutar en la terminal: `defaults write -g ApplePressAndHoldEnabled -bool false`. Mismo comando con `true` para revertir el cambio.

## Finder

Finder es el explorador de archivos para Mac. Cambiaré estas configuraciones:

- Cambiar la vista por la de `listas` y añadir la columna de fecha de modificación.
- En `View` activo `Show path bar` y `Show status bar`.
- Arrastro a la izquierda mis carpetas más utilizadas en el día a día, como por ejemplo `Github`.
- En `View`, ir a `Customize toolbar` y eliminar cosas que no utilizo como tags, groups, etc.
- `Finder > Settings > Advanced` y seleccionar **Current folder** para el campo `When performing a search`.

## Configuración del Dock

Botón derecho en una parte vacía del dock y seleccionar `Dock settings`:

- Activar minimizar aplicación en su icono.
- Deshabilitar `Show suggested and recent apps in dock`.

## Aplicaciones a instalar

Normalmente instalo estas aplicaciones:

- [Shottr](https://shottr.cc/): Aplicación gratuita para tomar pantallazos y hacer rápidas anotaciones.
- [Warp](https://www.warp.dev/): Terminal mejorada, con AI incluida.
- [Oh My Zsh](https://ohmyz.sh/): Framework para personalizar la terminal zsh.
- [Macpass](https://macpassapp.org/): Cliente para KeePass en mac, gestor de contraseñas.
- [Colorslurp](https://colorslurp.com/): Color picker. Me encanta que al pulsar Ctrl + click mientras te mueves se activa el modo alta precisión.
- [VSCode](https://code.visualstudio.com/download): Mi editor de texto favorito para desarrollo.
- [Firefox](https://www.mozilla.org/es-ES/firefox/new/), [Chrome](https://www.google.com/intl/es_es/chrome/), [Responsively](https://responsively.app/): Navegadores.
- [Logi Options+](https://www.logitech.com/es-es/software/logi-options-plus.html): Software para mi ratón y teclado.
- [ChatGPT](https://openai.com/chatgpt/mac/): La herramienta de AI más famosa.
- [HyperKey](https://hyperkey.app/): Convierte la tecla `Bloq. Mayús` or any other unused key to the hyper key, a combination of these 4 keys: `⌃⌥⌘⇧`. More information below.
- [Raycast](https://www.raycast.com/): Spotlight con extensiones y más opciones. Amplío información más adelante.
- [DevToys](https://github.com/DevToys-app/DevToysMac): Navaja de herramientas para desarrolladores para macOS.
- [GIMP](https://www.gimp.org/downloads/): Edición de imágenes open source.
- [Rectangle PRO](https://rectangleapp.com/pro): Manejo de ventanas avanzado para mac con mi funcionalidad favorita, App layouts.

### Hyperkey

[HyperKey](https://hyperkey.app/) es una aplicación muy sencilla que puede implicar todo un cambio a la hora de manejar los atajos de teclado. Te permite mapear la poco usada tecla `Bloq. Mayús` (o otra a tu elección) para ejecutar la combinación `⌃⌥⌘⇧`. Esta combinación es muy raramente usada en atajos de teclado, por lo que es ideal para crear tus propios atajos de teclado evitando colisión con los de otras aplicaciones.

Además, la tecla `Bloq. Mayús` continuará funcionando como siempre si la pulsas rápidamente. Esta es la configuración que uso para Hyperkey:

![Configuración Hyperkey](img/hyperkey.png 'Configuración Hyperkey')

Si quieres conseguir la misma personalización o ir más allá, puedes utilizar [Karabiner](https://karabiner-elements.pqrs.org/). Karabiner es una aplicación muy poderosa que te permite personalizar tu teclado en macOS. Hay un motón de locas combinaciones y cosas que puedes lograr, yo por simplicidad de momento estoy utilizando Hyperkey.

### Raycast

[Raycast](https://www.raycast.com/) es una aplicación que es una versión mejorada de la nativa Spotlight. En mi opinión Raycast implementa algunas de las funcionalidades que más se echan de menos en Mac de manera nativa, gestión de clipboard, manejo de ventanas y un montón de cosas que puedes añadir en forma de plugins.

Lo primero que hago es mapear Raycast al atajo por defecto de Spotlight, `Command + Space`. Para conseguir esto hay que ir a `Preferences > Keyboard > Shortcuts > Spotlight` y deshabilitar el atajo de teclado. Luego en la configuración de Raycast grabas el atajo de teclado utilizando `Command + Space` y ya estaría listo.

Algunas extensiones que utilizo:

- Colorslurp.
- Google translate.
- Ruler.
- GIF Search.
- Lorem Ipsum.
- Change case.
- ray.so
- brew

## Shortcuts

Atajos de teclado predefinidos y otros creamos por mí mismo para mejorar mi productividad.

### Manejo de aplicaciones

- `⌘ + M`: Minimizar
- `⌃ + ⌘ + F`: Activar/desactivar el modo pantalla completa
- `⌘ + W`: Cerrar ventana de la aplicación
- `⌘ + Q`: Matar aplicación
- `⌘ + H`: Esconder aplicación
- `⌥ + ⌘ + H`: Esconder todas las aplicaciones excepto la actual
- `⌥ + ⌘ + W`: Cierra todas las ventanas para una aplicación
- `⌥ + ⌘ + ESC`: Ventana que permite forzar el cierre de aplicaciones
- `F11`: Mostrar escritorio

### Screenshots

- `⌘ + ⌃ + 1`: Capturar pantalla (Shottr)
- `⌘ + ⌃ + 2`: Capturar area (Shottr)
- `⌘ + ⌃ + 3`: Capturar pantalla (Nativo)
- `⌘ + ⌃ + 4`: Capturar area (Nativo)
- `⌘ + ⌃ + 5`: Capturar video (Nativo)

### Manejo de ventanas

Atajos de teclado custom definidos en Raycast o Rectangle:

- `⌘ + ⌥ + Left`: Mover a la izquierda (rota entre 1/3, 2/3...)
- `⌘ + ⌥ + Right`: Mover a la derecha (rota entre 1/3, 2/3...)
- `⌘ + ⌥ + Up`: Mover arriba (rota entre 1/3, 2/3...) Nota: Conflicto con atajo de teclado en VSCode
- `⌘ + ⌥ + Down`: Mover abajo (rota entre 1/3, 2/3...) Nota: Conflicto con atajo de teclado en VSCode
- `⌘ + ⌥ + C`: Centrar (rota entre 1/3, 2/3...)
- `⌃ + ⌘ + ⌥ + C`: Centrar ventana
- `⌘ + ⌥ + F`: Maximizar
- `⌘ + ⌥ + Del`: Restaurar
- `⌘ + ⌥ + +`: Agrandar
- `⌘ + ⌥ + -`: Empequeñecer

### Historial del Clipboard

- `⌃ + ⌥ + V`: Historial del portapapeles Raycast

### Atajos de teclado con Hyper key

- `⌃ + ⌥ + ⌘ + ⇧ + F`: Firefox
- `⌃ + ⌥ + ⌘ + ⇧ + C`: Chrome
- `⌃ + ⌥ + ⌘ + ⇧ + V`: VSCode
- `⌃ + ⌥ + ⌘ + ⇧ + W`: Warp
- `⌃ + ⌥ + ⌘ + ⇧ + S`: Slack
- `⌃ + ⌥ + ⌘ + ⇧ + Enter`: Confetti (extensión de Raycast)
