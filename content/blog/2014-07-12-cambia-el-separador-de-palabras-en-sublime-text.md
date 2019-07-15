---
title: Cambia el separador de palabras en Sublime Text
author: javi
type: post
date: 2014-07-12T18:25:05+00:00
url: /cambia-el-separador-de-palabras-en-sublime-text.html
categories:
  - Sublime Text
tags:
  - sublime

---
Una de las cosas más tontas, pero que descubrí hace poco. Por defecto, Sublime Text tiene definido determinados caráceteres como separador de palabras. El punto, la coma, el signo del dólar, etc. En determinadas ocasiones, para determinados lenguajes (o para todos), podemos querer modificar los carácteres considerados como separador de palabra. Por ejemplo, en CSS, es muy común utilizar en las clases nombres separando las palabras con guiones, es una convención bastante extendida. Creas tu nuevo estilo en CSS, vas a copiarlo y te ves obligado a seleccionarlo ya que con doble click no se selecciona todo.

Es una buena idea por tanto, al menos para CSS eliminar el carácter &#8220;-&#8221; como separador. Para ello, en Sublime vamos al menú  _**Preferences -> Settings &#8211; Default.**_ Y buscamos la siguiente propiedad:

{{< highlight JavaScript >}}
// Characters that are considered to separate words
"word_separators": "./\\()\"'-:,.;<>~!@#$%^&*|+=[]{}`~?",
{{< / highlight >}}

La copiamos, y podemos cambiarla globalmente en _**Preferences -> Settings &#8211; User,**_ o para un lenguaje en específico. En este caso optamos por esta última opción, abrimos un archivo CSS cualquiera, y vamos a **_Preferences -> Settings &#8211; More -> Syntax &#8211; Specific &#8211; User._** Si no has definido ninguna preferencia para el lenguaje específico, aparecerá un archivo vacío. Pegaremos la propiedad y la encerraremos entre llaves de la siguiente manera, eliminando el carácter &#8220;**&#8211;**&#8220;:

{{< highlight JavaScript >}}
{
"word_separators": "./\\()\"':,.;<>~!@#$%^&*|+=[]{}`~?"
}
{{< / highlight >}}

Puedes utilizar un proceso similar para otros lenguajes, por ejemplo si utilizas jQuery en Javascript y/o PHP, puede resultarnos interesante eliminar el carácter &#8220;**$**&#8221; como separador de palabra. Por este tipo de detalles personalizables son por los que me encanta Sublime.
