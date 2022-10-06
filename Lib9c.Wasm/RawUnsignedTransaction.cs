using System.Globalization;

namespace Lib9c.Wasm;

using static TransactionSerializationConstants;

public record RawUnsignedTransaction(long nonce, byte[] publicKey, byte[] signer, byte[] genesisHash, byte[] action, DateTimeOffset timestamp)
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
            .Add(ActionsKey, Bencodex.Types.List.Empty.Add(new Bencodex.Codec().Decode(action)));
    }

    public byte[] Serialize()
    {
        return new Bencodex.Codec().Encode(ToBencodex());
    }

    public static RawUnsignedTransaction Deserialize(byte[] bytes)
    {
        var codec = new Bencodex.Codec();
        var value = codec.Decode(bytes);
        var dict = (Bencodex.Types.Dictionary)value;
        var action = codec.Encode(((Bencodex.Types.List)dict[ActionsKey]).Single());
        var timestamp = DateTimeOffset.ParseExact((Bencodex.Types.Text)dict[TimestampKey], TimestampFormat, CultureInfo.InvariantCulture);
        return new RawUnsignedTransaction(
            (Bencodex.Types.Integer)dict[NonceKey],
            (Bencodex.Types.Binary)dict[PublicKeyKey],
            (Bencodex.Types.Binary)dict[SignerKey],
            (Bencodex.Types.Binary)dict[GenesisHashKey],
            action,
            timestamp
        );
    }

    public RawTransaction AttachSignature(byte[] signature)
    {
        return new RawTransaction(
            nonce,
            publicKey,
            signer,
            genesisHash,
            action,
            timestamp,
            signature
        );
    }
}
