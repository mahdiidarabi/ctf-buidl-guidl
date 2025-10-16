import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { RLP } from "@ethereumjs/rlp";
import { getCreateAddress, getCreate2Address, keccak256, ethers } from 'ethers';

task("calc-rlp", "Reads private variables from Challenge9 contract storage")
  .addParam("sender", "The Challenge deployer address")
  .addParam("contractAddress", "The Challenge 12 contract address")
  .setAction(async (taskArgs: { sender: string, contractAddress: string }, hre: HardhatRuntimeEnvironment) => {
    console.log("fffff")

    const { sender, contractAddress } = taskArgs;

    const { deployer } = await hre.getNamedAccounts();
    const signer = await hre.ethers.getSigner(deployer);

    const provider = new ethers.JsonRpcProvider("https://optimism.api.onfinality.io/public");

    const contract = new ethers.Contract(
      contractAddress,
      ["function preMintFlag() external"],
      signer
    );
    const tx = await contract.preMintFlag();
    console.log("Transaction sent:", tx);
    await tx.wait();
    console.log("mintFlag executed successfully");

    // Add sleep for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    const blockData = await provider.send("eth_getBlockByNumber", [
      ethers.toQuantity(parseInt(tx.blockNumber + 2)),
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


    const contract2 = new ethers.Contract(
      contractAddress,
      ["function mintFlag(bytes memory rlpBytes) external"],
      signer
    );
    const tx2 = await contract2.mintFlag(`0x${encodedHex}`);
    console.log(`Transaction sent: ${tx.hash}`);
    await tx2.wait();
    console.log("mintFlag executed successfully");
      
  });

  // npx hardhat calc-rlp --sender 0x0b99DE6969399246fF1901432d7fe63DAC17bF8C --contract-address 0x8c7A3c2c44aB16f693d1731b10C271C7d2967769 --network optimism
