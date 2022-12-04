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

async function create2(from, salt, initCode) {
  const saltBytes32 = hexZeroPad(hexlify(salt), 32);
  const initCodeHash = keccak256(initCode);
  return getCreate2Address(from, saltBytes32, initCodeHash);
}

async function main() {
  [owner, addr1] = await hre.ethers.getSigners();

  CREATE2FACTORY_ADDRESS = '0xce0042b868300000d44a59004da54a005ffdcf9f';
  ENTRYPOINT_ADDRESS = '0x2DF1592238420ecFe7f2431360e224707e77fA0E'

  const InfinityWallet = await hre.ethers.getContractFactory("InfinityWallet");
  const InfinityWalletProxy = await hre.ethers.getContractFactory("InfinityWalletProxy");
  const Create2Factory = await hre.ethers.getContractFactory("Create2Factory");
  const EntryPoint = await hre.ethers.getContractFactory("EntryPoint");

  walletSingleton = await InfinityWallet.deploy();
  await walletSingleton.deployed();
  console.log(`singleton address ${walletSingleton.address}`);

  entryPoint = EntryPoint.attach(ENTRYPOINT_ADDRESS);



  const walletInitData = InfinityWallet.interface.encodeFunctionData("initialize", [
    ENTRYPOINT_ADDRESS,
    owner.address
  ]);

  let constructorArg = hre.ethers.utils.defaultAbiCoder.encode(
    ["address", "bytes"],
    [walletSingleton.address, walletInitData]
  );

  let contractCreateInitCode = `${InfinityWalletProxy.bytecode.slice(2)}${constructorArg.slice(2)}`
  const salt = "0x".padEnd(66, "0");
  newProxyAddress = await create2(CREATE2FACTORY_ADDRESS, salt, `0x${contractCreateInitCode}`);
  console.log(`new proxy address will be ${newProxyAddress}`)


  const Create2Factory_init = Create2Factory.interface.encodeFunctionData("deploy", [
    `0x${contractCreateInitCode}`, salt]);

  const initCode = `${CREATE2FACTORY_ADDRESS}${Create2Factory_init.slice(2)}`;

  await entryPoint.depositTo(newProxyAddress, {
    value: hre.ethers.utils.parseEther("0.02").toString(),
  });

  let userOperation = {
    'sender': newProxyAddress,
    'nonce': 1,
    'callData': '0x',
    'initCode': initCode,
    'callGasLimit': 10e6,
    'verificationGasLimit': 11e6,
    'preVerificationGas': 12e6,
    'maxFeePerGas': 12e9,
    'maxPriorityFeePerGas': 12e9,
    "paymasterAndData": '0x',
    'signature': undefined
  };

  userOperation.signature = await signUserOp(
    userOperation,
    entryPoint.address,
    5,
    owner
  );

  await entryPoint.handleOps([userOperation], owner.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
