require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const { MUMBAI_RPC_PROVIDER, MUMBAI_PRIVATE_KEY , GOERLI_RPC_PROVIDER, GOERLI_PRIVATE_KEY} = process.env

module.exports = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai: {
      url: MUMBAI_RPC_PROVIDER,
      accounts: [
        MUMBAI_PRIVATE_KEY,
      ],
      gas: 28e6,
      gasPrice: 20000000,
    },
    goerli: {
      url: GOERLI_RPC_PROVIDER,
      accounts: [GOERLI_PRIVATE_KEY],
      // gas: 2100000,
      // gasPrice: 200000000000,   
    },
    goerli: {
      url: 'http://127.0.0.1:8545',
      accounts: [
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
      ],
      // gas: 2100000,
      // gasPrice: 200000000000,   
    }
  }
};
