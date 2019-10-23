---
title: Ellipsis de múltiples líneas con Javascript
author: javi
type: post
date: 2015-09-07T09:00:57+00:00
tags:
  - javascript
  - css

---
Ellipsis es simplemente un cáracter compuesto por tres puntos: &#8220;…&#8221;. En desarrollo web, se aplica a textos muy largos que son más grandes que su contenedor, y por tanto queremos que sean recortados agregando al final el carácter ellipsis. Con el avance de los estándares css modernos, ya podemos aplicar una solución sin necesidad de echar mano de Javascript:

{{< highlight css >}}
.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
}
{{< / highlight >}}

¿Cual es la limitación? Que sólo funciona en textos con una línea, si tenemos más de una línea no funciona, y es ahí donde entra en juego Javascript. He creado una sencilla función, simplemente es necesario que en css el elemento disponga de un line-height definido para funcionar.

{{< highlight JavaScript >}}
/**
 *  Acorta strings multilinea añadiendo el símbolo ellipsis.
 *  @param  {jQuery}  $obj     : Objeto jQuery a aplicar si es necesario.
 *                               Importante, debe tener line-height definido.
 *  @param  {String}  val      : Texto a insertar.
 *  @param  {Number}  maxLines : Máximo de líneas permitidas.
 */

function ellipsis( $obj, val, maxLines ) {

    if ( maxLines &lt; 2 ) {
        $obj.text( val );
        return;
    }

    var _valueAux = val,
        _lenValueAux = _valueAux.length,
        _heightLine = parseFloat( $obj.css( "line-height" ) ),

        /*
         *  Añadimos 2 porque algunos navegadores redondean line-height,
         *  asi que cubrimos el máximo valor en px de line-height redondeado.
         */
        _maxHeight = maxLines * _heightLine + 2;

    $obj.text( _valueAux );

    // Si hay más líneas de las esperadas
    if ( ( $obj[ "0" ].scrollHeight > _maxHeight ) && ( _lenValueAux ) ) {

        // Reducimos el length del string hasta que queden las líneas deseadas
        while ( $obj[ "0" ].scrollHeight > _maxHeight ) {
            _valueAux = _valueAux.substr( 0, ( _lenValueAux - 2 ) ) + "…";
            $obj.text( _valueAux );
            _lenValueAux = _valueAux.length;
        }

    }

}
{{< / highlight >}}

También hay [plugins en jQuery,][1] para un uso más avanzado y complejo no está de más echarle un ojo. Para más información, o una implementación más optimizada, [hay un hilo en Stackoverflow donde hablan del tema.][2]

 [1]: http://dotdotdot.frebsite.nl/
 [2]: http://stackoverflow.com/questions/536814/insert-ellipsis-into-html-tag-if-content-too-wide
