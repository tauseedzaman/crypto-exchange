const dex = artifacts.require("dex");
const token = artifacts.require("token");

contract.skip('dex', function(accounts) {
    let dexInstance;
    let tokenInstance;

    beforeEach(async() => {
        dexInstance = await dex.deployed();
        tokenInstance = await token.deployed();
    });


    it('buy order should be placed from heigher to lower', async() => {
        const amount = 1000;
        const ticker = web3.utils.fromUtf8('Zaman');
        await tokenInstance.approve(dex.address, amount);

        await dex.depositEth({
            value: 100
        });

        await dex.createLimitOrder(0, ticker, 1, 100);
        await dex.createLimitOrder(0, ticker, 1, 300);
        await dex.createLimitOrder(0, ticker, 1, 150);
        await dex.createLimitOrder(0, ticker, 1, 200);

        let orderBook = await dex.getOrderBook(ticker, 0);
        for (let index = 0; index < orderBook.length; index++) {
            const price = orderBook[index].price;
            const nextPrice = orderBook[index + 1].price;
            assert(price >= nextPrice, "Not Right Order Price");
        }
    });


    it('sell order should be placed from lower to heigher', async() => {
        const amount = 1000;
        const ticker = web3.utils.fromUtf8('Zaman');
        await tokenInstance.approve(dex.address, amount);

        await dex.depositEth({
            value: 100
        });

        await dex.createLimitOrder(1, ticker, 1, 100);
        await dex.createLimitOrder(1, ticker, 1, 300);
        await dex.createLimitOrder(1, ticker, 1, 150);
        await dex.createLimitOrder(1, ticker, 1, 200);

        let orderBook = await dex.getOrderBook(ticker, 0);
        for (let index = 0; index < orderBook.length; index++) {
            const price = orderBook[index].price;
            const nextPrice = orderBook[index + 1].price;
            assert(price >= nextPrice, "Not Right Order Price");
        }
    });
});