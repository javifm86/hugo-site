---
title: "Gestión de literales en react con react-intl"
date: 2023-03-24
author: javi
type: post
img: img/react-intl.png
altImg: React y FormatJS logos
toc: true
tags:
    - react
---

En esta publicación, vamos a adentrarnos en un enfoque para la gestión de literales de un proyecto de React utilizando [react-intl][1].

## Configurando un nuevo proyecto con create-react-app

Iniciamos un nuevo proyecto de React con [CRA][2], una de las formas más fáciles de hacerlo sin tener que lidiar con la configuración de webpack.

```bash
npx create-react-app react-intl-example --template typescript
cd react-intl-example
npm start
```

## Instalando `react-intl`

El siguiente paso es instalar `react-intl` como una dependencia:

```bash
npm i react-intl
```

También necesitaremos una dependencia de desarrollo para extraer y compilar los literales:

```bash
npm i -D @formatjs/cli
```

## Usando `react-intl` en una aplicación de React

Comencemos a usar `react-intl` en nuestra aplicación de React de prueba.

Crea una carpeta `lang` en `src` con un archivo JSON vacío llamado `en.json`. Este archivo contendrá más tarde el resultado de la compilación para cada literal en la aplicación. Explicaremos más adelante en detalle cómo lograr esto.

```json
{}
```

Editamos `index.tsx` en la carpeta `src`. Tenemos que importar `IntlProvider` de `react-intl` y envolver nuestra aplicación con él. Estamos creando algunos componentes para rich elements que por defecto se usarán globalmente en los literales de la aplicación.

```tsx {linenos=table,hl_lines=["6-7", "9-19", "24-37"]}
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { IntlProvider } from "react-intl";
import literals from "./lang/en.json";

interface Props {
  children?: React.ReactNode;
}

const Bold = (props: Props) => {
  return (
    <div>
      <strong>{props.children}</strong>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <IntlProvider
    locale="en"
    defaultLocale="en"
    messages={literals}
    defaultRichTextElements={{
      bold: (chunks) => <Bold>{chunks}</Bold>,
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </IntlProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

El siguiente paso es crear una nueva carpeta con un archivo `example.ts` donde definiremos algunos literales. Por ejemplo, uno usando un rich element global definido anteriormente (usado como una etiqueta HTML, `<bold></bold>` en este ejemplo), y otro literal regular simple. Lo haremos utilizando la función `defineMessages` de `react-intl`.

```ts
import { defineMessages } from "react-intl";

export default defineMessages({
  hello: {
    id: "a.hello",
    defaultMessage: "<bold>hello</bold>",
  },
  world: {
    id: "a.world",
    defaultMessage: "world",
  },
});
```
Podemos crear otro archivo de literales llamado `other.ts` dentro de la carpeta `messages`. Esto es solo un ejemplo, puedes crear tantos archivos de literales como desees y colocarlos donde quieras, esa decisión está en tus manos y es subjetiva.

```ts
import { defineMessages } from "react-intl";

export default defineMessages({
  other: {
    id: "a.richtext",
    defaultMessage: "I have <test>{num}</test>",
  },
});
```

Ahora podemos comenzar a importar nuestros literales en la aplicación. Para simplificar, mostraré cómo hacerlo editando directamente el archivo `App.tsx` de la siguiente manera:

```tsx
import React from "react";
import { FormattedMessage } from "react-intl";
import exampleMessages from "./messages/example";
import otherMessages from "./messages/other";

function App() {
  return (
    <div className="App">
      <FormattedMessage {...exampleMessages.hello} />{" "}
      <FormattedMessage {...exampleMessages.world} />
      <FormattedMessage
        id={otherMessages.other.id}
        defaultMessage={otherMessages.other.defaultMessage}
        values={{ num: 99, test: (chunks: any) => <strong>{chunks}!!</strong> }}
      />
    </div>
  );
}

