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
        Amount: 1000n,
    });
    console.log(toHex(action));

    const publicKey = parseHex("0428c66126c62dde22c84cfa55a0578762c95481a81c4b4b2ccf63024b0929bb1bc2ca84f8a4e0bbc164a204bfb86fe38a45af3b86f142585a11d6a03818abe8ca");
    const signer = parseHex("2cBaDf26574756119cF705289C33710F27443767");
    const genesisHash = parseHex("15e07324f162d7f28037dc2ab88439c4103602c204af9052befb8a44249ef1fb");
    const tx = buildTransaction(2, publicKey, signer, genesisHash, action);
    console.log(toHex(tx));
}

main()
