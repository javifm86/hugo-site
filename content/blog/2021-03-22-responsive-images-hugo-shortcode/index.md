---
title: "Imágenes responsive en Hugo"
date: 2021-04-12
author: javi
type: post
img: img/responsive.jpg
altImg: Portátil, tables y smartphone sobre un escritorio
tags:
    - hugo
---
En este post voy a compartir un shortcode muy útil que nos permitirá **procesar automaticamente las imágenes con Hugo**. Antes de nada
debemos asegurarnos de que nuestro contenido se encuentra estructurado con [Hugo´s page bundles][1]. Al crear este blog, lo migré de
un Wordpress y todos los artículos estaban estructurados de la siguiente manera:
<pre>
responsive-images-hugo
 - responsive-images-hugo.md
using-tailwindcss-with-angular
 - using-tailwindcss-with-angular.md
</pre>
Y todas las imágenes se encontraban en el directorio `/static`. Con esa estructura Hugo no reconocerá nuestro contenido como un bundle,
así que tuve que reorganizar todos los posts. A continuación un resumen muy breve de los bundles en Hugo:
-   Los archivos `_index.md` son considerados índices de una sección y se utilizará el template `list.html` para ellos.
-   Los archivos `index.md` (o `index.en.md`, `index.es.md`) se consideran índices de una página/post y se utilizará el 
template `single.html`.

Después de estos cambios la estructura queda así:

<pre>
responsive-images-hugo
 - index.md
 - index.en.md
 img
  - img1.jpg
  - ...
</pre>

El siguiente paso es crear un archivo para el shortcode, yo lo creé en `layouts/shortcodes/img.html` con el siguiente código:
```go-html-template
{{/* Get file that matches the filename as specified as src="" in shortcode */}}
{{ $src := .Page.Resources.GetMatch (printf "*%s*" (.Get "src")) }}

{{/* Set image sizes, these are hardcoded for now, x dictates that images are resized to this width */}}

{{ $tinyw := default "500x" }}
{{ $smallw := default "800x" }}
{{ $mediumw := default "1200x" }}
{{ $largew := default "1500x" }}

{{/* Initialize variables */}}
{{ $tiny := "" }}
{{ $small := "" }}
{{ $medium := "" }}
{{ $large := "" }}

{{/* Resize the src image to the given sizes if necessary */}}
{{ if ge $src.Width "500" }}
{{ $tiny = $src.Resize $tinyw }}
{{ end }}

{{ if ge $src.Width "800" }}
{{ $small = $src.Resize $smallw }}
{{ end }}

{{ if ge $src.Width "1200" }}
{{ $medium = $src.Resize $mediumw }}
{{ end }}

{{ if ge $src.Width "1500" }}
{{ $large := $src.Resize $largew }}
{{ end }}

  <img
    class='mb-6 {{ with .Get "class" }}{{.}}{{ end }}'
    srcset='
    {{ with $src.RelPermalink }}{{.}} {{$src.Width}}w{{ end }}
    {{ if ge $src.Width "500" }}
      {{ with $tiny.RelPermalink }},{{.}} 500w{{ end }}
    {{ end }}
    {{ if ge $src.Width "800" }}
      {{ with $small.RelPermalink }}, {{.}} 800w{{ end }}
    {{ end }}
    {{ if ge $src.Width "1200" }}
      {{ with $medium.RelPermalink }}, {{.}} 1200w{{ end }}
    {{ end }}
    {{ if ge $src.Width "1500" }}
      {{ with $large.RelPermalink }}, {{.}} 1500w {{ end }}
    {{ end }}'
    src="{{ $src.RelPermalink }}"
    width="{{ $src.Width }}" height="{{ $src.Height }}"
    {{ with .Get "alt" }}alt='{{.}}'{{ end }}>

```

De esta manera seremos capaces de usar en los archivos markdown para los artículos el shortcode:
```go-html-template
{{</* img src="img/img1.jpg" alt="Description for image" */>}}
```

Y eso es todo, usas la imagen como si estuvieras en html y gracias al shortcode y Hugo se generarán imágenes más pequeñas
cuando sea necesario. El crédito de esta solución es de [Laura Kalbag][2], yo simplemente modifiqué un poco su código. Aprovecho
para recomendar su libro [Accessibility For Everyone][3], es una buena introducción para accesibilidad.

[1]: https://gohugo.io/content-management/page-bundles/
[2]: https://laurakalbag.com/processing-responsive-images-with-hugo/
[3]: https://abookapart.com/products/accessibility-for-everyone
