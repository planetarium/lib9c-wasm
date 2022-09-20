import { buildAction, boot } from "./wrapper";

async function main() {
    await boot();

    console.log(Buffer.from(buildAction("stake", {
        Amount: 10n,
    })).toString("hex"));
}

main()
