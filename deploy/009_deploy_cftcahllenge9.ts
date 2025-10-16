import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log(`Deploying CtfChallenge9 to network ${network.name} with deployer ${deployer}`);

  // npx hardhat read-storage --contract 0x1Fd913F2250ae5A4d9F8881ADf3153C6e5E2cBb1 --network optimism
  // Password (bytes32): 0xf6bd6ed5c530908225e7ea1ac072bde94b180a706c43bb253d3efd7ecb17ff3b
  // Count (uint256): 39

  await deploy("CtfChallenge9", {
    from: deployer,
    // args: ["0xf6bd6ed5c530908225e7ea1ac072bde94b180a706c43bb253d3efd7ecb17ff3b", 39],
    args: [],
    log: true,
    waitConfirmations: network.live ? 3 : 1,
  });
};

export default func;
func.tags = ["CtfChallenge9", "all"];
 