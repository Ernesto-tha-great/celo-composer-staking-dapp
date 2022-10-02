module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const piron = await deploy("PironToken", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
  });

  await deploy("StakePIR", {
    from: deployer,
    args: [piron.address],
    log: true,
  });
};

module.exports.tags = ["PironToken", "StakePIR"];
