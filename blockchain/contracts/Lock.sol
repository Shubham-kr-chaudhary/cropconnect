// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract Lock is ERC2771Context {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    // Constructor now accepts a trusted forwarder address for meta-transactions.
    constructor(uint _unlockTime, address trustedForwarder) payable ERC2771Context(trustedForwarder) {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");
        unlockTime = _unlockTime;
        owner = payable(_msgSender());
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(_msgSender() == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);
        owner.transfer(address(this).balance);
    }

    // Override _msgSender and _msgData using only ERC2771Context
    function _msgSender() internal view virtual override returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view virtual override returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
