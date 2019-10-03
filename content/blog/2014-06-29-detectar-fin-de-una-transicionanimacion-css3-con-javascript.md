---
title: Detectar fin de una transición/animación CSS3 con Javascript
author: javi
type: post
date: 2014-06-29T10:06:28+00:00
categories:
  - CSS3
  - Javascript
  - jQuery
tags:
  - css
  - animación
  - javascript
  - jQuery

---
<p style="text-align: left;">
  Nunca me había visto en la necesidad de <strong>detectar cuando una transición CSS3 termina,</strong> pero el otro día en el trabajo, para desplegar cierta información, estamos utilizando 2 contenedores, y al añadir una clase se activa una animación CSS3 que va aumentando el margen izquierdo del div hasta que aparece el siguiente. Para ello estamos utilizando eventos de teclado, si pulsamos flecha derecha va hacia la derecha, en caso de pulsar la flecha izquierda, hacia la izquierda, muy sencillito.
</p>

<p style="text-align: left;">
  ¿Y qué pasa si pulsamos varias veces antes de que la animación termine? Pues que parece que va a tirones, y lo que es un efecto de transición muy elegante se convierte en un efecto muy desagradable. No estaba al tanto, pero cuando un elemento presenta una animación puramente en CSS3, en función del navegador,<strong> podemos suscribirnos a un evento que nos informará cuando la transición ha terminado.</strong> En este proyecto estamos utilizando jQuery, asi que la solución es bien sencilla:
</p>

Solución para transiciones:

{{< highlight JavaScript >}}
var ended = false;
$("#selector").bind("transitionend
                     webkitTransitionEnd 
                     oTransitionEnd 
                     MSTransitionEnd", function(){ 
                        ended = true;
                    });
{{< / highlight >}}

Solución para animaciones:

{{< highlight JavaScript >}}
var ended = false;
$("#someSelector").bind("animationend 
                         webkitAnimationEnd 
                         oAnimationEnd 
                         MSAnimationEnd", function(){
                        ended = true;
                    });
{{< / highlight >}}

Si no deseas usar jQuery, en Modernizr tienen esto:

{{< highlight JavaScript >}}
function transitionEndEventName () {
    var i,
        undefined,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }

    //TODO: throw 'TransitionEnd event is not supported in this browser'; 
}
{{< / highlight >}}

Y se utiliza de la siguiente manera:

{{< highlight JavaScript >}}
var transitionEnd = transitionEndEventName();
element.addEventListener(transitionEnd, theFunctionToInvoke, false);
{{< / highlight >}}

<p style="text-align: left;">
  Encontré la solución en StackOverflow:
</p>
<ul>
    <li style="text-align: left;">
    <a title="Callback when CSS3 transition finishes" href="http://stackoverflow.com/questions/9255279/callback-when-css3-transition-finishes">Callback when CSS3 transition finishes</a>
    </li>
    <li style="text-align: left;">
    <a title="Normalize CSS3 transitions functions across browsers" href="http://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers">How do I normalize CSS3 Transition functions across browsers?</a>
    </li>
</ul>
