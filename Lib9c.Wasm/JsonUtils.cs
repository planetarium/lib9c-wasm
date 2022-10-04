using System.Collections;
using System.Numerics;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Libplanet;

namespace Lib9c.Wasm;
public static class JsonUtils
{
    public static void FillFieldsFromJsonElements(Type type, object instance, Dictionary<string, object> dictionary)
    {
        var flags = BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance;
        foreach (var pair in dictionary)
        {
            if (type.GetField(pair.Key, flags) is { } field)
            {
                var value = pair.Value switch
                {
                    null => null,
                    JsonElement element => ConvertJsonElementTo(element, field.FieldType),
                    _ => throw new ArgumentException(),
                };
                field.SetValue(instance, value);
            }
            else if (type.GetProperty(pair.Key, flags) is { } property)
            {
                var value = pair.Value switch
                {
                    null => null,
                    JsonElement element => ConvertJsonElementTo(element, property.PropertyType),
                    _ => throw new ArgumentException(),
                };
                property.SetValue(instance, value);
            }
            else
            {
                throw new Exception($"{pair.Key} is not found in {type}");
            }
        }
    }

    public static object ConvertJsonElementTo(JsonElement element, Type targetType)
    {
        if (targetType == typeof(Int32))
        {
            return element.GetInt32();
        }

        if (targetType == typeof(Int64))
        {
            return element.GetInt64();
        }

        if (targetType == typeof(BigInteger))
        {
            string value = element.GetString() ?? throw new ArgumentNullException();

            return BigInteger.Parse(value);
        }

        if (targetType == typeof(Guid))
        {
            return element.GetGuid();
        }

        if (targetType == typeof(string))
        {
            return element.GetString() ?? throw new ArgumentNullException();
        }

        if (targetType == typeof(Address))
        {
            string addressString = element.GetString() ?? throw new ArgumentNullException();
            return new Address(addressString.Replace("0x", ""));
        }

        if (targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(List<>))
        {
            Type elementType = targetType.GetGenericArguments()[0];
            IList list = (IList)Activator.CreateInstance(targetType);
            foreach (var item in element.EnumerateObject())
            {
                list.Add(ConvertJsonElementTo(item.Value, elementType));
            }
            return list;
        }

        if (targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(IEnumerable<>))
        {
            Type elementType = targetType.GetGenericArguments()[0];
            IList list = (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(elementType));
            foreach (var item in element.EnumerateObject())
            {
                list.Add(ConvertJsonElementTo(item.Value, elementType));
            }
            return list;
        }

        if (element.ValueKind == JsonValueKind.Object)
        {
            var instance = Activator.CreateInstance(targetType);
            foreach (var property in element.EnumerateObject())
            {
                if (targetType.GetProperty(property.Name) is { } prop)
                {
                    prop.SetValue(property.Name, ConvertJsonElementTo(property.Value, prop.PropertyType));
                }
                else if (targetType.GetField(property.Name) is { } field)
                {
                    field.SetValue(property.Name, ConvertJsonElementTo(property.Value, field.FieldType));
                }
                else
                {
                    throw new InvalidOperationException();
                }
            }

            return instance;
        }

        throw new ArgumentOutOfRangeException(targetType.ToString());
    }

    public static string ResolveType(Type type, string fieldName = "")
    {
        var typeToResolvedType = new Dictionary<Type, string>
        {
            [typeof(System.String)] = "string",
            [typeof(Libplanet.Assets.FungibleAssetValue)] = "string",

            [typeof(System.Numerics.BigInteger)] = "string",

            [typeof(System.Boolean)] = "boolean",

            [typeof(System.Byte[])] = "Uint8Array",

            [typeof(System.Int32)] = "number",
            [typeof(System.Int64)] = "number",

            [typeof(System.Guid)] = "Guid",
            [typeof(Libplanet.Address)] = "Address",
        };

        if (typeToResolvedType.TryGetValue(type, out string value))
        {
            return value;
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Libplanet.HashDigest<>))
        {
            return "string";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Generic.List<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s list type arg") + "[]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Generic.IList<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s IList type arg") + "[]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Generic.IReadOnlyList<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s IReadOnlyList type arg") + "[]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Generic.IEnumerable<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s IEnumerable type arg") + "[]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Generic.Dictionary<,>))
        {
            return "Map<" + ResolveType(type.GetGenericArguments()[0], fieldName + "'s Dictionary key type arg") + ", " + ResolveType(type.GetGenericArguments()[1], fieldName + "'s Dictionary value type arg") + ">";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Immutable.IImmutableSet<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s IImmutableSet type arg") + "[]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.ValueTuple<>))
        {
            return "[" + string.Join(", ", type.GetGenericArguments().Select(t => ResolveType(t, fieldName = "'s tuple arg"))) + "]";
        }

        if (type.IsEnum)
        {
            return string.Join(" | ", type.GetEnumNames().Select(x => $"\"{x}\""));
        }

        if (type.IsValueType || type.IsClass)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("{");

            bool IsIgnoredVariableName(string name)
            {
                return name == "errors"
                    || name == "PlainValue"
                    || name == "PlainValueInternal";
            }

            bool IsIgnoredType(Type type)
            {
                return type.Name.EndsWith("BattleLog")
                    || type.Name.EndsWith("Result")
                    || type.Name.EndsWith("AvatarState")
                    || type.Name.EndsWith("ArenaInfo")
                    || type.Name.EndsWith("Digest");
            }

            NullabilityInfoContext context = new ();

            var fields = type.GetFields(BindingFlags.Public | BindingFlags.Instance).Where(f => !IsIgnoredVariableName(f.Name) && !IsIgnoredType(f.FieldType));
            var properties = type.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).Where(p => !IsIgnoredVariableName(p.Name) && !IsIgnoredType(p.PropertyType));
            foreach (var f in fields)
            {
                var info = context.Create(f);
                var nullableSuffix = info.ReadState is NullabilityState.Nullable ? "| null" : "";
                builder.Append($"{f.Name}: {ResolveType(f.FieldType, f.Name)}{nullableSuffix};");
            }

            foreach (var p in properties)
            {
                if (p.Name.IndexOf(".") != -1) {
                    continue;
                }

                var info = context.Create(p);
                var nullableSuffix = info.ReadState is NullabilityState.Nullable ? "| null" : "";
                builder.Append($"{p.Name}: {ResolveType(p.PropertyType, p.Name)}{nullableSuffix};");
            }

            builder.Append("}");

            return builder.ToString();
        }

        throw new ArgumentException(type.FullName + " " + fieldName + " " + (type.IsValueType || type.IsClass));
    }
}
