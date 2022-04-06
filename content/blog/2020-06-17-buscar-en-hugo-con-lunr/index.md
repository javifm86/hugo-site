---
title: "Buscar en Hugo con Lunr"
date: 2020-11-16
author: javi
type: post
img: img/hugo-search.png
altImg: Lupa sobre ordenador portátil
tags:
    - hugo
---

¿Cómo implementar un **buscador con Hugo**? Mi primer impulso fue buscar en la [documentación oficial][1], donde encontré una
serie de links y guías que me permitieron orientarme un poco, pero no terminaba de convencerme ninguna. Asi que en esta guía voy
a detallar cual es la solución que he desarrollado.

En los distintos sitios que encontré guías básicamente las posibilidades eran 2:

-   [Algolia][2]: Es un servicio que se encarga de **rastrear todas las páginas de un sitio web**. De esa manera es capaz de proveer
    una **API** que podremos utilizar para realizar búsquedas en nuestra web. Tiene la ventaja de que al ser un servicio de un tercero,
    facilita la integración en sitios estáticos pues basta con llamar a la API desde el front. Es una opción muy válida y utilizada
    en multitud de sitios, pero en mi caso prefería decantarme por una opción sin depender de servicios de terceros.
-   [Lunr][3]: Lunr es una librería Javascript que permite realizar búsquedas en ficheros con formato JSON. Ofrece una interfaz sencilla pero
    potente para hacer búsquedas en cliente. Permite realizar [fuzzy search][4], que es un algoritmo que permite devolver los resultados más
    relevantes para una búsqueda a pesar de que el término introducido no coincida exactamente. Esta opción es la que he elegido e
    implementado en este blog.

## Definiendo la salida de nuestro contenido en formato JSON

Con Lunr como librería Javascript para realizar fuzzy search tan solo nos falta la otra parte para completar nuestro
buscador: un fichero JSON con el contenido de todos los posts del blog. Para ello podemos definirlo en 2 sitios distintos:

1. En el fichero de configuración global de Hugo, `config.toml` en mi caso. Si no definimos nada, por defecto todo el contenido estará disponible
   en formato **HTML** y **RSS**. En mi caso, tengo todos los artículos del blog en lo que se define en Hugo como una `section`, concretamente en la carpeta
   `content/blog`. Por tanto podría definir de manera global que todas las secciones del sitio también tuvieran como formato de salida JSON de la
   siguiente manera:

```go-html-template
[outputs]
section = ["JSON", "HTML", "RSS"]
```

De esta manera tendríamos un fichero JSON por cada **section**. Si además de _blog_ como es en mi caso, tuviéramos otra sección (_cursos_), cada una
dispondría de su propio fichero `index.json` con el contenido propio de cada sección, lo que nos permitiría poder realizar búsquedas independientes
por cada sección. ¿Cómo indico el contenido y formato de ese fichero JSON? En este caso al igual que disponemos de un template HTML llamado `list.html`
para mostrar el listado de contenidos de una sección, crearemos un fichero `list.json` para generar el JSON.

Si queremos que sean distintos por cada sección, dentro de la carpeta `layouts` y siguiendo con el ejemplo de este sitio, en una carpeta `blog`
crearíamos un fichero `list.json` y en la carpeta `cursos` crearíamos otro `list.json` con contenido distinto. Si el formato del fichero JSON
**va a ser el mismo para cada sección**, podemos crear el fichero `list.json` dentro de la carpeta `_default`, y valdría para todas las secciones
(siempre que la sección no contenga un fichero `list.json`, en cuyo caso prevalecería este último al de `_default`).

Veamos el contenido del fichero `list.json`, que simplemente genera usando sintaxis de Hugo un array de posts.

```go-html-template
[
{{ range $index, $value := where .Site.Pages "Type" "post" }}
{{ if $index }}, {{ end }}
{
"url": "{{ .RelPermalink }}",
"title": "{{ .Title }}",
"content": {{ .Content | plainify | jsonify }},
"summary": "{{.Summary}}"
}
{{ end }}
]
```

El contenido es personalizable, y el nombre de cada campo también. Yo por el momento al tener un número reducido de artículos, tengo
el contenido de cada uno en un campo `content`, pero a futuro con un número grande de artículos por temas de rendimiento sería conveniente reducir
el tamaño del fichero JSON quizás dejando solo el título y el sumario.

2. Se puede activar para cada _section_ el formato de salida desde el front matter. En mi caso, en `content/blog` tengo un fichero `_index.md` e
   `_index.en.md` para el idioma inglés. Desde ahí puedo activar también el formato JSON de la siguiente manera:

```md
---
title: Blog personal
subtitle: Artículos escritos sobre temática variada relacionada con el mundo de la tecnología y la programación.
outputs:
- html
- rss
- json
---
```

La parte del template `list.json` es exactamente igual que en el punto anterior. Puedes leer en la documentación de Hugo
[acerca de la personalización de formato de salida del contenido][5].

## Implementando el buscador usando lunr con Javascript

Una vez tenemos la fuente de datos contra la cual vamos a realizar las búsquedas, veamos el código que nos va a permitir
terminar la implementación del buscador. Yo he decidido poner el buscador simplemente en una página, por lo que en
`layouts/page` he creado un fichero `search.html`. Analicemos parte por parte y simplificando su contenido. Lo primero es el código html
que consta de un input para recoger el término de búsqueda y un elemento `section` donde mostraremos los resultados de la
búsqueda.

