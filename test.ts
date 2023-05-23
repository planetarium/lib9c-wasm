import { boot } from "./generated/index";
import { stake, transfer_asset3 } from "./generated/actions";
import { Currency, Address } from "./generated/utils";

(async () => {
  await boot();
  console.log(Buffer.from(stake({ amount: "1000" })).toString("hex"));
  console.log(
    Buffer.from(
      transfer_asset3({
        amount: {
          currency: new Currency({
            ticker: "NCG",
            decimalPlaces: 2,
            minters: [new Address("47d082a115c63e7b58b1532d20e631538eafadde")],
          }),
          sign: 1,
          majorUnit: "1000",
          minorUnit: "0",
        },
        sender: new Address("eb9afe072c781401bf364224c75a036e4d832f52"),
        recipient: new Address("eb9afe072c781401bf364224c75a036e4d832f52"),
        memo: "aaaa",
      })
    ).toString("hex")
  );
})();
