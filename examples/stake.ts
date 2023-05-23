import { stake } from "../generated/actions";
import { boot } from "../generated";

import { toHex } from "../utils";

async function main() {
    await boot();

    const action = stake({
        amount: String(1000n)
    });

    console.log(toHex(action));
}

main()
