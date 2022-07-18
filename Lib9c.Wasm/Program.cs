using System.Collections;
using System.Linq;
using System.Numerics;
using System.Reflection;
using System.Text.Json;
using Bencodex;
using Libplanet;
using Libplanet.Action;
using Microsoft.JSInterop;

namespace Lib9c.Wasm;
public class Program
{
    public static void Main() {}

    public record Input(string Name, string TypeName);

    [JSInvokable]
    public static string[] GetAllActionTypes() {
        var types = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .Where(t => t.IsDefined(typeof(ActionTypeAttribute)));
        return types.Select(x => ActionTypeAttribute.ValueOf(x)).ToArray();
    }

    [JSInvokable]
    public static Input[] GetAvailableInputs(string actionTypeString) {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) == actionTypeString);
        var fields = actionType.GetFields(BindingFlags.Public | BindingFlags.Instance).Where(f => f.IsPublic);
        var properties = actionType.GetProperties(BindingFlags.Public | BindingFlags.Instance).Where(p => p.CanWrite && p.GetSetMethod(true).IsPublic);
        return fields.Select(f => new Input(f.Name, ResolveFullName(f.FieldType))).Concat(properties.Select(p => new Input(p.Name, ResolveFullName(p.PropertyType)))).ToArray();
    }

    [JSInvokable]
    public static byte[] BuildAction(string actionTypeString, Dictionary<string, object> dictionary) {
        Type actionType = typeof(Nekoyume.Action.ActionBase).Assembly.GetTypes()
            .First(t => t.IsDefined(typeof(ActionTypeAttribute)) && ActionTypeAttribute.ValueOf(t) == actionTypeString);

        IAction action = (IAction)Activator.CreateInstance(actionType);

        FillFieldsFromJsonElements(actionType, action, dictionary);

        return new Codec().Encode(action.PlainValue);
    }

    private static void FillFieldsFromJsonElements(Type type, object instance, Dictionary<string, object> dictionary) {
        foreach (var pair in dictionary) {
            if (type.GetField(pair.Key) is {} field) {
                if (pair.Value is JsonElement element) {
                    field.SetValue(instance, ConvertJsonElementTo(element, field.FieldType));
                } else {
                    throw new ArgumentException();
                }
            } else if (type.GetProperty(pair.Key) is {} property) {
                property.SetValue(instance, pair.Value);
            } else {
                throw new Exception($"{pair.Key} is not found in {type}");
            }
        }
    }

    private static object ConvertJsonElementTo(JsonElement element, Type targetType) {
        if (targetType == typeof(Int32)) {
            return element.GetInt32();
        }

        if (targetType == typeof(Int64)) {
            return element.GetInt64();
        }

        if (targetType == typeof(BigInteger)) {
            string value = element.GetString() ?? throw new ArgumentNullException();

            return BigInteger.Parse(value);
        }
        
        if (targetType == typeof(Guid)) {
            return element.GetGuid();
        }

        if (targetType == typeof(string)) {
            return element.GetString() ?? throw new ArgumentNullException();
        }

        if (targetType == typeof(Address)) {
            string addressString = element.GetString() ?? throw new ArgumentNullException();
            return new Address(addressString.Replace("0x", ""));
        }

        if (targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(List<>)) {
            Type elementType = targetType.GetGenericArguments()[0];
            IList list = (IList)Activator.CreateInstance(targetType);
            foreach (var item in element.EnumerateArray()) {
                list.Add(ConvertJsonElementTo(item, elementType));
            }
            return list;
        }

        throw new ArgumentOutOfRangeException(targetType.ToString());
    }

    private static string ResolveFullName(Type type) {
        if (type.IsGenericType) {
            return $"{type.Namespace}.{RemoveUnexpectedParts(type.Name)}<{string.Join(", ", type.GenericTypeArguments.Select(ResolveFullName))}>";
        } else {
            return type.FullName;
        }
    }

    private static string RemoveUnexpectedParts(string typeName)
    {
        int index = typeName.IndexOf('`');
        return index == -1 ? typeName : typeName.Substring(0, index);
    }
}
