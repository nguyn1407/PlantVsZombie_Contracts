// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PlantCoin is ERC20("Plant Coin", "PC") {
    uint256 private cap = 50_000_000_000 * 10**uint256(18);
    constructor() {
        //console.log("owner: %s maxcap: %s", msg.sender, cap);
        _mint(msg.sender, cap);
    }
}

