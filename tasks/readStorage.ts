import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";

task("read-storage", "Reads private variables from Challenge9 contract storage")
  .addParam("contract", "The Challenge9 contract address")
  .setAction(async (taskArgs: { contract: string }, hre: HardhatRuntimeEnvironment) => {
    const { contract: contractAddress } = taskArgs;

    // Set up provider (replace with your Infura project ID or Optimism endpoint)
    const provider = new ethers.JsonRpcProvider("https://optimism.api.onfinality.io/public");

    // Query storage slots
    const password = await provider.getStorage(contractAddress, 1); // Slot 1: bytes32 password
    const count = await provider.getStorage(contractAddress, 2);   // Slot 2: uint256 count

    // Convert and log results
    console.log(`Password (bytes32): ${password}`);
    console.log(`Count (uint256): ${ethers.toNumber(count)}`);
  });

  // npx hardhat read-storage --contract 0x1Fd913F2250ae5A4d9F8881ADf3153C6e5E2cBb1 --network optimism
