---
title: "Flujo de trabajo sencillo para un monorepo"
date: 2022-04-05
author: javi
type: post
img: img/monorepo-react-nestjs.jpg
altImg: Logos de React y NestJS
toc: true
tags:
    - git
    - hook
    - react
    - nestJS
---

En mi trabajo actual, me ha tocado configurar un monorepo con hooks de git, ESLint, Prettier y algunas acciones propias. Quiero dejar constancia del proceso de cara a poder volver a consultar en el futuro. Este es el caso de uso:

- Directorio `backend`, con proyecto de [NestJS][1]. NestJS es un framework para backend en Node, utiliza Typescript.
- Directorio `frontend`, con un proyecto **React + Typescript**.
- Configuración global de **Prettier**, compartida entre ambos proyectos.
- **ESLint** para linting, cada proyecto tendrá su propia configuración.
- Además de ESLint, **tsc** para las comprobaciones de tipo.
- Hook **pre-commit** para git: ejecutará `eslint --fix` y `prettier --write` en los archivos que se incluyan en los commit. Si ESLint o tsc detectan algún error, **el commit será abortado**.
- Git **pre-push hook**: ejecutará los tests unitarios, si los ficheros cambiados corresponden al proyecto de backend, ejecutará solo los tests de backend. Hará lo mismo para frontend y, en caso de haber cambios en ambos directorios ejecutará ambos. **Git push será abortado si se encuentra algún error**.

Empecemos explicando paso a paso.

## Inicialización del backend con NestJS

Como he mencionado al comienzo, utilizaremos NestJS para el backend. El primer paso será instalar el CLI de Nest para iniciar el proyecto. Por tanto, crearemos un nuevo proyecto:
```bash
npm i -g @nestjs/cli
nest new backend
```
Ya que esta será parte backend del monorepo, eliminaremos la carpeta `.git` creada dentro del directorio backend.

## Inicialización del frontend

Una vez creado el backend, procederemos a crear el frontend con React + Typescript utilizando create-react-app:

```bash
npx create-react-app frontend --template typescript
```

## Instalar prettier

Ambos proyectos utilizarán Prettier. Lo instalaremos tanto en el directorio de frontend como en el de backend.

```bash
cd backend
npm install --save-dev --save-exact prettier

cd ../frontend
npm install --save-dev --save-exact prettier
```

