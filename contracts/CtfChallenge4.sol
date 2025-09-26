// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CtfChallenge4 {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    event HashCalculated(bytes32 theHash);

    function mintFlag() public returns (bytes32) {

        bytes32 message = keccak256(abi.encode("BG CTF Challenge 4", msg.sender));
        bytes32 hash = message.toEthSignedMessageHash();

        emit HashCalculated(hash);

        return hash;

    }
}
