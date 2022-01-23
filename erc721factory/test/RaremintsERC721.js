const { expect } = require("chai");
const web3 = require('web3');
const { ethers, waffle } = require("hardhat");


const PRICE = web3.utils.toWei('0.01', 'ether');
const INITIAL_SUPPLY = 10000;

describe("RaremintsERC721", function () {
  let RaremintsERC721;
  let erc721Contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let BASE_URI = "https://gateway.pinata.cloud/ipfs/Qma/";

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    RaremintsERC721 = await ethers.getContractFactory('RaremintsERC721');
    erc721Contract = await RaremintsERC721.deploy(
      "My NFT",
      "NFT",
      BASE_URI,
      PRICE,
      INITIAL_SUPPLY
    );
  });
  const mintNft = (addr, value=PRICE) => {
    return erc721Contract.connect(addr).mint(1, {value: value});
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await erc721Contract.owner()).to.equal(owner.address);
    });
  });

  describe("State", function () {
    it("can change price", async function () {
      const newPrice = web3.utils.toWei('0.03', 'ether');
      expect(await erc721Contract.getPrice()).to.equal(PRICE);
      expect(await erc721Contract.setPrice(newPrice));
      expect(await erc721Contract.getPrice()).to.equal(newPrice);
    });


    it("can change baseURI", async function () {
      const url = "https://raremints.club/images";
      expect(await erc721Contract.getBaseURI()).to.equal(BASE_URI);
      expect(await erc721Contract.setBaseURI(url));
      expect(await erc721Contract.getBaseURI()).to.equal(url);
    });

    it("can change pause", async function () {
      const url = "https://raremints.club/images";
      expect(await erc721Contract.isPaused()).to.equal(false);
      expect(await erc721Contract.setPause(true));
      expect(await erc721Contract.isPaused()).to.equal(true);
    });

    it("can change supply", async function () {
      const url = "https://raremints.club/images";
      expect(await erc721Contract.getSupply()).to.equal(INITIAL_SUPPLY);
      expect(await erc721Contract.setSupply(1));
      expect(await erc721Contract.getSupply()).to.equal(1);
    });
  });

  describe("Payments", function() {
    describe("airdrop", function() {
      it("could airdrop a new NFT", async function() {
        expect(await erc721Contract.balanceOf(addr1.address)).to.eq(0)
        await erc721Contract.airdrop([addr1.address], [1]);
        expect(await erc721Contract.balanceOf(addr1.address)).to.eq(1)
      });

      it("cant airdrop 2 if there is only 1 supply", async function() {
        await erc721Contract.setSupply(1);
        await expect(erc721Contract.airdrop([addr1.address], [2])).to.be.revertedWith('Exceeds maximum supply');
      });
    });

    describe("mint", function() {
      it("could mint a new NFT", async function() {
        await expect(mintNft(owner))
          .to.emit(erc721Contract, "Transfer")
          .withArgs(ethers.constants.AddressZero, owner.address, "0");
      });

      it("minting increases contract balance", async function() {
        const balance = await ethers.provider.getBalance(erc721Contract.address);
        expect(balance).to.eq(0)
        await mintNft(owner);
        const newBalance = await ethers.provider.getBalance(erc721Contract.address);
        expect(newBalance).to.eq(PRICE)
      });

      it("cant mint if paused", async function() {
        await erc721Contract.setPause(true);
        await expect(mintNft(owner)).to.be.revertedWith('Sale paused')
      });

      it("cant mint if supply capped", async function() {
        await erc721Contract.setSupply(0);
        await expect(mintNft(owner)).to.be.revertedWith('Exceeds maximum supply')
      });

      it("cant mint if underpaid", async function() {
        await expect(mintNft(owner, 0)).to.be.revertedWith('Ether sent is not correct')
      });
    });

    describe("withdraw", function() {
      it("could withdraw as owner", async function() {
        await expect(mintNft(addr1));
        const originalAccountBalance = await ethers.provider.getBalance(owner.address);
        const withdrew = await erc721Contract.connect(owner).withdraw();
        const newAccountBalance = await ethers.provider.getBalance(owner.address);
        expect(newAccountBalance > originalAccountBalance).to.eq(true);
      });

      it("doesn't allow withdraw if not owner", async function() {
        await expect(mintNft(addr1));
        await expect(erc721Contract.connect(addr2).withdraw()).to.be.revertedWith('Ownable: caller is not the owner');
      });
    });
  });

  describe("Enumerable", function() {
    describe("walletOfOwner", function() {
      it("can get all NFT's owned by address", async function() {
      });
    });
  });
});
