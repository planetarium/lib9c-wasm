import { boot } from "./generated/index";
import { stake } from "./generated/actions"

(async() => {
  await boot();
  console.log(Buffer.from(stake({Amount: "1000"})).toString("hex"));
})();