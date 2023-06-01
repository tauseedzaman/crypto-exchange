pragma solidity ^0.8.0;
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma experimental ABIEncoderV2;
import "./Wallet.sol";

contract Dex is Wallet {
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
}
