import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log(`Deploying CtfChallenge5 to network ${network.name} with deployer ${deployer}`);

  await deploy("CtfChallenge5", {
    from: deployer,
    args: ["0xB76AdFe9a791367A8fCBC2FDa44cB1a2c39D8F59"],
    log: true,
    waitConfirmations: network.live ? 3 : 1,
  });
};

export default func;
func.tags = ["CtfChallenge5", "all"];
 