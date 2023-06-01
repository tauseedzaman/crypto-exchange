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

    it('should deposit tokens into the wallet', async() => {
        const depositAmount = 150;
        const ticker = web3.utils.fromUtf8('Zaman');
        await tokenInstance.approve(walletInstance.address, depositAmount);

        await walletInstance.deposit(depositAmount, ticker);

        const balance = await walletInstance.balances(accounts[0], ticker);
        assert.equal(balance, depositAmount, 'Tokens not deposited correctly');

        const tokenBalance = await tokenInstance.balanceOf(walletInstance.address);
        assert.equal(tokenBalance, depositAmount, 'Tokens not transferred correctly');
    });

    it('should withdraw tokens from the wallet', async() => {
        const withdrawalAmount = 20;
        const ticker = web3.utils.fromUtf8('Zaman');

        const initialBalance = await walletInstance.balances(accounts[0], ticker);

        // Withdraw tokens from the wallet
        await walletInstance.withdraw(withdrawalAmount, ticker, {
            from: accounts[0]
        });

        // Check the updated balances in the wallet
        const balance = await walletInstance.balances(accounts[0], ticker);
        assert.equal(balance, initialBalance - withdrawalAmount, 'Tokens not withdrawn correctly');
    });

    it('should revert if token is not supported', async() => {
        const withdrawalAmount = 20;
        const invalidTicker = web3.utils.fromUtf8('Invalid'); //so far we have only one token and that is zaman

        try {
            await walletInstance.withdraw(withdrawalAmount, invalidTicker);
            assert.fail('Expected revert not received');
        } catch (error) {
            assert(error.message.includes('Invalid Token'), 'Unexpected revert reason');
        }
    });

    it('should revert if balance is insufficient', async() => {
        const ticker = web3.utils.fromUtf8('Zaman');

        const initialBalance = await walletInstance.balances(accounts[0], ticker);
        const insufficientAmount = initialBalance + 10;

        try {
            await walletInstance.withdraw(insufficientAmount, ticker, {
                from: accounts[0]
            });
            assert.fail('Expected revert not received');
        } catch (error) {
            assert(error.message.includes('Invalid Balance amount'), 'Unexpected revert reason');
        }
    });

});