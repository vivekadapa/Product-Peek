require('dotenv').config();
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/KFCgbg0MHde8j5O-3ShIV0b2Mrv7_-05',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
