using System.Globalization;

namespace Lib9c.Wasm;
public record RawUnsignedTransaction(long nonce, byte[] publicKey, byte[] signer, byte[] genesisHash, byte[] action, DateTimeOffset timestamp)
{
    private static readonly byte[] NonceKey = { 0x6e }; // 'n'
    private static readonly byte[] SignerKey = { 0x73 }; // 's'
    private static readonly byte[] GenesisHashKey = { 0x67 }; // 'g'
    private static readonly byte[] UpdatedAddressesKey = { 0x75 }; // 'u'
    private static readonly byte[] PublicKeyKey = { 0x70 }; // 'p'
    private static readonly byte[] TimestampKey = { 0x74 }; // 't'
    private static readonly byte[] ActionsKey = { 0x61 }; // 'a'

    private const string TimestampFormat = "yyyy-MM-ddTHH:mm:ss.ffffffZ";

    public Bencodex.Types.IValue ToBencodex()
    {
        return Bencodex.Types.Dictionary.Empty
            .Add(NonceKey, nonce)
            .Add(SignerKey, signer)
            .Add(UpdatedAddressesKey, new Bencodex.Types.IValue[0])
            .Add(PublicKeyKey, publicKey)
            .Add(
                TimestampKey,
                timestamp.ToString(TimestampFormat, CultureInfo.InvariantCulture))
            .Add(ActionsKey, new Bencodex.Types.IValue[] { (Bencodex.Types.Binary)action });
    }

    public byte[] Serialize()
    {
        return new Bencodex.Codec().Encode(ToBencodex());
    }
}