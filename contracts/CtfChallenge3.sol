// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CtfChallenge3 is Ownable {
  constructor(address target) Ownable(msg.sender) {
    ITarget(target).mintFlag();
  }

}

interface ITarget {
  function mintFlag() external;
}
