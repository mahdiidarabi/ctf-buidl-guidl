// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CtfChallenge6 {
    IChallenge6 public challenge;
    string public name;


    constructor(address _challengeAddress) {
        challenge = IChallenge6(_challengeAddress);
        name = "BG CTF Challenge 6 Solution";
    }

    function startMint() external {
        uint256 count = challenge.count();
        challenge.mintFlag(count << 8);
    }
}


interface IChallenge6 {
    function count() external view returns (uint256);
    function mintFlag(uint256 _count) external;
}