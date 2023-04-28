using System.Reflection;
using System.Text.Json;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using Bencodex;
using Libplanet.Action;
using Nekoyume.Action;
using static Lib9c.Wasm.JsonUtils;

namespace Lib9c.Wasm;

[SupportedOSPlatform("browser")]
public partial class Program
{

    public static void Main()
    {
        JS.Runtime.ConfigureJson(options =>
        {
            options.IncludeFields = true;
        });
    }

    public record Input(string Name, string Type);

    [JSExport]
    public static string[] GetAllActionTypes()
    {
        var types = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .Where(t => t.IsDefined(typeof(ActionTypeAttribute)) && t != typeof(InitializeStates) && t != typeof(CreatePendingActivations));
        return types.Select(x => ActionTypeAttribute.ValueOf(x)).Where(x => x is Bencodex.Types.Text).Select(x => ((Bencodex.Types.Text)x).Value).ToArray();
    }

    [JSExport]
    public static string GetAvailableInputs(string actionTypeString)
    {
        Console.WriteLine(actionTypeString);
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) is Bencodex.Types.Text text && text.Value == actionTypeString);

        return ResolveType(actionType);
    }

    [JSExport]
    public static byte[] BuildAction(string actionTypeString, [JSMarshalAsAttribute<JSType.Any>] Object dictionary)
    {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) is Bencodex.Types.Text text && text.Value == actionTypeString);

        var action = (IAction)dictionary;
        return new Codec().Encode(((PolymorphicAction<ActionBase>)(dynamic)action).PlainValue);
    }
}
