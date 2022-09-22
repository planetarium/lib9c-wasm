namespace Lib9c.Wasm;

internal static class TransactionSerializationConstants
{
    public static readonly byte[] NonceKey = { 0x6e }; // 'n'
    public static readonly byte[] SignerKey = { 0x73 }; // 's'
    public static readonly byte[] GenesisHashKey = { 0x67 }; // 'g'
    public static readonly byte[] UpdatedAddressesKey = { 0x75 }; // 'u'
    public static readonly byte[] PublicKeyKey = { 0x70 }; // 'p'
    public static readonly byte[] TimestampKey = { 0x74 }; // 't'
    public static readonly byte[] ActionsKey = { 0x61 }; // 'a'
    public static readonly byte[] SignatureKey = { 0x53 }; // 'S'
    public const string TimestampFormat = "yyyy-MM-ddTHH:mm:ss.ffffffZ";
}
