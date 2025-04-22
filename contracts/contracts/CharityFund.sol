// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CharityFund {
    address public owner;
    uint256 public threshold = 0.05 ether;  // Changed from 0.1 to 0.05
    uint256 public totalAmount;

    event FundDeposited(address indexed donor, uint256 amount);
    event FundsTransferred(address indexed recipient, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        totalAmount += msg.value;
        emit FundDeposited(msg.sender, msg.value);
        
        if (totalAmount >= threshold) {
            transferFunds();
        }
    }

    function transferFunds() internal {
        uint256 amountToTransfer = address(this).balance;
        totalAmount = 0;
        
        (bool success, ) = owner.call{value: amountToTransfer}("");
        require(success, "Transfer failed");
        
        emit FundsTransferred(owner, amountToTransfer);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}