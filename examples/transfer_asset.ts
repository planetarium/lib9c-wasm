import { transfer_asset2 } from "../generated/actions";
import { boot } from "../generated";

import { toHex } from "../utils";
import { Address, Currency } from "../generated/utils";

async function main() {
    await boot();

    const action = transfer_asset2({
        amount: {
            currency: new Currency({
                ticker: "NCG",
                decimalPlaces: 2,
                minters: []
            }),
            sign: 1,
            majorUnit: "10",
            minorUnit: "10"
        },
        sender: new Address("0x2cBaDf26574756119cF705289C33710F27443767"),
        recipient: new Address("0x2cBaDf26574756119cF705289C33710F27443767"),
        memo: "MY MEMO",
    });

    console.log(toHex(action));
}

main()
