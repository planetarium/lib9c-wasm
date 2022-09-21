using System.Reflection;
using Bencodex;
using Libplanet.Action;
using Microsoft.JSInterop;
using Nekoyume.Action;
using static Lib9c.Wasm.JsonUtils;

namespace Lib9c.Wasm;
public class Program
{
    public static void Main() { }

    public record Input(string Name, string Type);

    [JSInvokable]
    public static string[] GetAllActionTypes()
    {
        var types = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .Where(t => t.IsDefined(typeof(ActionTypeAttribute)));
        return types.Select(x => ActionTypeAttribute.ValueOf(x)).ToArray();
    }

    [JSInvokable]
    public static string GetAvailableInputs(string actionTypeString)
    {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) == actionTypeString);
        var fields = actionType.GetFields(BindingFlags.Public | BindingFlags.Instance).Where(f => f.IsPublic);
        var properties = actionType.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).Where(p => p.CanWrite);
        return ResolveType(actionType);
        // return fields.Select(f => new Input(f.Name, ResolveType(f.FieldType, f.Name))).Concat(properties.Select(p => new Input(p.Name, ResolveType(p.PropertyType)))).ToArray();
    }

    [JSInvokable]
    public static byte[] BuildAction(string actionTypeString, Dictionary<string, object> dictionary)
    {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) == actionTypeString);

        IAction action = (IAction)Activator.CreateInstance(actionType);
        FillFieldsFromJsonElements(actionType, action, dictionary);

        return new Codec().Encode(((PolymorphicAction<ActionBase>)(dynamic)action).PlainValue);
    }

    [JSInvokable]
    public static byte[] BuildRawTransaction(long nonce, byte[] publicKey, byte[] address, byte[] genesisHash, byte[] action)
    {
        var tx = new RawUnsignedTransaction(nonce, publicKey, address, genesisHash, action, DateTimeOffset.UtcNow);
        return tx.Serialize();
    }

    private static string RemoveUnexpectedParts(string typeName)
    {
        int index = typeName.IndexOf('`');
        return index == -1 ? typeName : typeName.Substring(0, index);
    }
}
