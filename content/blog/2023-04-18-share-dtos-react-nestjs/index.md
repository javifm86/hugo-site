---
title: 'Compartiendo DTOs entre NestJS y React'
date: 2023-04-17
author: javi
type: post
img: img/monorepo-react-nestjs.jpg
altImg: Logos de React y NestJS
toc: true
tags:
  - react
---

Durante los 2 últimos años, he estado trabajando en proyectos que utilizan estructura de monorepo, con `NestJS` para el backend y `React` para el frontend. Fruto de esta experiencia, he diseñado un approach para **compartir eficientemente DTOs entre las 2 capas**. Si buscas información acerca de este tema, no encontrarás una rápida respuesta asi que ¡allá vamos!.

## DTO (Data Transfer Object)

Antes de nada, ¿Qué es un **DTO (Data Transfer Object)**? Extraído de la documentación oficial de NestJS:

> Un DTO es un objeto que define cómo se enviarán los datos a través de la red. Podríamos determinar el esquema del DTO utilizando interfaces de TypeScript o clases simples. Curiosamente, recomendamos utilizar clases. ¿Por qué? Las clases son parte del estándar ES6 de JavaScript y, por lo tanto, se preservan como entidades reales en el JavaScript compilado. Por otro lado, dado que las interfaces de TypeScript se eliminan durante la transpilación, Nest no puede referirse a ellas en tiempo de ejecución. Esto es importante porque características como Pipes permiten posibilidades adicionales cuando tienen acceso al metatipo de la variable en tiempo de ejecución.

Me encanta lo sencillo que es validar parámetros con DTOs en NestJS, puedes usar [decoradores `class-validator` para validar parámetros de entrada][1] sin la necesidad de escribir ni una línea de código.

Puedes [documentar y generar el swagger para tus endpoints][2] simplemente usando decoradores.

Ejemplo de un DTO:

```ts
export class ExampleRequestDto {
  @ApiProperty({
    description: 'Person ID',
    example: 'a94dd9b3-c0ae-43e2-b13e-31fce2e60203'
  })
  @IsNotEmpty()
  personId: string;

  @ApiProperty({
    description: 'Address ID',
    example: 'a94dd9b3-c0ae-43e2-b13e-31fce2e60203'
  })
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({
    description: 'Telephone number ID',
    example: '3e26f0e9-22e4-46eb-a14e-ad37fbdf2144'
  })
  @IsNotEmpty()
  @IsOptional()
  phoneNumberId?: string;
}
```

Con este DTO podemos **validar los parámetros de entrada** para un endpoint, **tenemos tipado**, y podemos **crear un maravilloso swagger** con información para los desarrolladores que quieran utilizar esta API. Está muy chulo, ¿cierto?

¿No sería genial si pudiéramos utilizar el mismo DTO, como fuente de verdad para tipado de parámetros de entrada en los servicios front? De esta manera eliminaríamos la necesidad de duplicar ambas definiciones. Inicialmente, tenía que generar version separadas del DTO utilizando Typescript plano con interfaces, ya que los decoradores no eran posibles en este caso. Era una tarea tediosa, pero utilizar un DTO compartido hace el proceso de desarrollo más productivo y eficiente.

## Usando DTOs para tipado en el frontend

¿Cómo podríamos utilizar el mismo DTO con decoradores en el frontend sin añadir cosas innecesarias a nuestro bundle? De primeras, pudiera parecer que instalar dependencias como `@nestjs/swagger` y `class-validator` e importándolas añadiríamos multitud de código a nuestro bundle.

Sin embargo, por lo que he podido probar, **si solo utilizamos el DTO como un tipo, el resultado final del bundle no se verá afectado ya que los tipos son eliminados durante el proceso de compilado**. Por tanto, incluso si utilizas una clase para definir el DTO, las referencias no será incluidas en el bundle final siempre y cuando se utilice como tipado. Veamos un ejemplo de configuración para un monorepo.

## Preparando el monorepo

Crearemos en un directorio raíz 3 directorios: `backend`, `frontend` y `common` (aquí dejaremos los DTOs compartidos).

### Backend con NestJS

Iniciaremos un proyecto con el CLI de NestJS:

```sh
nest new backend
cd backend
npm i
```

### Frontend con React

Como CRA está oficialmente deprecado, usaremos Vite, que es más rápido y una de las opciones más fáciles para inicializar un proyecto React sin utilizar ningún framework.