export default App;
```
En este ejemplo, estamos cargando nuestros literales desde dos archivos diferentes y utilizando el componente `FormattedMessage` de la biblioteca `react-intl`. Puedes consultar en la [documentación oficial diferentes formas de declarar mensajes][3].

Por lo tanto, cada vez que deseemos usar un literal en la aplicación, podemos definirlo en un archivo separado e importarlo para usarlo. Si no se encuentra un literal en el archivo compilado `lang/en.json`, se utilizará el valor proporcionado en `defaultMessage`. Esto es muy útil porque no es necesario compilar los literales cada vez que necesitemos un nuevo literal mientras desarrollamos.

## Extrayendo y compilando literales con `formatJS`

Crearemos algunos scripts en el archivo `package.json` para automatizar el proceso de extracción y compilación de literales. Podemos consultar [la documentación oficial para obtener más detalles][4]. Utilizaremos un comando muy largo de la documentación y lo dividiremos en algunos scripts para una mejor legibilidad. Veamos los scripts y luego la explicación de los comandos ejecutados:

```json
// ---- scripts section from package.json
"scripts": {
    "literals:extract": "formatjs extract 'src/**/*.ts*' --ignore='**/*.d.ts' --out-file temp.json --flatten --id-interpolation-pattern '[sha512:contenthash:base64:6]'",
    "literals:compile": "formatjs compile 'temp.json'",
    "postliterals:compile": "rm temp.json",
}
// ----
```

El primer comando extraerá cada una de los literales definidos en la aplicación bajo la carpeta `src` a un archivo temporal llamado `temp.json`.

```bash
formatjs extract 'src/**/*.ts*' --ignore='**/*.d.ts' --out-file temp.json --flatten --id-interpolation-pattern '[sha512:contenthash:base64:6]'
```

> **Advertencias**: El comando incluye una opción para generar ids, pero con la configuración de `create-react-app`, esta característica no funcionará porque es necesario editar la configuración de webpack y babel. 

Una vez extraídos los literales a un archivo, los compilaremos especificando el archivo de destino (destacar los parámetros adicionales utilizados en el comando, no están presentes en el script anterior, agregaremos más scripts al final):

```bash
formatjs compile 'temp.json' --out-file src/lang/en.json
```

Con este comando, el archivo generado (`src/lang/en.json`) será el siguiente:

```json
{
  "a.hello": "<bold>hello</bold>",
  "a.richtext": "I have <test>{num}</test>",
  "a.world": "world"
}
```

> Si deseamos traducir nuestros literales a otro idioma, este archivo debe ser utilizado como punto de partida, y se deben traducir cada uno de los literales. Luego, debemos crear un nuevo archivo, por ejemplo `es.json`, y agregar lógica en `index.tsx` para cargar el archivo `en.json` o `es.json` dependiendo del idioma seleccionado en la aplicación.

Si iniciamos nuestra aplicación con este archivo, todo funcionará según lo esperado, pero en las DevTools se puede leer esta advertencia:

`[@formatjs/intl] "defaultRichTextElements" was specified but "message" was not pre-compiled. 
Please consider using "@formatjs/cli" to pre-compile your messages for performance.
For more details see https://formatjs.io/docs/getting-started/message-distribution`.

Esto se debe a que estamos usando la opción `defaultRichTextElements` globalmente para los literales, y cada vez que se carga un literal, la biblioteca no sabe si el literal está utilizando `defaultRichTextElements` o no. Por esta razón, debemos compilar utilizando el flag `ast`:


```bash
formatjs compile 'temp.json' --ast --out-file src/lang/en.json
```

Después de esto, el resultado será diferente:

```json
{
  "a.hello": [
    {
      "children": [
        {
          "type": 0,
          "value": "hello"
        }
      ],
      "type": 8,
      "value": "bold"
    }
  ],
  "a.richtext": [
    {
      "type": 0,
      "value": "I have "
    },
    {
      "children": [
        {
          "type": 1,
          "value": "num"
        }
      ],
      "type": 8,
      "value": "test"
    }
  ],
  "a.world": [
    {
      "type": 0,
      "value": "world"
    }
  ]
}
```

Y si iniciamos la aplicación con este archivo, la advertencia desaparecerá. Finalmente, podemos agregar más scripts con los flags necesarios para cada caso. Extracto final de los scripts:

```json
// ---- scripts section from package.json
"scripts": {
    "literals:extract": "formatjs extract 'src/**/*.ts*' --ignore='**/*.d.ts' --out-file temp.json --flatten --id-interpolation-pattern '[sha512:contenthash:base64:6]'",
    "literals:compile": "formatjs compile 'temp.json'",
    "postliterals:compile": "rm temp.json",
    "literals:en": "npm run literals:compile -- --out-file src/lang/en.json",
    "literals:en:ast": "npm run literals:compile -- --ast --out-file src/lang/en.json",
    "literals:extract:compile": "npm-run-all literals:extract literals:en",
    "literals:extract:compile:ast": "npm-run-all literals:extract literals:en:ast"
}
// ----
```

> Los últimos 2 scripts están utilizando `npm-run-all` como una dependencia de desarrollo, puedes instalarla usando: `npm i -D npm-run-all`.

Para generar los literales en la aplicación, podemos ejecutar `literals:extract:compile` para generar un archivo listo para ser traducido, o `literals:extract:compile:ast` para un archivo listo para producción.

Se puede revisar un repositorio con este ejemplo de aplicación [en mi cuenta de Github][5].

Nota: No he probado [BalbelEdit][6] pero parece que puede ser muy útil a la hora de traducir una aplicación, soporta React.

[1]: https://formatjs.io/docs/react-intl/
[2]: https://create-react-app.dev/
[3]: https://formatjs.io/docs/getting-started/message-declaration
[4]: https://formatjs.io/docs/getting-started/message-extraction
[5]: https://github.com/javifm86/react-intl-example
[6]: https://www.codeandweb.com/babeledit
