// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const plantCoin = await hre.ethers.deployContract("PlantCoin", []);
  // await plantCoin.waitForDeployment();
  // console.log(`plantCoin address ${plantCoin.target}`);

  // const pvz = await hre.ethers.deployContract("PlantVsZombieNFT", ["Plant and Zombie", "PvZ", 9755]);
  // await pvz.waitForDeployment();
  // console.log(`pvz address ${pvz.target}`);

  const box = await hre.ethers.deployContract("Box", ["0xc27764d63266D1029377DF2D98d138AB50dB138f", ""]);
  await box.waitForDeployment();
  console.log(`box address ${box.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
