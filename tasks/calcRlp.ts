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

task("calc-rlp", "Calls mintFlag on Challenge9 contract on Optimism")
  .addParam("contract", "The Challenge9 contract address")
  .addParam("sender", "The sender address (must have called preMintFlag)")
  .addParam("targetBlock", "The target block number (blockNumber[sender] + futureBlocks)")
  .setAction(async (taskArgs: { contract: string; sender: string; targetBlock: string }, hre: HardhatRuntimeEnvironment) => {
    const { contract: contractAddress, sender, targetBlock } = taskArgs;
    // const provider = new ethers.JsonRpcProvider("https://mainnet.optimism.io"); // Optimism mainnet
    // const signer = await hre.ethers.getSigner(sender);


    const provider = new ethers.JsonRpcProvider("https://optimism.api.onfinality.io/public"); // Or Optimism
    const signer = await hre.ethers.getSigner(sender);

    // Fetch full block header
    const blockData = await provider.send("eth_getBlockByNumber", [
      ethers.toQuantity(parseInt(targetBlock)),
      false,
    ]);

    console.log("block", blockData);

    // Verify block number window
    // const currentBlock = await provider.getBlockNumber();
    // if (currentBlock < parseInt(targetBlock) || currentBlock >= parseInt(targetBlock) + 256) {
    //   throw new Error(`Current block ${currentBlock} is outside valid window [${targetBlock}, ${parseInt(targetBlock) + 256})`);
    // }

    // Block header data (from provided Optimism block)
    // const blockData = {
    //   parentHash: "0xfdf13181523024a0d73faf9b77b6a69b8655eeafacfced84d68e74e732a2c5d6",
    //   sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    //   miner: "0x4200000000000000000000000000000000000011",
    //   stateRoot: "0x950d54f0f6883a7f892464a544899147f4700a6fa805919267c4cdc9bb38c4b6",
    //   transactionsRoot: "0xd383da153d462d776e734fcad14c3e3c5c3f151d307a59db75a7b261c17153ac",
    //   receiptsRoot: "0x2214bdddc508ec2457b8d2e5d70b08e7f21c237e0b84c1c50e13226f44da7ec3",
    //   logsBloom: "0x000022217083004e800100927402a0000003800802c0218008040008056030400a3c1000200c0292020007503004825700010241800400034062440810082000201041104234410000060e080204882240000481840833c40400801080010410080208010114060004184c102249000314001024138022e01400005200000d3900008b000262c00100000020c0801000401a400584340814218d000012000510019000212601a0204104460996000402388010001410800408206000007040806010148280180420288001150902204001008000a11c082018090084046010180030000e0240420360000002008016110000128000820048408001a000320610",
    //   difficulty: "0x0",
    //   number: "0x875c805",
    //   gasLimit: "0x2625a00",
    //   gasUsed: "0x7c02c8",
    //   timestamp: "0x68df69c3",
    //   extraData: "0x00000000fa00000002",
    //   baseFeePerGas: "0x1a1",
    //   withdrawalsRoot: "0xb223fa016d68998071a81d3d054fa99249484c7df88c399345eaacc18f63a43f",
    //   hash: "0x4b0bbb86d2ab0fc2c7043f20c4e696f4cf14a441e0542689c74915acc598ad1c"
    // };

    // Try Optimism header (15 fields, pre-Merge Ethereum style)
    const header = [
        blockData.parentHash,
        blockData.sha3Uncles,
        blockData.miner,
        blockData.stateRoot,
        blockData.transactionsRoot,
        blockData.receiptsRoot,
        blockData.logsBloom,
        blockData.difficulty,
        blockData.number, // ls[8] = 0x875c805 (141936645)
        blockData.gasLimit,
        blockData.gasUsed,
        blockData.timestamp,
        blockData.extraData,
        blockData.mixHash, // mixHash (Optimism default)
        blockData.nonce, // nonce (Optimism default)
    ].map((val) => Buffer.from(val.slice(2), "hex"));

    // RLP-encode header
    const rlpBuffer = RLP.encode(header);
    const rlpBytes: ethers.BytesLike = ethers.hexlify(rlpBuffer);

    // Verify block hash
    const blockHash = "0x4b0bbb86d2ab0fc2c7043f20c4e696f4cf14a441e0542689c74915acc598ad1c";
    const computedHash = ethers.keccak256(rlpBytes);
    console.log(`Block hash: ${blockHash}`);
    console.log(`Computed hash: ${computedHash}`);
    if (blockHash !== computedHash) {
      throw new Error(`Invalid RLP encoding: expected ${blockHash}, got ${computedHash}`);
    }

    // Call mintFlag
    // const contract = new ethers.Contract(
    //   contractAddress,
    //   ["function mintFlag(bytes memory rlpBytes) public"],
    //   signer
    // );
    // const tx = await contract.mintFlag(rlpBytes);
    // console.log(`Transaction sent: ${tx.hash}`);
    // await tx.wait();
    // console.log("mintFlag executed successfully");
  });