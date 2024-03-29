import { claim_stake_reward } from "../generated/actions";
import { boot } from "../generated";
import { Address, toHex } from "../generated/utils";

async function main() {
    await boot();

    const action = claim_stake_reward({
        avatarAddress: new Address("0x0000000000000000000000000000000000000001"),
    });

    console.log(toHex(action));
}

main()
