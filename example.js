const dotnet = require('./Lib9c.Wasm/bin/dotnet');

async function main() {
    await dotnet.boot();
    console.log(dotnet.Lib9c.Wasm.GetAvailableInputs("hack_and_slash"));
    console.log(Buffer.from(dotnet.Lib9c.Wasm.BuildAction('hack_and_slash', {
        stageId: 0,
        worldId: 0,
        costumes: [],
        foods: [],
        equipments: [],
        avatarAddress: "0x0000000000000000000000000000000000000000",
        WeeklyArenaAddress: "0x0000000000000000000000000000000000000000",
        RankingMapAddress: "0x0000000000000000000000000000000000000000",
    })).toString('hex'));
}

main().then().catch(console.error)