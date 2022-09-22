using System.Globalization;
using Libplanet;
using Libplanet.Blocks;
using Libplanet.Crypto;
using Nekoyume.Action;

namespace Lib9c.Wasm.Tests;

public class RawTransactionTest
{
    [Fact]
    public void IsCompatibilityWithLibplanetTx()
    {
        var publicKey = new PublicKey(ByteUtil.ParseHex("0228c66126c62dde22c84cfa55a0578762c95481a81c4b4b2ccf63024b0929bb1b"));
        var address = publicKey.ToAddress();
        var nonce = 2;
        var genesisHash = BlockHash.FromString("15e07324f162d7f28037dc2ab88439c4103602c204af9052befb8a44249ef1fb");
        var actionBytes = ByteUtil.ParseHex("6475373a747970655f696475353a7374616b6575363a76616c7565736475323a616d6930656565");
        var timestamp = DateTimeOffset.ParseExact("2022-09-22T02:02:13.843000Z", "yyyy-MM-ddTHH:mm:ss.ffffffZ", CultureInfo.InvariantCulture);
        var signature = ByteUtil.ParseHex("3045022100da631aae7fa09233b7fbb80d92207562ddae4460774044290f421f4719ed0618022015bf2e0971a46ac8edb1ba22cc454b8c1f2979d89fa1fd237c775d6ec57ff022");

        var rawTx = new RawTransaction(nonce, publicKey.ToImmutableArray(false).ToArray(), address.ToByteArray(), genesisHash.ToByteArray(), actionBytes, timestamp, signature);
        var serialized = rawTx.Serialize();
        var tx = Libplanet.Tx.Transaction<Libplanet.Action.PolymorphicAction<Nekoyume.Action.ActionBase>>.Deserialize(serialized, true);

        Assert.Equal(address, tx.Signer);
        Assert.Equal(publicKey, tx.PublicKey);
        Assert.Equal(nonce, tx.Nonce);
        Assert.Equal(timestamp, tx.Timestamp);
        Assert.Equal(genesisHash, tx.GenesisHash);
        Assert.Equal(signature, tx.Signature);
        var action = Assert.IsType<Stake>(Assert.Single(tx.Actions).InnerAction);
    }
}