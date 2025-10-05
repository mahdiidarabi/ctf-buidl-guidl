import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log(`Deploying CtfChallenge11 to network ${network.name} with deployer ${deployer}`);

  // npx hardhat read-storage --contract 0x1Fd913F2250ae5A4d9F8881ADf3153C6e5E2cBb1 --network optimism
  // Password (bytes32): 0xf6bd6ed5c530908225e7ea1ac072bde94b180a706c43bb253d3efd7ecb17ff3b
  // Count (uint256): 39

  await deploy("CtfChallenge11", {
    from: deployer,
    args: ["0x67392ea0A56075239988B8E1E96663DAC167eF54"],
    log: true,
    waitConfirmations: network.live ? 3 : 1,
  });
};

export default func;
func.tags = ["CtfChallenge11", "all"];
 