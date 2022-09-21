import { buildAction, buildTransaction, boot } from "./wrapper";

function parseHex(hex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hex, "hex"));
}

function toHex(buf: Uint8Array): string {
    return Buffer.from(buf).toString("hex");
}

async function main() {
    await boot();

    const action = buildAction("stake", {
        Amount: 10n,
    });
    console.log(toHex(action));

    const publicKey = parseHex("03b672312dec15f25acaae755c7293945223b6c678d39758fdfcf6bea5efe82de8");
    const signer = parseHex("89BcA8110e12aC68D124f06Dd0E19D909b4Ada6F");
    const genesisHash = parseHex("4582250d0da33b06779a8475d283d5dd210c683b9b999d74d03fac4f58fa6bce");
    const tx = buildTransaction(0, publicKey, signer, genesisHash, action);
    console.log(toHex(tx));
}

main()
