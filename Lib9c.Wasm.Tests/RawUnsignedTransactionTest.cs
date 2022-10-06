using Libplanet;
using Libplanet.Action;
using Libplanet.Blocks;
using Libplanet.Crypto;
using Nekoyume.Action;

namespace Lib9c.Wasm.Tests;

public class RawUnsignedTransactionTest
{
    [Fact]
    public void IsCompatibilityWithLibplanetTx()
    {
        var privateKey = new PrivateKey();
        var publicKey = privateKey.PublicKey;
        var address = publicKey.ToAddress();
        var genesisHash = BlockHash.FromString("4582250d0da33b06779a8475d283d5dd210c683b9b999d74d03fac4f58fa6bce");
        var actionBytes = ByteUtil.ParseHex("6475373a747970655f696475353a7374616b6575363a76616c7565736475323a616d6930656565");
        var timestamp = DateTimeOffset.UtcNow;

        var rawUnsignedTx = new RawUnsignedTransaction(0, publicKey.ToImmutableArray(false).ToArray(), address.ToByteArray(), genesisHash.ToByteArray(), actionBytes, timestamp);
        var serialized = rawUnsignedTx.Serialize();
        var tx = Libplanet.Tx.Transaction<Libplanet.Action.PolymorphicAction<Nekoyume.Action.ActionBase>>.Deserialize(serialized, false);

        Assert.Empty(tx.Signature);
        Assert.Equal(address, tx.Signer);
        Assert.Equal(publicKey, tx.PublicKey);
        Assert.Equal(0, tx.Nonce);
        Assert.Equal(timestamp, tx.Timestamp);
        Assert.Equal(genesisHash, tx.GenesisHash);
        var action = Assert.IsType<Stake>(Assert.IsType<PolymorphicAction<ActionBase>>(Assert.Single(tx.Actions)).InnerAction);
    }
}