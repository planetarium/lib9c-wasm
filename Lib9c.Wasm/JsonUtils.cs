using System.Collections;
using System.Collections.Immutable;
using System.Numerics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json;
using Libplanet;
using Libplanet.Assets;

namespace Lib9c.Wasm;
public static class JsonUtils
{
    private static Dictionary<Type, string> _typesCache = new Dictionary<Type, string>();

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

        if (targetType == typeof(Libplanet.Assets.Currency))
        {
#pragma warning disable CS0618
            return Currency.Legacy(
                element.GetProperty("ticker").GetString(),
                element.GetProperty("decimalPlaces").GetByte(),
                element.TryGetProperty("minters", out var minters)
                    ? minters.EnumerateArray()
                        .Select(value => ConvertJsonElementTo(value, typeof(Address))).Cast<Address>().ToImmutableHashSet()
                    : null);
#pragma warning restore CS0618
        }

        if (targetType == typeof(byte))
        {
            return element.GetByte();
        }

        if (targetType == typeof(Address))
        {
            string addressString = element.GetString() ?? throw new ArgumentNullException();
            return new Address(addressString.Replace("0x", ""));
        }

        if (targetType.IsGenericType && targetType == typeof(System.Collections.Immutable.IImmutableSet<Address>))
        {
            var set = System.Collections.Immutable.ImmutableHashSet<Address>.Empty;
            foreach (var el in element.EnumerateObject())
            {
                set = set.Add((Address)ConvertJsonElementTo(el.Value, typeof(Address)));
            }

            return set;
        }

        if (element.ValueKind == JsonValueKind.Object &&
            (targetType.IsClass || targetType.IsValueType) &&
            targetType.GetConstructors()
                .Where(ctr => ctr.GetParameters().Length == element.EnumerateObject().Count()).FirstOrDefault() is { } constructor)
        {
            return constructor.Invoke(constructor.GetParameters().Select(parameter => ConvertJsonElementTo(element.GetProperty(parameter.Name), parameter.ParameterType)).ToArray());
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

        if (targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(Nullable<>))
        {
            if (element.ValueKind == JsonValueKind.Null)
            {
                return null;
            }

            return Convert.ChangeType(ConvertJsonElementTo(element, targetType.GetGenericArguments()[0]), targetType);
        }

        if (targetType.IsEnum)
        {
            return Enum.Parse(targetType, element.GetString());
        }

        if (element.ValueKind == JsonValueKind.Object)
        {
            var instance = Activator.CreateInstance(targetType);
            foreach (var property in element.EnumerateObject())
            {
                if (targetType.GetProperty(property.Name) is { } prop)
                {
                    prop.SetValue(instance, ConvertJsonElementTo(property.Value, prop.PropertyType));
                }
                else if (targetType.GetField(property.Name) is { } field)
                {
                    field.SetValue(instance, ConvertJsonElementTo(property.Value, field.FieldType));
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
        if (!_typesCache.ContainsKey(type))
        {
            _typesCache[type] = ResolveTypeImpl(type, fieldName);
        }

        return _typesCache[type];
    }

    public static string ResolveTypeImpl(Type type, string fieldName = "")
    {
        var typeToResolvedType = new Dictionary<Type, string>
        {
            [typeof(System.String)] = "string",
            [typeof(System.Numerics.BigInteger)] = "string",  // JSON doesn't support bigint

            [typeof(System.Boolean)] = "boolean",

            [typeof(System.Byte[])] = "Uint8Array",

            [typeof(System.Byte)] = "number",

            [typeof(System.Int32)] = "number",
            [typeof(System.Int64)] = "number",
            [typeof(System.Decimal)] = "number",

            [typeof(System.Guid)] = "Guid",
            [typeof(Libplanet.Address)] = "Address",
            [typeof(Libplanet.Assets.Currency)] = "Currency",
        };

        if (typeToResolvedType.TryGetValue(type, out string value))
        {
            return value;
        }

        if (type.IsAssignableTo(typeof(Bencodex.Types.IValue)))
        {
            return "\"BencodexValue\"";
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

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Generic.IReadOnlyDictionary<,>))
        {
            return "Map<" + ResolveType(type.GetGenericArguments()[0], fieldName + "'s IReadOnlyDictionary key type arg") + ", " + ResolveType(type.GetGenericArguments()[1], fieldName + "'s IReadOnlyDictionary value type arg") + ">";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Generic.IDictionary<,>))
        {
            return "Map<" + ResolveType(type.GetGenericArguments()[0], fieldName + "'s IReadOnlyDictionary key type arg") + ", " + ResolveType(type.GetGenericArguments()[1], fieldName + "'s IDictionary value type arg") + ">";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Immutable.IImmutableSet<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s IImmutableSet type arg") + "[]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Immutable.ImmutableHashSet<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s ImmutableSet type arg") + "[]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Immutable.IImmutableList<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s IImmutableList type arg") + "[]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Generic.HashSet<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s HashSet type arg") + "[]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.ValueTuple<>))
        {
            return "[" + string.Join(", ", type.GetGenericArguments().Select(t => ResolveType(t, fieldName = "'s tuple arg"))) + "]";
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Collections.Generic.ICollection<>))
        {
            return ResolveType(type.GetGenericArguments()[0], fieldName + "'s ICollection type arg") + "[]";
        }

