import { RuntimeAPI, dotnet } from "./dotnet.js";
interface Lib9cExport {
  Wasm: {
    Program: any
  }
}

declare global {
  var Lib9c: Lib9cExport;
}
export async function create(): Promise<void> {
  await dotnet
    .create()
    .then((api: RuntimeAPI) => {
      return api.getAssemblyExports("Lib9c.Wasm.dll");
    })
    .then((Lib9c) => {
      globalThis.Lib9c = Lib9c.Lib9c;
    });
}

export * from "./actions.js";
