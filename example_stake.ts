import { buildAction, boot } from "./wrapper";

async function main() {
    await boot();

    const action = buildAction("stake", {
        Amount: 10n,
    });
    console.log(Buffer.from(action).toString("hex"));

    const dotnet = require("./Lib9c.Wasm/bin/dotnet")
    const publicKey = Uint8Array.from(Buffer.from("03b672312dec15f25acaae755c7293945223b6c678d39758fdfcf6bea5efe82de8", "hex"));
    const signer = Uint8Array.from(Buffer.from("89BcA8110e12aC68D124f06Dd0E19D909b4Ada6F", "hex"));
    const genesisHash = Uint8Array.from(Buffer.from("4582250d0da33b06779a8475d283d5dd210c683b9b999d74d03fac4f58fa6bce", "hex"));
    const tx = dotnet.Lib9c.Wasm.BuildRawTransaction(0, publicKey, signer, genesisHash, action);
    console.log(Buffer.from(tx).toString("hex"));
}

main()