```sh
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

### Directorio common

Crearemos un directorio común donde estarán los DTOs reutilizados para frontend y backend, e instalaremos las dependencias.

```sh
mkdir common
cd common
npm i @nestjs/swagger class-validator
npm i -D typescript
```

Tenemos que definir un `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Ahora crearemos un directorio `api` que contendrá los ficheros fuente para los DTOs. Destacar que **no vamos a hacer build de este directorio común, copiaremos los ficheros utilizando este directorio como fuente de verdad**. Por ejemplo, `example.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExampleDto {
  @ApiProperty({
    description: 'Property description'
  })
  @IsString()
  @IsNotEmpty()
  test: string;

  other: number;
}
```

### Script para distribuir los DTOs para backend y frontend

Instalaremos estas dependencias en el directorio raíz.

```sh
npm i -D cpx rimraf npm-run-all
```

Definimos los siguientes scripts para distribuir los DTOs.

```json
// ---- scripts section from package.json
"scripts": {
    "predistribute:api:frontend": "rimraf frontend/src/api",
    "distribute:api:frontend": "cpx ./common/api/**/* ./frontend/src/api",
    "predistribute:api:backend": "rimraf backend/src/api",
    "distribute:api:backend": "cpx ./common/api/**/* ./backend/src/api",
    "distribute:api": "npm-run-all distribute:api:frontend distribute:api:backend"
}
// ----
```

Finalmente, ejecutaremos el script para distribuir el directorio `api`:

```sh
npm run distribute:api
```

Ya estamos listos para configurar `frontend` y `backend` con sus dependencias y configuración.

### Configurando el frontend

Tenemos que instalar las dependencias de NestJS, pero no te preocupes, no serán incluidas en el bundle final.

```sh
npm i @nestjs/swagger class-validator
```

Y estas dependencias de desarrollo:

```sh
npm i -D @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators @types/node
```

Actualizaremos el `tsconfig.json`, añadiendo las líneas destacadas:

```json {linenos=table,hl_lines=["3", "18-19"]}
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strictPropertyInitialization": false
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Actualizaremos el `tsconfig.node.json` también:

```json {linenos=table,hl_lines=["7"]}
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true
  },
  "include": ["vite.config.ts"]
}
```

Finalmente tenemos que actualizar `vite.config.ts`. Añadiremos los plugins de Babel necesarios para procesas decoradores, y crearemos un alias para el archivo shim utilizado por `@nestjs/swagger`. Aunque no tenemos planeado instanciar ninguna clase de los DTOs, **es siempre una buena idea disponer de una opción de fallback** para algún caso de uso imprevisto o error. **Este alias previene cargar codigo y polyfills innecesarios** que serían requeridos en tales casos.

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

const swaggerShimFile = 'node_modules/@nestjs/swagger/dist/extra/swagger-shim.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@nestjs/swagger': path.resolve(__dirname, swaggerShimFile)
    }
  }
});
```

Ahora podemos ir al fichero `App.tsx`, y poner un ejemplo muy básico. Importaremos nuestro `example.dto` y lo usaremos como tipo.

```tsx
import './App.css';
import { ExampleDto } from './api/example.dto';

const example: ExampleDto = {
  test: 'testValue',
  other: 2
};

function App() {
  return <div className="App">Hello world</div>;
}

export default App;
```

¡Genial! Tendremos **errores en typescript** si no estamos definiendo correctamente el objeto, y una **maravillosa experiencia de desarrollo gracias al autocompletado**. Puedes comprobar que el proyecto se inicia sin errores ejecutando `npm run dev` y ejecutando el build con `npm run build`.

```sh
> frontend@0.0.0 build
> tsc && vite build

vite v4.2.2 building for production...
✓ 33 modules transformed.
dist/index.html                   0.46 kB
dist/assets/index-d526a0c5.css    1.42 kB │ gzip:  0.74 kB
dist/assets/index-d40907b6.js   142.90 kB │ gzip: 45.87 kB
```

Para asegurarnos que el fichero shim está funcionando correctamente, editamos el fichero `App.tsx` e instanciamos un objeto `ExampleDto`.

```tsx
import './App.css';
import { ExampleDto } from './api/example.dto';

const example = new ExampleDto();

function App() {
  return <div className="App">Hello world</div>;
}

export default App;
```

Resultado con la configuración de Vite con el archivo shim (el fichero JS crece un poco):

