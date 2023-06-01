pragma solidity ^0.8.0;
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

pragma experimental ABIEncoderV2;
import "./Wallet.sol";

contract Dex is Wallet {
    using SafeMath for uint256;
    enum OrderType {
        Buy,
        Sell
    }

    struct Order {
        uint id;
        address trader;
        OrderType orderType;
        bytes32 ticker;
        uint amount;
        uint price;
    }

    // if uint is 0 then its buy , and on 1 its sell
    mapping(bytes32 => mapping(uint => Order[])) public orderBook;

    // get order book for the provided ticker or coin and ordertype [buy/sell]
    function getOrderBook(bytes32 ticker, OrderType orderType)
        public
        view
        returns (Order[] memory)
    {
        return orderBook[ticker][uint(orderType)];
    }

    function createLimitOrder(
        OrderType orderType,
        bytes32 ticker,
        uint amount,
        uint price
    ) public {
        // when creating limit order for buying coin
        if (orderType == OrderType.Buy) {
            require(balances[msg.sender]["Eth"] >= amount * price, "");
        }

        // when creating limit order for selling coin
        if (orderType == OrderType.Sell) {
            require(balances[msg.sender][ticker] >= amount, "");
        }
    }
}