```go-html-template
<label for="search-input">Término de búsqueda</label>
<input type="text" id="search-input" name="search" placeholder="{{i18n "search_loading"}}...">

<section id="search-results"></section>
```

En el mismo fichero html se encuentra el código Javascript, ya que no es muy largo y podemos **crear variables dinámicas en
Javascript con Hugo** para obtener los literales multi idioma y la ruta relativa al `index.json` para cada lenguaje.

Importamos Lunr, yo lo tengo en la carpeta `static/js/`:

```go-html-template
{{ $lunr := "js/lunr.min.js" | absURL }}

<script src="{{ $lunr }}"></script>

```

También podría importarse desde CDN:

```go-html-template

<script src="https://unpkg.com/lunr/lunr.js"></script>

```

A continuación, el código javascript que al cargar la página hace una petición para cargar el fichero `index.json` y crea el
documento indexado que posteriormente se utilizará para devolver los resultados de la búsqueda. Las búsquedas se van lanzando
según el usuario va escribiendo en el input.

```go-html-template

<script type="text/javascript">
(function () {
  let idx;
  let documents = [];
  const URL_LIST_POSTS = '{{ "blog/index.json" | relLangURL }}';
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  // Request and index documents
  fetch(URL_LIST_POSTS, {
    method: "get",
  })
    .then((res) => res.json())
    .then((res) => {
      // Create index document with lunr
      idx = lunr(function () {
        this.ref("url");
        this.field("title");
        this.field("content");
        this.field("summary");

        res.forEach(function (doc) {
          this.add(doc);
          documents[doc.url] = {
            title: doc.title,
            content: doc.content,
            summary: doc.summary,
          };
        }, this);
      });

      // Once data is loaded we can register handler
      registerSearchHandler();
    })
    .catch((err) => {
      console.log({ err });
      const errorMsg = '{{ i18n "search_error" }}';
      searchResults.innerHTML = `
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>${errorMsg}</p>
        </div>`;
    });

  ///////////////////////////////////////////////////////////

  function renderSearchResults(results) {
    const noResults = '{{ i18n "search_noCoincidence" }}';
    // If results are empty
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p>${noResults}</p>
        </div>
            `;
      return;
    }

    // Show max 10 results
    if (results.length > 9) {
      results = results.slice(0, 10);
    }

    // Reset search results
    searchResults.innerHTML = "";

    // Append results
    results.forEach((result) => {
      // Create result item
      let article = document.createElement("article");
      article.classList.add("mb-8");
      article.innerHTML = `
        <a href="${result.ref}" class="block group">
          <h2 class="article-title group-hover:text-green-500 pb-1">${documents[result.ref].title}</h2>
          <div class="text-gray-700 dark:text-gray-300"><p>${documents[result.ref].summary}</p></div>
        </a>`;
      searchResults.appendChild(article);
    });
  }

  function registerSearchHandler() {
    // Register on input event
    searchInput.oninput = function (event) {
      if (searchInput.value === "") {
        searchResults.innerHTML = "";
        return;
      }

      // Get input value
      const query = event.target.value;

      // Run fuzzy search
      const results = idx.query(function(q) {
        q.term(lunr.tokenizer(query.trim()), { usePipeline: true, boost: 100 });
        q.term(lunr.tokenizer(query.trim()) + '*', { usePipeline: false, boost: 10 });
        q.term(lunr.tokenizer(query.trim()), { usePipeline: false, editDistance: 1 });
      });

      // Render results
      renderSearchResults(results);
    };

    searchInput.placeholder = '{{ i18n "search_inputPlaceholder" }}';
  }
})();
</script>
```

Y con esto ya tendríamos nuestro buscador finalizado. Para elaborar esta solución he seguido las guías
de [Joseph Earl][6] y [Matt Walters][7]. He adaptado y actualizado el código Javascript y he corregido la manera de lanzar la
búsqueda con **Lunr**, ya que no era del todo precisa y no funcionaba correctamente en todos los casos. Esta es la parte más
importante, y [la solución][8] la encontré en una issue en el github de Lunr:

```js
// Run fuzzy search
const results = idx.query(function(q) {
  q.term(lunr.tokenizer(query.trim()), { usePipeline: true, boost: 100 });
  q.term(lunr.tokenizer(query.trim()) + '*', { usePipeline: false, boost: 10 });
  q.term(lunr.tokenizer(query.trim()), { usePipeline: false, editDistance: 1 });
});
```

Puedes [consultar mi fichero search.html][9] con el código completo en github y adaptarlo para tu caso de uso.

[1]: https://gohugo.io/tools/search/
[2]: https://www.algolia.com/
[3]: https://lunrjs.com/
[4]: https://en.wikipedia.org/wiki/Approximate_string_matching
[5]: https://gohugo.io/templates/output-formats/
[6]: https://www.josephearl.co.uk/post/static-sites-search-hugo/
[7]: https://www.mattwalters.net/posts/2018-03-28-hugo-and-lunr/
[8]: https://github.com/olivernn/lunr.js/issues/273
[9]: https://github.com/javifm86/hugo-site/blob/master/layouts/page/search.html
