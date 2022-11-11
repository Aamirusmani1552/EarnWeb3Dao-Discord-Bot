const { network } = require("hardhat");
const { verify } = require("../utils/verify.js");
const { developementChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  
  log("_________________________________________");
  const args = [];

  const faucet = await deploy("Faucet", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: developementChains.includes(network.name) ? 1 : 6,
  });

  if (
    !developementChains.includes(network.name) &&
    (process.env.ETHERSCAN_API_KEY || process.env.MUMBAI_POLYGON_API_KEY) && !process.env.CELOSCAN_API_KEY
  ) {
    await verify(faucet.address, args);
  }

  log("___________________________________________");
};

module.exports.tags = ['all', 'faucet'];

