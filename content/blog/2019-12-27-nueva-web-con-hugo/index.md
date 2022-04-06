---
title: 'Nueva web con Hugo'
img: img/gohugoio.png
altImg: Hugo, generador estático de contenidos
author: javi
type: post
date: 2019-12-27T12:04:01+01:00
tags:
  - hugo
  - tailwindcss
---
Estreno nueva web con un **propósito: volver de nuevo a la actividad de mi blog personal** en el que crear de vez en
cuando algún artículo, donde tener a mano tutoriales con las nuevas cosas que voy aprendiendo.

Atrás queda mi antiguo blog construido con Wordpress. Siempre quise diseñar mi propio sitio desde cero y finalmente lo
he hecho. A través de este y los próximos artículos voy a resumir algunas de las cosas que he aprendido diseñando esta
página.

En primer lugar tenía que elegir con qué herramienta gestionar mi página personal, en su día tenía en mente desarrollar
mi propio tema para Wordpress, pero con el paso del tiempo han ido apareciendo muchas otras alternativas y finalmente
me decidí por utilizar alguna **herramienta generadora de sitios estáticos** (en inglés con las siglas *SSG*).

{{< img src="img/hugo-logo.png" alt="Hugo" class="mx-auto" >}}

Busqué información de las ventajas de los distintos generadores y de casualidad
me topé con una herramienta escrita en ***Go***  que es muy rápida, [Hugo][1], así que empecé a trastear y probar. Cuando me
quise dar cuenta me encontraba cómodo y avanzaba rápido, así que me decanté por Hugo.

Para poder trabajar con Hugo, lo primero que hice fué [instalarlo][2] y posteriormente seguir [esta guía para poder crear un blog con
Hugo desde cero][3]. A partir de ahí Hugo te permite hacer prácticamente lo que quieras, es bastante flexible, puedes instalar
temas, utilizar [shortcodes][4] para sintaxis coloreada de código, embeber contenido de servicios populares como Youtube, Twitter, Instagram, etc.

Como Hugo genera un sitio estático, la opción para hosting más sencilla es [Github][5] pages. Para subir una nueva versión del
sitio simplemente copio la carpeta public al repositorio, y al hacer commit y push se despliega automáticamente.

Finalmente, me quedaba la decisión de cómo iba a organizar la maquetación del sitio. Al ser un sitio pequeño, podría haber
maquetado todo desde cero con CSS o SASS, pero llevo un tiempo oyendo hablar de un framework CSS llamado [Tailwind CSS][6] que
utiliza un concepto denominado "utility first". Después de haber trabajado con Bootstrap, no me apetecía aprender un nuevo
framework pero me decidí a darle una oportunidad. Al empezar mi primer pensamiento fue que todo quedaba muy sucio con esa
ristra de clases por todos lados, pero con el paso del tiempo me fui acostumbrando y le fui cogiendo el gustillo, hasta el
punto de que he quedado encantado.

{{< img src="img/tailwindcss.png" alt="TailwindCSS" class="mx-auto" >}}

Tailwind no es un framework como Bootstrap, **no te da componentes creados** con una sintaxis marcada. Tailwind te ofrece un
**conjunto de utilidades CSS atómicas** con las que poder crear tus propios componentes de manera consistente. Te puedes concentrar
en crear, no pierdes tiempo en buscar la mejor manera de nombrar las clases, no repites una y otra vez las mismas propiedades
CSS que hacen que los ficheros CSS crezcan sin control.

Tailwind te provee de un conjunto de posibilidades entre las que elegir, distintos tamaños de texto, una paleta de colores,
sombras, escala para margins y paddings... Y además es completamente personalizable, Tailwind está construido sobre PostCSS
y puedes mediante su fichero de configuración sobrescribir o extender los valores que desees. Tailwind te da una base sobre
la que poder crear tu sistema de diseño para una web totalmente personalizada. Pruébalo y no te defraudará, de primeras es
normal ser reticente.

En próximos artículos voy a ir desgranando cómo me he configurado Hugo a mi gusto, cosas que he aprendido y que he necesitado
de mucho tiempo para resolver.

[1]: https://gohugo.io/
[2]: https://gohugo.io/getting-started/quick-start/
[3]: https://zwbetz.com/make-a-hugo-blog-from-scratch/
[4]: https://gohugo.io/content-management/shortcodes/
[5]: https://github.com
[6]: https://tailwindcss.com
