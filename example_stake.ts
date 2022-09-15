import { buildAction } from "./wrapper";

async function main() {
    const dotnet = require('./Lib9c.Wasm/bin/dotnet');
    await dotnet.boot();

    console.log(Buffer.from(buildAction("stake", {
        Amount: 10n,
    })).toString("hex"));
}

main()
