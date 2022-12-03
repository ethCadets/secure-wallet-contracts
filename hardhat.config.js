require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const { MUMBAI_RPC_PROVIDER, MUMBAI_PRIVATE_KEY } = process.env

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
      gas: 2100000,
      gasPrice: 200000000000,
    },
    // goerli: {
    //   url: GOERLI_RPC_PROVIDER,
    //   accounts: [GOERLI_PRIVATE_KEY],
    //   // gas: 2100000,
    //   // gasPrice: 200000000000,   
    // }
  }
};
