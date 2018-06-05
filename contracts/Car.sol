pragma solidity ^0.4.17;
contract car {
    string public brand;

    constructor(string initialBrand) public {
        brand = initialBrand;
    }

    function setBrand(string newBrand) public {
        brand = newBrand;
    }
}