require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.19" }, // For CropConnect.sol
      { version: "0.8.28" }  // For Lock.sol
    ],
  },
  networks: {
    // Local Hardhat network for quick development
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // GoChain Testnet configuration
    gochainTestnet: {
      url: "https://testnet-rpc.gochain.io",
      chainId: 3133,
      accounts: process.env.GOCHAIN_TESTNET_PRIVATE_KEY
        ? [process.env.GOCHAIN_TESTNET_PRIVATE_KEY]
        : [],
      timeout: 300000, // 5 minutes timeout if needed
    },
  },
};
