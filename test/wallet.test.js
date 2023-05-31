const Wallet = artifacts.require("Wallet");
const token = artifacts.require("token");

contract('Wallet', function(accounts) {
    let walletInstance;
    let tokenInstance;

    beforeEach(async() => {
        walletInstance = await Wallet.deployed();
        tokenInstance = await token.deployed();
    });

    it('should deploy the Wallet contract', async() => {
        assert.ok(walletInstance.address, 'Wallet contract not deployed');
    });

    it('should deploy the token contract', async() => {
        assert.ok(tokenInstance.address, 'Token contract not deployed');
    });

    it('should have the correct name and symbol', async() => {
        const name = await tokenInstance.name();
        const symbol = await tokenInstance.symbol();

        assert.equal(name, 'TauseedZaman', 'Incorrect name');
        assert.equal(symbol, 'Zaman', 'Incorrect symbol');
    });

    it('should have the correct initial supply', async() => {
        const totalSupply = await tokenInstance.totalSupply();
        const ownerBalance = await tokenInstance.balanceOf(accounts[0]);

        assert.equal(totalSupply, 1000, 'Incorrect total supply');
        assert.equal(ownerBalance, 1000, 'Incorrect owner balance');
    });

    it('should add a new token to the mapping and list', async() => {
        const ticker = web3.utils.fromUtf8('Zaman');
        const tokenAddress = tokenInstance.address // or tokenInstance.address which is uisng the first account from the accounts arrary

        await walletInstance.addToken(ticker, tokenAddress);

        const token = await walletInstance.tokenMapping(ticker);
        // const tokenList = await walletInstance.tokenList(tokenAddress);

        assert.equal(token.tokenAddress, tokenAddress, 'Token address not added correctly');
        // assert.equal(tokenList[0], ticker, 'Ticker not added to the token list');
    });
});