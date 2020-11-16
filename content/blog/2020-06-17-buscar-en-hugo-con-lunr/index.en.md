---
title: "Search in Hugo with Lunr"
date: 2020-11-16
author: javi
type: post
img: img/hugo-search.png
altImg: Magnifying glass over laptop
tags:
    - hugo
---
¿What is the best way to make a search engine in Hugo? My first attempt was looking for information in the [official documentation][1],
I found some guides and links which helped me, but none of them suited my needs. So I will detail in this guide the solution that
I have developed.

Every guide suggest these 2 possibilities:

-   [Algolia][2]: It´s a service that provides a set of tools that simplify the process of making and integrating a
    full search experience into our sites and applications. It has **an automated crawler to extract content from web sites**.
    It´s a third party service which allows the integration on a static site easily, we just have to use the provided API in front.
    Algolia is used in a lot of different sites but I decided I didn´t want to use
    a third party service.
    
-   [Lunr][3]: Lunr.js is a small, full-text search library for use in the browser. It indexes JSON documents and provides a
    simple search interface for retrieving documents that best match text queries. It allows [fuzzy search][4] that is the technique
    of finding strings that match a pattern approximately (rather than exactly). This is the approach used in this blog.

## Defining the output of our content in JSON format

Having Lunr as Javascript library for fuzzy search we just need the other part in order to complete our search engine: a JSON file
with posts content from the blog. We can define this behaviour in 2 differents ways:


1.  In Hugo global config file, `config.toml` in my case. All the content in Hugo will be available in **HTML** and **RSS** format
    by default if no config is provided. In this site, all the blog articles are under what is called in Hugo as `section`, in 
    `content/blog` path. We can set global JSON output for every section on this way:

{{< highlight go-html-template >}}
[outputs]
section = ["JSON", "HTML", "RSS"]
{{< / highlight >}}

This configuration will output a JSON file for each **section**. For example, if we have another section (_courses_) in addition
to _blog_, each one will have its `index.json` file with the content of the section. This is very powerful and we will be able to make
independent searches for each section. But, How can I tell to Hugo the content and format for that JSON file? We have to create
a `list.json` template file like we have `list.html` for HTML files.

If we want each section file different, inside `layouts` folder and following with this site as example, in a folder called `blog` we must
create a `list.json` file and inside `courses` folder we will create another `list.json` different. However if the format for each
section is going to be the same, we can create `list.json` file inside `_default` folder and it will be used for every section (unless the
section has a `list.json` file that would replace the global in `_default` folder).

Let´s see `list.json` content finally. It just generates an array of posts using Hugo syntax.

{{< highlight go-html-template >}}
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
{{< / highlight >}}

Of course the content is completely customizable, and so the name for each field. In my case I have a reduced number of posts,
so by the moment I put all the content in `content` field, but in the future because of better performarnce I will try to
reduce the JSON file size leaving just title and summary for the search.

2.  Enabling for each _section_ the output format from the front matter. Following with my site as example, I have `_index.md` and
    `_index.en.md` (English version) files in `content/blog` folder. We can enable JSON format on this way:

{{< highlight markdown >}}
---
title: Personal blog
subtitle: Posts written on a variety of topics related to the world of technology and programming.
outputs:
- html
- rss
- json
---
{{< / highlight >}}

The template `list.json` part is exactly the same than at point 1. You can read more about
[custom output formats][5] in Hugo documentation.

## Implementing search engine using lunr with Javascript

Let´s see the code that will allow us to search in the JSON file generated. In my case, I have created a `search.html` file
in `layouts/page`. Let´s check step by step the content. First of all we need and input text for the search term, followed by
a `section` element where search results will be showed.

{{< highlight go-html-template >}}
<label for="search-input">Término de búsqueda</label>
<input type="text" id="search-input" name="search" placeholder="{{i18n "search_loading"}}...">

<section id="search-results"></section>
{{< / highlight >}}

Javascript code is also inside the html file so that we can create dinamyc vars in Javascript with Hugo, for example for
getting translation of strings and getting relative path to `index.json` for each language.

Next step is importing Lunr, in my case in `static/js/` folder:

{{< highlight go-html-template >}}
{{ $lunr := "js/lunr.min.js" | absURL }}

<script src="{{ $lunr }}"></script>

{{< / highlight >}}

It would be possible importing Lunr via CDN:

{{< highlight go-html-template >}}

<script src="https://unpkg.com/lunr/lunr.js"></script>

{{< / highlight >}}

Below is shown the Javascript code that on pageload makes a petition to load `index.json` file and creates indexed
document that will be used to return search results. Searchs will be launched when user is typing in the input field.

{{< highlight go-html-template >}}

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
{{< / highlight >}}

And that´s all. To develop this solution I have followed the guides of [Joseph Earl][6] and [Matt Walters][7]. I have
adapted and updated Javascript code and corrected the method for searching with **Lunr**, beacuse it didn´t work
properly in all cases. This is the most important part, I found [the solution][8] in an issue in Lunr github:


{{< highlight javascript >}}
// Run fuzzy search
const results = idx.query(function(q) {
  q.term(lunr.tokenizer(query.trim()), { usePipeline: true, boost: 100 });
  q.term(lunr.tokenizer(query.trim()) + '*', { usePipeline: false, boost: 10 });
  q.term(lunr.tokenizer(query.trim()), { usePipeline: false, editDistance: 1 });
});
{{< / highlight >}}

You can [take a look to search.html file][9] with the complete code in github and adapt it to your needs.

[1]: https://gohugo.io/tools/search/
[2]: https://www.algolia.com/
[3]: https://lunrjs.com/
[4]: https://en.wikipedia.org/wiki/Approximate_string_matching
[5]: https://gohugo.io/templates/output-formats/
[6]: https://www.josephearl.co.uk/post/static-sites-search-hugo/
[7]: https://www.mattwalters.net/posts/2018-03-28-hugo-and-lunr/
[8]: https://github.com/olivernn/lunr.js/issues/273
[9]: https://github.com/javifm86/hugo-site/blob/master/layouts/page/search.html
