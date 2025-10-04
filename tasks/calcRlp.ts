// import { task } from "hardhat/config";
// import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { ethers } from "ethers";
// import { RLP } from "@ethereumjs/rlp";

// task("calc-rlp", "Calls mintFlag on Challenge12 contract")
//   .addParam("contract", "The Challenge12 contract address")
//   .addParam("sender", "The sender address (must have called preMintFlag)")
//   .addParam("targetBlock", "The target block number (blockNumber[sender] + futureBlocks)")
//   .setAction(async (taskArgs: { contract: string; sender: string; targetBlock: string }, hre: HardhatRuntimeEnvironment) => {
//     const { contract: contractAddress, sender, targetBlock } = taskArgs;
//     const provider = new ethers.JsonRpcProvider("https://optimism.api.onfinality.io/public"); // Or Optimism
//     const signer = await hre.ethers.getSigner(sender);

//     // Fetch full block header
//     const block = await provider.send("eth_getBlockByNumber", [
//       ethers.toQuantity(parseInt(targetBlock)),
//       false,
//     ]);

//     console.log("block", block);

//     // Construct header array (post-Merge fields included)
//     const header = [
//       block.parentHash,
//       block.sha3Uncles, // Default if missing
//       block.miner,
//       block.stateRoot,
//       block.transactionsRoot,
//       block.receiptsRoot,
//       block.logsBloom,
//       block.difficulty,
//       block.number,
//       block.gasLimit,
//       block.gasUsed,
//       block.timestamp,
//       block.extraData,
//       block.mixHash, // Post-Merge default
//       block.nonce, // Post-Merge default
//       block.baseFeePerGas,
//       block.withdrawalsRoot, // Post-Merge
//       block.blobGasUsed,
//       block.excessBlobGas,
//       block.parentBeaconBlockRoot,
//     ].map((val) => Buffer.from(val.slice(2), "hex"));

//     // RLP-encode header
//     const rlpBytes = RLP.encode(header)

//     // Verify block hash
//     const blockHash = block.hash;
//     console.log("blockHash", blockHash);
//     console.log("rlpBytes", rlpBytes);

//     const computedHash = ethers.keccak256(ethers.hexlify(rlpBytes));

//     if (blockHash !== computedHash) throw new Error(`Invalid RLP encoding: expected ${blockHash}, got ${computedHash}`);

//     // Verify block number window
//     const currentBlock = await provider.getBlockNumber();
//     if (currentBlock < parseInt(targetBlock) || currentBlock >= parseInt(targetBlock) + 256) {
//       throw new Error(`Current block ${currentBlock} is outside valid window [${targetBlock}, ${parseInt(targetBlock) + 256})`);
//     }

//     // Call mintFlag
//     // const contract = new ethers.Contract(
//     //   contractAddress,
//     //   ["function mintFlag(bytes memory rlpBytes) public"],
//     //   signer
//     // );
//     // const tx = await contract.mintFlag(rlpBytes);
//     // console.log(`Transaction sent: ${tx.hash}`);
//     // await tx.wait();
//     // console.log("mintFlag executed successfully");
//   });















import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";
import { RLP } from "@ethereumjs/rlp";
import { keccak256 } from 'ethers';

task("calc-rlp", "Calls mintFlag on Challenge9 contract on Optimism")
  .addParam("contract", "The Challenge9 contract address")
  .addParam("sender", "The sender address (must have called preMintFlag)")
  .addParam("targetBlock", "The target block number (blockNumber[sender] + futureBlocks)")
  .setAction(async (taskArgs: { contract: string; sender: string; targetBlock: string }, hre: HardhatRuntimeEnvironment) => {
    const { contract: contractAddress, sender, targetBlock } = taskArgs;
    // const provider = new ethers.JsonRpcProvider("https://mainnet.optimism.io"); // Optimism mainnet
    // const signer = await hre.ethers.getSigner(sender);


    const provider = new ethers.JsonRpcProvider("https://optimism.api.onfinality.io/public"); // Or Optimism
    console.log("sender", sender);
    const { deployer } = await hre.getNamedAccounts();
    console.log("deployer", deployer);
    const signer = await hre.ethers.getSigner(sender);


    const contract = new ethers.Contract(
      contractAddress,
      ["function preMintFlag() external"],
      signer
    );
    const tx = await contract.preMintFlag();
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("mintFlag executed successfully");


    // Fetch full block header
    const blockData = await provider.send("eth_getBlockByNumber", [
      ethers.toQuantity(parseInt(targetBlock)),
      false,
    ]);

    console.log("block", blockData);// Compute block hash
    const difficulty = blockData.difficulty === '0x0' ? '0x' : blockData.difficulty;
    const blobGasUsed = blockData.blobGasUsed === '0x0' ? '0x' : blockData.blobGasUsed;
    const excessBlobGas = blockData.excessBlobGas === '0x0' ? '0x' : blockData.excessBlobGas;
    
    const blockHeader: string[] = [
      blockData.parentHash,
      blockData.sha3Uncles,
      blockData.miner,
      blockData.stateRoot,
      blockData.transactionsRoot,
      blockData.receiptsRoot,
      blockData.logsBloom,
      difficulty,
      blockData.number,
      blockData.gasLimit,
      blockData.gasUsed,
      blockData.timestamp,
      blockData.extraData,
      blockData.mixHash,
      '0x0000000000000000', // nonce
      blockData.baseFeePerGas || '0x0',
      blockData.withdrawalsRoot,
      blobGasUsed,
      excessBlobGas,
      blockData.parentBeaconBlockRoot,
      blockData.requestsHash
    ];
    
    const encoded = RLP.encode(blockHeader);
    const encodedHex = Buffer.from(encoded).toString('hex');
    const computedHash = keccak256(`0x${encodedHex}`);
    
    console.log('Computed hash:', computedHash);
    console.log('Original hash:', blockData.hash);
    console.log('Match:', computedHash === blockData.hash);


    // Call mintFlag
    const contract2 = new ethers.Contract(
      contractAddress,
      ["function mintFlag(bytes memory rlpBytes) external"],
      signer
    );
    const tx2 = await contract.mintFlag(encodedHex);
    console.log(`Transaction sent: ${tx.hash}`);
    await tx2.wait();
    console.log("mintFlag executed successfully");
  });