import { HDNodeWallet, Mnemonic, ethers } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment, HardhatNetworkHDAccountsConfig } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log(`Deploying CtfChallenge3 to network ${network.name} with deployer ${deployer}`);

  const hAccounts = hre.config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig;
  const derivationPath = "m/44'/60'/0'/0/12";
  const challenge4Account = HDNodeWallet.fromMnemonic(Mnemonic.fromPhrase(hAccounts.mnemonic), derivationPath);

  console.log("Challenge4 account:", challenge4Account);
  console.log("Challenge4 address:", challenge4Account.address);

  const msgSender = deployer; // Or specify, e.g., "0xYourAddressHere"

  // Compute the message hash (equivalent to keccak256(abi.encode("BG CTF Challenge 4", msg.sender)))
  const abiCoder = new ethers.AbiCoder();
  const messageHash = ethers.keccak256(abiCoder.encode(["string", "address"], ["BG CTF Challenge 4", msgSender]));

  // Implement toEthSignedMessageHash equivalent in JavaScript
  const prefix = ethers.toUtf8Bytes("\x19Ethereum Signed Message:\n32"); // Prefix as bytes
  const combined = ethers.concat([prefix, ethers.getBytes(messageHash)]); // Concatenate prefix and messageHash
//   const ethSignedMessageHash = ethers.keccak256(combined); // keccak256(prefix + messageHash)
  const ethSignedMessageHash =  "0x8e60166d37d05ce89959a3599a67f10c4b81e3efd48c7974177e06bda61ca42f"

  // Generate the signature
//   const signature = await challenge4Account.signMessage(ethers.getBytes(ethSignedMessageHash));

// Sign the raw digest (no extra prefixing)
    const digest = ethers.getBytes(ethSignedMessageHash);
    const signed = challenge4Account.signingKey.sign(digest);

    // Format signature as hex string (r + s + v)
    const signature = ethers.concat([
    ethers.getBytes(signed.r),
    ethers.getBytes(signed.s),
    new Uint8Array([signed.v])
    ]);
    const signatureHex = ethers.hexlify(signature);


  console.log("Message Hash:", messageHash);
  console.log("Ethereum Signed Message Hash:", ethSignedMessageHash);
  console.log("Signature:", signature);
  console.log("Signature:", signatureHex);
  console.log("Signer Address:", challenge4Account.address);

  const recoveredAddress = ethers.verifyMessage(ethers.getBytes(ethSignedMessageHash), signature);
  console.log("Recovered Address:", recoveredAddress); // Should match challenge4Account.address

};

export default func;
func.tags = ["CtfChallenge4", "all"];
 