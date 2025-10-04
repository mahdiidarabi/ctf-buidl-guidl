import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";
import { RLP } from "@ethereumjs/rlp";
import { keccak256 } from 'ethers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();
  const signer = await hre.ethers.getSigner(deployer);

  log(`Deploying CtfChallenge12 to network ${network.name} with deployer ${deployer}`);

  const provider = new ethers.JsonRpcProvider("https://optimism.api.onfinality.io/public");
  const contractAddress = "0x8c7A3c2c44aB16f693d1731b10C271C7d2967769";

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
};

export default func;
func.tags = ["CtfChallenge12", "all"];
 