```sh
> frontend@0.0.0 build
> tsc && vite build

vite v4.2.2 building for production...
✓ 586 modules transformed.
dist/index.html                   0.46 kB
dist/assets/index-d526a0c5.css    1.42 kB │ gzip:  0.74 kB
dist/assets/index-e4051b0b.js   154.29 kB │ gzip: 49.15 kB
```

Y el resultado sin archivo shim:

```sh
> frontend@0.0.0 build
> tsc && vite build

vite v4.2.2 building for production...
transforming (1213) node_modules/rxjs/dist/cjs/internal/util/Immediate.js"@nestjs/websockets/socket-module" is imported by "@nestjs/websockets/socket-module?commonjs-external", but could not be resolved – treating it as an external dependency.
"@nestjs/microservices/microservices-module" is imported by "@nestjs/microservices/microservices-module?commonjs-external", but could not be resolved – treating it as an external dependency.
"class-transformer/storage" is imported by "class-transformer/storage?commonjs-external", but could not be resolved – treating it as an external dependency.
✓ 2053 modules transformed.
dist/index.html                     0.46 kB
dist/assets/index-d526a0c5.css      1.42 kB │ gzip:   0.74 kB
dist/assets/index-f46b4c53.js   1,053.06 kB │ gzip: 296.88 kB

(!) Some chunks are larger than 500 kBs after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 6.90s
```

Como mencioné anteriormente, si utilizamos DTOs como tipos, esto no ocurrirá, pero es mejor tener configurado el archivo shim por precaución.

### Configurando el backend

Este paso es más sencillo porque **NestJS ya está preparado para trabajar con decorators y DTOs**, asi que simplemente instalamos las dependencias:

```sh
npm i @nestjs/swagger class-validator class-transformer
```

Destacar que `class-transformer` es requerido junto con `class-validator`. Actualizamos el fichero `main.ts` con estos cambios:

```ts {linenos=table,hl_lines=["8-16"]}
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false
    })
  );

  await app.listen(3050);
}
bootstrap();
```

Este proceso [está comentado en la documentación oficial de NestJS][3]. Ahora probemos con un ejemplo muy sencillo. Reemplazamos el contenido de `app.controller.ts` con el siguiente código:

```ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ExampleDto } from './api/example.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  postHello(@Body() exampleDto: ExampleDto) {
    return this.appService.postHello(exampleDto);
  }
}
```

Y `app.service.ts` con:

```ts
import { Injectable } from '@nestjs/common';
import { ExampleDto } from './api/example.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  postHello(exampleDto: ExampleDto) {
    return {
      success: true
    };
  }
}
```

Nuestro endpoint está tipado correctamente, podemos beneficiarnos de las validaciones con decoradores y tendremos nuestra [API documentada con su swagger][2] (esta parte ha sido omitida en esta guía). Podemos comprobar que los decoradores están funcionando ejecutando `npm run start:dev`, y haciendo una petitición post con parámetros a `http://localhost:3050/test`.

Si la propiedad `test` no es un string, obtendremos un error.

Body para la request:

```json
{
  "test": 2,
  "other": 2
}
```

Respuesta:

```json
{
  "statusCode": 400,
  "message": ["test must be a string"],
  "error": "Bad Request"
}
```

Si utilizamos string, la petición termina correctamente.

Body para la request:

```json
{
  "test": "2",
  "other": 2
}
```

Respuesta:

```json
{
  "success": true
}
```

## Resumen y conclusión

Hemos experimentado cómo **compartir DTOs entre un backend NestJS y un frontend React**. Aunque puede que haya métodos alternativos, no hay mucha información disponible acerca de este tema. Por tanto, en esta guía tenemos una solución que funciona.

Hay espacio para mejorar el enfoque, como ignorar el directorio API en el `backend` y `frontend`, que tiene el mismo contenido que el directorio `common`.

Para evitar errores en el futuro, asegurate de instalar la misma versión de `@nestjs/swagger` y `class-validator` en los 3 proyectos.

Espera que esta guía haya sido de utilidad. Puedes encontrar [el ejemplo en este repositorio][4].

[1]: https://docs.nestjs.com/pipes#class-validator
[2]: https://docs.nestjs.com/openapi/introduction
[3]: https://docs.nestjs.com/techniques/validation
[4]: https://github.com/javifm86/vite-react-nest-share-dtos
