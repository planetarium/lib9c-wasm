import { stake } from "../generated/actions";
import { boot } from "../generated";

import { toHex } from "../static/utils";

async function main() {
    await boot();

    const action = stake({
        amount: String(1000n)
    });

    console.log(toHex(action));
}

main()
