---
title: 'PlantUML for generating diagrams'
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

[PlantUML](https://plantuml.com/) is an application that allows you to quickly write different kind of diagrams (UML and non-UML).

Based on some instructions, you can build and export diagrams to different formats (png, SVG, etc). Check the [online guide](https://plantuml.com/guide) to discover the different options for creating diagrams.

I love the [PlantUML extension for VSCode](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) for generating diagrams without leaving my code editor.

It is possible to install the extension and use the online server for create diagrams, but for privacy reasons the recommended approach is installing locally the server.

## Run PlantUML server locally

To be able to run the server you have to follow these steps:

1. Download and install [Java](http://java.com/en/download/).
1. Install [Graphviz](http://www.graphviz.org/download/), necessary for some complex diagrams.

   ```bash
   brew install graphviz
   ```

1. Download the file `plantuml.jar` from [Plantum official page](https://plantuml.com/download) or from [github releases](https://github.com/plantuml/plantuml/releases/).

Now you are ready to go! Just simply execute the following in the command line to run the server:

```bash
java -jar plantuml.jar -picoweb:8000
```

## Run PlantUML with Docker image

It is possible getting a Docker image instead of installing locally.

1. Open Docker and [download the PlantUML server image](https://hub.docker.com/r/plantuml/plantuml-server). You can pull it executing:

   ```bash
   docker pull plantuml/plantuml-server
   ```

1. Run the image, by default the container image runs in 8080 port. You can use for example port 8000 with the following command:

   ```bash
   docker run -d -p 8000:8080 plantuml/plantuml-server
   ```

## PlantUML VSCode settings

These are the settings related to PlantUML extension:

```json
{
  "plantuml.server": "http://localhost:8000",
  "plantuml.render": "PlantUMLServer",
  "plantuml.diagramsRoot": "docs/diagrams/src",
  "plantuml.exportOutDir": "docs/diagrams/out",
  "plantuml.exportSubFolder": false
}
```

## Creating diagrams from VSCode

Run the Plantum server locally and create a new file under `docs/diagrams/src` folder, `hello.puml` for example, with this content:

```
@startuml hello
Alice -> Bob: test
@enduml
```

Write `PlantUml` at VSCode command palette and select `PlantUML: Preview Current Diagram` (or press `Option` + `D` keystroke).

If everything is working as expected, you should be able to see the preview for the diagram.

{{< img src="img/plantUMLPreview.png" alt="Plantuml diagram example." class="mx-auto" >}}

Now, you can write and select in the command palette `PlantUML: Export Current File Diagrams` and export the diagram to `png`, `SVG` or `txt`.