        if (type.IsEnum)
        {
            return string.Join(" | ", type.GetEnumNames().Select(x => $"\"{x}\""));
        }

        if (type.IsInterface || type.IsAbstract)
        {
            var derivedTypes = type.Assembly.GetTypes()
                .Where(t => t.IsAssignableTo(type) && !t.IsAbstract && !t.IsInterface)
                .Select(t => ResolveType(t))
                .Where(t => !string.IsNullOrEmpty(t))  // Filter out empty types
                .ToArray();

            if (derivedTypes.Length > 0)
            {
                return string.Join(" | ", derivedTypes);
            }
            else
            {
                throw new ArgumentException($"No concrete implementations found for {type.FullName}");
            }
        }

        if (type.IsValueType || type.IsClass)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("{");

            var stateInterfaceType = typeof(Nekoyume.Model.State.IState);

            if (!type.IsAssignableTo(stateInterfaceType) &&
                type.GetConstructors().Where(ctr =>
                    ctr.GetParameters().Length > 0 &&
                    !(ctr.GetParameters().Length == 1 && typeof(Bencodex.Types.IValue).IsAssignableFrom(ctr.GetParameters().First().ParameterType)) &&
                    !(ctr.GetParameters().Length == 2 && ctr.GetParameters().First().ParameterType == typeof(SerializationInfo) && ctr.GetParameters().Skip(1).First().ParameterType == typeof(StreamingContext))
                ).OrderByDescending(x => x.GetParameters().Length).FirstOrDefault() is { } constructor)
            {
                foreach (var parameter in constructor.GetParameters())
                {
                    if (type.IsAssignableTo(typeof(Nekoyume.Action.GameAction)) && parameter.Name == nameof(Nekoyume.Action.GameAction.Id))
                    {
                        continue;
                    }

                    builder.Append($"{parameter.Name}: {ResolveType(parameter.ParameterType)};");
                }

                builder.Append("}");

                return builder.ToString();
            }

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

            NullabilityInfoContext context = new();

            var fields = type.GetFields(BindingFlags.Public | BindingFlags.Instance).Where(f => !IsIgnoredVariableName(f.Name) && !IsIgnoredType(f.FieldType));
            var properties = type.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).Where(p => !IsIgnoredVariableName(p.Name) && !IsIgnoredType(p.PropertyType));
            foreach (var f in fields)
            {
                var info = context.Create(f);
                var nullableSuffix = info.ReadState is NullabilityState.Nullable ? "| null" : "";
                var innerType = f.FieldType.IsGenericType && f.FieldType.GetGenericTypeDefinition() == typeof(Nullable<>) ? f.FieldType.GetGenericArguments()[0] : f.FieldType;
                builder.Append($"{f.Name}: {ResolveType(innerType, f.Name)}{nullableSuffix};");
            }

            foreach (var p in properties)
            {
                if (type.IsAssignableTo(typeof(Nekoyume.Action.GameAction)) && p.Name == nameof(Nekoyume.Action.GameAction.Id))
                {
                    continue;
                }

                if (p.Name.IndexOf(".") != -1)
                {
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
