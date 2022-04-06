---
title: Lanzar fichero batch (.bat) sin mostrar la consola en Windows
author: javi
type: post
date: 2015-01-27T16:12:47+00:00
tags:
  - batch

---
En mi día a día suelo trabajar en entorno Windows, y hay ciertos atajos de teclado y acciones, como backups de algunos proyectos, que tengo automatizadas con un simple fichero `.bat`, que ejecuto a través de un comando a través de [Autohotkey][1] (algún día escribiré un poco sobre esta utilidad para mejorar la productividad en Windows).

Por si te resulta molesto que esté la consola abierta mientras se ejecuta el script, hay una manera sencilla de impedirlo, como pude encontrar en esta pregunta de [Superuser.][2] Copia el siguiente mini script en un fichero con extensión `.vbs` en la misma carpeta que tu bat, y ejecutalo en lugar del `.bat`

```vb
Set oShell = CreateObject ("Wscript.Shell") 
Dim strArgs
strArgs = "cmd /c testing.bat"
oShell.Run strArgs, 0, false
```

Simplemente cambia `testing.bat` por el nombre de tu fichero y listo.

 [1]: http://www.autohotkey.com/ "Autohotkey"
 [2]: http://superuser.com/questions/140047/how-to-run-a-batch-file-without-launching-a-command-window
