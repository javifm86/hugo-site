---
title: "Share DTOs between NestJS and React"
date: 2023-04-18
author: javi
type: post
img: img/monorepo-react-nestjs.jpg
altImg: React and NestJS logos
toc: true
tags:
    - react
---

Over the past two years, I have been heavily involved in working on projects that utilize a monorepo architecture, with `NestJS` as the backend and `React` for the frontend. As a result of this experience, I have developed an approach to **efficiently share DTOs between the two layers**. If you search information about this topic, you won’t find quickly a solution, so there I go!

## DTO (Data Transfer Object)
First of all, what is a **DTO (Data Transfer Object)**? From NestJS official documentation:

 > A DTO is an object that defines how the data will be sent over the network. We could determine the DTO schema by using TypeScript interfaces, or by simple classes. Interestingly, we recommend using classes here. Why? Classes are part of the JavaScript ES6 standard, and therefore they are preserved as real entities in the compiled JavaScript. On the other hand, since TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime. This is important because features such as Pipes enable additional possibilities when they have access to the metatype of the variable at runtime.

 I love how easy is validating params with DTOs in NestJS, you can use [`class-validator` decorators for validating input params][1] without writing a single line of code.

 You can [document and generate swagger for your endpoints][2] leveraging decorators.

 An example for a DTO:

 ```ts
 export class ExampleRequestDto {
  @ApiProperty({
    description: 'Person ID',
    example: 'a94dd9b3-c0ae-43e2-b13e-31fce2e60203',
  })
  @IsNotEmpty()
  personId: string;

  @ApiProperty({
    description: 'Address ID',
    example: 'a94dd9b3-c0ae-43e2-b13e-31fce2e60203',
  })
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({
    description: 'Telephone number ID',
    example: '3e26f0e9-22e4-46eb-a14e-ad37fbdf2144',
  })
  @IsNotEmpty()
  @IsOptional()
  phoneNumberId?: string;
}
```

With this DTO we can **validate the input params** for an endpoint, **we have the types**, and we can **generate a beautiful swagger** with information for developers that want to use this API. Very cool, right?

Wouldn't it be great if we could use a single DTO as the source of truth for typing input params in the frontend service? This would eliminate the need for duplicating type definitions. Initially, I had to generate a separate version of the DTO using a plain TypeScript interface, as decorators are not possible in this case. This was a tedious and time-consuming process, but using a unified DTO makes the development process much smoother and more efficient.

## Using DTOs for typing in the frontend

How can we use the same DTO with decorators in the frontend without adding unnecessary things to our bundle? Initially, it might seem like installing dependencies like `@nestjs/swagger` and `class-validator` and importing them would add unnecessary bloat to your bundle.

However, from my testing, **if you only use the DTO as a type, it won't increase the size of the final bundle since types are removed during the bundling process**. Therefore, even if you use a class for defining the DTO, the references to it won't be included in the final bundle as long as it's only used for typing. Here's an example configuration for a monorepo setup.

## Preparing the monorepo

We will create in the root folder 3 directories: `backend`, `frontend` and `common` (here we will keep the shared DTOs).

### Backend with NestJS

We will bootstrap a backend project with NestJS using the CLI:

```sh
nest new backend
cd backend
npm i
```

### Frontend with React
Since CRA is officially deprecated, we will use Vite, which is faster and one of the easiest options for scaffolding a React project without a framework.

```sh
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

### Common folder
We will create a common folder where we will have the DTOs reused in frontend and backend, and we will install dependencies.

```sh
mkdir common
cd common
npm i @nestjs/swagger class-validator
npm i -D typescript
```

We have to define a `tsconfig.json` as well:

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

Now we will create an `api` folder that will contain the source files for DTOs. Notice that **we are not going to build this common folder, we will copy the files using this folder as a single source of true**. For example, `example.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExampleDto {
  @ApiProperty({
    description: 'Property description',
  })
  @IsString()
  @IsNotEmpty()
  test: string;

  other: number;
}
```

### Script to distribute DTOs for backend and frontend
Install these dependencies in the root folder.

```sh
npm i -D cpx rimraf npm-run-all
```

Define the following scripts to distribute the DTOs.


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

Finally, we execute the script to distribute the api `folder`:

```sh
npm run distribute:api
```

Now we are ready to configure `frontend` and `backend` with some dependencies and configuration.

### Configuring frontend

We have to install NestJS dependencies, but don't worry, they won't be included in the final bundle.

```sh
npm i @nestjs/swagger class-validator
```

And these dev dependencies:

```sh
npm i -D @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators @types/node
```

Update `tsconfig.json`, added lines to the default file are highlighted:

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
    "strictPropertyInitialization":false
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Update `tsconfig.node.json` as well:

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

Finally, we need to update `vite.config.ts`. We'll add the necessary Babel plugins for processing decorators, and we'll create an alias for a shim file used by `@nestjs/swagger`. While we don't plan on instantiating any DTO classes, **it's always good to have a fallback option** in case there are any unforeseen use cases. **This alias will prevent unnecessary loading of polyfills and chunks of code** that would be required in such scenarios.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

const swaggerShimFile =
  "node_modules/@nestjs/swagger/dist/extra/swagger-shim.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }],
          ["@babel/plugin-proposal-class-properties", { loose: true }],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@nestjs/swagger": path.resolve(__dirname, swaggerShimFile),
    },
  },
});
```

