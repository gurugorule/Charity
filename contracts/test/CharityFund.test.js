const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CharityFund", function () {
  let charityFund;
  let owner;
  let donor;

  beforeEach(async function () {
    [owner, donor] = await ethers.getSigners();
    
    const CharityFund = await ethers.getContractFactory("CharityFund");
    charityFund = await CharityFund.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await charityFund.owner()).to.equal(owner.address);
  });

  it("Should accept donations and update total amount", async function () {
    const donationAmount = ethers.parseEther("0.05");
    
    await expect(charityFund.connect(donor).deposit({ value: donationAmount }))
      .to.emit(charityFund, "FundDeposited")
      .withArgs(donor.address, donationAmount);
    
    expect(await charityFund.totalAmount()).to.equal(donationAmount);
    expect(await charityFund.getContractBalance()).to.equal(donationAmount);
  });

  it("Should transfer funds to owner when threshold is reached", async function () {
    const donationAmount = ethers.parseEther("0.15"); // Above threshold
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
    
    await expect(charityFund.connect(donor).deposit({ value: donationAmount }))
      .to.emit(charityFund, "FundsTransferred")
      .withArgs(owner.address, donationAmount);
    
    expect(await charityFund.totalAmount()).to.equal(0);
    expect(await charityFund.getContractBalance()).to.equal(0);
    
    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    expect(finalOwnerBalance - initialOwnerBalance).to.equal(donationAmount);
  });
});