import axios from 'axios';
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const alchemyPolygonKey = process.env.REACT_APP_ALCHEMY_POLYGON_KEY;
const alchemyRinkebyKey = process.env.REACT_APP_ALCHEMY_RINKEBY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const contractABI = require("../contract_definitions/erc721.json");

window.imageCache = {}

export const readContractState = async (address, chain) => {
  const contract = new ERC721Contract(address, chain);
  const name = await contract.fetchName();
  const symbol = await contract.fetchSymbol();
  const balance = await contract.fetchBalance();
  const totalSupply = parseInt(await contract.fetchTotalSupply());
  const maxSupply = parseInt(await contract.fetchMaxSupply());
  const price = await contract.fetchPrice();
  const isPaused = await contract.fetchIsPaused();
  const baseURI = await contract.fetchBaseURI();
  return { maxSupply, isPaused, name, symbol, balance, totalSupply, price, baseURI }
}

export class DeployContract {
}

export class ImageCache {
  constructor(contractAddress, cache, chain='eth') {
    this.contractAddress = contractAddress;
    this.contract = new ERC721Contract(contractAddress, chain);
    this.chain = chain;
  }

  get(tokenId) {
    return window.imageCache[tokenId];
  }

  async addToCache(tokenIds) {
    const newCache = {}
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i]
      if (!(tokenId in window.imageCache)) {
        const imageUrl = await this.contract.getImageUrlForToken(tokenId);
        newCache[tokenId] = imageUrl;
      }
    }
    window.imageCache = {...newCache, ...window.imageCache}
    return new ImageCache(this.contractAddress, window.imageCache, this.chain);
  }
}

export class ERC721Contract {
  constructor(contractAddress, chain='eth') {
    this.contractAddress = contractAddress;
    if (chain === 'polygon') {
      this.web3 = createAlchemyWeb3(alchemyPolygonKey);
    } else if (chain === 'rinkeby') {
      this.web3 = createAlchemyWeb3(alchemyRinkebyKey);
    } else {
      this.web3 = createAlchemyWeb3(alchemyKey);
    }

    this.contract = new this.web3.eth.Contract(contractABI, this.contractAddress);
    this.chain = chain;
  }

  fetchName() {
    return this.contract.methods.name().call();
  }

  fetchPrice() {
    return this.contract.methods.getPrice().call();
  }

  fetchIsPaused() {
    return this.contract.methods.isPaused().call();
  }

  fetchSymbol() {
    return this.contract.methods.symbol().call();
  }

  fetchBalance() {
    return this.web3.eth.getBalance(this.contractAddress)
  }

  fetchBaseURI() {
    return this.contract.methods.getBaseURI().call();
  }

  fetchTotalSupply() {
    return this.contract.methods.totalSupply().call();
  }

  fetchMaxSupply() {
    return this.contract.methods.getSupply().call();
  }

  async sendMethod(data, value=null) {
    const transactionParameters = {
      to: this.contractAddress, // Required except during contract publications.
      value: value,
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: data.encodeABI(),
    };

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      return {
        success: true,
        transactionHash: txHash,
        status:
          "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" +
          txHash,
      };
    } catch (error) {
      return {
        success: false,
        status: "😥 Something went wrong: " + error.message,
      };
    }
  }

  async executeAirdrop(address, amount) {
    const data = this.contract.methods.airdrop([address], [amount]);
    return await this.sendMethod(data);
  }

  async executeSetPause(pause) {
    const data = this.contract.methods.setPause(pause);
    return await this.sendMethod(data);
  }

  async executeSetPrice(price) {
    const data = this.contract.methods.setPrice(price);
    return await this.sendMethod(data);
  }

  async executeWithdraw() {
    const data = this.contract.methods.withdraw();
    return await this.sendMethod(data);
  }

  async executeMint(amount, value) {
    const data = this.contract.methods.mint(amount);
    return await this.sendMethod(data, value);
  }

  async getImageUrlForToken(tokenId) {
    const metadataUri = await this.contract.methods.tokenURI(tokenId).call()
    return await this.getImageUrl(metadataUri);
  }

  async getImageUrl(metadataUri) {
    const response = await axios.get(metadataUri)
    return response.data.image;
  }

  async getAllUrls() {
    const results = await this.web3.eth.getPastLogs({
      address: this.contractAddress,
      fromBlock: "0x1",
      toBlock: "latest",
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // This is the transfer topic
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ]
    });
    return results;
  }
}