// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require("dotenv").config();
const hre = require("hardhat");
const { signUserOp } = require("./userOp");
const { getCreate2Address,
  hexlify,
  hexZeroPad,
  keccak256 } = require('ethers/lib/utils')

async function main() {
  [owner, addr1] = await hre.ethers.getSigners();

  const InfinityWallet = await hre.ethers.getContractFactory("InfinityWallet");
  const InfinityWalletProxy = await hre.ethers.getContractFactory("InfinityWalletProxy");

  ENTRYPOINT_ADDRESS = '0x2DF1592238420ecFe7f2431360e224707e77fA0E'

  walletSingleton = await InfinityWallet.deploy();
  await walletSingleton.deployed();
  console.log(`singleton address ${walletSingleton.address}`);

  const walletInitData = InfinityWallet.interface.encodeFunctionData("initialize", [
    ENTRYPOINT_ADDRESS,
    owner.address
  ]);

  walletProxy = await InfinityWalletProxy.deploy(walletSingleton.address, walletInitData);
  await walletProxy.deployed();
  console.log(`walletProxy address ${walletProxy.address}`);



  await walletProxy.initiate()

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
