var web3 = require('web3');
async function main() {
  // Grab the contract factory
  const RaremintsERC721 = await ethers.getContractFactory("RaremintsERC721");

  // Start deployment, returning a promise that resolves to a contract object
  const contract = await RaremintsERC721.deploy(
    'DinoBros',
    'DINO',
    'https://backend.raremints.club/revealer/dinobrosgiveaway/',
    web3.utils.toWei('0.03'),
    1000,
  ); // Instance of the contract
  console.log("Contract deployed to address:", contract.address);
  console.log(contract.deployTransaction.hash);

  // The contract is NOT deployed yet; we must wait until it is mined
  await contract.deployed()
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
