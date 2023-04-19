const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();

    const Coins = await ethers.getContractFactory('Coins');
    const coinToken = await Coins.deploy("coins", "cn", 1000);

    console.log("ERC20Token address:", coinToken.address);

    const Assets = await ethers.getContractFactory('Assets');
    const nft = await Assets.deploy("asset", "ast", coinToken.address);

    console.log("ERC721Token address:", nft.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
})