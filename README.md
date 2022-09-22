# lib9c-wasm
The experimental project to part Lib9c into JavaScript environment through WASM.

## Prerequisite

  - [.NET](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
  - [yarn](https://yarnpkg.com/)
  - [node](https://nodejs.org/en/) (> 16.17.0)

## Git clone

```
git clone --recurse-submodules https://github.com/moreal/lib9c-wasm
```

## Build

You can get `wrapper.ts` by using the below command:

```
yarn build
```

## Run example

You can run example with the below steps:

```
yarn build
yarn ts-node example_stake.ts
```

## Generate docs

You can generate docs with the below command:

```
yarn generate-docs
```

It'll generate `/docs` directory then you can open the `/docs/index.html` file in your browser.

## Run .NET tests

You can run .NET tests.

```
dotnet test
```
