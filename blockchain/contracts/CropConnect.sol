// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract CropContract is ERC2771Context {
    struct Crop {
        uint id;
        address farmer;
        string name;
        uint price;       // Price per unit
        uint quantity;    // Units available
        bool isSold;
    }

    uint public cropCount = 0;
    mapping(uint => Crop) public crops;

    event CropListed(uint id, string name, uint price);
    event CropSold(uint id, address buyer, uint quantity);

    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    function listCrop(string memory name, uint price, uint quantity) public {
        cropCount++;
        crops[cropCount] = Crop({
            id: cropCount,
            farmer: _msgSender(),
            name: name,
            price: price,
            quantity: quantity,
            isSold: false
        });
        emit CropListed(cropCount, name, price);
    }

    function buyCrop(uint id, uint quantity) public payable {
        require(!crops[id].isSold, "Already sold or no quantity left");
        require(quantity > 0, "Quantity must be greater than 0");
        require(quantity <= crops[id].quantity, "Not enough quantity available");

        uint cost = crops[id].price * quantity;
        require(msg.value >= cost, "Insufficient Payment");

        crops[id].quantity -= quantity;
        if (crops[id].quantity == 0) {
            crops[id].isSold = true;
        }
        payable(crops[id].farmer).transfer(msg.value);
        emit CropSold(id, _msgSender(), quantity);
    }

    // Override _msgSender and _msgData without listing Context explicitly.
    function _msgSender() internal view virtual override returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view virtual override returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
