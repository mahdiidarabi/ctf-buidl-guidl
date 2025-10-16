import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log(`Deploying CtfChallenge2 to network ${network.name} with deployer ${deployer}`);

  await deploy("CtfChallenge2", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.live ? 3 : 1,
  });
};

export default func;
func.tags = ["CtfChallenge2", "all"];
 