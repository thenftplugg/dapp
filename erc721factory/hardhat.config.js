/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const { RINKEBY_API_URL, RINKEBY_PRIVATE_KEY } = process.env;
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 500,
      },
    },
  },
  networks: {
    rinkeby: {
      url: RINKEBY_API_URL,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`]
    },
  },
};
