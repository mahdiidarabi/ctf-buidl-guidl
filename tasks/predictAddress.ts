import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getAddress, getCreateAddress, getCreate2Address, keccak256, hexlify, toBeHex, ethers } from 'ethers';
import { getNamedAccounts } from "hardhat";

task("predict-address", "Reads private variables from Challenge9 contract storage")
  .addParam("sender", "The Challenge deployer address")
  .addParam("nonce", "The Challenge deployer nonce")
  .setAction(async (taskArgs: { sender: string, nonce: number }, hre: HardhatRuntimeEnvironment) => {

    const { sender, nonce } = taskArgs;

    const { deployer } = await getNamedAccounts();
    const signer = await hre.ethers.getSigner(deployer);

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

    let isFind = false

    let preferedNonce = BigInt(0);

    for (let i = nonce; i < nonce + 1000; i++) {
      preferedNonce = BigInt(nonce) + BigInt(i);
      let predictedAddress = predictCreateAddress(sender, preferedNonce);
      if (predictedAddress.slice(-2) === sender.slice(-2)) {
        console.log("address", predictedAddress);
        console.log("nonce", nonce);
        console.log("i", i);
        console.log("prefered nonce", preferedNonce);
        isFind = true
        break;
        
      }
    }

    if (!isFind) {
      console.log("nothing find in next 1000 nonces")
    }

    // for (let j = nonce; j < )
      
  });


  function predictCreateAddress(deployer: string, nonce: bigint): string {
    return getCreateAddress({ from: deployer, nonce });
  }
  
  function predictCreate2Address(deployer: string, salt: string, bytecode: string): string {
    const initCodeHash = keccak256(bytecode);
    return getCreate2Address(deployer, salt, initCodeHash);
  }

  // npx hardhat predict-address --sender 0x0b99DE6969399246fF1901432d7fe63DAC17bF8C --nonce 10 --network optimism
