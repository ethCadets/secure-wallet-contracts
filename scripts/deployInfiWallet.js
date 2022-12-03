// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  signers = await ethers.getSigners();
  const owner = signers[0];
  const InfinityAccount = await hre.ethers.getContractFactory("InfinityAccount");
  const account = await InfinityAccount.deploy('0x2DF1592238420ecFe7f2431360e224707e77fA0E', '0xA2AF948C508311e1D24270649d770cF4d4F5D0B5');

  await account.deployed();

  console.log(
    `InfinityAccount deployed to ${account.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
