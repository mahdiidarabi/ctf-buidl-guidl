import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log(`Deploying CtfChallenge6 to network ${network.name} with deployer ${deployer}`);

  await deploy("CtfChallenge6", {
    from: deployer,
    args: ["0x75961D2da1DEeBaEC24cD0E180187E6D55F55840"],
    log: true,
    waitConfirmations: network.live ? 3 : 1,
  });
};

export default func;
func.tags = ["CtfChallenge6", "all"];
 