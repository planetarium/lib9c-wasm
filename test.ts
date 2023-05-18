import { create, stake } from "./generated/index.js";

(async() => {
  await create();
  console.log(globalThis.Lib9c);
  console.log(Buffer.from(stake({Amount: "1000"})).toString("hex"));
})();