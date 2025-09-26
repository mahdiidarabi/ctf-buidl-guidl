// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CtfChallenge2 is Ownable {
  constructor() Ownable(msg.sender) {}

  function indirectCall(address target) public onlyOwner {
    ITarget(target).justCallMe();
  }
}

interface ITarget {
  function justCallMe() external;
}
