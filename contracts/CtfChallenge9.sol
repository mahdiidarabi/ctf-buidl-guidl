// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CtfChallenge9 {

    event newPasswordGenerated(bytes32 password);

    // bytes32 public password;
    // uint256 public count;

    constructor() {}


    function generateNewPassword(bytes32 password, uint256 count) public {
        bytes32 mask = ~(bytes32(uint256(0xFF) << ((31 - (count % 32)) * 8)));
        bytes32 newPassword = password & mask;
        emit newPasswordGenerated(newPassword);
    }
}


interface IChallenge6 {
    function count() external view returns (uint256);
    function mintFlag(uint256 _count) external;
}