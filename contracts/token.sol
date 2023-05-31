pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract token is ERC20 {
    constructor() public ERC20("TauseedZaman", "Zaman") {
        _mint(msg.sender, 1000);
    }
}
//  wallet.addToken(web3.utils.fromUtf8("Zaman"),token.address)
