require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    contractSizer: {
      alphaSort: true,
      runOnCompile: true,
      disambiguatePaths: false,
    },
  },
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com",
      accounts: [process.env.PRIV_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.API_KEY,
    },
  },
};