Ahora podemos crear el fichero de configuración `.prettierrc` en el directorio raíz (será compartido por ambos proyectos). Podemos añadir nuestras reglas preferidas, un ejemplo:

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "all",
  "singleQuote": true,
  "semi": true
}
```
A continuación crearemos scripts npm para ejecutar prettier. En `frontend/package.json`:

```json
"scripts": {
  // ...
  "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,json,css,scss,md}'"
},
```

En `backend/package.json`:

```json
"scripts": {
  // ...
  "format": "prettier --write 'src/**/*.ts\' 'test/**/*.ts'",
},
```

## Configurando ESLint

En este momento configuraremos ESLint para el linting. Como estamos usando Prettier, instalaremos un paquete que desactivará reglas que son innecesarias o pudieran entrar en conflicto con ESLint. Después de eso, instalaremos un plugin para auto ordenar los imports, pero veamos la configuración básica primero.

Vamos con frontend primero:

```bash
cd frontend
npm i -D eslint eslint-config-prettier @typescript-eslint/parser
```

Además, crearemos un fichero `.eslintrc.js` en el directorio frontend:

```js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-alert': 'warn',
  },
};
```

Ésta es la configuración más básica para React con Typescript. Se evitan los conflictos con Prettier y es un estupendo punto de inicio para personalizar o extender con otro tipo de configuraciones.

Como bonus, en nuestro proyecto añadimos el plugin [eslint-plugin-import][3] para ordenar los imports siguiendo siempre el mismo criterio. Si no te interesa puedes saltarte esta parte. Debemos instalar los siguientes paquetes:

```bash
npm i -D eslint-import-resolver-typescript eslint-plugin-import 
```

Y finalmente la configuración (hay multitud de reglas que pueden ser personalizadas):

```js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: ['import'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: 'react**',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: '*.scss',
            patternOptions: { matchBase: true },
            group: 'index',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        warnOnUnassignedImports: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
```

Ahora, cuando ejecutemos `eslint --fix`, todos los imports deberían formatearse automáticamente.

> **NOTA:** Los imports que no son nombrados no pueden ser ordenados automáticamente porque, en este tipo de imports, el orden importa. Este tipo de imports serán marcados como error, pero **deben ser ordenados manualmente**.
>
> **Ejemplo**: import './App.scss';

Finalmente, podemos eliminar del `package.json` la configuración de ESLint que fue creada por create-react-app:

```json
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
```

Una vez tenemos ESLint funcionando en el frontend, vayamos a por el backend. NestJS viene con una configuración por defecto que es un buen punto de partida. Vamos a modificarla e instalar [eslint-plugin-import][3].

```bash
cd backend
npm i -D eslint-import-resolver-typescript eslint-plugin-import 
```

El fichero `.eslintrc.js` final, con el plugin de Prettier y la configuración para los imports:

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '@nestjs**',
            group: 'builtin',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['@nestjs'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        warnOnUnassignedImports: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
```

## Git pre-commit hook
Queremos ejecutar ciertas operaciones en los ficheros que hacemos commit, tales como **formatear con prettier y lanzar el lint con `eslint --fix`**. Para conseguir esto, utilizaremos [Husky][6] que se encargará de ejecutar estas acciones como hooks de git.

### Instalando husky

Debemos crear un fichero `package.json` en el raíz de nuestro proyecto para poder instalar Husky como dependencia. Ejecutaremos:

```bash
npm init -y
```

Acto seguido, rellenamos los campos con la información que queramos, y procederemos a **instalar Husky y crear y ejecutar el script `prepare`**:

```bash
npm i -D husky
npm set-script prepare "husky install"
npm run prepare
```

`prepare` es un script que forma parte del ciclo de vida, y será ejecutado justo después de hacer `npm install` en un repositorio. Si estás utilizando **Yarn**, quizás **husky** no se instala automáticamente después del install. En ese caso, debemos ejecutarlo manualmente:

```bash
npm run prepare
```

Finalmente podemos añadir el hook `pre-commit`. Ejecutaremos `npm run lint` en el pre-commit (en breve definiremos este script).

```bash
npx husky add .husky/pre-commit "npm run lint"
```

Un fichero llamado `pre-commit` aparecerá bajo el directorio `.husky`, con el siguiente contenido:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
```

> **NOTA:** Si utilizas un cliente para Git como Sourcetree, y obtienes el error `command not found`, es necesario crear un fichero `~/.huskyrc` para cargar lo necesario antes de ejecutar el hook (descrito [aquí](https://typicode.github.io/husky/#/?id=command-not-found)). Por ejemplo, para `nvm`:
>
> ```bash
> # ~/.huskyrc
> # This loads nvm.sh and sets the correct PATH before running hook
> export NVM_DIR="$HOME/.nvm"
> [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
> ```


### Añadiendo scripts npm en el package.json raíz

Una vez definidos el hook, debemos crear el script `lint` en el `package.json`. Este script ejecutará a su vez 2 scripts, uno para el lint en el backend, y otro para el frontend. Añadimos estas líneas:
```json
"scripts": {
  // ...
  "lint": "npm-run-all lint:backend lint:frontend",
  "lint:backend": "cd backend && npm run lint:staged",
  "lint:frontend": "cd frontend && npm run lint:staged",
},
```

Estamos utilizando [npm-run-all][7] en el script lint para ejecutar los otros 2 scripts, por tanto debemos instalar esta dependencia en el package.json del raíz:

```bash
npm i -D npm-run-all
```

El siguiente paso es definir el script `lint:staged` en `backend/package.json` y en `frontend/package.json`, pero antes, instalaremos otra dependencia para el linting.

### Instalando tsc-files
[tsc-files][10] es una pequeña herramienta para ejecutar `tsc` en determinados ficheros sin ignorar el `tsconfig.json`. Este paquete fue creado [porque pasar ficheros específicos][11] de esta manera `tsc --noEmit file1.ts file2.ts` propicia que Typescript simplemente ignora el `tsconfig.json`.

Instalamos tsc-files, que se necesitará en pasos posteriores:

```bash
cd backend
npm i -D tsc-files
cd ../frontend
npm i -D tsc-files
```

### lint-staged para backend y frontend
[lint-staged][8] es un paquete que nos permite ejecutar linters en los ficheros staged en git. De esta manera, no permitiremos que entren bus en nuestro código, y aprovecharemos la oportunidad para formatear los ficheros.

Instalaremos esta dependencia de desarrollo tanto en backend como en frontend:

```bash
cd backend
npm i -D lint-staged
cd ../frontend
npm i -D lint-staged
```

Ahora [definiremos la configuración para lint-staged][9] que se aplicará al ejecutar nuestras tareas. Podemos definir esta configuración en el fichero `package.json` o en un archivo separado. Para ambos proyectos, ejecutaremos `eslint --fix`, `tsc` para comprobaciones de tipo y `prettier` para formateo.

Adicionalmente, tenemos que añadir un script `lint:staged`, que será invocado desde el `package.json` raíz.

Vayamos por el primero:

`backend/package.json`

```json
"scripts": {
  // ...
  "lint:staged": "lint-staged",
  // ...
}
// ...
"lint-staged": {
  "src/**/*.+(ts)": [
    "eslint --fix",
    "tsc-files --noEmit"
  ],
  "src/**/*.{ts,json,md}": [
    "prettier --write"
  ]
}
```

`frontend/package.json`
```json
"scripts": {
  // ...
  "lint:staged": "lint-staged",
  // ...
}
// ...
"lint-staged": {
  "src/**/*.+(ts|tsx)": [
    "eslint --fix",
    "tsc-files --noEmit"
  ],
  "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
    "prettier --write"
  ],
  "*.js": "eslint --cache --fix"
}
```

### Resumen pre-commit
Con todos estos pasos completados, **hemos terminado la configuración del hook pre-commit**. Este será el flujo ejecutado cuando hagamos commit:

1. El script `pre-commit` de husky ejecutará `npm run lint` que se encuentra definido en el `package.json` raíz.
1. El script `lint` acudirá tanto a los directorios de **backend** como de **frontend** y ejecutará `npm run lint:staged`.
1. **lint-staged** será invocada y recibirá la lista de archivos involucrados en el commit. Si no encuentra ningún fichero definido en la configuración no hará nada. En caso de encontrar un error el commit es abortado hasta que se resuelva el problema.

## Git pre-push hook
Con este hook, queremos asegurarnos de que no hacemos push de código que pueda romper nuestros tests unitarios. Nuevamente utilizaremos husky, utilizando la misma estrategia seguida en el hook pre-commit using the same strategy as pre-commit hook. Vayamos directamente al lío. En el directorio raíz del proyecto:

```bash
npx husky add .husky/pre-push "npm run pre-push"
```

Un fichero `pre-push` dentro del directorio `.husky` aparecerá con este contenido:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run pre-push
```

### Añadiendo scripts npm en el package.json raíz

Con el hook ya definido, debemos crear un script `pre-push` en el `package.json` raíz. Este script invocará a otros 2 scripts, uno para backend y otro para frontend. Añadimos estas líneas:

```json
"scripts": {
  // ...
  "pre-push": "npm-run-all pre-push:backend pre-push:frontend",
  "pre-push:frontend": "cd frontend && npm run pre-push",
  "pre-push:backend": "cd backend && npm run pre-push",
},
```

El siguiente objetivo es definir el script `pre-push` en `backend/package.json` y en `frontend/package.json`.

### prepush-if-changed para backend y frontend
[prepush-if-changed][12] es un paquete similar a `lint-staged` pero para git push. No es tan popular como lint-staged, pero lo he probado yo mismo y funciona correctamente. **Queremos lanzar los test unitarios y el linting**, pero solo si algún fichero de backend o frontend está involucrado en los ficheros que vamos a hacer push.


Por ejemplo, si estamos haciendo push de cambios en frontend, solo queremos ejecutar los test de la parte de front y su lint. Lo mismo aplica para backend, y en caso de tener cambios de ambos proyectos, se comprobarán ambos.

Instalaremos esta dependencia de desarrollo tanto en backend como en frontend:

```bash
cd backend
npm i -D prepush-if-changed
cd ../frontend
npm i -D prepush-if-changed
```

[Definiremos la configuración utilizad para prepush-if-changed][13]. Podemos definirla  en el `package.json` o en un fichero aparte.

Además, tenemos que añadir un script llamado `pre-push` (y sus tareas dependientes), que será ejecutado desde el `package.json` raíz. **Si algún test o el proceso de lint fallan, el git push será abortado**.

Vamos con el primero:

`backend/package.json`

```json
"scripts": {
  // ...
  "pre-push": "npm-run-all pre-push:test lint",
  "pre-push:test": "prepush-if-changed",
  "lint": "npm-run-all lint:eslint lint:tsc",
  "lint:eslint": "eslint 'src/**/*.ts'",
  "lint:tsc": "tsc -p tsconfig.json",
  "test": "npm run test:unit && npm run test:e2e",
  "test:unit": "jest --runInBand",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  // ...
}
// ...
  "prepush-if-changed": {
    "src/**/*.+(ts)": "echo 'Files changed on backend. Launching tests.' && npm run test"
  },
```

Breve explicación del proceso:
- El script `pre-push` lanzará `pre-push:test` que a su vez ejecuta `prepush-if-changed` con la configuración mostrada, y después de eso, `lint`.
- Si la configuración de `prepush-if-changed` encuentra algún resultado, ejecutará el script `test`.
- El script `test` ejecutará `test:unit` y `test:e2e`.
- Por último, el script `lint` ejecuta `lint:eslint` y `lint:tsc`.

`frontend/package.json`

```json
"scripts": {
  // ...
  "pre-push": "npm-run-all pre-push:test lint",
  "pre-push:test": "prepush-if-changed",
  "lint": "npm-run-all lint:eslint lint:tsc",
  "lint:eslint": "eslint 'src/**/*.{ts,tsx}'",
  "lint:tsc": "tsc -p tsconfig.json",
  "test": "react-scripts test",
  // ...
}
// ...
  "prepush-if-changed": {
    "src/**/*.+(ts|tsx)": "echo 'Files changed on frontend. Launching tests.' && npm run test -- --watchAll=false"
  },
```

Nota para frontend:
- El script `pre-push` ejecuta `pre-push:test` que a su vez lanza `prepush-if-changed` con la configuración mostrada, y después de eso, `lint`.
- Si la configuración de `prepush-if-changed` encuentra algún resultado, procederá a lanzar `npm run test -- --watchAll=false`.
- Finalmente, el script `lint` ejecuta `lint:eslint` y `lint:tsc`. 

Vaya este post ha sido largo, muy interesante como futura referencia. Toca un montón de temas, he publicado [el resultado final en Github][14]. En mi equipo hemos estado utilizando esta configuración los últimos 3 meses sin problemas, estamos contentos con los resultados. Gracias por leerme.

[1]: https://nestjs.com/
[2]: https://prettier.io/
[3]: https://github.com/import-js/eslint-plugin-import
[4]: https://eslint.org/
[5]: https://languagetool.org/
[6]: https://github.com/typicode/husky
[7]: https://github.com/mysticatea/npm-run-all
[8]: https://github.com/okonet/lint-staged
[9]: https://github.com/okonet/lint-staged#configuration
[10]: https://github.com/gustavopch/tsc-files
[11]: https://github.com/microsoft/TypeScript/issues/27379
[12]: https://github.com/dprovodnikov/prepush-if-changed
[13]: https://github.com/dprovodnikov/prepush-if-changed#configuration
[14]: https://github.com/javifm86/monorepo-starter-react-nest
