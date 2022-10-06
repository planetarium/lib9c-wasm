using System.Globalization;

namespace Lib9c.Wasm;

using static TransactionSerializationConstants;

public record RawTransaction(long nonce, byte[] publicKey, byte[] signer, byte[] genesisHash, byte[] action, DateTimeOffset timestamp, byte[] signature)
{
    public Bencodex.Types.IValue ToBencodex()
    {
        return Bencodex.Types.Dictionary.Empty
            .Add(NonceKey, nonce)
            .Add(SignerKey, signer)
            .Add(UpdatedAddressesKey, Bencodex.Types.List.Empty)
            .Add(PublicKeyKey, publicKey)
            .Add(GenesisHashKey, genesisHash)
            .Add(
                TimestampKey,
                timestamp.ToString(TimestampFormat, CultureInfo.InvariantCulture))
            .Add(ActionsKey, Bencodex.Types.List.Empty.Add(new Bencodex.Codec().Decode(action)))
            .Add(SignatureKey, signature);
    }

    public byte[] Serialize()
    {
        return new Bencodex.Codec().Encode(ToBencodex());
    }
}