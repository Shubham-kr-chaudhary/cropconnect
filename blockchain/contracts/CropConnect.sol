// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CropContract {
    struct Crop {
        uint id;
        address farmer;
        string name;
        uint price;
        uint quantity;
        bool isSold;
    }

    uint public cropCount = 0;
    mapping(uint => Crop) public crops;

    event CropListed(uint id, string name, uint price);
    event CropSold(uint id, address buyer);

    function listCrop(string memory name, uint price, uint quantity) public {
        cropCount++;
        crops[cropCount] = Crop(cropCount, msg.sender, name, price, quantity, false);
        emit CropListed(cropCount, name, price);
    }

    function buyCrop(uint id) public payable {
        require(crops[id].isSold == false, "Already Sold");
        require(msg.value >= crops[id].price, "Insufficient Payment");

        crops[id].isSold = true;
        payable(crops[id].farmer).transfer(msg.value);
        emit CropSold(id, msg.sender);
    }
}
