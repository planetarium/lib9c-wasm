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
    }

    public record Input(string Name, string Type);

    [JSExport]
    public static string[] GetAllActionTypes()
    {
        var types = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .Where(t => t.IsDefined(typeof(ActionTypeAttribute)) && t != typeof(InitializeStates) && t != typeof(CreatePendingActivations));
        return types.Select(x => ActionTypeAttribute.ValueOf(x)).ToArray();
    }

    [JSExport]
    public static string GetAvailableInputs(string actionTypeString)
    {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) == actionTypeString);
        var fields = actionType.GetFields(BindingFlags.Public | BindingFlags.Instance).Where(f => f.IsPublic);
        var properties = actionType.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).Where(p => p.CanWrite);

        // Map fields and properties to their TypeScript types
        var inputs = fields.Select(f => $"{f.Name}: {ResolveType(f.FieldType)}").Concat(properties.Select(p => $"{p.Name}: {ResolveType(p.PropertyType)}")).ToArray();

        // Combine the TypeScript types into a single object type
        var typeInfo = "{" + string.Join(", ", inputs) + "}";

        return typeInfo;
    }

    [JSExport]
    public static byte[] BuildAction(string actionTypeString, [JSMarshalAsAttribute<JSType.Any>] Object dictionary)
    {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) == actionTypeString);

        var action = (IAction)dictionary;
        return new Codec().Encode(((PolymorphicAction<ActionBase>)(dynamic)action).PlainValue);
    }

    [JSExport]
    public static byte[] BuildRawTransaction([JSMarshalAsAttribute<JSType.BigInt>] long nonce, byte[] publicKey, byte[] address, byte[] genesisHash, byte[] action)
    {
        var tx = new RawUnsignedTransaction(nonce, publicKey, address, genesisHash, action, DateTimeOffset.UtcNow);
        return tx.Serialize();
    }

    [JSExport]
    public static byte[] AttachSignature(byte[] unsignedTransaction, byte[] signature)
    {
        return RawUnsignedTransaction.Deserialize(unsignedTransaction).AttachSignature(signature).Serialize();
    }

    [JSExport]
    public static string[] ListAllStates()
    {
        Type stateInterfaceType = typeof(Nekoyume.Model.State.IState);
        return stateInterfaceType.Assembly.GetTypes()
            .Where(t =>
                !t.IsInterface &&
                !t.IsAbstract &&
                t.IsAssignableTo(stateInterfaceType) &&
                t.Namespace.StartsWith("Nekoyume.Model") &&
                !t.IsGenericType &&
                t.FullName != "Nekoyume.Model.ArenaPlayerDigest"
            ).Select(t => t.FullName).ToArray();
    }

    [JSExport]
    public static JSObject DeserializeState(string typeFullName, byte[] bytes)
    {
        var codec = new Codec();
        var decoded = codec.Decode(bytes);

        Type stateInterfaceType = typeof(Nekoyume.Model.State.IState);
        Type stateType = stateInterfaceType.Assembly.GetType(typeFullName);
        if (stateType is null)
        {
            Console.Error.WriteLine("stateType is null");
        }

        var ctor = stateType?.GetConstructors().FirstOrDefault(ctor => ctor.GetParameters().Count() == 1 && ctor.GetParameters().First().ParameterType.IsAssignableTo(typeof(Bencodex.Types.IValue)));
        Console.Error.WriteLine("ctor is " + (ctor is null));
        var stateObject = ctor?.Invoke(new[] { decoded });
        return stateObject as JSObject;
    }

    [JSExport]
    public static string GetStateJSType(string typeFullName)
    {
        Type stateInterfaceType = typeof(Nekoyume.Model.State.IState);
        Type stateType = stateInterfaceType.Assembly.GetType(typeFullName);
        if (stateType is null)
        {
            Console.Error.WriteLine("stateType is null");
        }

        return ResolveType(stateType);
    }

    private static string RemoveUnexpectedParts(string typeName)
    {
        int index = typeName.IndexOf('`');
        return index == -1 ? typeName : typeName.Substring(0, index);
    }
}
