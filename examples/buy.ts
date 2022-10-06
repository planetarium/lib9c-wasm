import { buy12 } from "../generated/actions";
import { buildUnsignedTransaction, attachSignature } from "../generated/tx";
import { boot } from "../generated";
import { parseHex, toHex, Address, Guid, Currency } from "../generated/utils";

import { ec as EC } from "elliptic";
import { createHash } from "crypto";

async function main() {
    await boot();

    const action = buy12({
        buyerAvatarAddress: new Address("0xab51b5ac8778a0f00d340b1db07fe68de41fbc1d"),
        purchaseInfos: [{
            orderId: new Guid("0525715e-eb08-44f7-a851-535ed1f19d83"),
            avatarAddress: new Address("0xab51b5ac8778a0f00d340b1db07fe68de41fbc1d"),
            agentAddress: new Address("0xab51b5ac8778a0f00d340b1db07fe68de41fbc1d"),
            type: "Food",
            tradableId: new Guid("0525715e-eb08-44f7-a851-535ed1f19d83"),
            itemPrice: {
                currency: new Currency({
                    ticker: "NCG",
                    decimalPlaces: 2,
                    minters: [
                        new Address("0x47d082a115c63e7b58b1532d20e631538eafadde")
                    ]
                }),
                sign: 1,
                majorUnit: "10000",
                minorUnit: "11"
            },
        }],
    });

    const publicKey = parseHex("0428c66126c62dde22c84cfa55a0578762c95481a81c4b4b2ccf63024b0929bb1bc2ca84f8a4e0bbc164a204bfb86fe38a45af3b86f142585a11d6a03818abe8ca");
    const signer = parseHex("2cBaDf26574756119cF705289C33710F27443767");
    const genesisHash = parseHex("15e07324f162d7f28037dc2ab88439c4103602c204af9052befb8a44249ef1fb");
    
    const unsignedTx = buildUnsignedTransaction(6, publicKey, signer, genesisHash, action);

    const txid = createHash("sha256")
        .update(unsignedTx)
        .digest();
    const ec = new EC('secp256k1');
    // WARNING: DO NOT USE THIS PRIVATE KEY.
    const privateKey = ec.keyFromPrivate("e803887ad70b94fc7bece28e7b7f36807aa6241b177035c38bbbaac7183a7c1b");
    const sig = privateKey.sign(txid);

    if (!ec.n) throw new Error("unexpected n");
    const otherS = ec.n.sub(sig.s);
    if (sig.s.cmp(otherS) === 1) {
        sig.s = otherS;
    }

    const signature = Uint8Array.from(sig.toDER());
    const tx = attachSignature(unsignedTx, signature);
    console.log(toHex(tx));
}

main()