Now we can go to `App.tsx` file, and put a very basic example. We will import our `example.dto` and use it as a type.

```tsx
import "./App.css";
import { ExampleDto } from "./api/example.dto";

const example: ExampleDto = {
  test: "testValue",
  other: 2,
};

function App() {
  return <div className="App">Hello world</div>;
}

export default App;
```

Nice! We have **typescript errors** if we are not defining properly the object, and a **beautiful autocompletion experience**. You can check the project starts without errors running `npm run dev` and building with `npm run build`.

```sh
> frontend@0.0.0 build
> tsc && vite build

vite v4.2.2 building for production...
✓ 33 modules transformed.
dist/index.html                   0.46 kB
dist/assets/index-d526a0c5.css    1.42 kB │ gzip:  0.74 kB
dist/assets/index-d40907b6.js   142.90 kB │ gzip: 45.87 kB
```

To ensure that the shim file is functioning correctly, you can edit the `App.tsx` file and instantiate an `ExampleDto` object.

```tsx
import "./App.css";
import { ExampleDto } from "./api/example.dto";

const example = new ExampleDto();

function App() {
  return <div className="App">Hello world</div>;
}

export default App;
```

Result with the vite config with shim file (JS file grew up a bit):

```sh
> frontend@0.0.0 build
> tsc && vite build

vite v4.2.2 building for production...
✓ 586 modules transformed.
dist/index.html                   0.46 kB
dist/assets/index-d526a0c5.css    1.42 kB │ gzip:  0.74 kB
dist/assets/index-e4051b0b.js   154.29 kB │ gzip: 49.15 kB
```

And look at the result without shim file:

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

As I mentioned earlier, if we use DTOs as types, this won't happen, but it's better to have configured the shim file just in case we are missing something.

### Configuring backend
This step is much simpler because **NestJS is ready to work with decorators and DTOs**, so we just have to install dependencies:

```sh
npm i @nestjs/swagger class-validator class-transformer
```

Note that `class-transformer` is required altogether with `class-validator`. We update `main.ts` file with these changes:

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
      forbidNonWhitelisted: false,
    }),
  );

  await app.listen(3050);
}
bootstrap();
```

This process [is documented in NestJS documentation][3]. Now let's use it in a pretty straightforward example. Replace `app.controller.ts` content with this code:

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

And `app.service.ts` with:

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
      success: true,
    };
  }
}
```

Our endpoint is properly typed, we can benefit from decorators validations and we would have our [API documented with the swagger][2] (this part has been omitted in this guide). We can test decorators are working running `npm run start:dev`, and making a post petition with params to `http://localhost:3050/test`.

If `test` property is not string, we get an error.

Body for the request:
```json
{
  "test": 2,
  "other": 2
}
```

Response:
```json
{
  "statusCode": 400,
  "message": [
    "test must be a string"
  ],
  "error": "Bad Request"
}
```

Once we put a string, the petition runs successfully.

Body for the request:
```json
{
  "test": "2",
  "other": 2
}
```

Response:
```json
{
  "success": true
}
```

## Summary and conclusion

We have explored an approach for **sharing DTOs between the NestJS backend and the React frontend**. While it's possible that there may be alternative methods, there isn't a lot of information available on this topic. Hence, we have presented a working solution through this guide.

There is scope for further improvement, such as ignoring the API folders in the `backend` and `frontend` repositories, which have the same content as the `common` folder.

To avoid any issues in the future, make sure that you install the same version of the `@nestjs/swagger` and `class-validator` packages in all three projects.

We hope this guide has been helpful to you. **Happy coding!**

 [1]: https://docs.nestjs.com/pipes#class-validator
 [2]: https://docs.nestjs.com/openapi/introduction
 [3]: https://docs.nestjs.com/techniques/validation
