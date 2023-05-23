using System.Reflection;
using System.Text.Json;
using Bencodex;
using DotNetJS;
using Libplanet.Action;
using Microsoft.JSInterop;
using Nekoyume.Action;
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
        return types.Select(x => ActionTypeAttribute.ValueOf(x)).Where(x => x is Bencodex.Types.Text).Select(x => ((Bencodex.Types.Text)x).Value).ToArray();
    }

    [JSInvokable]
    public static string GetAvailableInputs(string actionTypeString)
    {
        bool IsIgnoredVariableName(string name)
        {
            return name == "errors"
                || name == "PlainValue"
                || name == "PlainValueInternal"
                || name.StartsWith("Extra");
        }

        bool IsIgnoredType(Type type)
        {
            return type.Name.EndsWith("BattleLog")
                || type.Name.EndsWith("Result")
                || type.Name.EndsWith("AvatarState")
                || type.Name.EndsWith("ArenaInfo")
                || type.Name.EndsWith("Digest");
        }

        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) is Bencodex.Types.Text text && text.Value == actionTypeString);

        var fields = actionType.GetFields(BindingFlags.Public | BindingFlags.Instance).Where(f => f.IsPublic && !IsIgnoredVariableName(f.Name) && !IsIgnoredType(f.FieldType));
        var properties = actionType.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).Where(p => p.CanWrite && !IsIgnoredVariableName(p.Name) && !IsIgnoredType(p.PropertyType));
        // Map fields and properties to their TypeScript types
        var inputs = fields.Select(f => $"{f.Name}: {ResolveType(f.FieldType)}").Concat(properties.Select(p => $"{p.Name}: {ResolveType(p.PropertyType)}")).ToArray();

        // Combine the TypeScript types into a single object type
        var typeInfo = "{" + string.Join(", ", inputs) + "}";

        return ResolveType(actionType);
    }

    [JSInvokable]
    public static byte[] BuildAction(string actionTypeString, JsonElement dictionary)
    {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) is Bencodex.Types.Text text && text.Value == actionTypeString);

        var action = (IAction)ConvertJsonElementTo(dictionary, actionType);
        return new Codec().Encode(((PolymorphicAction<ActionBase>)(dynamic)action).PlainValue);
    }
}
