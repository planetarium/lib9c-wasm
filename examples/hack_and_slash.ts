import { hack_and_slash14 } from "../generated/actions";
import { boot } from "../generated";
import { Address } from "../generated/utils";

import { toHex } from "../utils";

async function main() {
    await boot();

    const action = hack_and_slash14({
        avatarAddress: new Address("0x2cBaDf26574756119cF705289C33710F27443767"),
        costumes: [],
        equipments: [],
        foods: [],
        stageBuffId: null,
        stageId: 10,
        worldId: 1
    });

    console.log(toHex(action));
}

main()
