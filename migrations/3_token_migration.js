const _token = artifacts.require("token");
const _Wallet = artifacts.require("Wallet");

module.exports = async function(deployer) {
    await deployer.deploy(_token);

    // const ticker = web3.utils.fromUtf8('Zaman');
    // // await wallet.tokenMapping(ticker)
    // depositAmount = 150

    // let wallet = await _Wallet.deployed()
    // let token = await _token.deployed()

    // await wallet.addToken(ticker, token.address);

    // await token.approve(wallet.address, depositAmount);
    // await wallet.deposit(depositAmount, ticker);
};