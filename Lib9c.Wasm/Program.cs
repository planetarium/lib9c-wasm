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
    public static byte[] BuildAction(string actionTypeString, JsonElement dictionary)
    {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) == actionTypeString);

        var action = (IAction)ConvertJsonElementTo(dictionary, actionType);
        return new Codec().Encode(((PolymorphicAction<ActionBase>)(dynamic)action).PlainValue);
    }

    [JSInvokable]
    public static byte[] BuildRawTransaction(long nonce, byte[] publicKey, byte[] address, byte[] genesisHash, byte[] action)
    {
        var tx = new RawUnsignedTransaction(nonce, publicKey, address, genesisHash, action, DateTimeOffset.UtcNow);
        return tx.Serialize();
    }

    [JSInvokable]
    public static byte[] AttachSignature(byte[] unsignedTransaction, byte[] signature)
    {
        return RawUnsignedTransaction.Deserialize(unsignedTransaction).AttachSignature(signature).Serialize();
    }

    [JSInvokable]
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

    [JSInvokable]
    public static object DeserializeState(string typeFullName, byte[] bytes)
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
        return ctor?.Invoke(new[] { decoded });
    }

    [JSInvokable]
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
