require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const alchemyPolygonKey = process.env.REACT_APP_ALCHEMY_POLYGON_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      return { address: addressArray[0], success: true };
    } catch (err) {
      return {
        address: "",
        success: false,
      };
    }
  } else {
    return {
      address: "",
      success: false,
      reason: "INSTALL_METAMASK",
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          success: true,
        };
      } else {
        return {
          address: "",
          success: false,
        };
      }
    } catch (err) {
      return {
        address: "",
        success: false,
      };
    }
  } else {
    return {
      address: "",
      success: false,
      reason: "INSTALL_METAMASK",
    };
  }
};

export const handleSignMessage = ({ publicAddress, nonce, chain }) => {
  let web3;
  if (chain === 'polygon') {
    web3 = createAlchemyWeb3(alchemyPolygonKey);
  } else {
    web3 = createAlchemyWeb3(alchemyKey);
  }
  return new Promise((resolve, reject) =>
    web3.eth.personal.sign(
      web3.utils.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
      publicAddress,
      (err, signature) => {
        if (err) return reject(err);
        return resolve({ publicAddress, signature });
      }
    )
  );
};
