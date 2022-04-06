---
title: "Responsive images in Hugo"
date: 2021-04-12
author: javi
type: post
img: img/responsive.jpg
altImg: Laptop, tablet and smartphone on a desktop
tags:
    - hugo
---
In this post I will share a very useful shortcode that will allow us processing images automatically with Hugo. First of all, we must
be sure that our content is structured in [Hugo´s page bundles][1]. When I created my blog, I migrated from wordpress and all articles
were named like this:
<pre>
responsive-images-hugo
 - responsive-images-hugo.md
using-tailwindcss-with-angular
 - using-tailwindcss-with-angular.md
</pre>
And all the images were placed inside `/static` folder. That structure will not be recognized by Hugo as page bundles so I had to reorganize
every post. A very basic summary for page bundles:
-   `_index.md` files are considered index of a section and `list.html` template will be used.
-   `index.md` (or `index.en.md`, `index.es.md`) files are considered index of a page/post and `single.html` template will be used.

Now the structure for each post is:

<pre>
responsive-images-hugo
 - index.md
 - index.en.md
 img
  - img1.jpg
  - ...
</pre>

The next step is creating a file for the shortcode, I created in `layouts/shortcodes/img.html` with this code:
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

This way we will be able to use in markdown files the shortcode:
```go-html-template
{{</* img src="img/img1.jpg" alt="Description for image" */>}}
```

And that´s all, you use the image as if you were in html and the shortcode and Hugo will generate images smaller when necessary. This
solution comes from [Laura Kalbag][2], I just modified a little bit her code. I take this opportunity to recomendate her
book [Accessibility For Everyone][3].

[1]: https://gohugo.io/content-management/page-bundles/
[2]: https://laurakalbag.com/processing-responsive-images-with-hugo/
[3]: https://abookapart.com/products/accessibility-for-everyone
