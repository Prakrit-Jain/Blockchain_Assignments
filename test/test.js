const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  const { ethers } = require("hardhat");

let owner, user1, user2, Coin, Assets, hardhatCoinToken, hardhatAssetToken, ZeroAddress;

describe("Swap nft With Coin" , function() {

    before(async function() {
        [owner, user1, user2] = await ethers.getSigners();

        Coin = await ethers.getContractFactory("Coins");
        hardhatCoinToken = await Coin.deploy("coins", "cn", 1000);

        Assets = await ethers.getContractFactory("Assets");
        hardhatAssetToken = await Assets.deploy("asset", "ast", hardhatCoinToken.address);
    });

    it("should set price of the token in coins", async function() {
        
        await expect(hardhatAssetToken.setPrice(1, 100)).to.be.revertedWith("Token invalid");
        await hardhatAssetToken.mint(user1.address, 1);
        await expect(hardhatAssetToken.setPrice(1, 100)).to.be.revertedWith("Not a owner");
        await hardhatAssetToken.connect(user1).setPrice(1, 100);
        expect (await hardhatAssetToken.price(1)).to.be.equal(100);

    })

    it("should swap tokens with coins" , async function() {
        await expect(hardhatAssetToken.connect(user1).swap(1)).to.be.revertedWith('Not Enough Coins to swap');
        await hardhatAssetToken.connect(user1).setPrice(1, 100);
        await hardhatCoinToken.approve(hardhatAssetToken.address, 100);
        await hardhatAssetToken.swap(1);
        expect (await hardhatAssetToken.ownerOf(1)).to.be.equal(owner.address);
        expect (await hardhatCoinToken.balanceOf(user1.address)).to.be.equal(100);
        expect (await hardhatCoinToken.balanceOf(owner.address)).to.be.equal(900);
             
    })

})