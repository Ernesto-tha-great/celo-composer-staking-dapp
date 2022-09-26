// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run("compile");

  // We deploy the erc20 contract
  const PironToken = await hre.ethers.getContractFactory("PironToken");
  const pironToken = await PironToken.deploy();

  await pironToken.deployed();

  console.log("Piron token deployed to:", pironToken.address);

  // we deloy the staking contract
  const Staking = await hre.ethers.getContractFactory("StakePIR");
  const staking = await Staking.deploy(pironToken.address);

  await staking.deployed();

  console.log("staking deployed to:", staking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
