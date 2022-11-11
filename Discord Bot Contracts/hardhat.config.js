require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    alfajores:{
      url: process.env.CELO_RPC_URL,
      accounts: [process.env.CELO_PRIVATE_KEY],
      chainId: 44787,
      saveDeployments: true
    },
    matic: {
      url: process.env.QUICKNODE_MUMBAI_POLYGON_RPC_URL,
      accounts: [process.env.POLYGON_PRIVATE_KEY],
      chainId: 80001,
      saveDeployments: true,
    },
    goerli:{
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5,
      saveDeployments: true,
    },
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.MUMBAI_POLYGON_API_KEY,
      alfajores: process.env.CELOSCAN_API_KEY
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  contractSizer: {
    runOnCompile: false,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 200000,
  }
}
}
