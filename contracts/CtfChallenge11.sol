// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CtfChallenge11 {

    event senderLastGenerated(uint8 sLast);

    constructor() {}

    function generateNewSenderLast() public {
        uint8 senderLast = uint8(abi.encodePacked(msg.sender)[19]);
        uint8 senderLast2 = uint8(senderLast & 0x15);
        emit senderLastGenerated(senderLast);
        emit senderLastGenerated(senderLast2);
    }

}