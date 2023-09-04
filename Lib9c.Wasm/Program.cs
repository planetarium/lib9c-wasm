using System.Reflection;
using System.Security.Cryptography;
using System.Text.Json;
using Bencodex;
using DotNetJS;
using Microsoft.JSInterop;
using Libplanet.Common;
using Libplanet.Action;
using Libplanet.Action.State;
using Libplanet.Crypto;
using Libplanet.Types.Assets;
using Nekoyume;
using Nekoyume.Action;
using Nekoyume.Battle;
using Nekoyume.Extensions;
using Nekoyume.Action;
using Nekoyume.Model;
using Nekoyume.Model.Item;
using Nekoyume.Model.Mail;
using Nekoyume.Model.Quest;
using Nekoyume.Model.Rune;
using Nekoyume.Model.Skill;
using Nekoyume.Model.State;
using Nekoyume.TableData;
using Lib9c.Tests;
using Lib9c.Tests.Action;
using static Lib9c.Wasm.JsonUtils;

namespace Lib9c.Wasm;
public class Program
{
    public static void Main()
    {
        JS.Runtime.ConfigureJson(options =>
        {
            options.IncludeFields = true;
        });
    }

    public record Input(string Name, string Type);

    [JSInvokable]
    public static string[] GetAllActionTypes()
    {
        var types = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .Where(t => t.IsDefined(typeof(ActionTypeAttribute)) && t != typeof(InitializeStates) && t != typeof(CreatePendingActivations));
        return types.Select(x => x.GetCustomAttribute<ActionTypeAttribute>()?.TypeIdentifier).Where(x => x is Bencodex.Types.Text).Select(x => ((Bencodex.Types.Text)x).Value).ToArray();
    }

    [JSInvokable]
    public static string GetAvailableInputs(string actionTypeString)
    {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && t.GetCustomAttribute<ActionTypeAttribute>()?.TypeIdentifier is Bencodex.Types.Text text && text.Value == actionTypeString);

        return ResolveType(actionType);
    }

    [JSInvokable]
    public static byte[] BuildAction(string actionTypeString, JsonElement dictionary)
    {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && t.GetCustomAttribute<ActionTypeAttribute>()?.TypeIdentifier is Bencodex.Types.Text text && text.Value == actionTypeString);

        var action = (IAction)ConvertJsonElementTo(dictionary, actionType);
        return new Codec().Encode(((ActionBase)(dynamic)action).PlainValue);
    }

    [JSInvokable]
    public static string UseStageSimulator(string avatarState, string PreEvaluationHash, string signature, int worldId, int stageId, JsonElement jsonsheet)
    {
        var preEvaluationHashBytes = ByteUtil.ParseHex(PreEvaluationHash);
        byte[] hashedSignature;
        using (var hasher = SHA1.Create())
        {
            hashedSignature = hasher.ComputeHash(ByteUtil.ParseHex(signature));
        }

        var _sheets = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonsheet);
        var _tableSheets = new TableSheets(_sheets);
        var state = (Bencodex.Types.Dictionary)new Codec().Decode(ByteUtil.ParseHex(avatarState));

        AvatarState _avatarState = new AvatarState(state);

        var seed = (preEvaluationHashBytes.Length > 0
                    ? BitConverter.ToInt32(preEvaluationHashBytes, 0) : 0)
                ^ (signature.Any() ? BitConverter.ToInt32(hashedSignature, 0) : 0) - 0;
        var contextRandom = new TestRandom(seed);

        var simulator = new StageSimulator(
                contextRandom,
                _avatarState,
                new List<Guid>(),
                new List<RuneState>(),
                new List<Skill>(),
                worldId,
                stageId,
                _tableSheets.StageSheet[stageId],
                _tableSheets.StageWaveSheet[stageId],
                false,
                StageRewardExpHelper.GetExp(_avatarState.level, stageId),
                _tableSheets.GetSimulatorSheets(),
                _tableSheets.EnemySkillSheet,
                _tableSheets.CostumeStatSheet,
                StageSimulatorV3.GetWaveRewards(
                    contextRandom,
                    _tableSheets.StageSheet[stageId],
                    _tableSheets.MaterialItemSheet));
        simulator.Simulate();
        var log = simulator.Log;
        return $"{log.result}, {log.clearedWaveNumber}, {log.waveCount}";
    }
}
