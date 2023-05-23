import { buy12 } from "../generated/actions";
import { boot } from "../generated";
import { toHex, Address, Guid, Currency } from "../generated/utils";


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

    console.log(toHex(action));
}

main()
