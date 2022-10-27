// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Wallet {
    mapping(address => uint) Wallets; //Each wallet has an address and an amount in eth

    function withdrawMoney(address payable _to, uint _amount) external{
        require(_amount <= Wallets[msg.sender], "Not enough funds");
        Wallets[msg.sender] -= _amount;
        _to.transfer(_amount); //Withdrawal to my metamask
    }

    function getBalance() external view returns(uint){ // see the amount of my wallet
        return Wallets[msg.sender];
    }

    receive() external payable { //deposit to wallet
        Wallets[msg.sender] += msg.value;
    }

    
}
