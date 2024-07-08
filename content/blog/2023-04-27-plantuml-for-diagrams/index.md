---
title: 'PlantUML para generar diagramas'
date: 2023-04-18
author: javi
type: post
img: img/plantuml.png
altImg: PlantUML logo
toc: true
tags:
  - react
---

# PlantUML

[PlantUML](https://plantuml.com/) es una aplicación que permite escribir rápidamente diferentes tipos de diagramas (UML y no UML).

En base a unas instrucciones, puedes crear y exportar diagramas a diferentes formatos (png, SVG, etc). Echa un vistazo a la [guía online](https://plantuml.com/guide) para descubrir diferentes opciones para crear diagramas.

Me encanta [la extensión de PlantUML para VSCode](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml), puesto que me permite generar diagramas sin salir del editor.

Es posible instalar la extensión y utilizar el servicio online para crear diagramas, pero por motivos de privacidad, recomendaría instalar el servidor local.

## Ejecutar servidor local para PlantUML

Para poder ejecutar el servidor es necesario seguir los siguientes pasos:

1. Descargar e instalar [Java](http://java.com/en/download/).
1. Instalar [Graphviz](http://www.graphviz.org/download/), necesario para diagramas complejos.

   ```bash
   brew install graphviz
   ```

1. Descarga el fichero `plantuml.jar` desde la [página oficial de Plantum](https://plantuml.com/download) o desde [github releases](https://github.com/plantuml/plantuml/releases/).

Con eso estaría todo. Simplemente ejecuta el siguiente comando en tu consola para tener listo el servidor local:

```bash
java -jar plantuml.jar -picoweb:8000
```

## Ejecutar PlantUML con imagen Docker

Otra alternativa es obtener una imagen de Docker en lugar de instalar localmente.

1. Ejecuta Docker y [descarga la imagen de PlantUML](https://hub.docker.com/r/plantuml/plantuml-server). Puedes hacer pull ejecutando:

   ```bash
   docker pull plantuml/plantuml-server
   ```

1. Ejecuta la imagen, por defecto el contenedor ejecuta el servidor en el puerto 8080. Podrías cambiar al 8000 por ejemplo con el siguiente comando:

   ```bash
   docker run -d -p 8000:8080 plantuml/plantuml-server
   ```

## PlantUML VSCode settings

Éstas son las settings relativas a la extensión PlantUML:

```json
{
  "plantuml.server": "http://localhost:8000",
  "plantuml.render": "PlantUMLServer",
  "plantuml.diagramsRoot": "docs/diagrams/src",
  "plantuml.exportOutDir": "docs/diagrams/out",
  "plantuml.exportSubFolder": false
}
```

## Creando diagramas desde VSCode

Ejecuta el servidor de PlantUML y crea un fichero en `docs/diagrams/src`, `hello.puml` por ejemplo, con este contenido:

```
@startuml hello
Alice -> Bob: test
@enduml
```

Escribe `PlantUml` en la paleta de comandos de VSCode y selecciona `PlantUML: Preview Current Diagram` (o usa el shortcut `Option` + `D`).

Si todo está funcionando correctamente, deberías de ser capaz de visualizar la vista previa para el diagrama.

{{< img src="img/plantUMLPreview.png" alt="PlantUML diagrama de ejemplo." class="mx-auto" >}}

Ahora, escribe y selecciona en la paleta de comandos `PlantUML: Export Current File Diagrams` y exporta el diagrama a `png`, `SVG` o `txt`.
